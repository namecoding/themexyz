import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyTokenFromHeader } from "@/lib/jwt";
import { ObjectId } from "mongodb";
import { corsHeaders } from "@/lib/cors";

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

    const user = await db.collection("users").findOne(
      { _id: new ObjectId(userId) },
      {
        projection: {
          password: 0, // Hide password field
        },
      }
    );

    if (!user) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "User not found.",
        }),
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    //console.log("✅ Authenticated user:", user);

    return new NextResponse(
      JSON.stringify({
        success: true,
        user,
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("❌ Failed to fetch current user:", error);

    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Unauthorized or failed to fetch user.",
      }),
      {
        status: 401,
        headers: corsHeaders,
      }
    );
  }
}
