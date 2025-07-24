import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { verifyTokenFromHeader } from "@/lib/jwt"
import { ObjectId } from "mongodb"

export async function GET(request: Request) {
    try {
        const decoded: any = verifyTokenFromHeader(request)
        const userId = decoded.userId

        const client = await clientPromise
        const db = client.db()

        const user = await db.collection("users").findOne(
            { _id: new ObjectId(userId) },
            {
                projection: {
                    password: 0, // Exclude password
                },
            }
        )

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found." },
                { status: 404 }
            )
        }

        console.log("✅ Authenticated user:", user)

        return NextResponse.json({
            success: true,
            user,
        })
    } catch (error) {
        console.error("❌ Failed to fetch current user:", error)
        return NextResponse.json(
            { success: false, message: "Unauthorized or failed to fetch user." },
            { status: 401 }
        )
    }
}
