import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyTokenFromHeader } from "@/lib/jwt";
import {ObjectId} from "mongodb";
import {commissions} from "@/lib/utils";
// import { corsHeaders } from '@/lib/cors';

// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 204,
//     headers: corsHeaders,
//   });
// }

export async function POST(req: NextRequest) {
    try {
        const decoded: any = verifyTokenFromHeader(req);
        const userId = decoded.userId;

        const { reference } = await req.json();

        if (!reference) {
            return NextResponse.json({ success: false, message: "Reference is required" }, { status: 400 });
        }

        const db = await clientPromise;
        const payments = db.db().collection("payments");

        // 🔍 1. Find existing pending payment
        const existing = await payments.findOne({
            reference,
            userId: new ObjectId(userId),
            status: "pending",
        });

        if (!existing) {
            return NextResponse.json({ success: false, message: "Pending payment not found" }, { status: 404 });
        }

        // 🌐 2. Verify with Paystack
        const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
        });

        const result = await verifyRes.json();

        if (!verifyRes.ok || result.status !== true || result.data.status !== "success") {
            return NextResponse.json({
                success: false,
                message: "Transaction verification failed",
                data: result.data || null,
            }, { status: 400 });
        }

        const paystackData = result.data;

        // 🔐 3. Validate amount & currency
        const expectedAmount = existing.total * 100;
        const expectedCurrency = existing.currency;

        if (paystackData.amount !== expectedAmount || paystackData.currency !== expectedCurrency) {
            return NextResponse.json({
                success: false,
                message: "Payment mismatch: currency or amount does not match.",
                data: {
                    expected: { amount: expectedAmount, currency: expectedCurrency },
                    received: { amount: paystackData.amount, currency: paystackData.currency },
                },
            }, { status: 400 });
        }

        // ✅ 4. Update payment to success
        await payments.updateOne(
            { _id: existing._id },
            {
                $set: {
                    status: "successful",
                    paid_at: paystackData.paid_at,
                    channel: paystackData.channel,
                    updatedAt: new Date(),
                },
            }
        );

        const splitPayments = db.db().collection("splitPayments");

        const currency = existing.currency; // "NGN" or "USD"
        const priceKey = currency === "NGN" ? "priceNGN" : "priceUSD";
        const supportFeeKey = currency === "NGN" ? "extendHelpFeeNGN" : "extendHelpFeeUSD";

// Group cartItems by authorId
        const authorGroups = new Map();

        for (const item of existing.cartItems) {
            const authorId = item.authorId;
            if (!authorId) continue;

            if (!authorGroups.has(authorId)) {
                authorGroups.set(authorId, []);
            }
            authorGroups.get(authorId).push(item);
        }

            // For each author group
        for (const [authorId, items] of authorGroups.entries()) {
            let totalPrice = 0;
            let supportFee = 0;

            for (const item of items) {
                totalPrice += item[priceKey] || 0;
                supportFee += item[supportFeeKey] || 0;
            }

            const commission = totalPrice * commissions.commissionRate;
            const authorEarnings = totalPrice - commission;

            // Release date for main earnings — 7 working days
            const baseReleaseDate = new Date();
            let daysAdded = 0;
            while (daysAdded < 7) {
                baseReleaseDate.setDate(baseReleaseDate.getDate() + 1);
                const day = baseReleaseDate.getDay();
                if (day !== 0 && day !== 6) daysAdded++;
            }

            // Release date for support fee — 1 month
            const supportReleaseDate = new Date();
            supportReleaseDate.setMonth(supportReleaseDate.getMonth() + 1);

            // ✅ Insert base earnings record
            await splitPayments.insertOne({
                type: "sale",
                authorId,
                userId: existing.userId,
                paymentId: existing._id,
                reference: existing.reference,
                cartItems: items,
                currency,
                totalAmount: totalPrice,
                commission,
                authorEarnings,
                status: "pending",
                releaseDate: baseReleaseDate,
                createdAt: new Date(),
            });

            // ✅ Insert support extension record if applicable
            // ✅ Insert support extension record if applicable
            if (supportFee > 0) {
                //const supportCommissionRate = 0.05;
                const supportCommission = supportFee * commissions.supportCommissionRate;
                const supportEarnings = supportFee - supportCommission;

                await splitPayments.insertOne({
                    type: "support",
                    authorId,
                    userId: existing.userId,
                    paymentId: existing._id,
                    reference: existing.reference,
                    cartItems: items.filter(item => item[supportFeeKey]),
                    currency,
                    totalAmount: supportFee,
                    commission: supportCommission,
                    authorEarnings: supportEarnings,
                    status: "pending",
                    releaseDate: supportReleaseDate,
                    createdAt: new Date(),
                });
            }

        }

        // ⬇️ Insert user activity record
        const activities = db.db().collection("activities");

        await activities.insertOne({
            userId: new ObjectId(userId),
            type: "purchase",
            title: 'Software purchases',
            description: `Purchased ${existing.cartItems.length > 1 ? `${existing.cartItems.length} items` : existing.cartItems[0]?.title || 'an item'}`,
            createdAt: new Date()
        });


        

        return NextResponse.json({
            success: true,
            message: "Payment verified successfully",
            transaction: {
                reference: paystackData.reference,
                amount: paystackData.amount,
                currency: paystackData.currency,
                status: "success",
            },
        });


    } catch (error: any) {
        console.error("Verification error:", error);
        return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
    }
}
