// app/api/auth/[...nextauth]/route.ts
import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import clientPromise from "@/lib/mongodb";
import { sendEmail, allowEmailSending } from '@/lib/mailer';
import { metaData } from '@/lib/utils';

import { corsHeaders } from '@/lib/cors';

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
    });
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async signIn({ user }) {
            try {
                const client = await clientPromise;
                const db = client.db();
                const existingUser = await db.collection("users").findOne({ email: user.email });

                if (!existingUser) {
                    // Insert new user (like your custom registration logic)
                    await db.collection("users").insertOne({
                        name: user.name,
                        email: user.email,
                        password: null, // no password for Google users
                        createdAt: new Date(),
                        avatar: user.image || null,
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
                    });


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

                return true;
            } catch (error) {
                console.error("Google signIn error:", error);
                return false;
            }
        },

        // async session({ session }) {
        //     // Attach user._id from DB to session
        //     const client = await clientPromise;
        //     const db = client.db();
        //     const dbUser = await db.collection("users").findOne({ email: session.user?.email });

        //     if (dbUser) {
        //         session.user.id = dbUser._id.toString(); // add user ID
        //     }

        //     return session;
        // },


        async jwt({ token, account }) {
                if (account?.provider) {
                token.provider = account.provider; // e.g. "google" on first sign-in
                }
                return token;
            },

            // ⭐ UPDATED: copy provider from token to session; keep your DB user.id mapping
            async session({ session, token }) {
                // expose provider on session so client code can read session.provider
                // @ts-expect-error (we'll add proper types below)
                session.provider = token.provider as string | undefined;

                // Attach user._id from DB to session.user.id
                const client = await clientPromise;
                const db = client.db();
                const dbUser = await db.collection("users").findOne({ email: session.user?.email });

                if (dbUser) {
                // @ts-expect-error (typed in augmentation)
                session.user.id = dbUser._id.toString();
                }

                return session;
            },

        async redirect({ url, baseUrl }) {
                // Always return to your site root (prevents bouncing to provider pages)
                return baseUrl;

                // If you prefer to allow internal routes, use this instead:
                // if (url.startsWith("/")) return `${baseUrl}${url}`;
                // if (new URL(url).origin === baseUrl) return url;
                // return baseUrl;
            },

    },
};
const handler = NextAuth(authOptions);


export { handler as GET, handler as POST };
