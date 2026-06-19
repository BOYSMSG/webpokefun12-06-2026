import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGym extends Document {
  name: string; // e.g. "Bug Gym"
  type: string; // e.g. "Bug"
  badgeName: string; // e.g. "Swarm Badge"
  leaderUsername?: string; // The username of the appointed leader
  status: 'OPEN' | 'BOOKED';
  levelCap?: number;
  rules?: string; // Admin/Leader custom rules for the gym
  createdAt: Date;
}

const GymSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  badgeName: { type: String, required: true },
  leaderUsername: { type: String },
  status: { type: String, enum: ['OPEN', 'BOOKED'], default: 'OPEN' },
  levelCap: { type: Number, default: 50 },
  rules: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const Gym: Model<IGym> = mongoose.models.Gym || mongoose.model<IGym>('Gym', GymSchema);

export default Gym;
