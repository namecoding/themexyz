import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { verifyTokenFromHeader } from "@/lib/jwt";
import { ObjectId } from "mongodb";

export async function PATCH(request: Request) {
  try {
    const decoded: any = verifyTokenFromHeader(request);
    const userId = decoded.userId;

    const { currentCode, newCode, confirmCode } = await request.json();

    if (!newCode || !confirmCode) {
      return NextResponse.json({ success: false, message: "New and confirmation code are required" }, { status: 400 });
    }

    if (newCode !== confirmCode) {
      return NextResponse.json({ success: false, message: "Codes do not match" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });

    if (!user || !user.admin) {
      return NextResponse.json({ success: false, message: "User not found or not an admin" }, { status: 404 });
    }

    // Compare current code
    const isValid = await bcrypt.compare(currentCode, user.admin.accessCode);
    if (!isValid) {
      return NextResponse.json({ success: false, message: "Current access code is incorrect" }, { status: 401 });
    }

    const hashedAccessCode = await bcrypt.hash(newCode, 10);

    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          "admin.accessCode": hashedAccessCode,
          "admin.delete": "0000", // dev-only override
        },
      }
    );

    return NextResponse.json({ success: true, message: "Access code updated successfully" });

  } catch (error) {
    console.error("Access code change error:", error);
    return NextResponse.json({ success: false, message: error.message || "Unauthorized" }, { status: 401 });
  }
}
