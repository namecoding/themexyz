export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Theme from '@/components/models/Theme';
// import { corsHeaders } from '@/lib/cors';

interface Params {
  params: { id: string };
}

// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 204,
//     headers: corsHeaders,
//   });
// }

export async function GET(req: Request, { params }: Params) {
  try {
    await dbConnect();

    const themeDoc = await Theme.findOne({ slug: params.id });

    if (!themeDoc) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Product not found' }),
        {
          status: 404,
          // headers: corsHeaders,
        }
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

    return new NextResponse(
      JSON.stringify({
        success: true,
        data: theme,
      }),
      {
        status: 200,
        // headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error('[PRODUCT GET ERROR]', error);
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Server error' }),
      {
        status: 500,
        // headers: corsHeaders,
      }
    );
  }
}
