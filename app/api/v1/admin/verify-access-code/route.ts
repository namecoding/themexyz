import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { verifyTokenFromHeader } from '@/lib/jwt'
import { ObjectId } from 'mongodb'
import bcrypt from 'bcryptjs'
import { corsHeaders } from '@/lib/cors';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}


export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { code, adminType } = body

    if (!code || !adminType) {
      return NextResponse.json(
        { success: false, message: 'Missing access code or admin type.' },
        { status: 400 }
      )
    }

    // ✅ Authenticate request
    const decoded: any = verifyTokenFromHeader(request)
    const userId = decoded?.userId

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Invalid or missing token.' },
        { status: 401 }
      )
    }

    const client = await clientPromise
    const db = client.db()
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) })

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 })
    }

    const userPermissions = user?.admin?.permission || []
    const storedHashedCode = user?.admin?.accessCode

    if (!storedHashedCode) {
      return NextResponse.json({ success: false, message: 'No access code found for user.' }, { status: 403 })
    }

    const isCodeValid = await bcrypt.compare(code, storedHashedCode)

    if (!isCodeValid) {
      return NextResponse.json({ success: false, message: 'Invalid access code.' }, { status: 403 })
    }

    if (!userPermissions.includes(adminType)) {
      return NextResponse.json({ success: false, message: 'Access denied for selected admin type.' }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      message: 'Access granted.',
      valid: true,
      adminType,
    })

  } catch (error) {
    console.error('Verify access code error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 })
  }
}
