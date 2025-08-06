import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyTokenFromHeader } from "@/lib/jwt";
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
        const authorId = decoded.userId;

        const client = await clientPromise;
        const db = client.db();

        const { searchParams } = new URL(request.url);
        const isRecent = searchParams.get("recent") === "true";

        const cursor = db
            .collection("themes")
            .find({ authorId })
            .sort({ releaseDate: -1 });

        const themes = isRecent ? await cursor.limit(5).toArray() : await cursor.toArray();

        const themesWithId = themes.map((theme) => {
            const cleaned = { ...theme };

            // Delete unwanted fields
            delete cleaned.authorId;

            return {
                ...cleaned,
                id: theme._id.toString(), // manually add id
            };
        });

        return NextResponse.json({
            success: true,
            themes: themesWithId,
        }, { status: 200, headers: corsHeaders });
    } catch (error) {
        console.error("Fetch themes by author error:", error);
        return NextResponse.json(
            { success: false, message: "Unauthorized or failed to fetch themes." },
            { status: 401, headers: corsHeaders }
        );
    }
}
