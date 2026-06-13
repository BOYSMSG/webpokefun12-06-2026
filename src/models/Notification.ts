import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
  title: string;
  message: string;
  icon?: string;
  url?: string;
  isGlobal: boolean;
  userId?: string;
  readBy: string[]; // Array of user IDs who have read this global notification
  count?: number;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  icon: { type: String },
  url: { type: String },
  isGlobal: { type: Boolean, default: true },
  userId: { type: String },
  readBy: [{ type: String }],
  count: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now, expires: 604800 } // Auto delete after 7 days
});

const Notification: Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
