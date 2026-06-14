"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ShopClient({ initialCategories }: { initialCategories: any[] }) {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(initialCategories.length > 0 ? initialCategories[0].id : null);
  const [selectedPkg, setSelectedPkg] = useState<any | null>(null);
  const [loadingPkg, setLoadingPkg] = useState<number | null>(null);
  
  // Minecraft Username State
  const [mcUsername, setMcUsername] = useState<string>('');
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [tempUsername, setTempUsername] = useState<string>('');
  
  const router = useRouter();

  useEffect(() => {
    // Load saved username
    const saved = localStorage.getItem('mcUsername');
    if (saved) {
      setMcUsername(saved);
    } else {
      // Auto-show login modal if no username is set
      setShowLoginModal(true);
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('success')) {
      alert("Payment initiated or completed! Thank you for your support.");
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get('cancel')) {
      alert("Payment was cancelled.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleSaveUsername = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUsername.trim().length > 2) {
      setMcUsername(tempUsername.trim());
      localStorage.setItem('mcUsername', tempUsername.trim());
      setShowLoginModal(false);
    }
  };

  const handleBuy = async (pkgId: number) => {
    if (!mcUsername) {
      setShowLoginModal(true);
      return;
    }
    
    setLoadingPkg(pkgId);
    try {
      const res = await fetch('/api/tebex/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: pkgId, mcUsername: mcUsername })
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '100px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Top Banner Area like Cobblemon Islands */}
      <div className="shop-top-banner">
        <div className="server-info">
          <div className="ip-box">
             <i className="fa-solid fa-play" style={{ color: '#fbbf24', fontSize: '1.5rem' }}></i>
             <div>
               <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>play.pokefun.in</div>
               <div style={{ fontSize: '0.85rem', color: '#fbbf24' }}>Join our amazing server!</div>
             </div>
          </div>
          <div className="social-links">
             <a href="https://discord.gg/pokefun" target="_blank" className="social-btn discord"><i className="fa-brands fa-discord"></i></a>
             <a href="https://youtube.com/@Pokefunsmp" target="_blank" className="social-btn youtube"><i className="fa-brands fa-youtube"></i></a>
          </div>
        </div>
        
        {/* User Login/Cart Status */}
        <div className="user-status-box" onClick={() => setShowLoginModal(true)} style={{ cursor: 'pointer' }}>
           {mcUsername ? (
             <div className="user-logged-in">
               <img src={`https://mc-heads.net/avatar/${mcUsername}`} alt={mcUsername} />
               <div>
                 <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Guest's Bag</div>
                 <div style={{ fontWeight: 'bold', color: 'white' }}>{mcUsername}</div>
               </div>
             </div>
           ) : (
             <div className="user-logged-in">
               <img src="https://mc-heads.net/avatar/steve" alt="Guest" />
               <div>
                 <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Guest's Bag</div>
                 <div style={{ fontWeight: 'bold', color: '#fbbf24' }}>click-to-login</div>
               </div>
             </div>
           )}
        </div>
      </div>

      <div className="shop-layout">
        
        {/* Sidebar */}
        <div className="shop-sidebar">
          <div className="sidebar-box menu-box">
            <h3 className="sidebar-title">START SHOPPING</h3>
            <ul className="category-list">
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
          
          <div className="sidebar-box widget-box">
            <h3 className="sidebar-title">SUPPORT GOAL</h3>
            <div style={{ background: '#1a1a1a', padding: '15px', borderRadius: '8px', border: '1px solid #333', textAlign: 'center' }}>
              <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '10px' }}>Help us reach our monthly server goal!</p>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '45%' }}></div>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#fbbf24', marginTop: '5px', fontWeight: 'bold' }}>45% Completed</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="shop-main">
          {activeCategory ? (
            <div className="category-container">
              <div className="category-header">
                <h2><i className="fa-solid fa-list" style={{ color: '#fbbf24', marginRight: '10px' }}></i> {activeCategory.name}</h2>
                <div className="cat-desc" dangerouslySetInnerHTML={{ __html: activeCategory.description || "Select a package below to purchase." }} />
              </div>
              
              <div className="package-list">
                {activeCategory.packages.map((pkg: any) => (
                  <div key={pkg.id} className="package-list-item">
                    <div className="pkg-left" onClick={() => setSelectedPkg(pkg)}>
                      {pkg.image ? (
                        <img src={pkg.image} alt={pkg.name} className="pkg-image" />
                      ) : (
                        <div className="pkg-image-fallback"><i className="fa-solid fa-box-open"></i></div>
                      )}
                    </div>
                    
                    <div className="pkg-middle" onClick={() => setSelectedPkg(pkg)}>
                      <h3 className="pkg-name">{pkg.name}</h3>
                      <div className="pkg-price">{pkg.total_price} {pkg.currency}</div>
                    </div>
                    
                    <div className="pkg-right">
                      <button className="btn-info" onClick={() => setSelectedPkg(pkg)}>!</button>
                      <button 
                        className="btn-buy"
                        onClick={() => handleBuy(pkg.id)}
                        disabled={loadingPkg === pkg.id}
                      >
                        {loadingPkg === pkg.id ? <i className="fa-solid fa-spinner fa-spin"></i> : "+ Buy"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {activeCategory.packages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
                  No packages available in this category.
                </div>
              )}
            </div>
          ) : (
             <div style={{ textAlign: 'center', padding: '100px 0', color: 'gray' }}>No categories found.</div>
          )}
        </div>

      </div>

      {/* MC Username Login Modal */}
      {showLoginModal && (
        <div className="pkg-modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="mc-login-modal" onClick={e => e.stopPropagation()}>
            <div className="pkg-modal-header" style={{ justifyContent: 'center' }}>
              <h2 style={{ color: '#fbbf24' }}>ENTER MINECRAFT USERNAME</h2>
            </div>
            <div className="pkg-modal-body" style={{ textAlign: 'center', padding: '40px 30px' }}>
              <p style={{ color: '#ccc', marginBottom: '25px', fontSize: '1.1rem' }}>Please enter your Minecraft username to continue shopping.</p>
              <form onSubmit={handleSaveUsername}>
                <input 
                  type="text" 
                  value={tempUsername}
                  onChange={e => setTempUsername(e.target.value)}
                  placeholder="e.g. Notch"
                  className="mc-username-input"
                  autoFocus
                />
                <button type="submit" className="btn-mc-login">CONTINUE</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Package Detail Modal */}
      {selectedPkg && (
        <div className="pkg-modal-overlay" onClick={() => setSelectedPkg(null)}>
          <div className="pkg-modal-container" onClick={e => e.stopPropagation()}>
            <div className="pkg-modal-header">
              <h2>{selectedPkg.name}</h2>
              <button className="btn-close" onClick={() => setSelectedPkg(null)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            
            <div className="pkg-modal-body">
              <div className="modal-scroll-area">
                 {selectedPkg.image && (
                   <div style={{ textAlign: 'center', marginBottom: '20px', background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '10px' }}>
                     <img src={selectedPkg.image} alt={selectedPkg.name} style={{ maxHeight: '150px', objectFit: 'contain' }} />
                   </div>
                 )}
                 <div className="modal-description" dangerouslySetInnerHTML={{ __html: selectedPkg.description }} />
              </div>
            </div>
            
            <div className="pkg-modal-footer">
              <div className="modal-price">{selectedPkg.total_price} {selectedPkg.currency}</div>
              <div className="modal-actions">
                <button 
                  className="btn-add-cart"
                  onClick={() => handleBuy(selectedPkg.id)}
                  disabled={loadingPkg === selectedPkg.id}
                >
                  {loadingPkg === selectedPkg.id ? 'Loading...' : 'Add to cart'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styles for Shop Layout */}
      <style dangerouslySetInnerHTML={{__html: `
        .shop-top-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          gap: 20px;
          flex-wrap: wrap;
        }
        
        .server-info {
          display: flex;
          gap: 20px;
          align-items: center;
        }
        
        .ip-box {
          display: flex;
          align-items: center;
          gap: 15px;
          background: rgba(0,0,0,0.6);
          padding: 12px 25px;
          border-radius: 50px;
          border: 1px solid rgba(251, 191, 36, 0.3);
        }
        
        .social-links {
          display: flex;
          gap: 10px;
        }
        
        .social-btn {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          color: white;
          background: rgba(0,0,0,0.6);
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.2s;
        }
        
        .social-btn.discord:hover { background: #5865F2; border-color: #5865F2; }
        .social-btn.youtube:hover { background: #FF0000; border-color: #FF0000; }
        
        .user-status-box {
          background: rgba(0,0,0,0.6);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50px;
          padding: 8px 20px;
          transition: background 0.2s;
        }
        
        .user-status-box:hover {
          background: rgba(255,255,255,0.1);
        }
        
        .user-logged-in {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .user-logged-in img {
          width: 35px;
          height: 35px;
          border-radius: 4px; /* Minecraft heads are usually square */
        }
        
        .mc-login-modal {
          background: #1a1a1a;
          width: 100%;
          max-width: 450px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 30px rgba(0,0,0,0.8);
          animation: slideDown 0.3s ease;
          border: 1px solid #fbbf24;
        }
        
        .mc-username-input {
          width: 100%;
          padding: 15px;
          background: #000;
          border: 1px solid #333;
          color: white;
          font-size: 1.2rem;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
        }
        
        .mc-username-input:focus {
          outline: none;
          border-color: #fbbf24;
        }
        
        .btn-mc-login {
          width: 100%;
          background: #fbbf24;
          color: black;
          border: none;
          padding: 15px;
          font-size: 1.2rem;
          font-weight: bold;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .btn-mc-login:hover {
          background: #f59e0b;
        }
        
        .shop-layout {
          display: flex;
          gap: 25px;
          align-items: flex-start;
        }
        
        .shop-sidebar {
          width: 280px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .sidebar-title {
          font-size: 1rem;
          color: #fbbf24;
          text-align: center;
          margin-bottom: 15px;
          font-weight: 800;
          letter-spacing: 1px;
        }
        
        .sidebar-box {
          background: #222;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #333;
        }
        
        .menu-box {
          padding: 20px 10px;
        }
        
        .category-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
        }
        
        .cat-btn {
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          padding: 15px 20px;
          color: #ccc;
          font-size: 1.05rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
          border-left: 3px solid transparent;
        }
        
        .cat-btn:hover {
          background: rgba(255,255,255,0.05);
          color: white;
        }
        
        .cat-btn.active {
          background: rgba(251, 191, 36, 0.1);
          border-left: 3px solid #fbbf24;
          color: #fbbf24;
        }
        
        .progress-bar-bg {
          width: 100%;
          height: 12px;
          background: #333;
          border-radius: 10px;
          overflow: hidden;
        }
        
        .progress-bar-fill {
          height: 100%;
          background: #fbbf24;
          border-radius: 10px;
        }
        
        .shop-main {
          flex-grow: 1;
          min-width: 0;
        }
        
        .category-container {
          background: #222;
          border-radius: 12px;
          border: 1px solid #333;
          overflow: hidden;
        }
        
        .category-header {
          background: #1a1a1a;
          padding: 20px 25px;
          border-bottom: 1px solid #333;
        }
        
        .category-header h2 {
          color: white;
          font-size: 1.5rem;
          margin: 0 0 10px 0;
          display: flex;
          align-items: center;
        }
        
        .cat-desc {
          color: #aaa;
          font-size: 0.95rem;
          line-height: 1.5;
        }
        
        .package-list {
          display: flex;
          flex-direction: column;
        }
        
        .package-list-item {
          display: flex;
          align-items: center;
          padding: 20px 25px;
          border-bottom: 1px solid #333;
          transition: background 0.2s;
        }
        
        .package-list-item:last-child {
          border-bottom: none;
        }
        
        .package-list-item:hover {
          background: rgba(255,255,255,0.02);
        }
        
        .pkg-left {
          width: 80px;
          height: 80px;
          flex-shrink: 0;
          margin-right: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.2);
          border-radius: 50%;
          padding: 10px;
          cursor: pointer;
        }
        
        .pkg-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        
        .pkg-image-fallback {
          font-size: 2.5rem;
          color: #555;
        }
        
        .pkg-middle {
          flex-grow: 1;
          cursor: pointer;
        }
        
        .pkg-name {
          color: white;
          font-size: 1.2rem;
          margin: 0 0 5px 0;
        }
        
        .pkg-price {
          color: #aaa;
          font-size: 0.9rem;
        }
        
        .pkg-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .btn-info {
          width: 40px;
          height: 40px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.2rem;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .btn-info:hover { background: #2563eb; }
        
        .btn-buy {
          background: #10b981;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 0 20px;
          height: 40px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .btn-buy:hover:not(:disabled) { background: #059669; }
        .btn-buy:disabled { opacity: 0.6; cursor: not-allowed; }
        
        /* Modal Styles */
        .pkg-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.85);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .pkg-modal-container {
          background: #1a1a1a;
          width: 100%;
          max-width: 600px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          animation: slideDown 0.3s ease;
          border: 1px solid #333;
          max-height: 90vh;
        }
        
        @keyframes slideDown {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .pkg-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 25px;
          border-bottom: 1px solid #333;
          background: #222;
          border-radius: 8px 8px 0 0;
        }
        
        .pkg-modal-header h2 {
          margin: 0;
          color: white;
          font-size: 1.3rem;
        }
        
        .btn-close {
          background: transparent;
          border: none;
          color: #aaa;
          font-size: 1.5rem;
          cursor: pointer;
        }
        
        .btn-close:hover { color: white; }
        
        .pkg-modal-body {
          padding: 25px;
          overflow-y: auto;
          background: #1a1a1a;
        }
        
        .modal-description {
          color: #ddd;
          line-height: 1.6;
          font-size: 0.95rem;
        }
        
        .modal-description p { margin-bottom: 15px; }
        .modal-description ul { margin-left: 20px; margin-bottom: 15px; }
        .modal-description li { margin-bottom: 5px; }
        
        .pkg-modal-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 25px;
          background: #222;
          border-top: 1px solid #333;
          border-radius: 0 0 8px 8px;
        }
        
        .modal-price {
          font-size: 1.2rem;
          color: white;
          font-weight: bold;
        }
        
        .modal-actions {
          display: flex;
          gap: 15px;
        }
        
        .btn-add-cart {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .btn-add-cart:hover:not(:disabled) { background: #2563eb; }
        .btn-add-cart:disabled { opacity: 0.6; cursor: not-allowed; }
        
        @media (max-width: 900px) {
          .shop-layout {
            flex-direction: column;
          }
          .shop-sidebar {
            width: 100%;
          }
          .package-list-item {
            flex-wrap: wrap;
          }
          .pkg-right {
            width: 100%;
            margin-top: 15px;
            justify-content: flex-end;
          }
          .shop-top-banner {
            flex-direction: column;
            align-items: stretch;
          }
          .ip-box {
            justify-content: center;
          }
        }
      `}} />
    </div>
  );
}
