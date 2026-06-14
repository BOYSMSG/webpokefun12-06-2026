import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const secretKey = process.env.TEBEX_PRIVATE_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: "Missing Tebex secret key" }, { status: 500 });
    }

    // Fetch latest payments from Tebex API (plugin API) - fetching more so we can filter
    const res = await fetch(`https://plugin.tebex.io/payments?limit=25`, {
      headers: {
        'X-Tebex-Secret': secretKey
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch from Tebex" }, { status: res.status });
    }
    
    const data = await res.json();
    
    // Filter out $0.00 payments and take the top 5 real purchases
    let realPayments = [];
    if (Array.isArray(data)) {
      realPayments = data.filter((p: any) => parseFloat(p.amount) > 0).slice(0, 5);
    }
    
    return NextResponse.json(realPayments.length > 0 ? realPayments : data);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
