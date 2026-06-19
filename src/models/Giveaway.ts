import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGiveaway extends Document {
  prize: string;
  description: string;
  winnersCount: number;
  participants: string[]; // Array of usernames
  winners: string[]; // Array of usernames who won
  forceWinner?: string; // Secret field for admin to force a specific winner
  createdBy: string;
  createdAt: Date;
  expiresAt: Date;
  status: 'ACTIVE' | 'ENDED';
}

const GiveawaySchema: Schema = new Schema({
  prize: { type: String, required: true },
  description: { type: String, default: '' },
  winnersCount: { type: Number, required: true, default: 1 },
  participants: [{ type: String }],
  winners: [{ type: String }],
  forceWinner: { type: String },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  status: { type: String, enum: ['ACTIVE', 'ENDED'], default: 'ACTIVE' }
});

const Giveaway: Model<IGiveaway> = mongoose.models.Giveaway || mongoose.model<IGiveaway>('Giveaway', GiveawaySchema);

export default Giveaway;
