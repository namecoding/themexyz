import { NextResponse } from 'next/server';
import dbConnect from '/lib/dbConnect';
import Theme from '/components/models/Theme';

export async function GET() {
    try {
        await dbConnect();

        const themes = await Theme.find({ isPublic: true });

        const enrichedThemes = themes.map(themeDoc => {
            const theme = themeDoc.toObject();
            theme.id = theme._id.toString();
            delete theme._id;
            delete theme.__v;
            return theme;
        });

        return NextResponse.json({
            success: true,
            data: enrichedThemes,
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
