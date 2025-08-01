import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyTokenFromHeader } from "@/lib/jwt";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
    try {
        const decoded: any = verifyTokenFromHeader(request);

        if (!decoded || !decoded.userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db();

        // Verify permission
        const currentUser = await db.collection("users").findOne({ _id: new ObjectId(decoded.userId) });
        if (!currentUser?.admin?.permission?.includes("feedback_admin")) {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
        }

        // Fetch feedbacks
        const feedbacks = await db.collection("feedbacks").find({}).toArray();

        // Extract all userIds from feedbacks
        const userIds = feedbacks.map((fb) => new ObjectId(fb.userId));
        const users = await db
            .collection("users")
            .find({ _id: { $in: userIds } })
            .project({ avatar: 1, email: 1, name: 1 })
            .toArray();

        // Map userId to user data for fast lookup
        const userMap = users.reduce((acc, user) => {
            acc[user._id.toString()] = user;
            return acc;
        }, {} as Record<string, { avatar?: string; email?: string; name?: string }>);

        // Format final response
        const result = feedbacks.map((fb, index) => {
            const user = userMap[fb.userId] || {};
            return {
                id: fb._id.toString(),
                type: fb.type,
                customerName: user.name || "Anonymous",
                customerEmail: user.email || "unknown@example.com",
                customerAvatar: user.avatar || "https://via.placeholder.com/100",
                rating: fb.rating,
                comment: fb.review,
                productId: fb.productData?.orderId || null,
                productTitle: fb.productData?.productTitle || "Unknown Product",
                orderId: fb.productData?.orderId || "N/A",
                status: "pending", // default status || in-progress
                priority: "high", // default priority medium || high | low
                createdAt: fb.submittedAt || new Date().toISOString(),
            };
        });

        return NextResponse.json({ success: true, feedbacks: result });
    } catch (error) {
        console.error("Error fetching feedback:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch feedback" },
            { status: 500 }
        );
    }
}
