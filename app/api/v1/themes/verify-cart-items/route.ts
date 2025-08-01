export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Theme from '@/components/models/Theme';
import { corsHeaders } from '@/lib/cors';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { productIds } = await request.json();

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Invalid product IDs provided.' }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const themes = await Theme.find({
      _id: { $in: productIds },
      isPublic: true,
    });

    const formatTheme = (themeDoc: any) => {
      const theme = themeDoc.toObject();
      theme.id = theme._id.toString();

      delete theme._id;
      delete theme.__v;
      delete theme.downloadUrl;
      delete theme.downloadInstructions;
      delete theme.loginDetails;

      return theme;
    };

    const enrichedThemes = themes.map(formatTheme);

    return new NextResponse(
      JSON.stringify({ success: true, data: enrichedThemes }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error('[VERIFY CART ITEMS API ERROR]', error);
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Server error' }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
