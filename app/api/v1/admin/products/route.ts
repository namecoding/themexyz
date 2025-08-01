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

        if (!decoded || !decoded.userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db();

        // Verify permission
        const currentUser = await db.collection("users").findOne({ _id: new ObjectId(decoded.userId) });
        if (!currentUser?.admin?.permission?.includes("content_admin")) {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
        }

        // Fetch feedbacks
        const themes = await db.collection("themes").find().toArray(); //{ isPublic: false }

        return NextResponse.json({ success: true, themes: themes });
    } catch (error) {
        console.error("Error fetching themes:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch themes" },
            { status: 500 }
        );
    }
}
