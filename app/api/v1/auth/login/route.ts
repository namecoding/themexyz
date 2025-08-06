import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET;

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*", // or your frontend domain
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Invalid credentials" }),
        {
          status: 401,
          headers: {
            "Access-Control-Allow-Origin": "*", // or your frontend domain
          },
        }
      );
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Invalid credentials" }),
        {
          status: 401,
          headers: {
            "Access-Control-Allow-Origin": "*", // or your frontend domain
          },
        }
      );
    }

    // Sign JWT
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...userWithoutPassword } = user;

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Login successful",
        token,
        user: userWithoutPassword,
      }),
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // or your frontend domain
        },
      }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ success: false, message: "Internal Server Error" }),
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*", // or your frontend domain
        },
      }
    );
  }
}
