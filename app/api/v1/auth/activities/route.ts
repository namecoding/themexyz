import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyTokenFromHeader } from "@/lib/jwt";
import { ObjectId } from "mongodb";
import { corsHeaders } from '@/lib/cors';

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
    });
}

export async function GET(request: Request) {
    try {
        const decoded: any = verifyTokenFromHeader(request);
        const userId = decoded.userId;

        // console.log("Decoded token:", decoded);

        const client = await clientPromise;
        const db = client.db();

        // Get `recent=true` from query string
        const { searchParams } = new URL(request.url);
        const isRecent = searchParams.get("recent") === "true";

        const cursor = db
            .collection("activities")
            .find({ userId: new ObjectId(userId) })
            .sort({ createdAt: -1 });

        const activities = isRecent
            ? await cursor.limit(5).toArray()
            : await cursor.toArray();

        const formatted = activities.map((activity) => ({
            id: activity._id.toString(),
            type: activity.type,
            title: activity.title,
            description: activity.description,
            createdAt: activity.createdAt,
        }));

        return NextResponse.json({
            success: true,
            activities: formatted,
        }, { status: 200, headers: corsHeaders });
    } catch (error) {
        console.error("Fetch activities error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Unauthorized or failed to fetch activities.",
            },
            { status: 401, headers: corsHeaders }
        );
    }
}
