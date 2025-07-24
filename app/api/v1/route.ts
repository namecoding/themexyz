// app/api/v1/route.ts
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db(); // uses swiftCourier from URI
        const users = await db.collection("users").find({}).toArray();

        return NextResponse.json({
            message: "Users fetched successfully",
            count: users.length,
            data: users,
        });
    } catch (error) {
        console.error("MongoDB GET error:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
