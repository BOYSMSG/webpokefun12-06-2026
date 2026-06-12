import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `You are "Professor Oak" (or a helpful guide for the Pokefun server). 
You must act as a friendly, knowledgeable Minecraft Cobblemon SMP assistant.
Never break character. Provide short, fun, and helpful answers. 
If someone asks about the server, it's called Pokefun.
Server IP: play.pokefun.in
Store: store.pokefun.in
Discord: https://discord.gg/pokefun
The server has custom Fakemons, crates, gyms, and more!
Always respond warmly!`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid message format" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key is missing from environment" }, { status: 500 });
    }

    // Use Gemini 2.0 Flash as it is the only model supported by this API key
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT
    });

    // Extract the latest user message. The frontend sends msg.content
    const latestMessage = messages[messages.length - 1].content || messages[messages.length - 1].text || "";

    if (!latestMessage) {
        return NextResponse.json({ error: "Empty message content" }, { status: 400 });
    }

    // Call Gemini API
    const result = await model.generateContent(latestMessage);
    const responseText = result.response.text();

    return NextResponse.json({ response: responseText });
  } catch (error: any) {
    console.error("AI Chat error:", error);
    
    // Attempt to parse rate limits to give user a clean error
    if (error?.message?.includes("429")) {
        return NextResponse.json({ error: "Google API Limit reached! Please try again later or use a different Google account for the API key." }, { status: 429 });
    }

    if (error?.message?.includes("404")) {
        // Fallback if gemini-1.5-flash isn't available
        return NextResponse.json({ error: "The AI model is currently disabled for this API key. Please generate a new key from Google AI Studio." }, { status: 404 });
    }

    return NextResponse.json({ error: "Internal Server Error. Check console logs." }, { status: 500 });
  }
}
