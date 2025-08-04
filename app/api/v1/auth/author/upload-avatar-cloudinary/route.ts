import { NextRequest, NextResponse } from 'next/server';
// import { corsHeaders } from '@/lib/cors';

// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 204,
//     headers: corsHeaders,
//   });
// }
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('avatar') as Blob | null;

        if (!file) {
            return NextResponse.json(
                { success: false, message: "No file uploaded" },
                { status: 400 }
            );
        }

        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const preset = process.env.CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !preset) {
            console.error("Cloudinary config missing");
            return NextResponse.json(
                { success: false, message: "An internal error occurred. Please try again." },
                { status: 500 }
            );
        }

        // Convert Blob to base64
        const arrayBuffer = await file.arrayBuffer();
        const base64String = `data:${file.type};base64,${Buffer.from(arrayBuffer).toString('base64')}`;

        const form = new FormData();
        form.append("file", base64String);
        form.append("upload_preset", preset);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: form,
        });

        if (!res.ok) {
            const errData = await res.json();
            console.error("Cloudinary upload error:", errData);
            return NextResponse.json(
                { success: false, message: "Upload failed. Please try again." },
                { status: 500 }
            );
        }

        const data = await res.json();

        return NextResponse.json({
            success: true,
            message: "Upload successful",
            url: data.secure_url,
        });
    } catch (err) {
        console.error("Upload error:", err);
        return NextResponse.json(
            { success: false, message: "An unexpected error occurred. Please try again." },
            { status: 500 }
        );
    }
}
