import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { sendEmail, allowEmailSending } from '@/lib/mailer';
import { metaData } from '@/lib/utils';

import { corsHeaders } from '@/lib/cors';

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
    });
}


const JWT_SECRET = process.env.JWT_SECRET!;



export async function POST(request: Request) {
    try {
        const body = await request.json();
        let { email, name } = body;

        if (!email || !name) {
            return NextResponse.json({ success: false, message: 'Missing email or name' }, { status: 400, headers: corsHeaders });
        }

        const client = await clientPromise;
        const db = client.db();

        let user = await db.collection('users').findOne({ email });

        if (!user) {
            const newUser = {
                name,
                email,
                password: null, // Google users don't need password
                createdAt: new Date(),
                avatar: null,
                wallet: {
                    NGN: { balance: 0, bonus: 0, lastUpdated: new Date() },
                    USD: { balance: 0, bonus: 0, lastUpdated: new Date() },
                },
                author: {
                    NGN: { balance: 0, bonus: 0, lastUpdated: new Date() },
                    USD: { balance: 0, bonus: 0, lastUpdated: new Date() },
                },
                thresholdNGN: 50000,
                thresholdUSD: 100,
                totalDownloads: 0,
                reviews: 0,
                isAuthor: 0,
                authorityToSell: false,
                notifications: {
                    emailUpdates: true,
                    productUpdates: true,
                    promotionalEmails: true,
                    purchaseConfirmations: true,
                    supportMessages: true,
                },
                isSocial: true,
                socialType: 'Google',
                premiumMembership: {
                    isActive: false,
                    startDate: null,
                    endDate: null,
                    plan: null, // e.g. 'monthly', 'yearly'
                    benefits: {
                        reducedThreshold: true,
                        commissionRate: 10, // instead of default 20%
                        freeBoostsPerMonth: 2,
                        badge: true,
                    }
                },
                loyaltyPoint: 0,
                accountStatus: true
            };

            const result = await db.collection('users').insertOne(newUser);
            user = await db.collection('users').findOne({ _id: result.insertedId });


            if (allowEmailSending) {
                await sendEmail({
                    to: user.email!,
                    subject: `Welcome to ${metaData.name || 'Our Platform'}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                            <h2>Welcome, ${user.name}!</h2>
                            <p>Your account has been successfully created on <strong>${metaData.name}</strong>.</p>
                            <p>You can now start exploring and purchasing software products from our marketplace.</p>
                            <p>If you're a developer and would like to sell your own software, you can complete the <a href="${process.env.NEXT_PUBLIC_BASE_URL || '#'}${'/become-author'}" style="color: #007bff; text-decoration: underline;">Become an Author</a> process to get started.</p>
                            <br/>
                            <p>Best regards,<br/>The ${metaData.name} Team</p>
                        </div>
                    `,
                });
            }

        }

        const { password, _id, ...safeUser } = user;

        // ✅ Sign JWT
        const token = jwt.sign(
            {
                userId: _id.toString(),
                email: user.email,
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return NextResponse.json({
            success: true,
            token, // ✅ Send token
            user: {
                id: _id.toString(),
                ...safeUser,
            },
        }, { status: 200, headers: corsHeaders });


    } catch (error) {
        console.error('Google login error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500, headers: corsHeaders });
    }
}
