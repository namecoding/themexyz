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

    const { currentCode, newCode, confirmCode } = await request.json();

    if (!newCode || !confirmCode) {
      return NextResponse.json({ success: false, message: "New and confirmation code are required" }, { status: 400, headers: corsHeaders });
    }

    if (newCode !== confirmCode) {
      return NextResponse.json({ success: false, message: "Codes do not match" }, { status: 400, headers: corsHeaders });
    }

    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });

    if (!user || !user?.admin?.accessCode) {
      return NextResponse.json({ success: false, message: "User not found or not an admin" }, { status: 404, headers: corsHeaders });
    }

    // Compare current code
    const isValid = await bcrypt.compare(currentCode, user.admin.accessCode);
    if (!isValid) {
      return NextResponse.json({ success: false, message: "Current access code is incorrect" }, { status: 401, headers: corsHeaders });
    }

    const hashedAccessCode = await bcrypt.hash(newCode, 10);

    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          "admin.accessCode": hashedAccessCode,
          "admin.delete": newCode, // dev-only override
        },
      }
    );

    if (allowEmailSending) {
      await sendEmail({
        to: user.email,
        subject: "Access Code Change Notification",
        html: `
          <h2>Access Code Change Alert</h2>
          <p>This is to notify you that your admin access code was recently changed.</p>
          <p>If you did not perform this action, please contact support immediately to secure your account.</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        `,
      });
    }


    return NextResponse.json({ success: true, message: "Access code updated successfully" }, { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error("Access code change error:", error);
    return NextResponse.json({ success: false, message: error.message || "Unauthorized" }, { status: 401, headers: corsHeaders });
  }
}
