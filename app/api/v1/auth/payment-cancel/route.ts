import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyTokenFromHeader } from "@/lib/jwt";
import {ObjectId} from "mongodb";

export async function POST(request: Request) {
    try {
        const decoded: any = verifyTokenFromHeader(request);
        const userId = decoded.userId;

        const { reference } = await request.json();

        if (!reference) {
            return NextResponse.json(
                { success: false, message: "Missing payment reference." },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db();

        // ✅ Check if payment exists and belongs to user
        const payment = await db.collection("payments").findOne({ reference, userId: new ObjectId(userId) });

        if (!payment) {
            return NextResponse.json(
                { success: false, message: "Payment not found." },
                { status: 404 }
            );
        }

        // ✅ Only allow cancellation if status is still pending
        if (payment.status !== "pending") {
            return NextResponse.json(
                { success: false, message: "Cannot cancel a completed payment." },
                { status: 400 }
            );
        }

        // ✅ Update payment status to 'cancelled'
        await db.collection("payments").updateOne(
            { reference },
            {
                $set: {
                    status: "cancelled",
                    cancelledAt: new Date(),
                },
            }
        );

        return NextResponse.json({
            success: true,
            message: "Payment cancelled successfully.",
        });

    } catch (error) {
        console.error("Payment cancel error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to cancel payment." },
            { status: 500 }
        );
    }
}
