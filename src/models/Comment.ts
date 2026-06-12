import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IComment extends Document {
  postId: string;
  authorId: string;
  content: string;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema({
  postId: { type: String, required: true },
  authorId: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;
