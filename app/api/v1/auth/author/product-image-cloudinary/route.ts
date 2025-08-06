import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { corsHeaders } from '@/lib/cors';

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
    });
}

export async function POST(request: NextRequest) {
    try {
        const { files } = await request.json();

        if (!files || !Array.isArray(files) || files.length === 0) {
            return Response.json(
                { success: false, message: "Invalid upload request" },
                { status: 400, headers: corsHeaders }
            );
        }

        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const preset = process.env.CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !preset) {
            console.error("Cloudinary config missing");
            return Response.json(
                { success: false, message: "An internal error occurred. Please try again." },
                { status: 500, headers: corsHeaders }
            );
        }

        const uploadPromises = files.map(async (file: string) => {
            if (!file.startsWith("data:image/")) {
                console.warn("Skipped non-image file");
                return null;
            }

            try {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", preset);

                const res = await fetch(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                if (!res.ok) {
                    const errData = await res.json();
                    console.error("Cloudinary upload error:", errData);
                    return null;
                }

                const data = await res.json();
                return data.secure_url;
            } catch (err) {
                console.error("Upload exception:", err);
                return null;
            }
        });

        const results = await Promise.all(uploadPromises);
        const urls = results.filter((url): url is string => url !== null);

        if (urls.length === 0) {
            return Response.json(
                { success: false, message: "We couldn't process your upload. Please try again." },
                { status: 500, headers: corsHeaders }
            );
        }

        return Response.json({
            success: true,
            message: "Upload successful",
            urls,
        }, { status: 200, headers: corsHeaders });
    } catch (err) {
        console.error("Unexpected upload error:", err);
        return Response.json(
            { success: false, message: "An unexpected error occurred. Please try again later." },
            { status: 500, headers: corsHeaders }
        );
    }
}
