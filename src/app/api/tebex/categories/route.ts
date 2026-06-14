import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const currency = searchParams.get('currency') || 'USD';
    const token = process.env.TEBEX_PUBLIC_TOKEN;
    
    if (!token) {
      return NextResponse.json({ error: "Missing Tebex token" }, { status: 500 });
    }

    const res = await fetch(`https://headless.tebex.io/api/accounts/${token}/categories?includePackages=1&currency=${currency}`, {
      next: { revalidate: 60 } // Cache slightly to prevent spam
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch from Tebex" }, { status: res.status });
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
