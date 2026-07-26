import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import PendingDelivery from "@/models/PendingDelivery";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("X-PFConnect-Token");
    
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    }

    await connectMongo();
    
    // Fetch all pending deliveries
    const deliveries = await PendingDelivery.find({ status: "PENDING" });
    
    // Map them to the format the mod expects (com.pokefun.connect.model.DeliveryRequest)
    const formattedDeliveries = deliveries.map(delivery => ({
      deliveryId: delivery._id.toString(),
      playerUUID: delivery.playerUUID,
      playerName: delivery.minecraftName || "Unknown",
      rewardId: delivery.rewardId.toString(),
      rewardType: delivery.rewardType || "COMMAND",
      commands: delivery.commands || [],
      metadata: delivery.metadata || {},
      status: "PENDING",
      priority: 1
    }));
    
    // Mark them as processing so they aren't fetched again immediately
    if (deliveries.length > 0) {
      const ids = deliveries.map(d => d._id);
      await PendingDelivery.updateMany(
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
