import mongoose, { Schema, Document } from 'mongoose';

export interface IGlobalConfig extends Document {
  dailyCheckInAmount: number;
  rewardCategories: string[];
}

const GlobalConfigSchema: Schema = new Schema({
  dailyCheckInAmount: { type: Number, default: 50 },
  rewardCategories: { type: [String], default: ['Items', 'Pokemons', 'Exclusive Offers'] }
});

export default mongoose.models.GlobalConfig || mongoose.model<IGlobalConfig>('GlobalConfig', GlobalConfigSchema);
