import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const secretKey = process.env.TEBEX_PRIVATE_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: "Missing Tebex secret key" }, { status: 500 });
    }

    // Fetch latest payments from Tebex API (plugin API) - fetching more so we can filter
    const res = await fetch(`https://plugin.tebex.io/payments?limit=100`, {
      headers: {
        'X-Tebex-Secret': secretKey
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch from Tebex" }, { status: res.status });
    }
    
    const data = await res.json();
    
    // Filter out payments if needed, but allow $0.00 for testing or free packages
    let realPayments: any[] = [];
    if (Array.isArray(data)) {
      realPayments = data;
    } else if (data && Array.isArray(data.data)) {
      realPayments = data.data;
    }
    
    // Only count completed payments
    realPayments = realPayments.filter((p: any) => p.status === 'Complete');
    
    // Calculate Top Customer by grouping amounts by player name
    const playerTotals: Record<string, { total: number, player: any }> = {};
    for (const p of realPayments) {
      const name = p.player?.name || 'Unknown';
      if (!playerTotals[name]) {
        playerTotals[name] = { total: 0, player: p };
      }
      playerTotals[name].total += parseFloat(p.amount);
    }
    
    let topCustomer = null;
    let maxAmount = -1;
    for (const name in playerTotals) {
      if (playerTotals[name].total > maxAmount) {
        maxAmount = playerTotals[name].total;
        topCustomer = playerTotals[name].player;
      }
    }
    
    // We don't need to send the exact amount back to the client if they don't want it, 
    // but the client can just ignore it. We'll send the top 5 recent and the top customer.
    return NextResponse.json({
      recent: realPayments.slice(0, 5),
      top: topCustomer
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
