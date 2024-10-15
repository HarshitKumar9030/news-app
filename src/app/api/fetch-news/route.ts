/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { fetchAndStoreNews } from '@/utils/fetchNews';
import RateLimit from '@/models/RateLimit';

const MAX_REQUESTS_PER_DAY = 10;
const RATE_LIMIT_KEY = 'manual-fetch';

export async function POST(request: Request) {
  await dbConnect();

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of the day

  let rateLimit = await RateLimit.findOne({ key: RATE_LIMIT_KEY });

  if (!rateLimit) {
    // Create a new rate limit document
    rateLimit = new RateLimit({
      key: RATE_LIMIT_KEY,
      count: 0,
      date: today,
    });
  } else if (rateLimit.date < today) {
    // Reset count for a new day
    rateLimit.count = 0;
    rateLimit.date = today;
  }

  if (rateLimit.count >= MAX_REQUESTS_PER_DAY) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. You can perform up to 10 manual fetches per day.' },
      { status: 429 }
    );
  }

  try {
    await fetchAndStoreNews();
    rateLimit.count += 1;
    await rateLimit.save();
    return NextResponse.json({ message: 'News fetched and stored successfully.' });
  } catch (error) {
    console.error('Error during manual fetch:', error);
    return NextResponse.json({ error: 'Failed to fetch news.' }, { status: 500 });
  }
}