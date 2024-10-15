/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import News from '@/models/news';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const country = searchParams.get('country');
  const date = searchParams.get('date');

  await dbConnect();

  // Build the query object
  const query: any = {};
  if (category && category !== 'all') query.category = category;
  if (country && country !== 'all') query.country = country;
  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    query.publishedAt = { $gte: startDate, $lt: endDate };
  }

  try {
    const news = await News.find(query).sort({ publishedAt: -1 }).limit(50);
    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}