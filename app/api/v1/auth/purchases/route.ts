import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyTokenFromHeader } from "@/lib/jwt";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
    try {
        const decoded: any = verifyTokenFromHeader(request);
        const userId = decoded.userId;

        const client = await clientPromise;
        const db = client.db();

        // Check query string for "recent"
        const { searchParams } = new URL(request.url);
        const isRecent = searchParams.get("recent") === "true";

        const cursor = db
            .collection("purchases")
            .find({ userId: userId })
            .sort({ purchaseDate: -1 });

        const purchases = isRecent ? await cursor.limit(5).toArray() : await cursor.toArray();

        const purchasesWithId = purchases.map((purchase) => ({
            ...purchase,
            id: purchase._id.toString(),
            _id: undefined,
        }));

        return NextResponse.json({
            success: true,
            purchases: purchasesWithId,
        });
    } catch (error) {
        console.error("Fetch purchases error:", error);
        return NextResponse.json(
            { success: false, message: "Unauthorized or failed to fetch purchases." },
            { status: 401 }
        );
    }
}
