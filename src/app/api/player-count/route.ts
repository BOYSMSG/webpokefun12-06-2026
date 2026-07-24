import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // We scrape the player count from the voting site since the actual server blocks standard status APIs via Cloudflare/Firewall.
    const res = await fetch("https://minecraftbestservers.com/server-pokefun.4851/", {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      next: { revalidate: 60 } // cache for 60 seconds
    });
    
    if (!res.ok) {
      return NextResponse.json({ online: false, players: 0 });
    }
    
    const html = await res.text();
    const match = html.match(/(\d+)\s+online/i);
    
    if (match && match[1]) {
      return NextResponse.json({ online: true, players: parseInt(match[1], 10) });
    }
    
    return NextResponse.json({ online: false, players: 0 });
  } catch (error) {
    console.error("Player count API error:", error);
    return NextResponse.json({ online: false, players: 0 });
  }
}
