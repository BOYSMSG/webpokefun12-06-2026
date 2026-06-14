import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const PUBLIC_TOKEN = process.env.TEBEX_PUBLIC_TOKEN;
const PRIVATE_KEY = process.env.TEBEX_PRIVATE_KEY;

export async function POST(req: Request) {
  try {
    const { packageId, mcUsername } = await req.json();
    if (!packageId) {
      return NextResponse.json({ error: "Missing packageId" }, { status: 400 });
    }
    if (!mcUsername) {
      return NextResponse.json({ error: "Minecraft username is required" }, { status: 400 });
    }

    const authHeader = `Basic ${Buffer.from(`${PUBLIC_TOKEN}:${PRIVATE_KEY}`).toString('base64')}`;

    // 1. Create Basket
    const basketRes = await fetch(`https://headless.tebex.io/api/accounts/${PUBLIC_TOKEN}/baskets`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        complete_url: `${process.env.NEXTAUTH_URL || 'https://pokefun.in'}/shop?success=true`,
        cancel_url: `${process.env.NEXTAUTH_URL || 'https://pokefun.in'}/shop?cancel=true`,
        username: mcUsername
      })
    });
    
    const basketData = await basketRes.json();
    if (!basketData || !basketData.data || !basketData.data.ident) {
      console.error("Basket creation failed:", basketData);
      return NextResponse.json({ error: "Failed to create basket with Tebex" }, { status: 500 });
    }
    
    const basketIdent = basketData.data.ident;

    // 2. Add Package to Basket
    const addRes = await fetch(`https://headless.tebex.io/api/baskets/${basketIdent}/packages`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        package_id: packageId,
        quantity: 1
      })
    });

    const addData = await addRes.json();
    if (addRes.status >= 400) {
      console.error("Add package failed:", addData);
      return NextResponse.json({ error: addData.error_message || "Failed to add package to basket" }, { status: addRes.status });
    }

    const checkoutUrl = addData.data?.links?.checkout || `https://pay.tebex.io/${basketIdent}`;

    return NextResponse.json({ checkoutUrl });

  } catch (error: any) {
    console.error("Tebex checkout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
