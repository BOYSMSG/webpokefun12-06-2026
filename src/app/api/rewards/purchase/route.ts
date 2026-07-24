import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';
import RewardProduct from '@/models/RewardProduct';
import DeliveryQueue from '@/models/DeliveryQueue';
import RewardTransaction from '@/models/RewardTransaction';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
    }

    await connectMongo();
    
    // Start session for transaction to ensure atomic operations (if supported by MongoDB setup, otherwise sequential)
    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    try {
      // Find User
      const user = await User.findOne({ email: session.user.email }).session(dbSession);
      if (!user) {
        throw new Error("User not found");
      }
      
      if (!user.connections?.minecraft) {
        throw new Error("You must link your Minecraft account in Profile first!");
      }

      // Find Product
      const product = await RewardProduct.findById(productId).session(dbSession);
      if (!product) {
        throw new Error("Product not found");
      }

      if (!product.isVisible) {
        throw new Error("This product is currently unavailable.");
      }

      if (product.stock === 0) {
        throw new Error("This product is out of stock.");
      }

      // Calculate final price
      const finalPrice = product.discount > 0 
        ? product.price - (product.price * (product.discount / 100)) 
        : product.price;

      if (user.rewardPoints < finalPrice) {
        throw new Error("Insufficient reward points.");
      }

      // Deduct Points
      user.rewardPoints -= finalPrice;
      user.lifetimeSpent += finalPrice;
      await user.save({ session: dbSession });

      // Update Stock
      if (product.stock > 0) {
        product.stock -= 1;
        await product.save({ session: dbSession });
      }

      // Record Transaction
      await RewardTransaction.create([{
        userId: user._id,
        amount: finalPrice,
        type: 'SPEND',
        provider: 'ShopPurchase',
        description: `Purchased ${product.name}`
      }], { session: dbSession });

      // Prepare commands by replacing {player} with actual minecraft username
      const mcUsername = user.connections.minecraft;
      const parsedCommands = product.commands.map(cmd => cmd.replace(/{player}/g, mcUsername));

      // Create Delivery Queue
      if (parsedCommands.length > 0) {
        await DeliveryQueue.create([{
          userId: user._id,
          minecraftUsername: mcUsername,
          productId: product._id,
          productName: product.name,
          commands: parsedCommands,
          status: 'PENDING'
        }], { session: dbSession });
      }

      await dbSession.commitTransaction();
      dbSession.endSession();

      return NextResponse.json({ success: true, newBalance: user.rewardPoints, message: 'Purchase successful!' });
    } catch (err: any) {
      await dbSession.abortTransaction();
      dbSession.endSession();
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

  } catch (error) {
    console.error('Purchase Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
