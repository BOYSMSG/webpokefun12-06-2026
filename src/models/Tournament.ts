import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITournament extends Document {
  name: string;
  description: string;
  rules: string;
  maxPlayers: number;
  applicants: string[]; // Usernames who applied
  approvedPlayers: string[]; // Usernames who were approved
  createdBy: string;
  createdAt: Date;
  eventDate: Date;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
}

const TournamentSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  rules: { type: String, default: '' },
  maxPlayers: { type: Number, required: true, default: 32 },
  applicants: [{ type: String }],
  approvedPlayers: [{ type: String }],
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  eventDate: { type: Date, required: true },
  status: { type: String, enum: ['UPCOMING', 'ONGOING', 'COMPLETED'], default: 'UPCOMING' }
});

const Tournament: Model<ITournament> = mongoose.models.Tournament || mongoose.model<ITournament>('Tournament', TournamentSchema);

export default Tournament;
