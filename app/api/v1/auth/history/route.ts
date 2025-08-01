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

        const client = await clientPromise;
        const db = client.db();

        // Check if the query includes ?recent=true
        const { searchParams } = new URL(request.url);
        const isRecent = searchParams.get("recent") === "true";

        const cursor = db
            .collection("payments")
            .find({ userId: new ObjectId(userId) })
            .sort({ createdAt: -1 }) // latest first
            .project({
                createdAt: 1,
                description: 1,
                total: 1,
                status: 1,
                currency: 1,
            });

        const payments = isRecent ? await cursor.limit(20).toArray() : await cursor.toArray();

        // Format to match expected format
        const formattedPayments = payments.map((payment) => ({
            date: new Date(payment.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            }),
            description: payment.description,
            amount: payment.total,
            currency: payment.currency,
            status: payment.status,
        }));

        return NextResponse.json({
            success: true,
            payments: formattedPayments,
        });
    } catch (error) {
        console.error("Fetch payments error:", error);
        return NextResponse.json(
            { success: false, message: "Unauthorized or failed to fetch payments." },
            { status: 401 }
        );
    }
}
