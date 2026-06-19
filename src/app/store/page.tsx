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
    <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="inner" style={{ maxWidth: '1450px', margin: '0 auto', padding: '0 20px' }}>
        <ShopClient initialCategories={categories} />
      </div>
    </main>
  );
}
