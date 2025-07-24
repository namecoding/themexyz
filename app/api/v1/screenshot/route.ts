import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { url } = body;

        // Basic validation
        if (!url || !/^https?:\/\/.+/i.test(url)) {
            return NextResponse.json({ success: false, message: 'Invalid URL' }, { status: 400 });
        }

        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        // Screenshot as buffer
        const buffer = await page.screenshot({ fullPage: false });

        await browser.close();

        const base64 = buffer.toString('base64');

        return NextResponse.json({
            success: true,
            image: `data:image/png;base64,${base64}`,
        });
    } catch (err) {
        console.error('Screenshot error:', err);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
