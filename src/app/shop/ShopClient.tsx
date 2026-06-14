"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ShopClient({ initialCategories }: { initialCategories: any[] }) {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(initialCategories.length > 0 ? initialCategories[0].id : null);
  const [selectedPkg, setSelectedPkg] = useState<any | null>(null);
  const [loadingPkg, setLoadingPkg] = useState<number | null>(null);
  
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Check if there's a success or cancel query param
    const params = new URLSearchParams(window.location.search);
    if (params.get('success')) {
      alert("Payment initiated or completed! Thank you for your support.");
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

  const activeCategory = initialCategories.find(c => c.id === activeCategoryId) || initialCategories[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', paddingBottom: '100px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Header Cart Status (Optional, basic for now) */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-20px' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 20px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="fa-solid fa-basket-shopping" style={{ color: '#10b981' }}></i>
          <span>Ready to Checkout</span>
        </div>
      </div>

      <div className="shop-layout">
        
        {/* Sidebar */}
        <div className="shop-sidebar">
          <div className="sidebar-box">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '15px', color: '#10b981', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
              <i className="fa-solid fa-list-ul"></i> Categories
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {initialCategories.map(category => (
                <li key={category.id}>
                  <button 
                    onClick={() => setActiveCategoryId(category.id)}
                    className={activeCategoryId === category.id ? 'cat-btn active' : 'cat-btn'}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="sidebar-box" style={{ marginTop: '20px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '10px', color: '#fbbf24' }}>Need Help?</h3>
            <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '15px' }}>If you haven't received your package within 15 minutes, please open a ticket on our Discord.</p>
            <a href="https://discord.gg/pokefun" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: '#5865F2', padding: '10px 20px', borderRadius: '8px', color: 'white', fontWeight: 'bold' }}>
              <i className="fa-brands fa-discord"></i> Join Discord
            </a>
          </div>
        </div>

        {/* Main Content */}
        <div className="shop-main">
          {activeCategory ? (
            <>
              <div style={{ marginBottom: '30px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', padding: '20px', borderRadius: '15px' }}>
                <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: '10px' }}>{activeCategory.name}</h2>
                <div dangerouslySetInnerHTML={{ __html: activeCategory.description || "Browse our packages below." }} style={{ color: '#ccc' }} />
              </div>
              
              <div className="packages-grid">
                {activeCategory.packages.map((pkg: any) => (
                  <div key={pkg.id} className="package-card" onClick={() => setSelectedPkg(pkg)}>
                    {pkg.image ? (
                      <div className="pkg-image-container">
                        <img src={pkg.image} alt={pkg.name} />
                      </div>
                    ) : (
                      <div className="pkg-image-container fallback">
                        <i className="fa-solid fa-box-open"></i>
                      </div>
                    )}
                    <div className="pkg-info">
                      <h3>{pkg.name}</h3>
                      <div className="price">{pkg.total_price} {pkg.currency}</div>
                      <button className="view-btn">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
              {activeCategory.packages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '50px', background: 'rgba(0,0,0,0.3)', borderRadius: '15px' }}>
                  <i className="fa-solid fa-box-open" style={{ fontSize: '3rem', color: '#555', marginBottom: '15px' }}></i>
                  <p style={{ color: '#aaa', fontSize: '1.2rem' }}>No packages in this category yet.</p>
                </div>
              )}
            </>
          ) : (
             <div style={{ textAlign: 'center', padding: '100px 0', color: 'gray' }}>No categories found.</div>
          )}
        </div>

      </div>

      {/* Package Detail Modal */}
      {selectedPkg && (
        <div className="pkg-modal-overlay" onClick={() => setSelectedPkg(null)}>
          <div className="pkg-modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedPkg(null)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            
            <div className="modal-layout">
              <div className="modal-left">
                {selectedPkg.image ? (
                  <img src={selectedPkg.image} alt={selectedPkg.name} />
                ) : (
                  <div className="modal-image-fallback">
                    <i className="fa-solid fa-box-open"></i>
                  </div>
                )}
              </div>
              <div className="modal-right">
                <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{selectedPkg.name}</h2>
                <div style={{ fontSize: '1.8rem', color: '#10b981', fontWeight: 'bold', marginBottom: '20px' }}>
                  {selectedPkg.total_price} {selectedPkg.currency}
                </div>
                
                <div className="modal-desc" dangerouslySetInnerHTML={{ __html: selectedPkg.description }} />
                
                <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <button 
                    onClick={() => handleBuy(selectedPkg.id)}
                    disabled={loadingPkg === selectedPkg.id}
                    className="modal-buy-btn"
                  >
                    {loadingPkg === selectedPkg.id ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-cart-shopping"></i>}
                    {loadingPkg === selectedPkg.id ? 'Preparing...' : `Purchase for ${selectedPkg.total_price} ${selectedPkg.currency}`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styles for Shop Layout */}
      <style dangerouslySetInnerHTML={{__html: `
        .shop-layout {
          display: flex;
          gap: 40px;
          align-items: flex-start;
        }
        
        .shop-sidebar {
          width: 300px;
          flex-shrink: 0;
        }
        
        .sidebar-box {
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        
        .cat-btn {
          width: 100%;
          text-align: left;
          background: rgba(255,255,255,0.02);
          border: 1px solid transparent;
          padding: 12px 15px;
          border-radius: 8px;
          color: #ddd;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .cat-btn:hover {
          background: rgba(255,255,255,0.08);
        }
        
        .cat-btn.active {
          background: linear-gradient(90deg, rgba(16,185,129,0.2), transparent);
          border-left: 3px solid #10b981;
          color: white;
          font-weight: bold;
        }
        
        .shop-main {
          flex-grow: 1;
          min-width: 0;
        }
        
        .packages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 25px;
        }
        
        .package-card {
          background: rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 15px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          flex-direction: column;
        }
        
        .package-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 30px rgba(16,185,129,0.2);
          border-color: rgba(16,185,129,0.5);
        }
        
        .pkg-image-container {
          width: 100%;
          height: 200px;
          background: rgba(255,255,255,0.02);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .pkg-image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .pkg-image-container.fallback {
          font-size: 4rem;
          color: rgba(255,255,255,0.1);
        }
        
        .pkg-info {
          padding: 20px;
          text-align: center;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        
        .pkg-info h3 {
          font-size: 1.4rem;
          margin-bottom: 10px;
          color: white;
        }
        
        .pkg-info .price {
          font-size: 1.2rem;
          color: #10b981;
          font-weight: bold;
          margin-bottom: 15px;
        }
        
        .view-btn {
          margin-top: auto;
          background: rgba(255,255,255,0.1);
          color: white;
          border: none;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .package-card:hover .view-btn {
          background: #10b981;
        }
        
        /* Modal Styles */
        .pkg-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.8);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          backdrop-filter: blur(5px);
        }
        
        .pkg-modal-content {
          background: #1a1a1a;
          border: 1px solid rgba(16,185,129,0.3);
          border-radius: 20px;
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 25px 50px rgba(0,0,0,0.5);
          animation: modalPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        @keyframes modalPop {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .close-modal {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 1.2rem;
          cursor: pointer;
          z-index: 10;
          transition: background 0.2s;
        }
        
        .close-modal:hover {
          background: #ef4444;
        }
        
        .modal-layout {
          display: flex;
          flex-direction: row;
        }
        
        .modal-left {
          width: 40%;
          background: rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
        }
        
        .modal-left img {
          max-width: 100%;
          border-radius: 10px;
        }
        
        .modal-image-fallback {
          font-size: 8rem;
          color: rgba(255,255,255,0.05);
        }
        
        .modal-right {
          width: 60%;
          padding: 40px;
          display: flex;
          flex-direction: column;
        }
        
        .modal-desc {
          color: #bbb;
          font-size: 1.05rem;
          line-height: 1.6;
          margin-bottom: 30px;
        }
        
        .modal-desc p {
          margin-bottom: 10px;
        }
        
        .modal-desc ul {
          margin-left: 20px;
          margin-bottom: 10px;
        }
        
        .modal-desc li {
          margin-bottom: 5px;
        }
        
        .modal-buy-btn {
          width: 100%;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 15px 25px;
          border-radius: 12px;
          font-size: 1.3rem;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          box-shadow: 0 4px 15px rgba(16,185,129,0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .modal-buy-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16,185,129,0.6);
        }
        
        .modal-buy-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        /* Mobile Responsiveness */
        @media (max-width: 900px) {
          .shop-layout {
            flex-direction: column;
          }
          .shop-sidebar {
            width: 100%;
          }
          .modal-layout {
            flex-direction: column;
          }
          .modal-left, .modal-right {
            width: 100%;
          }
          .modal-left {
            padding: 20px;
            height: 200px;
          }
          .modal-left img {
            max-height: 100%;
            width: auto;
          }
          .modal-right {
            padding: 20px;
          }
        }
      `}} />
    </div>
  );
}
