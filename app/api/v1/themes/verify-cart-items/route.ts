export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import dbConnect from '/lib/dbConnect';
import Theme from '/components/models/Theme';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { productIds } = await request.json();

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid product IDs provided.' },
        { status: 400 }
      );
    }

    const themes = await Theme.find({
      _id: { $in: productIds },
      isPublic: true,
    });

    const formatTheme = (themeDoc: any) => {
      const theme = themeDoc.toObject();
      theme.id = theme._id.toString();

      // Remove sensitive/unwanted fields
      delete theme._id;
      delete theme.__v;
      delete theme.downloadUrl;
      delete theme.downloadInstructions;
      delete theme.loginDetails;

      return theme;
    };

    const enrichedThemes = themes.map(formatTheme);

    return NextResponse.json({ success: true, data: enrichedThemes });
  } catch (error) {
    console.error('[VERIFY CART ITEMS API ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
