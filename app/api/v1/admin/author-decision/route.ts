import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { verifyTokenFromHeader } from '@/lib/jwt'
import { ObjectId } from 'mongodb'
import { corsHeaders } from '@/lib/cors';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: Request) {
  try {
    // ✅ Authenticate admin
    const decoded: any = verifyTokenFromHeader(request)
    const adminId = decoded?.userId

    if (!adminId) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db()

    const admin = await db.collection('users').findOne({ _id: new ObjectId(adminId) })

    if (!admin || !admin?.admin?.permission?.includes('author_admin')) {
      return NextResponse.json({ success: false, message: 'Access denied.' }, { status: 403, headers: corsHeaders })
    }

    const body = await request.json()
    const { userId, decision, notes } = body

    if (!userId || !['approved', 'rejected'].includes(decision)) {
      return NextResponse.json({ success: false, message: 'Invalid input.' }, { status: 400, headers: corsHeaders })
    }

    // ✅ Build update fields
    const updateFields: any = {
      authorityToSell: decision === 'approved',
      authorReviewNotes: notes || '',
      authorReviewStatus: decision,
      reviewedBy: new ObjectId(adminId),
      reviewedAt: new Date(),
    }

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId), isAuthor: 1, authorityToSell: { $ne: true } },
      { $set: updateFields }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: 'User not found or already approved.' }, { status: 404, headers: corsHeaders })
    }

    return NextResponse.json({
      success: true,
      message: `Author application ${decision} successfully.`,
    }, { status: 200, headers: corsHeaders })
  } catch (error) {
    console.error('Error processing author decision:', error)
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500, headers: corsHeaders })
  }
}
