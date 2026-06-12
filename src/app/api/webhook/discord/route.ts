import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Notification from '@/models/Notification';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Basic security: In production you'd verify a secret token in the URL or headers
    // e.g. /api/webhook/discord?secret=abc123xyz
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");
    
    // For now we accept if body exists
    if (!body) {
      return NextResponse.json({ error: 'No body provided' }, { status: 400 });
    }

    // Parse Discord Webhook Payload
    // Discord sends 'content' (raw text) or 'embeds'
    let messageText = "New Announcement from Discord!";
    let titleText = "Server Announcement";

    if (body.content) {
      messageText = body.content;
    } else if (body.embeds && body.embeds.length > 0) {
      titleText = body.embeds[0].title || titleText;
      messageText = body.embeds[0].description || "Check out the new update on Discord.";
    }

    await dbConnect();
    
    // Create Global Notification
    const newNotif = await Notification.create({
      title: titleText,
      message: messageText,
      isGlobal: true,
      url: "https://discord.gg/pokefun"
    });

    return NextResponse.json({ success: true, notificationId: newNotif._id }, { status: 200 });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
