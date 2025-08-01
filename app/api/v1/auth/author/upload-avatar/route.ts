import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {metaData} from "@/lib/utils";
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
        const file = formData.get('avatar') as Blob;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const fileName = `${metaData.name.toLowerCase()}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;

        const storageRef = ref(storage, fileName);
        const snapshot = await uploadBytes(storageRef, new Uint8Array(arrayBuffer));
        const url = await getDownloadURL(snapshot.ref);

        return NextResponse.json({ url });
    } catch (err) {
        console.error('Upload error:', err);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
