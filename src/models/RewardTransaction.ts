import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRewardTransaction extends Document {
  userId: string;
  amount: number;
  type: 'EARN' | 'SPEND' | 'REFUND' | 'ADMIN_ADD' | 'ADMIN_REMOVE';
  provider: string; // e.g. "BitLabs", "DailyLogin", "ShopPurchase"
  description: string;
  metadata?: any;
  timestamp: Date;
}

const RewardTransactionSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  amount: { type: Number, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['EARN', 'SPEND', 'REFUND', 'ADMIN_ADD', 'ADMIN_REMOVE']
  },
  provider: { type: String, required: true },
  description: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now }
});

const RewardTransaction: Model<IRewardTransaction> = mongoose.models.RewardTransaction || mongoose.model<IRewardTransaction>('RewardTransaction', RewardTransactionSchema);

export default RewardTransaction;
