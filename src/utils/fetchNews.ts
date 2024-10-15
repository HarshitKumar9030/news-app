/* eslint-disable @typescript-eslint/no-explicit-any */

import newsapi from '@/lib/newsapi';
import News from '@/models/news';
import dbConnect from '@/lib/mongoose';

const categories = ['general', 'business', 'technology', 'sports', 'entertainment', 'health', 'science'];
const countries = ['in', 'us', 'gb']; // Add more country codes here if you want to ~Harshit

interface FetchOptions {
  category?: string;
  country?: string;
}

export async function fetchAndStoreNews(options: FetchOptions = {}) {
  await dbConnect();

  const { category = 'all', country = 'all' } = options;

  const categoriesToFetch = category === 'all' ? categories : [category];
  const countriesToFetch = country === 'all' ? countries : [country];

  for (const cat of categoriesToFetch) {
    for (const ctry of countriesToFetch) {
      try {
        const params: any = {
          pageSize: 40, // Amount of news recieveing from the API
        };

        if (cat !== 'all') params.category = cat;
        if (ctry !== 'all') params.country = ctry;

        const response = await newsapi.get('/top-headlines', {
          params,
        });

        const articles = response.data.articles;

        for (const article of articles) {
          await News.findOneAndUpdate(
            { url: article.url }, // Unique identifier to prevent duplicates
            {
              title: article.title || 'No Title',
              description: article.description || 'No Description',
              url: article.url,
              urlToImage: article.urlToImage || '',
              publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date(),
              content: article.content || '',
              category: cat,
              country: ctry, // Store country code instead of name
              source: {
                id: article.source.id,
                name: article.source.name || 'Unknown Source',
              },
            },
            { upsert: true, new: true }
          );
        }

        console.log(`Fetched and stored news for category: ${cat}, country: ${ctry}`);
      } catch (error) {
        console.error(`Error fetching/storing news for category: ${cat}, country: ${ctry}`, error);
      }
    }
  }
}