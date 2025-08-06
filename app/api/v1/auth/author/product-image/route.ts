import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { metaData } from "@/lib/utils";
import { corsHeaders } from '@/lib/cors';

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
    });
}

const firebaseConfig = {
    apiKey: process.env.FIREBASE_KEY,
    authDomain: "themexyz-eba33.firebaseapp.com",
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
};
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const storage = getStorage(app);

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        // Collect all "images[]" files (assuming field name is images[])
        const files: Blob[] = formData.getAll('images') as Blob[];

        if (!files.length) {
            return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
        }

        const urls: string[] = [];

        for (const file of files) {
            const arrayBuffer = await file.arrayBuffer();
            const fileName = `preview-${metaData.name.toLowerCase()}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;

            const storageRef = ref(storage, fileName);
            const snapshot = await uploadBytes(storageRef, new Uint8Array(arrayBuffer));
            const url = await getDownloadURL(snapshot.ref);

            urls.push(url);
        }

        return NextResponse.json({ urls }, { status: 200, headers: corsHeaders });
    } catch (err) {
        console.error('Upload error:', err);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500, headers: corsHeaders });
    }
}
