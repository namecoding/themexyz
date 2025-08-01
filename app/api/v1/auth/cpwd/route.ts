import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { verifyTokenFromHeader } from "@/lib/jwt";
import { ObjectId } from "mongodb";
import { allowEmailSending, sendEmail } from "@/lib/mailer";
import { corsHeaders } from '@/lib/cors';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function PATCH(request: Request) {
  try {
    const decoded: any = verifyTokenFromHeader(request);
    const userId = decoded.userId;

    const { currentPassword, newPassword, confirmPassword } = await request.json();

    if (!newPassword || !confirmPassword) {
      return NextResponse.json({ success: false, message: "New password and confirmation are required" }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ success: false, message: "Passwords do not match" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (!user.isSocial) {
      if (!currentPassword) {
        return NextResponse.json({ success: false, message: "Current password is required" }, { status: 400 });
      }

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json({ success: false, message: "Current password is incorrect" }, { status: 401 });
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: hashedPassword, isSocial: false } }
    );

    // Fetch updated user
    const updatedUser = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    const { password: _pw, _id, ...safeUser } = updatedUser;

    if (allowEmailSending) {
      await sendEmail({
        to: updatedUser.email,
        subject: "Password Change Notification",
        html: `
          <h2>Password Change Alert</h2>
          <p>This is to notify you that your password was recently changed.</p>
          <p>If you did not perform this action, please reset your password immediately or contact support.</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
      user: {
        id: _id.toString(),
        ...safeUser,
      },
    });

  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json({ success: false, message: error.message || "Unauthorized" }, { status: 401 });
  }
}
