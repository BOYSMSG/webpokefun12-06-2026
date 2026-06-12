import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStaffApplication extends Document {
  userId: string;
  discordTag: string;
  age: number;
  reason: string;
  experience: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: Date;
}

const StaffApplicationSchema: Schema = new Schema({
  userId: { type: String, required: true },
  discordTag: { type: String, required: true },
  age: { type: Number, required: true },
  reason: { type: String, required: true },
  experience: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED'], default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
});

const StaffApplication: Model<IStaffApplication> = mongoose.models.StaffApplication || mongoose.model<IStaffApplication>('StaffApplication', StaffApplicationSchema);

export default StaffApplication;
