import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  image?: string;
  role: 'ADMIN' | 'STAFF' | 'USER';
  discordId?: string;
  bio?: string;
  followers: string[];
  following: string[];
  lastActive?: Date;
  isBanned?: boolean;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String },
  role: { type: String, enum: ['ADMIN', 'STAFF', 'USER'], default: 'USER' },
  discordId: { type: String },
  bio: { type: String, default: 'A passionate Pokemon Trainer!' },
  followers: [{ type: String }],
  following: [{ type: String }],
  lastActive: { type: Date, default: Date.now },
  isBanned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
