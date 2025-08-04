import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { sendEmail, allowEmailSending } from '@/lib/mailer';
import { metaData } from '@/lib/utils';
import { verifyTokenFromHeader } from "@/lib/jwt";
// import { corsHeaders } from '@/lib/cors';

// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 204,
//     headers: corsHeaders,
//   });
// }

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Missing userId in request body.' },
        { status: 400 }
      );
    }

    // ✅ Authenticated requester
    const decoded: any = verifyTokenFromHeader(request);
    const requesterId = decoded?.userId;

    if (!requesterId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Token invalid or missing.' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const requester = await db.collection('users').findOne({ _id: new ObjectId(requesterId) });
    const requesterPermissions = requester?.admin?.permission || [];

    // ✅ Check if requester is a super_admin
    if (!requesterPermissions.includes('super_admin')) {
      return NextResponse.json(
        { success: false, message: 'Access denied. Super admin only.' },
        { status: 403 }
      );
    }

    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const currentPermissions = user?.admin?.permission ?? [];

    if (currentPermissions.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'User has no admin roles to remove.',
      }, { status: 200 });
    }

    // 🔥 Remove the permission field (only the array, not the whole admin object)
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $unset: { admin: "" } }
    );

    // ✉️ Optional notification
    if (allowEmailSending && user.email) {
      await sendEmail({
        to: user.email,
        subject: `Your admin roles have been removed from ${metaData.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
            <h2>Admin Access Revoked</h2>
            <p>Hello ${user.name},</p>
            <p>Your admin permissions on <strong>${metaData.name}</strong> have been removed.</p>
            <p>If this was a mistake, contact your system administrator.</p>
            <br/>
            <p>Best regards,<br/>${metaData.name} Team</p>
          </div>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Admin permissions removed successfully.',
      removedRoles: currentPermissions,
    });

  } catch (error) {
    console.error('Remove admin error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
