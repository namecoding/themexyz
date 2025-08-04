import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyTokenFromHeader } from "@/lib/jwt";
import { ObjectId } from "mongodb";
import { randomUUID } from "crypto";
// import { corsHeaders } from "@/lib/cors"; // ✅ Import your CORS headers

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 204,
//     headers: corsHeaders,
//   });
// }

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
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Missing required payment data.",
        }),
        {
          status: 400,
          // headers: corsHeaders,
        }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const reference = `REF-${randomUUID().split("-")[0].toUpperCase()}`;

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

    const initRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: total * 100,
        reference,
        currency: "NGN",
        callback_url: "https://your-domain.com/payment/verify", // Update in prod
      }),
    });

    const initData = await initRes.json();

    if (!initRes.ok || !initData.status) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: initData?.message || "Paystack init failed.",
        }),
        {
          status: 500,
          // headers: corsHeaders,
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Payment initialized with Paystack.",
        reference,
        authorization_url: initData.data.authorization_url,
        access_code: initData.data.access_code,
      }),
      {
        status: 200,
        // headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("Payment initialization error:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to process payment request.",
      }),
      {
        status: 500,
        // headers: corsHeaders,
      }
    );
  }
}
