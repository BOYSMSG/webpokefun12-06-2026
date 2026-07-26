import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import DeliveryQueue from "@/models/DeliveryQueue";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("X-PFConnect-Token");
    
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    }

    await dbConnect();
    
    // Fetch all pending deliveries
    const deliveries = await DeliveryQueue.find({ status: "PENDING" });
    
    // Map them to the format the mod expects (com.pokefun.connect.model.DeliveryRequest)
    const formattedDeliveries = deliveries.map(delivery => ({
      deliveryId: delivery._id.toString(),
      playerUUID: (delivery.userId && delivery.userId.length === 24) 
        ? `${delivery.userId.substring(0,8)}-${delivery.userId.substring(8,12)}-${delivery.userId.substring(12,16)}-${delivery.userId.substring(16,20)}-${delivery.userId.substring(20,24)}00000000` 
        : "00000000-0000-0000-0000-000000000000",
      playerName: delivery.minecraftUsername || "Unknown",
      rewardId: delivery.productId.toString(),
      rewardType: "COMMAND",
      commands: delivery.commands || [],
      metadata: {},
      status: "PENDING",
      priority: 1
    }));
    
    // Mark them as processing so they aren't fetched again immediately
    if (deliveries.length > 0) {
      const ids = deliveries.map(d => d._id);
      await DeliveryQueue.updateMany(
        { _id: { $in: ids } },
        { $set: { status: "PROCESSING" } }
      );
    }
    
    // We return a simple JSON array. The mod will parse it.
    return NextResponse.json(formattedDeliveries);
  } catch (error) {
    console.error("Delivery fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
