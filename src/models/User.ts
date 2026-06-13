import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  username: string;
  name: string;
  image?: string;
  role: 'OWNER' | 'ADMIN' | 'SUB_ADMIN' | 'STAFF' | 'USER';
  discordId?: string;
  bio?: string;
  connections: {
    minecraft?: string;
    discord?: string;
    google?: string;
    youtube?: string;
    instagram?: string;
  };
  followers: string[];
  following: string[];
  permissions: string[]; // e.g. ['DELETE_POSTS', 'ANNOUNCEMENTS', 'MANAGE_ROLES', 'READ_DMS', 'BAN_USERS']
  savedPosts: string[]; // Array of post IDs
  pushSubscriptions?: any[]; // For Web Push notifications
  lastActive?: Date;
  isBanned?: boolean;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String },
  role: { type: String, enum: ['OWNER', 'ADMIN', 'SUB_ADMIN', 'STAFF', 'USER'], default: 'USER' },
  discordId: { type: String },
  bio: { type: String, default: 'A passionate Pokemon Trainer!' },
  connections: {
    minecraft: { type: String },
    discord: { type: String },
    google: { type: String },
    youtube: { type: String },
    instagram: { type: String }
  },
  followers: [{ type: String }],
  following: [{ type: String }],
  permissions: [{ type: String }],
  savedPosts: [{ type: String }],
  pushSubscriptions: [{ type: Schema.Types.Mixed }], // For Web Push notifications
  lastActive: { type: Date, default: Date.now },
  isBanned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
