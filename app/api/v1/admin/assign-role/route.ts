import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { sendEmail, allowEmailSending } from '@/lib/mailer'
import { metaData } from '@/lib/utils'
import { verifyTokenFromHeader } from '@/lib/jwt'
import bcrypt from 'bcryptjs'
import { corsHeaders } from '@/lib/cors';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

function generateAccessCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, roles } = body

    if (!userId || !Array.isArray(roles) || roles.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid payload: userId and roles[] required' },
        { status: 400 }
      )
    }

    const decoded: any = verifyTokenFromHeader(req)
    const requesterId = decoded?.userId

    if (!requesterId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Token invalid or missing.' },
        { status: 401 }
      )
    }

    const client = await clientPromise
    const db = client.db()

    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) })
    const requester = await db.collection('users').findOne({ _id: new ObjectId(requesterId) })

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    const requesterPermissions = requester?.admin?.permission || []
    if (!requesterPermissions.includes('super_admin')) {
      return NextResponse.json(
        { success: false, message: 'Access denied. Super admin only.' },
        { status: 403 }
      )
    }

    const currentPermissions = user?.admin?.permission || []

    const addedRoles: string[] = []
    const removedRoles: string[] = []

    // Toggle logic
    const updatedPermissions = [...currentPermissions]
    for (const role of roles) {
      if (updatedPermissions.includes(role)) {
        removedRoles.push(role)
        updatedPermissions.splice(updatedPermissions.indexOf(role), 1)
      } else {
        addedRoles.push(role)
        updatedPermissions.push(role)
      }
    }

    let accessCode: string | undefined = undefined
    const updateFields: any = {
      'admin.permission': updatedPermissions,
    }

    // Only generate and save access code if not already present
    if (!user?.admin?.accessCode) {
      accessCode = generateAccessCode()
      const hashed = await bcrypt.hash(accessCode, 10)
      updateFields['admin.accessCode'] = hashed
      updateFields['admin.delete'] = accessCode
    }

    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateFields }
    )

    // Send email if enabled and user has email
    if (allowEmailSending && user.email) {
      await sendEmail({
        to: user.email,
        subject: `Your Admin Roles Have Been Updated on ${metaData.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
            <h2>Admin Role Update</h2>
            <p>Hello ${user.name},</p>
            ${
              addedRoles.length > 0
                ? `<p><strong>Added:</strong> ${addedRoles.join(', ')}</p>`
                : ''
            }
            ${
              removedRoles.length > 0
                ? `<p><strong>Removed:</strong> ${removedRoles.join(', ')}</p>`
                : ''
            }
            <p><strong>Your updated roles:</strong> ${updatedPermissions.join(', ')}</p>
            ${
              accessCode
                ? `<p>Your access code is: <strong>${accessCode}</strong></p>`
                : ''
            }
            <p>You can now log in and access admin tools accordingly.</p>
            <br/>
            <p>Best regards,<br/>${metaData.name} Team</p>
          </div>
        `,
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Admin roles updated successfully.',
      addedRoles,
      removedRoles,
      allRoles: updatedPermissions,
      // ...(accessCode && { accessCode }), // only include if generated
    })
  } catch (error) {
    console.error('Admin role toggle error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
