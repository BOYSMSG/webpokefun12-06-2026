import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("X-PFConnect-Token");
    
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    }

    const body = await req.json();
    const { onlinePlayers, maxPlayers } = body;
    
    // In a full implementation, you'd save these stats to the database.
    // For now, we just return success to satisfy the mod.
    
    return NextResponse.json({ success: true, onlinePlayers, maxPlayers });
  } catch (error) {
    console.error("Heartbeat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
