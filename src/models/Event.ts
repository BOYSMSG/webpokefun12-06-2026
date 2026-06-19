import mongoose, { Schema, Document, Model } from 'mongoose';

// Identical to Tournament schema for now, just named Event
export interface IEvent extends Document {
  name: string;
  description: string;
  imageUrl?: string;
  rules: string;
  maxPlayers: number;
  applicants: string[];
  approvedPlayers: string[];
  createdBy: string;
  createdAt: Date;
  eventDate: Date;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
  winners?: {
    first?: string;
    second?: string;
    third?: string;
  };
}

const EventSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  rules: { type: String, default: '' },
  maxPlayers: { type: Number, required: true, default: 50 },
  applicants: [{ type: String }],
  approvedPlayers: [{ type: String }],
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  eventDate: { type: Date, required: true },
  status: { type: String, enum: ['UPCOMING', 'ONGOING', 'COMPLETED'], default: 'UPCOMING' },
  winners: {
    first: { type: String, default: '' },
    second: { type: String, default: '' },
    third: { type: String, default: '' }
  },
  endMessage: { type: String, default: '' }
});

const ServerEvent: Model<IEvent> = mongoose.models.ServerEvent || mongoose.model<IEvent>('ServerEvent', EventSchema);

export default ServerEvent;
