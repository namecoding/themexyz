export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { ObjectId } from 'mongodb';

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // adjust path if different
import Theme from '@/components/models/Theme'; // assuming you're still using Theme model

interface Params {
  params: { id: string }
}

export async function GET(req: Request, { params }: Params) {
  try {
    await dbConnect();

    const themeDoc = await Theme.findById(new ObjectId(params.id));

    if (!themeDoc) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    const theme = themeDoc.toObject();
    theme.id = theme._id.toString();

    // Remove sensitive fields
    delete theme._id;
    delete theme.__v;
    delete theme.downloadUrl;
    delete theme.downloadInstructions;
    delete theme.loginDetails;

    return NextResponse.json({
      success: true,
      data: theme,
    });
  } catch (error) {
    console.error('[PRODUCT GET ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
