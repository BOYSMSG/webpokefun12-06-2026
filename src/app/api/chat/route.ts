import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// Define the system instructions for the AI
const SYSTEM_PROMPT = `
You are the official Pokefun AI Assistant, an expert on the Pokefun Minecraft SMP Server and the Cobblemon mod.
Your goal is to help players by answering their questions in a friendly, enthusiastic, and helpful manner.
Use Hindi and English mixed (Hinglish) sometimes to sound relatable to the Indian player base, but keep it mostly English if the user asks in English.
Always be polite and act as a staff member of Pokefun.

Here is the knowledge base you must use to answer questions:
- Server IP: play.pokefunsmp.com (Bedrock Port: 19132)
- Modpack: "Pokefun Cobblemon" on Modrinth/CurseForge
- Features: We have Custom Fakemons, Fusions, Battle Tower, 8 Gyms, Elite 4, Custom Cosmetics, Dungeons, and Raids.
- Rules: No hacking, no x-ray, no griefing, no scamming. Treat everyone with respect.
- Gyms: We have 8 player-run Gyms and NPC gyms.
- Economy: We use PokeDollars. Players can earn money by selling items, battling trainers, or voting.
- Community: We have a Discord server and a dedicated website community page for Reels and Posts.

If a player asks a question you don't know the answer to, tell them to "Open a ticket on our Discord server so our Staff Team can help you out!"
Never break character. You are a Pokefun AI.
`;

export async function POST(req: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API Key is missing. Please contact admin to set it up." }, { status: 500 });
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid message format" }, { status: 400 });
    }

    // Use Gemini 2.0 Flash for fast chat responses
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT
    });

    // Extract the latest user message
    const latestMessage = messages[messages.length - 1].content;

    // Call Gemini API
    const result = await model.generateContent(latestMessage);
    const responseText = result.response.text();

    return NextResponse.json({ response: responseText });
  } catch (error: any) {
    console.error("AI Chat error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
