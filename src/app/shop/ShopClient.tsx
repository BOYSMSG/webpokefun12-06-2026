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
    <div className="premium-shop-wrapper">
      
      {/* Animated Background Gradients */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      <div className="shop-content-container">
        
        {/* TOP RIGHT NAV (Giftcard, Currency, Login) */}
        <div className="shop-top-right-nav slide-down">
          <button className="top-nav-btn glass-panel" onClick={() => alert("Giftcards coming soon!")}>
            <i className="fa-solid fa-gift"></i> check giftcard
          </button>
          <button className="top-nav-btn glass-panel">
            <i className="fa-solid fa-dollar-sign"></i> USD
          </button>
          
          <div className="user-status-box glass-panel" onClick={() => setShowLoginModal(true)}>
             {mcUsername ? (
               <div className="user-logged-in">
                 <div className="user-text-info">
                   <div className="user-label">Guest's Bag</div>
                   <div className="user-name">{mcUsername}</div>
                 </div>
                 <div className="mc-avatar-container">
                   <img src={`https://mc-heads.net/avatar/${mcUsername}`} alt={mcUsername} className="mc-face" />
                 </div>
               </div>
             ) : (
               <div className="user-logged-in">
                 <div className="user-text-info">
                   <div className="user-label" style={{color: 'white'}}>Guest's Bag</div>
                   <div className="user-name highlight-text">click to login</div>
                 </div>
                 <div className="mc-avatar-container">
                   <img src="https://mc-heads.net/avatar/steve" alt="Guest" className="mc-face" />
                 </div>
               </div>
             )}
          </div>
        </div>

        {/* LOGO AND IP AREA */}
        <div className="shop-header-area fade-in-up">
           <div className="shop-logo-container">
             {/* Text Logo as fallback if image isn't available */}
             <h1 className="shop-main-logo">
               <span className="logo-poke">POKE</span>
               <span className="logo-fun">FUN</span>
               <div className="logo-sub">OFFICIAL STORE</div>
             </h1>
           </div>

           <div className="shop-server-info">
              <div className="ip-box glass-panel">
                 <i className="fa-solid fa-play" style={{ color: '#fbbf24', fontSize: '1.8rem' }}></i>
                 <div>
                   <div className="ip-text">play.pokefun.in</div>
                   <div className="ip-sub"><span style={{color: '#fbbf24', fontWeight: 'bold'}}>345</span> players online</div>
                 </div>
              </div>
              <div className="social-links">
                 <a href="#" className="social-btn twitter"><i className="fa-brands fa-twitter"></i></a>
                 <a href="https://discord.gg/pokefun" target="_blank" className="social-btn discord"><i className="fa-brands fa-discord"></i></a>
              </div>
           </div>
        </div>

        {/* ANNOUNCEMENT BANNER */}
        <div className="announcement-banner glass-panel fade-in-up">
           <div className="banner-icon">
             <i className="fa-solid fa-hourglass-half"></i>
           </div>
           <div className="banner-text">
             <div className="banner-top">Only 16d 17h left before the Summer Sale is gone for good!</div>
             <div className="banner-main">The Pokefun Summer Crate is now available for a limited time!</div>
           </div>
        </div>

        <div className="shop-layout">
          
          {/* Sidebar */}
          <div className="shop-sidebar fade-in-left">
            <div className="sidebar-box glass-panel menu-box">
              <h3 className="sidebar-title">START SHOPPING</h3>
              <ul className="category-list">
                {/* Home link placeholder */}
                <li>
                  <button className="cat-btn" onClick={() => router.push('/')}>
                    <i className="fa-solid fa-earth-americas" style={{marginRight: '10px', color: '#3b82f6'}}></i> Home
                  </button>
                </li>
                {initialCategories.map(category => (
                  <li key={category.id}>
                    <button 
                      onClick={() => setActiveCategoryId(category.id)}
                      className={activeCategoryId === category.id ? 'cat-btn active' : 'cat-btn'}
                    >
                      {category.name}
                      {activeCategoryId === category.id && <span className="active-dot"></span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="sidebar-box glass-panel widget-box">
              <h3 className="sidebar-title">COMMUNITY GOAL</h3>
              <div className="goal-container">
                <p className="goal-text">When the Community Goal is reached, all online players will receive rewards!</p>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill shine-anim" style={{ width: '45%' }}></div>
                </div>
                <div className="goal-percentage">45% completed</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="shop-main fade-in-up">
            {activeCategory ? (
              <div className="category-container glass-panel">
                <div className="category-header">
                  <h2>WELCOME TO THE OFFICIAL STORE OF</h2>
                  <h1 style={{color: '#fbbf24', fontSize: '2rem', margin: '5px 0 15px 0'}}>Pokefun Network</h1>
                  <div className="cat-desc" style={{textAlign: 'center', marginBottom: '20px'}}>
                     Every purchase supports the server and helps us grow with future content updates!
                  </div>
                  
                  {/* Category Description Banner */}
                  {activeCategory.description && (
                     <div className="category-banner-image" dangerouslySetInnerHTML={{ __html: activeCategory.description }} />
                  )}
                </div>
                
                <div className="package-list">
                  <div className="package-list-header">
                     <i className="fa-solid fa-list" style={{marginRight: '10px', color: '#fbbf24'}}></i> {activeCategory.name}
                  </div>
                  {activeCategory.packages.map((pkg: any, index: number) => (
                    <div 
                      key={pkg.id} 
                      className="package-list-item" 
                      style={{ animationDelay: \`\${index * 0.1}s\` }}
                    >
                      <div className="pkg-left" onClick={() => setSelectedPkg(pkg)}>
                        {pkg.image ? (
                          <img src={pkg.image} alt={pkg.name} className="pkg-image" />
                        ) : (
                          <div className="pkg-image-fallback"><i className="fa-solid fa-box-open"></i></div>
                        )}
                        <div className="image-glow"></div>
                      </div>
                      
                      <div className="pkg-middle" onClick={() => setSelectedPkg(pkg)}>
                        <h3 className="pkg-name">{pkg.name}</h3>
                        <div className="pkg-price">
                          <span className="price-amount">{pkg.total_price}</span> 
                          <span className="currency-code">{pkg.currency}</span>
                        </div>
                      </div>
                      
                      <div className="pkg-right">
                        <button className="btn-info" onClick={() => setSelectedPkg(pkg)}>!</button>
                        <button 
                          className="btn-buy premium-btn"
                          onClick={() => handleBuy(pkg.id)}
                          disabled={loadingPkg === pkg.id}
                        >
                          <div className="btn-content">
                            {loadingPkg === pkg.id ? <i className="fa-solid fa-spinner fa-spin"></i> : "+ Buy"}
                          </div>
                          <div className="btn-shine"></div>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {activeCategory.packages.length === 0 && (
                  <div className="empty-category">
                    <i className="fa-solid fa-box-open empty-icon"></i>
                    <p>No packages available in this category.</p>
                  </div>
                )}
              </div>
            ) : (
               <div className="empty-category glass-panel">No categories found.</div>
            )}
          </div>

        </div>

        {/* MC Username Login Modal */}
        {showLoginModal && (
          <div className="pkg-modal-overlay glass-overlay" onClick={() => setShowLoginModal(false)}>
            <div className="mc-login-modal glass-panel modal-pop" onClick={e => e.stopPropagation()}>
              <div className="modal-header-premium">
                <h2>Minecraft Account</h2>
              </div>
              <div className="modal-body-premium">
                <div className="mc-steve-icon">
                  <img src="https://mc-heads.net/avatar/steve/100" alt="Minecraft" />
                </div>
                <p>Please enter your exact Minecraft username to receive your items in-game.</p>
                <form onSubmit={handleSaveUsername} className="mc-form">
                  <div className="input-wrapper">
                    <i className="fa-solid fa-gamepad input-icon"></i>
                    <input 
                      type="text" 
                      value={tempUsername}
                      onChange={e => setTempUsername(e.target.value)}
                      placeholder="Username"
                      className="premium-input"
                      autoFocus
                    />
                  </div>
                  <button type="submit" className="premium-btn btn-submit-mc">
                    <div className="btn-content">CONTINUE <i className="fa-solid fa-arrow-right"></i></div>
                    <div className="btn-shine"></div>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Package Detail Modal */}
        {selectedPkg && (
          <div className="pkg-modal-overlay glass-overlay" onClick={() => setSelectedPkg(null)}>
            <div className="pkg-detail-modal glass-panel modal-pop" onClick={e => e.stopPropagation()}>
              <button className="btn-close-premium" onClick={() => setSelectedPkg(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
              
              <div className="pkg-modal-split">
                <div className="pkg-modal-left">
                   <div className="modal-image-wrapper">
                     {selectedPkg.image ? (
                       <img src={selectedPkg.image} alt={selectedPkg.name} className="modal-pkg-img" />
                     ) : (
                       <i className="fa-solid fa-box-open fallback-big"></i>
                     )}
                     <div className="modal-image-glow"></div>
                   </div>
                   <div className="modal-price-tag">
                      {selectedPkg.total_price} {selectedPkg.currency}
                   </div>
                </div>
                
                <div className="pkg-modal-right">
                  <h2 className="modal-title-premium">{selectedPkg.name}</h2>
                  
                  <div className="modal-scroll-desc custom-scrollbar">
                    <div className="html-desc" dangerouslySetInnerHTML={{ __html: selectedPkg.description }} />
                  </div>
                  
                  <div className="modal-checkout-area">
                    <button 
                      className="premium-btn btn-checkout"
                      onClick={() => handleBuy(selectedPkg.id)}
                      disabled={loadingPkg === selectedPkg.id}
                    >
                      <div className="btn-content">
                        {loadingPkg === selectedPkg.id ? (
                          <><i className="fa-solid fa-spinner fa-spin"></i> Processing...</>
                        ) : (
                          "Add to cart"
                        )}
                      </div>
                      <div className="btn-shine"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Ultra-Premium CSS Styles matching Cobblemon Islands Layout */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Base Variables & Wrappers */
        .premium-shop-wrapper {
          position: relative;
          min-height: 100vh;
          overflow-x: hidden;
          background: #111; /* Very dark background */
        }
        
        .shop-content-container {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 20px 20px 100px 20px;
          max-width: 1100px;
          margin: 0 auto;
        }
        
        /* Animated Background Elements */
        .bg-glow {
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.1;
          z-index: 0;
          animation: floatGlow 20s infinite alternate;
        }
        .bg-glow-1 { top: -10%; left: -5%; width: 600px; height: 600px; background: #fbbf24; }
        .bg-glow-2 { bottom: 10%; right: -10%; width: 800px; height: 800px; background: #fbbf24; animation-delay: -10s; }
        @keyframes floatGlow { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(50px, 50px) scale(1.1); } }

        /* Glassmorphism Panels */
        .glass-panel {
          background: #1a1a1a;
          border: 1px solid rgba(251, 191, 36, 0.2);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
        }
        
        /* Top Right Nav */
        .shop-top-right-nav {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .top-nav-btn {
          background: #111;
          border: 1px solid #333;
          color: white;
          padding: 10px 20px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }
        .top-nav-btn:hover { background: #222; border-color: #fbbf24; }
        
        .user-status-box {
          background: #111;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 8px 15px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .user-status-box:hover { border-color: #fbbf24; background: #222; }
        
        .user-logged-in { display: flex; align-items: center; gap: 15px; }
        .user-text-info { text-align: right; }
        .user-label { font-size: 0.8rem; font-weight: bold; }
        .user-name { font-weight: 800; color: white; font-size: 1rem; }
        .highlight-text { color: #fbbf24; }
        
        .mc-avatar-container { width: 35px; height: 35px; border-radius: 4px; overflow: hidden; }
        .mc-face { width: 100%; height: 100%; object-fit: cover; }

        /* Header Area (Logo + IP) */
        .shop-header-area {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 30px;
        }
        
        .shop-logo-container { flex-grow: 1; }
        .shop-main-logo {
          font-size: 3.5rem; font-weight: 900; margin: 0; line-height: 1; font-style: italic;
          text-shadow: 2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 5px 15px rgba(0,0,0,0.5);
        }
        .logo-poke { color: white; }
        .logo-fun { color: #fbbf24; }
        .logo-sub { font-size: 1rem; color: #fbbf24; letter-spacing: 4px; text-transform: uppercase; font-style: normal; margin-top: 5px; text-shadow: none;}
        
        .shop-server-info { display: flex; align-items: center; gap: 25px; }
        
        .ip-box {
          display: flex; align-items: center; gap: 15px; padding: 10px 20px; border-radius: 12px;
          background: transparent; border: none;
        }
        .ip-text { font-weight: 900; font-size: 1.3rem; color: white; letter-spacing: 0.5px; }
        .ip-sub { font-size: 0.9rem; color: #ccc; }
        
        .social-links { display: flex; gap: 15px; flex-direction: column; }
        
        .social-btn {
          width: 45px; height: 45px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
          font-size: 1.5rem; color: #fbbf24; background: #1a1a1a; transition: all 0.2s;
        }
        .social-btn:hover { background: #fbbf24; color: black; transform: scale(1.1) rotate(5deg); }

        /* Announcement Banner */
        .announcement-banner {
          display: flex; align-items: center; gap: 20px; padding: 15px 25px;
          border-radius: 8px; border: 2px solid #fbbf24; background: #111;
          margin-bottom: 20px; box-shadow: 0 0 20px rgba(251,191,36,0.1);
        }
        .banner-icon { font-size: 2rem; color: #fbbf24; }
        .banner-top { font-size: 0.9rem; font-weight: bold; color: #fbbf24; margin-bottom: 5px; }
        .banner-main { font-size: 1.1rem; color: white; font-weight: bold; }

        /* Shop Layout */
        .shop-layout { display: flex; gap: 25px; align-items: flex-start; }
        
        .shop-sidebar { width: 250px; flex-shrink: 0; display: flex; flex-direction: column; gap: 20px; }
        
        .sidebar-title { font-size: 1rem; color: #fbbf24; text-align: center; margin-bottom: 15px; font-weight: 800; letter-spacing: 1px; }
        .sidebar-box { border-radius: 8px; padding: 20px; border: 1px solid #fbbf24; background: #111; }
        
        .category-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 5px; }
        
        .cat-btn {
          width: 100%; text-align: left; background: transparent; border: none;
          padding: 12px 15px; color: white; font-size: 1.1rem; font-weight: bold;
          cursor: pointer; transition: all 0.2s ease; border-radius: 6px;
        }
        .cat-btn:hover { background: #222; }
        .cat-btn.active { background: #222; border-left: 4px solid #fbbf24; }
        
        .goal-container { text-align: center; }
        .goal-text { font-size: 0.85rem; color: #ccc; margin-bottom: 15px; line-height: 1.4; font-weight: bold; }
        .progress-bar-bg { width: 100%; height: 20px; background: #222; border: 1px solid #fbbf24; overflow: hidden; }
        .progress-bar-fill { height: 100%; background: #fbbf24; }
        .goal-percentage { font-size: 0.85rem; color: white; margin-top: 10px; font-weight: bold; }

        /* Main Content List */
        .shop-main { flex-grow: 1; min-width: 0; }
        
        .category-container { border-radius: 8px; overflow: hidden; background: #111; border: 1px solid #333; }
        
        .category-header { padding: 30px; text-align: center; border-bottom: 1px solid #222; }
        .category-header h2 { color: white; font-size: 1rem; letter-spacing: 2px; margin: 0; font-weight: bold;}
        .category-banner-image img { max-width: 100%; border-radius: 8px; margin-top: 20px; }
        
        .package-list { display: flex; flex-direction: column; }
        .package-list-header { background: #fbbf24; color: black; font-weight: 900; padding: 12px 20px; font-size: 1.2rem; }
        
        .package-list-item {
          display: flex; align-items: center; padding: 20px; border-bottom: 1px solid #222;
          background: #1a1a1a; transition: all 0.2s;
        }
        .package-list-item:hover { background: #222; }
        
        .pkg-left {
          width: 70px; height: 70px; flex-shrink: 0; margin-right: 20px;
          display: flex; align-items: center; justify-content: center;
          background: #111; border-radius: 50%; padding: 10px; border: 1px solid #333; cursor: pointer;
        }
        .pkg-image { max-width: 90%; max-height: 90%; object-fit: contain; transition: transform 0.2s; }
        .package-list-item:hover .pkg-image { transform: scale(1.1); }
        .pkg-image-fallback { font-size: 2.5rem; color: #444; }
        
        .pkg-middle { flex-grow: 1; cursor: pointer; }
        .pkg-name { color: white; font-size: 1.2rem; margin: 0 0 5px 0; font-weight: bold; }
        .pkg-price { color: #aaa; font-size: 0.9rem; font-weight: bold; }
        .price-amount { color: white; font-size: 1rem; }
        
        .pkg-right { display: flex; align-items: center; gap: 10px; }
        
        .btn-info {
          width: 40px; height: 40px; background: #3b82f6; color: white; border: none; border-radius: 6px;
          font-size: 1.2rem; font-weight: bold; cursor: pointer; transition: all 0.2s;
        }
        .btn-info:hover { background: #2563eb; }
        
        .btn-buy {
          background: #10b981; color: white; border: none; border-radius: 6px; padding: 0 20px;
          height: 40px; font-size: 1rem; font-weight: bold; cursor: pointer; transition: all 0.2s;
        }
        .btn-buy:hover:not(:disabled) { background: #059669; }
        .btn-buy:disabled { opacity: 0.6; cursor: not-allowed; }
        
        .premium-btn { position: relative; overflow: hidden; }
        .btn-content { position: relative; z-index: 2; }
        .btn-shine {
          position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent);
          transform: skewX(-20deg); z-index: 1;
        }
        .premium-btn:hover .btn-shine { animation: shine 0.6s ease; }
        @keyframes shine { 100% { left: 200%; } }

        /* Modals */
        .glass-overlay { background: rgba(0,0,0,0.85); backdrop-filter: blur(5px); }
        .modal-pop { animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes popIn { 0% { transform: scale(0.9) translateY(20px); opacity: 0; } 100% { transform: scale(1) translateY(0); opacity: 1; } }

        /* MC Login Modal */
        .mc-login-modal { max-width: 400px; padding: 0; overflow: hidden; background: #111; border: 1px solid #fbbf24; }
        .modal-header-premium { padding: 20px; background: #fbbf24; text-align: center; }
        .modal-header-premium h2 { color: black; font-size: 1.2rem; font-weight: 900; margin: 0; }
        .modal-body-premium { padding: 30px; text-align: center; }
        .mc-steve-icon { width: 80px; height: 80px; margin: 0 auto 20px; border-radius: 8px; overflow: hidden; }
        .mc-steve-icon img { width: 100%; height: 100%; object-fit: cover; }
        .modal-body-premium p { color: #ccc; font-size: 0.95rem; margin-bottom: 25px; font-weight: bold; }
        
        .input-wrapper { position: relative; margin-bottom: 20px; }
        .input-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #666; }
        .premium-input {
          width: 100%; padding: 15px 15px 15px 45px; background: #222; border: 2px solid #333;
          color: white; font-size: 1.1rem; font-weight: bold; border-radius: 8px;
        }
        .premium-input:focus { outline: none; border-color: #fbbf24; }
        
        .btn-submit-mc {
          width: 100%; background: #3b82f6; color: white; padding: 15px; font-size: 1.1rem; font-weight: bold; border-radius: 8px; border: none; cursor: pointer;
        }

        /* Package Detail Modal */
        .pkg-detail-modal { max-width: 600px; position: relative; padding: 0; background: #111; border: 1px solid #333; }
        .btn-close-premium {
          position: absolute; top: 15px; right: 15px; width: 35px; height: 35px; border-radius: 50%;
          background: rgba(255,255,255,0.1); border: none; color: white; cursor: pointer; z-index: 10;
        }
        
        .pkg-modal-split { display: flex; flex-direction: column; }
        .pkg-modal-left {
          background: #fbbf24; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;
        }
        .modal-image-wrapper { height: 120px; display: flex; align-items: center; justify-content: center; }
        .modal-pkg-img { max-height: 100%; max-width: 100%; object-fit: contain; }
        .fallback-big { font-size: 4rem; color: rgba(0,0,0,0.5); }
        .modal-price-tag { display: none; }
        
        .pkg-modal-right { padding: 30px; display: flex; flex-direction: column; }
        .modal-title-premium { color: white; font-size: 1.8rem; font-weight: 900; margin: 0 0 20px 0; text-align: center; }
        
        .modal-scroll-desc { flex-grow: 1; overflow-y: auto; max-height: 40vh; margin-bottom: 25px; background: #1a1a1a; padding: 20px; border-radius: 8px; }
        .html-desc { color: #ccc; font-size: 0.95rem; line-height: 1.6; }
        
        .modal-checkout-area { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #333; padding-top: 20px; }
        .btn-checkout {
          background: #3b82f6; color: white; border: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 1.1rem; cursor: pointer;
        }

        /* Animation Classes */
        .fade-in-left { animation: fadeInLeft 0.5s ease backwards; }
        .fade-in-up { animation: fadeUp 0.5s ease backwards; animation-delay: 0.1s; }
        .slide-down { animation: slideDown 0.5s ease backwards; }
        @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 900px) {
          .shop-layout { flex-direction: column; }
          .shop-sidebar { width: 100%; }
          .package-list-item { flex-wrap: wrap; }
          .pkg-right { width: 100%; margin-top: 15px; justify-content: flex-end; }
        }
      `}} />
    </div>
  );
}
