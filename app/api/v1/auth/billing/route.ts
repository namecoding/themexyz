import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyTokenFromHeader } from "@/lib/jwt";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
// import { corsHeaders } from '@/lib/cors';

// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 204,
//     headers: corsHeaders,
//   });
// }

const JWT_SECRET = process.env.JWT_SECRET!; // Ensure this is defined in your env

export async function PATCH(request: Request) {
    try {
        const decoded: any = verifyTokenFromHeader(request);
        const userId = decoded.userId;

        const { name, company, address, state, country, phone } = await request.json();

        if (!name || !address || !country || !phone) {
            return NextResponse.json(
                { success: false, message: "Required fields are missing." },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db();

        const updateFields = { name, company, address, state, country, phone };

        const result = await db.collection("users").updateOne(
            { _id: new ObjectId(userId) },
            { $set: updateFields }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json(
                { success: false, message: "No changes were made." },
                { status: 400 }
            );
        }

        // Fetch updated user (excluding _id and password)
        const updatedUser = await db.collection("users").findOne(
            { _id: new ObjectId(userId) },
            { projection: { password: 0, _id: 0 } }
        );

        // Re-sign JWT
        const token = jwt.sign(
            {
                userId,
                email: updatedUser?.email,
            },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        return NextResponse.json({
            success: true,
            message: "Billing details updated successfully.",
            user: updatedUser,
            token, // ⬅️ return the new token
        });
    } catch (error) {
        console.error("Billing update error:", error);
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }
}
