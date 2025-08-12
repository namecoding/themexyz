import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { corsHeaders } from '@/lib/cors';
// http://localhost:3000/api/v1/cron/process-splits // keep this line, i am using it

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
    });
}

export async function GET() {
    try {
        const db = await clientPromise;
        const splitPayments = db.db().collection("splitPayments");
        const users = db.db().collection("users");

        const now = new Date();

        // 1. Find all due and not on-hold split payments
        const dueSplits = await splitPayments.find({
            status: "pending",
            releaseDate: { $lte: now },
        }).toArray();

        if (dueSplits.length === 0) {
            return new NextResponse(JSON.stringify({ success: true, message: "No split payments to process" }), {
                status: 401,
                headers: corsHeaders,
            });
        }

        let processedCount = 0;

        for (const split of dueSplits) {
            const { authorId, currency, authorEarnings, status } = split;

            if (status === "onhold") continue;

            const authorBalancePath = `author.${currency}.balance`;
            const authorUpdatedPath = `author.${currency}.lastUpdated`;

            // 2. Ensure author wallet exists or initialize
            const authorUser = await users.findOne({ _id: new ObjectId(authorId) });

            if (!authorUser) continue;

            if (!authorUser.author || !authorUser.author[currency]) {
                await users.updateOne(
                    { _id: new ObjectId(authorId) },
                    {
                        $set: {
                            [`author.${currency}`]: {
                                balance: 0,
                                bonus: 0,
                                lastUpdated: now,
                            },
                        },
                    }
                );
            }

            // 3. Credit earnings and update lastUpdated
            await users.updateOne(
                { _id: new ObjectId(authorId) },
                {
                    $inc: { [authorBalancePath]: authorEarnings },
                    $set: { [authorUpdatedPath]: now },
                }
            );

            // 4. Mark split as completed
            await splitPayments.updateOne(
                { _id: split._id },
                {
                    $set: {
                        status: "completed",
                        completedAt: now,
                    },
                }
            );

            // 5. Record settlement history
            const settlementHistory = db.db().collection("settlementHistory");

            await settlementHistory.insertOne({
                authorId: new ObjectId(authorId),
                splitId: split._id,
                paymentId: split.paymentId,
                type: split.type, // "sale" or "support"
                currency,
                amount: authorEarnings,
                reference: split.reference,
                settledAt: now,
                createdAt: new Date(),
            });

            processedCount++;
        }

        return new NextResponse(
            JSON.stringify({
                success: true,
                message: `${processedCount} split payments processed successfully`,
            }),
            {
                status: 200,
                headers: corsHeaders,
            }
        );

    } catch (error: any) {
        //console.log("Split processing error:", error);

        return new NextResponse(
            JSON.stringify({ success: false, message: 'Internal Server error' }),
            {
                status: 500,
                headers: corsHeaders,
            }
        );
    }
}
