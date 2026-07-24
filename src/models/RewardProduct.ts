import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRewardProduct extends Document {
  name: string;
  description: string;
  category: string;
  price: number;
  discount: number; // e.g. 10 for 10% off
  
  // Media
  image: string;
  gallery: string[];
  video?: string;
  previewImages: string[];
  
  // Delivery
  deliveryType: 'COMMAND' | 'PERMISSION' | 'POKEMON' | 'COINS' | 'CUSTOM';
  commands: string[]; // List of commands to execute
  
  // Availability & Limits
  stock: number; // -1 for unlimited
  maxPurchasesPerUser: number; // -1 for unlimited
  startDate?: Date;
  endDate?: Date;
  
  // Flags & Badges
  isVisible: boolean;
  isFeatured: boolean;
  isExclusive: boolean;
  isNewItem: boolean;
  isPopular: boolean;
  isBestSeller: boolean;
  
  requirements?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const RewardProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: [
      'Keys', 'Coins', 'Pokemon', 'Ranks', 'Cosmetics', 
      'Battle Pass', 'Titles', 'Limited Items', 'Exclusive Items', 
      'Bundles', 'Special Offers', 'Mystery Box', 'Other'
    ]
  },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  
  image: { type: String, required: true },
  gallery: [{ type: String }],
  video: { type: String },
  previewImages: [{ type: String }],
  
  deliveryType: { 
    type: String, 
    enum: ['COMMAND', 'PERMISSION', 'POKEMON', 'COINS', 'CUSTOM'],
    default: 'COMMAND'
  },
  commands: [{ type: String }],
  
  stock: { type: Number, default: -1 },
  maxPurchasesPerUser: { type: Number, default: -1 },
  startDate: { type: Date },
  endDate: { type: Date },
  
  isVisible: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isExclusive: { type: Boolean, default: false },
  isNewItem: { type: Boolean, default: false },
  isPopular: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  
  requirements: { type: String },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const RewardProduct: Model<IRewardProduct> = mongoose.models.RewardProduct || mongoose.model<IRewardProduct>('RewardProduct', RewardProductSchema);

export default RewardProduct;
