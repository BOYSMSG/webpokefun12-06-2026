import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPost extends Document {
  authorId: string;
  type: 'POST' | 'REEL';
  category?: string;
  title: string;
  content: string; // text or video/image url from Google Drive
  media?: string;
  mediaType?: 'image' | 'video' | 'youtube';
  likes: string[]; // Array of User IDs
  dislikes: string[]; // Array of User IDs
  views: number; // For reels
  impressions: number; // For feed
  createdAt: Date;
}

const PostSchema: Schema = new Schema({
  authorId: { type: String, required: true },
  type: { type: String, enum: ['POST', 'REEL'], required: true },
  category: { type: String },
  title: { type: String, required: true },
  content: { type: String, required: true },
  media: { type: String },
  mediaType: { type: String, enum: ['image', 'video', 'youtube'] },
  likes: [{ type: String }],
  dislikes: [{ type: String }],
  views: { type: Number, default: 0 },
  impressions: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;
