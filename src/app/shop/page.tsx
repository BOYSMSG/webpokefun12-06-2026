import React from 'react';
import ShopClient from './ShopClient';

export const metadata = {
  title: 'Store - Pokefun',
  description: 'Support the Pokefun server and unlock awesome premium packages!',
};

export default async function ShopPage() {
  const token = process.env.TEBEX_PUBLIC_TOKEN;
  let categories = [];

  try {
    const res = await fetch(`https://headless.tebex.io/api/accounts/${token}/categories?includePackages=1`, {
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    
    if (res.ok) {
      const data = await res.json();
      if (data && data.data) {
        categories = data.data;
      }
    } else {
      console.error("Failed to fetch Tebex categories, status:", res.status);
    }
  } catch (err) {
    console.error("Error fetching Tebex categories:", err);
  }

  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh', background: '#0a0a0a' }}>
      <div className="inner" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', color: 'white', marginBottom: '10px' }}>
            Pokefun <span style={{ color: '#10b981', textShadow: '0 0 20px rgba(16,185,129,0.5)' }}>Store</span>
          </h1>
          <p style={{ color: '#aaa', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Support the server to keep it running smoothly and get exclusive perks, ranks, and items in return! ❤️
          </p>
        </div>
        
        <ShopClient initialCategories={categories} />
      </div>
    </main>
  );
}
