import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        const client = await clientPromise;
        const db = client.db();

        const user = await db.collection("users").findOne({ email });
        if (!user) {
            return NextResponse.json({success: false, message: "Invalid credentials" }, { status: 401 });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({success: false, message: "Invalid credentials" }, { status: 401 });
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

        return NextResponse.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                ...userWithoutPassword,
            },
        });
    } catch (error) {
        return NextResponse.json({success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
