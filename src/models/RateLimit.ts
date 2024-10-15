import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IRateLimit extends Document {
  key: string; 
  count: number;
  date: Date;
}

const RateLimitSchema: Schema = new Schema<IRateLimit>(
  {
    key: { type: String, required: true, unique: true },
    count: { type: Number, required: true, default: 0 },
    date: { type: Date, required: true, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const RateLimit: Model<IRateLimit> = mongoose.models.RateLimit || mongoose.model<IRateLimit>('RateLimit', RateLimitSchema);

export default RateLimit;