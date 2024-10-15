/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import RateLimit from '@/models/RateLimit';
import { fetchAndStoreNews } from '@/utils/fetchNews';
import { z } from 'zod';

const fetchSchema = z.object({
  category: z.enum(['all', 'general', 'business', 'technology', 'sports', 'entertainment', 'health', 'science']).optional(),
  country: z.enum(['all', 'in', 'us', 'gb']).optional(),
});

const MAX_MANUAL_FETCHES_PER_DAY = 10;
const RATE_LIMIT_KEY = 'manual-fetch';

export async function POST(request: Request) {
  await dbConnect();

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of the day

  let rateLimit = await RateLimit.findOne({ key: RATE_LIMIT_KEY });

  if (!rateLimit) {
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

  if (rateLimit.count >= MAX_MANUAL_FETCHES_PER_DAY) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. You can perform up to 10 manual fetches per day.' },
      { status: 429 }
    );
  }

  // Parse and validate the request body
  let body: any;
  try {
    body = await request.json();
  } catch (error: any) {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const parseResult = fetchSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json({ error: 'Invalid input parameters.' }, { status: 400 });
  }

  const { category, country } = parseResult.data;

  try {
    await fetchAndStoreNews({ category, country });
    rateLimit.count += 1;
    await rateLimit.save();
    return NextResponse.json({ message: 'News fetched and stored successfully.' });
  } catch (error: any) {
    console.error('Error during manual fetch:', error);
    return NextResponse.json({ error: 'Failed to fetch news.' }, { status: 500 });
  }
}