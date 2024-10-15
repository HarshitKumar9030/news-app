import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import RateLimit from '@/models/RateLimit';

const RATE_LIMIT_KEY = 'manual-fetch';

export async function GET() {
  await dbConnect();

  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const rateLimit = await RateLimit.findOne({ key: RATE_LIMIT_KEY });

  if (!rateLimit || rateLimit.date < today) {
    return NextResponse.json({ count: 0 });
  }

  return NextResponse.json({ count: rateLimit.count });
}