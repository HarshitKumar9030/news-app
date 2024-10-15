// lib/newsapi.ts
'use server';

import axios from 'axios';

const NEWSAPI_KEY = process.env.NEWS_API_KEY;

if (!NEWSAPI_KEY) {
  throw new Error('Please define the NEWSAPI_API_KEY environment variable inside .env.local');
}

const newsapi = axios.create({
  baseURL: 'https://newsapi.org/v2',
  headers: {
    Authorization: NEWSAPI_KEY,
  },
});

export default newsapi;
