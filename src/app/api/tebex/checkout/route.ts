import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const PUBLIC_TOKEN = process.env.TEBEX_PUBLIC_TOKEN;
const PRIVATE_KEY = process.env.TEBEX_PRIVATE_KEY;

export async function POST(req: Request) {
  try {
    const { packages, mcUsername, returnUrl } = await req.json();
    if (!packages || !Array.isArray(packages) || packages.length === 0) {
      return NextResponse.json({ error: "Missing packages array" }, { status: 400 });
    }
    if (!mcUsername) {
      return NextResponse.json({ error: "Minecraft username is required" }, { status: 400 });
    }

    const authHeader = `Basic ${Buffer.from(`${PUBLIC_TOKEN}:${PRIVATE_KEY}`).toString('base64')}`;
    const baseUrl = returnUrl || req.headers.get('origin') || process.env.NEXTAUTH_URL || 'https://pokefun.in';

    // 1. Create Basket
    const basketRes = await fetch(`https://headless.tebex.io/api/accounts/${PUBLIC_TOKEN}/baskets`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        complete_url: `${baseUrl}/store?success=true`,
        cancel_url: `${baseUrl}/store?cancel=true`,
        username: mcUsername
      })
    });
    
    const basketData = await basketRes.json();
    if (!basketData || !basketData.data || !basketData.data.ident) {
      console.error("Basket creation failed:", basketData);
      return NextResponse.json({ error: "Failed to create basket with Tebex" }, { status: 500 });
    }
    
    const basketIdent = basketData.data.ident;
    let checkoutUrl = `https://pay.tebex.io/${basketIdent}`;

    // 2. Add Packages to Basket
    for (const pkg of packages) {
      const addRes = await fetch(`https://headless.tebex.io/api/baskets/${basketIdent}/packages`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          package_id: pkg.id,
          quantity: pkg.quantity || 1
        })
      });

      const addData = await addRes.json();
      if (addRes.status >= 400) {
        console.error(`Add package ${pkg.id} failed:`, addData);
        return NextResponse.json({ error: addData.error_message || `Failed to add package to basket` }, { status: addRes.status });
      }
      
      if (addData.data?.links?.checkout) {
        checkoutUrl = addData.data.links.checkout;
      }
    }

    return NextResponse.json({ checkoutUrl });

  } catch (error: any) {
    console.error("Tebex checkout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
