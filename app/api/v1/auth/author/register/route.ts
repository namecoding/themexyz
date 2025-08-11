import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyTokenFromHeader } from "@/lib/jwt";
import { ObjectId } from "mongodb";
import { sendEmail, allowEmailSending } from '@/lib/mailer';
import { metaData } from '@/lib/utils';
import { corsHeaders } from '@/lib/cors';

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
    });
}

export async function POST(request: Request) {
    try {
        const decoded: any = verifyTokenFromHeader(request);
        const userId = decoded.userId;

        const body = await request.json();
        const {
            platforms,
            specialties,
            profile,
            payoutMethod,
            generalInfo,
            traderStatus,
        } = body;

        if (!platforms || !specialties || !profile) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400, headers: corsHeaders }
            );
        }

        const client = await clientPromise;
        const db = client.db();

        const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404, headers: corsHeaders }
            );
        }

        if (user.isAuthor === 1) {
            return NextResponse.json(
                { success: false, message: "User is already an author" },
                { status: 409, headers: corsHeaders }
            );
        }
        const now = new Date();
        await db.collection("users").updateOne(
            { _id: user._id },
            {
                $set: {
                    isAuthor: 1,
                    authorityToSell: false,
                    platforms,
                    specialties,
                    profile,
                    payoutMethod,
                    generalInfo,
                    traderStatus,
                    authorSince: now,
                    author: {
                        NGN: {
                            balance: 0,
                            bonus: 0,
                            lastUpdated: now,
                        },
                        USD: {
                            balance: 0,
                            bonus: 0,
                            lastUpdated: now,
                        }
                    }

                },
            }
        );

        const updatedUser = await db.collection("users").findOne({ _id: user._id });

        //send email to the user email
        if (allowEmailSending) {
            await sendEmail({
                to: updatedUser.email,
                subject: `Author Registration Received – ${metaData.name}`,
                html: `
                    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                        <h2>Hello, ${updatedUser.name}!</h2>
                        <p>Thank you for completing your author profile on <strong>${metaData.name}</strong>.</p>
                        <p>Your application to become an author has been received and is currently under review by our team.</p>
                        <p>Once approved, you'll be granted permission to start publishing and selling your software on the platform.</p>
                        <p>We appreciate your interest in joining our community of creators.</p>
                        <br/>
                        <p>Best regards,<br/>The ${metaData.name} Team</p>
                    </div>
                `,
            });
        }


        return NextResponse.json({
            success: true,
            message: "Author registration completed",
            user: {
                //id: updatedUser._id.toString(),
                ...updatedUser,
                password: undefined,
            },
        }, { status: 200, headers: corsHeaders });

    } catch (error) {
        console.error("Author registration error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Internal server error" },
            { status: 500, headers: corsHeaders }
        );
    }
}
