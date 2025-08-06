// app/api/test/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({ method: 'GET', message: 'GET request successful' });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({ method: 'POST', message: 'POST request successful', body });
}

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({ method: 'PUT', message: 'PUT request successful', body });
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({ method: 'DELETE', message: 'DELETE request successful' });
}
