import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Theme from '@/components/models/Theme';
import { corsHeaders } from '@/lib/cors'


const JWT_SECRET = process.env.JWT_SECRET;

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
export async function GET(req: Request) {
  // const origin = getOrigin(req);

  try {
    await dbConnect();

    const themes = await Theme.find({ isPublic: true });

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

    const featured = enrichedThemes.filter(t => t.featured).sort(() => 0.5 - Math.random()).slice(0, 3);
    const newest = [...enrichedThemes].sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()).slice(0, 4);
    const bestSelling = [...enrichedThemes].sort((a, b) => (b.sales || 0) - (a.sales || 0)).slice(0, 4);

    return new NextResponse(JSON.stringify({
      success: true,
      data: { featured, newest, bestSelling },
    }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('[THEME API ERROR]', error);
    return new NextResponse(JSON.stringify({
      success: false,
      message: 'Server error',
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
