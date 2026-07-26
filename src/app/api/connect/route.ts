import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import GlobalConfig from "@/models/GlobalConfig";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, nonce, timestamp, signature } = body;

    if (!token || !nonce || !timestamp || !signature) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectMongo();
    const config = await GlobalConfig.findOne();
    const serverSecret = config?.modSecret || process.env.PFCONNECT_SECRET || "default_pokefun_secret_123!";

    const payload = `token=${token}&nonce=${nonce}&timestamp=${timestamp}`;
    const expectedSignature = crypto.createHmac("sha256", serverSecret)
                                    .update(payload)
                                    .digest("base64url"); // Match Java's Base64.getUrlEncoder().withoutPadding()

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    return NextResponse.json({ success: true, message: "Connected successfully" });
  } catch (error) {
    console.error("Connect error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
