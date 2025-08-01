import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail, allowEmailSending } from '@/lib/mailer';
import { metaData } from '@/lib/utils';
import { corsHeaders } from "@/lib/cors";

const JWT_SECRET = process.env.JWT_SECRET;

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { email, password, name } = body;

    email = email?.trim().toLowerCase();
    name = name?.trim();

    if (!email || !password || !name) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Missing required fields' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Invalid email format' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'User already exists with this email' }),
        { status: 409, headers: corsHeaders }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: hashedPassword,
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
      isSocial: false,
      socialType: 'Manual',
      premiumMembership: {
        isActive: false,
        startDate: null,
        endDate: null,
        plan: null,
        benefits: {
          reducedThreshold: true,
          commissionRate: 10,
          freeBoostsPerMonth: 2,
          badge: true,
        },
      },
      loyaltyPoint: 0,
      accountStatus: true,
    };

    const result = await db.collection('users').insertOne(newUser);

    const token = jwt.sign(
      { userId: result.insertedId, email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const user = await db.collection('users').findOne({ _id: result.insertedId });
    if (!user) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'User fetch failed after creation' }),
        { status: 500, headers: corsHeaders }
      );
    }

    const { password: _pw, _id, __v, ...safeUser } = user;

    if (allowEmailSending) {
      await sendEmail({
        to: email,
        subject: `Welcome to ${metaData.name || 'Our Platform'}`,
        html: `
          <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
              <h2>Welcome, ${name}!</h2>
              <p>Your account has been successfully created on <strong>${metaData.name}</strong>.</p>
              <p>You can now start exploring and purchasing software products from our marketplace.</p>
              <p>If you're a developer and would like to sell your own software, you can complete the <a href="${process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE || '#'}${'/become-author'}" style="color: #007bff; text-decoration: underline;">Become an Author</a> process to get started.</p>
              <br/>
              <p>Best regards,<br/>The ${metaData.name} Team</p>
          </div>
        `,
      });
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
          id: _id.toString(),
          ...safeUser,
        },
      }),
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Internal Server Error' }),
      { status: 500, headers: corsHeaders }
    );
  }
}
