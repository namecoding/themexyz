import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const {
            title,
            image,
            featured,
            isCategory,
            priceNGN,
            priceUSD,
            author,
            authorImage,
            authorId,
            authorHelp,
            extendHelp,
            extendHelpFeeUSD,
            extendHelpFeeNGN,
            rating,
            reviews,
            sales,
            lastUpdate,
            releaseDate,
            tags,
            features,
            galleryImages,
            sections,
            support,
            documentation,
            suitableFor,
            featureSections,
            itemDetails,
            license
        } = body;

        // Validate required fields
        if (
            !title ||
            priceNGN == null ||
            priceUSD == null ||
            !author ||
            !authorId  ||
            rating == null ||
            reviews == null ||
            sales == null ||
            !releaseDate ||
            !tags ||
            !features ||
            !sections ||
            !support ||
            !documentation ||
            !suitableFor ||
            !featureSections ||
            !itemDetails ||
            !license
        ) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db();

        const newTheme = {
            title,
            featured : featured || false,
            isCategory,
            image,
            priceNGN: Number(priceNGN),
            priceUSD: Number(priceUSD),
            author,
            authorId,
            authorImage: authorImage || '',
            authorHelp: authorHelp || '',
            extendHelp: extendHelp || '',
            extendHelpFeeNGN: extendHelpFeeNGN != null ? Number(extendHelpFeeNGN) : 0,
            extendHelpFeeUSD: extendHelpFeeUSD != null ? Number(extendHelpFeeUSD) : 0,
            rating: Number(rating),
            reviews: Number(reviews),
            sales: Number(sales),
            lastUpdate: lastUpdate || '',
            releaseDate: releaseDate || '',
            tags: Array.isArray(tags) ? tags : [],
            features: Array.isArray(features) ? features : [],
            galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
            sections: Array.isArray(sections) ? sections : [],
            support: typeof support === 'object' ? support : {},
            documentation: typeof documentation === 'object' ? documentation : {},
            suitableFor: Array.isArray(suitableFor) ? suitableFor : [],
            featureSections: Array.isArray(featureSections) ? featureSections : [],
            itemDetails: typeof itemDetails === 'object' ? itemDetails : {},
            license,
            createdAt: new Date(),
            boost: {
                isActive: false,
                startDate: null,
                endDate: null,
                boostedBy:authorId,
                priority: 1, // for ranking boosted products
                lastPaymentRef: null
            }
        };

        const result = await db.collection('themes').insertOne(newTheme);

        return NextResponse.json(
            {
                success: true,
                message: 'Theme added successfully',
                theme: {
                    id: result.insertedId,
                    ...newTheme,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Insert theme error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
