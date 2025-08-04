import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
// import { corsHeaders } from "@/lib/cors";

const JWT_SECRET = process.env.JWT_SECRET;

// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 204,
//     headers: corsHeaders,
//   });
// }

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        const client = await clientPromise;
        const db = client.db();

        const user = await db.collection("users").findOne({ email });
        if (!user) {
            return new NextResponse(
                JSON.stringify({ success: false, message: "Invalid credentials" }),
                { status: 401 }
            );
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return new NextResponse(
                JSON.stringify({ success: false, message: "Invalid credentials" }),
                { status: 401}
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
        // headers: corsHeaders,
      }
    );

    } catch (error) {
        return new NextResponse(
      JSON.stringify({ success: false, message: "Internal Server Error" }),
      {
        status: 500,
        // headers: corsHeaders,
      }
    );
    
    }
}
