import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyTokenFromHeader } from "@/lib/jwt";
import { ObjectId } from "mongodb";
import {metaData, generateSlug} from "@/lib/utils";
import { corsHeaders } from '@/lib/cors';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: Request) {
    try {
        const decoded: any = verifyTokenFromHeader(request);
        const userId = decoded.userId;

        const body = await request.json();

        // ✅ Basic validation (you can expand this)
        if (!body.title || !body.isCategory || !body.priceNGN || !body.priceUSD) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db();

        const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        if (!user.authorityToSell) {
            return NextResponse.json(
                { success: false, message: "You are not authorized to sell, please contact support team" },
                { status: 409 }
            );
        }

        // ✅ Build theme document
        const themeDoc = {
            title: body.title,
            isCategory: body.isCategory,
            featured: body.featured || false,
            priceNGN: body.priceNGN,
            priceUSD: body.priceUSD,
            demoUrl: body.demoUrl,
            adminDemoUrl: body.adminDemoUrl,
            downloadUrl: body.downloadUrl,
            downloadInstructions: body.downloadInstructions,
            loginDetails: body.loginDetails || [],
            author: user?.profile?.displayName || user?.name || metaData.name+' Author',
            authorId: userId,
            authorImage: user?.profile?.avatar || null,
            helpDurationSettings: body.helpDurationSettings || {},
            preferredContact: body.preferredContact || [],
            tags: body.tags || [],
            features: body.features || [],
            galleryImages: body.galleryImages || [], // Assuming you're storing image URLs here
            suitableFor: body.suitableFor || [],
            compatibleBrowsers: body.compatibleBrowsers,
            builtWith: body.builtWith || [],
            layout: body.layout,
            sellType:body.sellType,
            license: body.license,
            responseTime: body.responseTime,
            overview: body.overview,
            documentation: body.documentation || '',
            marketData: body.marketData || { rating: 0, reviews: 0, sales: 0 },
            releaseDate: new Date(),
            lastUpdate: new Date(),
            isPublished: body.isPublished || false,
            isPublic:false,
            slug:generateSlug(body.title)
        };

        // ✅ Insert theme
        await db.collection("themes").insertOne(themeDoc);

        return NextResponse.json({ success: true, message: "Theme created successfully" });

    } catch (error: any) {
        console.error("upload error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
