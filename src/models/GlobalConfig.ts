import mongoose, { Schema, Document } from 'mongoose';

export interface IGlobalConfig extends Document {
  dailyCheckInAmount: number;
  rewardCategories: string[];
  modSecret?: string;
}

const GlobalConfigSchema: Schema = new Schema({
  dailyCheckInAmount: { type: Number, default: 50 },
  rewardCategories: { type: [String], default: ['Items', 'Pokemons', 'Exclusive Offers'] },
  modSecret: { type: String, default: "default_pokefun_secret_123!" }
});

export default mongoose.models.GlobalConfig || mongoose.model<IGlobalConfig>('GlobalConfig', GlobalConfigSchema);
