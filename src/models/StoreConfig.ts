import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStoreConfig extends Document {
  saleActive: boolean;
  saleEndDate: Date;
  saleTitle: string;
  saleSubtitle: string;
  discountPercentage: number;
}

const StoreConfigSchema: Schema = new Schema({
  saleActive: { type: Boolean, default: false },
  saleEndDate: { type: Date, default: Date.now },
  saleTitle: { type: String, default: "Summer Sale" },
  saleSubtitle: { type: String, default: "Up to 20% OFF on all Ranks & Keys!" },
  discountPercentage: { type: Number, default: 20 }
});

const StoreConfig: Model<IStoreConfig> = mongoose.models.StoreConfig || mongoose.model<IStoreConfig>('StoreConfig', StoreConfigSchema);
export default StoreConfig;
