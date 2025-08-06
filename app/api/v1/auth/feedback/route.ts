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

export async function POST(request: Request) {
    try {
        const decoded: any = verifyTokenFromHeader(request);
        const userId = decoded.userId;

        const body = await request.json();
        const {
            rating,
            review,
            type,
            currency,
            point,
            data
        } = body;

        if (!rating || !type || !currency || !point) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400, headers: corsHeaders }
            );
        }

        const client = await clientPromise;
        const db = client.db();

        const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404, headers: corsHeaders }
            );
        }

        // Convert point to number in case it was sent as a string
        // Convert point to number, safely removing commas if present
        const rewardPoints = parseInt(String(point).replace(/,/g, ""), 10) || 0;

        // Save feedback
        await db.collection("feedbacks").insertOne({
            userId: new ObjectId(userId),
            rating,
            review,
            type,
            currency,
            point: rewardPoints,
            productData: data,
            submittedAt: new Date()
        });

        // Update user's loyalty point
        await db.collection("users").updateOne(
            { _id: new ObjectId(userId) },
            {
                $inc: { loyaltyPoint: rewardPoints, reviews: 1 }

            }
        );

        const updatedUser = await db.collection("users").findOne(
            { _id: new ObjectId(userId) },
            { projection: { password: 0 } } // Exclude password directly
        );

        return NextResponse.json({
            success: true,
            message: "Feedback submitted and points rewarded",
            pointsEarned: rewardPoints,
            user: updatedUser
        }, { status: 200, headers: corsHeaders });

    } catch (error) {
        console.error("Feedback submission error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Internal server error" },
            { status: 500, headers: corsHeaders }
        );
    }
}
