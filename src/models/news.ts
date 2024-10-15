// models/News.ts

import mongoose, { Document, Model, Schema } from 'mongoose';

export interface INews extends Document {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: Date;
  content: string;
  category: string;
  country: string;
  source: {
    id: string | null;
    name: string;
  };
}

const NewsSchema: Schema = new Schema<INews>(
  {
    title: { type: String, required: true },
    description: { type: String },
    url: { type: String, required: true, unique: true },
    urlToImage: { type: String },
    publishedAt: { type: Date, required: true },
    content: { type: String },
    category: { type: String, required: true },
    country: { type: String, required: true },
    source: {
      id: { type: String, default: null },
      name: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  }
);

const News: Model<INews> = mongoose.models.News || mongoose.model<INews>('News', NewsSchema);

export default News;
