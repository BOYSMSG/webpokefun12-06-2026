"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ShopClient({ initialCategories }: { initialCategories: any[] }) {
  const [loadingPkg, setLoadingPkg] = useState<number | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Check if there's a success or cancel query param
    const params = new URLSearchParams(window.location.search);
    if (params.get('success')) {
      alert("Payment initiated or completed! Thank you for your support.");
      // remove query param
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get('cancel')) {
      alert("Payment was cancelled.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleBuy = async (pkgId: number) => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    setLoadingPkg(pkgId);
    try {
      const res = await fetch('/api/tebex/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: pkgId })
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert("Failed to initiate checkout: " + (data.error || "Unknown error"));
        setLoadingPkg(null);
      }
    } catch (err) {
      alert("Something went wrong!");
      setLoadingPkg(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '50px', paddingBottom: '100px', maxWidth: '1200px', margin: '0 auto' }}>
      {initialCategories.map(category => (
        <div key={category.id}>
          <h2 style={{ fontSize: '2.5rem', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '30px', color: 'white' }}>{category.name}</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
            {category.packages.map((pkg: any) => (
              <div key={pkg.id} style={{ 
                background: 'rgba(0,0,0,0.4)', 
                border: '1px solid rgba(16, 185, 129, 0.3)', 
                borderRadius: '20px', 
                padding: '25px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(16, 185, 129, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.8)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
              }}
              >
                {/* Image */}
                {pkg.image ? (
                  <div style={{ width: '100%', height: '200px', borderRadius: '15px', overflow: 'hidden', marginBottom: '20px', background: 'rgba(255,255,255,0.05)' }}>
                    <img src={pkg.image} alt={pkg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ) : (
                  <div style={{ width: '100%', height: '200px', borderRadius: '15px', marginBottom: '20px', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <i className="fa-solid fa-box-open" style={{ fontSize: '4rem', color: 'rgba(255,255,255,0.2)' }}></i>
                  </div>
                )}
                
                {/* Title & Price */}
                <h3 style={{ fontSize: '1.8rem', marginBottom: '10px', color: 'white', fontWeight: 800 }}>{pkg.name}</h3>
                <div style={{ fontSize: '1.4rem', color: '#10b981', fontWeight: 'bold', marginBottom: '20px' }}>
                  {pkg.total_price} {pkg.currency}
                </div>
                
                {/* Description */}
                <div 
                  style={{ 
                    color: '#aaa', 
                    fontSize: '1rem', 
                    lineHeight: '1.6',
                    marginBottom: '30px', 
                    flex: 1, 
                    maxHeight: '200px', 
                    overflowY: 'auto',
                    paddingRight: '10px'
                  }} 
                  dangerouslySetInnerHTML={{ __html: pkg.description }} 
                />
                
                {/* Buy Button */}
                <button 
                  onClick={() => handleBuy(pkg.id)}
                  disabled={loadingPkg === pkg.id}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    padding: '15px 25px',
                    borderRadius: '12px',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    cursor: loadingPkg === pkg.id ? 'not-allowed' : 'pointer',
                    opacity: loadingPkg === pkg.id ? 0.7 : 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  {loadingPkg === pkg.id ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-cart-shopping"></i>}
                  {loadingPkg === pkg.id ? 'Preparing...' : `Buy ${pkg.name}`}
                </button>
              </div>
            ))}
          </div>
          {category.packages.length === 0 && <p style={{ color: 'gray', fontStyle: 'italic' }}>No packages available in this category yet.</p>}
        </div>
      ))}
      
      {initialCategories.length === 0 && (
        <div style={{ textAlign: 'center', color: 'gray', padding: '100px 0' }}>
          <i className="fa-solid fa-store-slash" style={{ fontSize: '4rem', marginBottom: '20px' }}></i>
          <h2>No Categories Found</h2>
          <p>Please make sure packages are published in the Tebex store.</p>
        </div>
      )}
    </div>
  );
}
