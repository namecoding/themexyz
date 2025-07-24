import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyTokenFromHeader } from "@/lib/jwt";
import { ObjectId } from "mongodb";
import { randomUUID } from "crypto";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

export async function POST(request: Request) {
    try {
        const decoded: any = verifyTokenFromHeader(request);
        const userId = decoded.userId;

        const {
            hasBillingDetails,
            paymentMethod,
            description,
            currency,
            billingDetails,
            cartItems,
            subtotal,
            total,
            email,
            supportExtensionTotal,
        } = await request.json();

        if (!paymentMethod || !cartItems || !total || !email) {
            return NextResponse.json(
                { success: false, message: "Missing required payment data." },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db();

        // ✅ Generate a strong custom reference
        const reference = `REF-${randomUUID().split("-")[0].toUpperCase()}`;

        // ✅ Save as pending payment locally
        await db.collection("payments").insertOne({
            userId: new ObjectId(userId),
            hasBillingDetails,
            paymentMethod,
            description,
            currency,
            billingDetails,
            cartItems,
            subtotal,
            total,
            email,
            supportExtensionTotal,
            reference,
            status: "pending",
            createdAt: new Date(),
        });

        // ✅ Call Paystack to initialize payment with your custom reference
        const initRes = await fetch("https://api.paystack.co/transaction/initialize", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                amount: total * 100, // kobo
                reference, // ✅ Use your custom reference
                currency: "NGN",
                callback_url: "https://your-domain.com/payment/verify", // change this to your actual callback
            }),
        });

        const initData = await initRes.json();

        if (!initRes.ok || !initData.status) {
            return NextResponse.json(
                { success: false, message: initData?.message || "Paystack init failed." },
                { status: 500 }
            );
        }

        // ✅ Return details for frontend to launch modal or redirect
        return NextResponse.json({
            success: true,
            message: "Payment initialized with Paystack.",
            reference,
            authorization_url: initData.data.authorization_url,
            access_code: initData.data.access_code,
        });

    } catch (error) {
        console.error("Payment initialization error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to process payment request." },
            { status: 500 }
        );
    }
}
