import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPollOption {
  text: string;
  votes: string[]; // Array of usernames who voted for this option
}

export interface IPoll extends Document {
  question: string;
  options: IPollOption[];
  durationHours: number;
  allowMultiple: boolean;
  createdBy: string;
  createdAt: Date;
  expiresAt: Date;
  isActive: boolean;
}

const PollSchema: Schema = new Schema({
  question: { type: String, required: true },
  options: [{
    text: { type: String, required: true },
    votes: [{ type: String }] // Array of usernames
  }],
  durationHours: { type: Number, required: true },
  allowMultiple: { type: Boolean, default: false },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
});

const Poll: Model<IPoll> = mongoose.models.Poll || mongoose.model<IPoll>('Poll', PollSchema);

export default Poll;
