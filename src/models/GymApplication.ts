import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGymApplication extends Document {
  applicantUsername: string;
  gymId: mongoose.Types.ObjectId;
  discordTag: string;
  minecraftIgn: string;
  timezone: string;
  reason: string;
  experience: string;
  teamDraft: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: string; // Admin username
  createdAt: Date;
}

const GymApplicationSchema: Schema = new Schema({
  applicantUsername: { type: String, required: true },
  gymId: { type: Schema.Types.ObjectId, ref: 'Gym', required: true },
  discordTag: { type: String, required: true },
  minecraftIgn: { type: String, required: true },
  timezone: { type: String, required: true },
  reason: { type: String, required: true },
  experience: { type: String, required: true },
  teamDraft: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  reviewedBy: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const GymApplication: Model<IGymApplication> = mongoose.models.GymApplication || mongoose.model<IGymApplication>('GymApplication', GymApplicationSchema);

export default GymApplication;
