import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const currency = searchParams.get('currency') || 'USD';
    const token = process.env.TEBEX_PUBLIC_TOKEN;
    
    if (!token) {
      return NextResponse.json({ error: "Missing Tebex token" }, { status: 500 });
    }

    const res = await fetch(`https://headless.tebex.io/api/accounts/${token}/categories?includePackages=1`, {
      headers: { 'X-Tebex-Currency': currency },
      next: { revalidate: 60 } // Cache slightly to prevent spam
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch from Tebex" }, { status: res.status });
    }
    
    const data = await res.json();

    // If currency is not USD, we convert it manually because Headless API returns base currency
    if (currency && currency !== 'USD' && data && data.data) {
      try {
        const rateRes = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
          next: { revalidate: 3600 } // Cache rates for 1 hour
        });
        const rateData = await rateRes.json();
        const rate = rateData.rates[currency];

        if (rate) {
          data.data.forEach((category: any) => {
            if (category.packages) {
              category.packages.forEach((pkg: any) => {
                pkg.base_price = parseFloat((pkg.base_price * rate).toFixed(2));
                pkg.total_price = parseFloat((pkg.total_price * rate).toFixed(2));
                if (pkg.discount) {
                  pkg.discount = parseFloat((pkg.discount * rate).toFixed(2));
                }
                pkg.currency = currency;
              });
            }
          });
        }
      } catch (err) {
        console.error("Failed to fetch exchange rates:", err);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
