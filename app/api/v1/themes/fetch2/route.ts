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


export async function GET() {
  try {
    await dbConnect();

    const themes = await Theme.find({ isPublic: true });

    const enrichedThemes = themes.map((themeDoc) => {
      const theme = themeDoc.toObject();
      theme.id = theme._id.toString();
      delete theme._id;
      delete theme.__v;
      return theme;
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        data: enrichedThemes,
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    //console.log(error);
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Server error' }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
