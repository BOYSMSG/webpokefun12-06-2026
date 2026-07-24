import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDeliveryQueue extends Document {
  userId: string;
  minecraftUsername: string;
  productId: string;
  productName: string;
  commands: string[]; // Exact parsed commands to run (e.g. replacing {player} with minecraftUsername)
  status: 'PENDING' | 'PROCESSING' | 'DELIVERED' | 'FAILED' | 'CANCELLED';
  retryCount: number;
  lastAttempt?: Date;
  errorLog?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DeliveryQueueSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  minecraftUsername: { type: String, required: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  commands: [{ type: String, required: true }],
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'DELIVERED', 'FAILED', 'CANCELLED'],
    default: 'PENDING'
  },
  retryCount: { type: Number, default: 0 },
  lastAttempt: { type: Date },
  errorLog: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const DeliveryQueue: Model<IDeliveryQueue> = mongoose.models.DeliveryQueue || mongoose.model<IDeliveryQueue>('DeliveryQueue', DeliveryQueueSchema);

export default DeliveryQueue;
