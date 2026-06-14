"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

export default function ShopClient({ initialCategories }: { initialCategories: any[] }) {
  const [categories, setCategories] = useState<any[]>(initialCategories);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(initialCategories.length > 0 ? initialCategories[0].id : null);
  const [selectedPkg, setSelectedPkg] = useState<any | null>(null);
  const [loadingPkg, setLoadingPkg] = useState<number | null>(null);
  
  // Currency State
  const [currency, setCurrency] = useState<string>('USD');
  const [isFetchingCurrency, setIsFetchingCurrency] = useState<boolean>(false);
  
  // Minecraft Username State
  const [mcUsername, setMcUsername] = useState<string>('');
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [tempUsername, setTempUsername] = useState<string>('');
  
  const router = useRouter();

  useEffect(() => {
    // Load saved username and currency
    const savedName = localStorage.getItem('mcUsername');
    if (savedName) setMcUsername(savedName);

    const savedCurrency = localStorage.getItem('shopCurrency');
    if (savedCurrency && savedCurrency !== 'USD') {
      setCurrency(savedCurrency);
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

  // Fetch new prices when currency changes
  useEffect(() => {
    const fetchCurrencyPrices = async () => {
      setIsFetchingCurrency(true);
      try {
        const res = await fetch(`/api/tebex/categories?currency=${currency}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.data) {
            setCategories(data.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch currency prices", err);
      }
      setIsFetchingCurrency(false);
    };

    // If it's not the initial render load (which is USD) or we have a saved currency
    fetchCurrencyPrices();
  }, [currency]);

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurr = e.target.value;
    setCurrency(newCurr);
    localStorage.setItem('shopCurrency', newCurr);
  };

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

  const activeCategory = categories.find(c => c.id === activeCategoryId) || categories[0];

  return (
    <div className="clean-shop-wrapper">
      
      {/* TOP NAV & STATUS */}
      <div className="shop-top-bar">
        <div className="shop-logo">
           <i className="fa-solid fa-store" style={{color: '#3b82f6', marginRight: '10px'}}></i>
           Pokefun Store
        </div>
        
        <div className="top-right-actions">
          
          <div className="currency-selector-wrapper">
            {isFetchingCurrency ? <i className="fa-solid fa-spinner fa-spin currency-spinner"></i> : <i className="fa-solid fa-earth-americas"></i>}
            <select className="currency-select" value={currency} onChange={handleCurrencyChange} disabled={isFetchingCurrency}>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
          
          <div className="user-status-box" onClick={() => setShowLoginModal(true)}>
             {mcUsername ? (
               <div className="user-logged-in">
                 <div className="user-text-info">
                   <div className="user-label">Logged in as</div>
                   <div className="user-name">{mcUsername}</div>
                 </div>
                 <div className="mc-avatar-container">
                   <img src={`https://mc-heads.net/avatar/${mcUsername}`} alt={mcUsername} className="mc-face" />
                 </div>
               </div>
             ) : (
               <div className="user-logged-in">
                 <div className="user-text-info">
                   <div className="user-label">Guest</div>
                   <div className="user-name highlight-text">Click to login</div>
                 </div>
                 <div className="mc-avatar-container">
                   <img src="https://mc-heads.net/avatar/steve" alt="Guest" className="mc-face" />
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="shop-layout">
        
        {/* Sidebar */}
        <div className="shop-sidebar">
          <div className="sidebar-box menu-box">
            <h3 className="sidebar-title">CATEGORIES</h3>
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
        </div>

        {/* Main Content */}
        <div className="shop-main">
          {activeCategory ? (
            <div className="category-container">
              <div className="category-header">
                <h2>{activeCategory.name}</h2>
                {activeCategory.description && (
                  <div className="cat-desc" dangerouslySetInnerHTML={{ __html: activeCategory.description }} />
                )}
              </div>
              
              <div className="package-grid">
                {activeCategory.packages.map((pkg: any) => (
                  <div key={pkg.id} className="package-card">
                    <div className="pkg-image-wrapper" onClick={() => setSelectedPkg(pkg)}>
                      {pkg.image ? (
                        <img src={pkg.image} alt={pkg.name} className="pkg-image" />
                      ) : (
                        <i className="fa-solid fa-box-open placeholder-icon"></i>
                      )}
                    </div>
                    
                    <div className="pkg-details">
                      <h3 className="pkg-name" onClick={() => setSelectedPkg(pkg)}>{pkg.name}</h3>
                      <div className="pkg-price">{pkg.total_price} {pkg.currency}</div>
                    </div>
                    
                    <div className="pkg-actions">
                      <button 
                        className="btn-buy"
                        onClick={() => handleBuy(pkg.id)}
                        disabled={loadingPkg === pkg.id}
                      >
                        {loadingPkg === pkg.id ? <i className="fa-solid fa-spinner fa-spin"></i> : "Buy Now"}
                      </button>
                      <button className="btn-info" onClick={() => setSelectedPkg(pkg)}>
                        <i className="fa-solid fa-circle-info"></i>
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
             <div className="empty-category">No categories found.</div>
          )}
        </div>

      </div>

      {/* MC Username Login Modal */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="clean-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Minecraft Account</h2>
              <button className="btn-close" onClick={() => setShowLoginModal(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="mc-steve-icon">
                <img src="https://mc-heads.net/avatar/steve/100" alt="Minecraft" />
              </div>
              <p>Please enter your exact Minecraft username to receive your items in-game.</p>
              <form onSubmit={handleSaveUsername} className="mc-form">
                <input 
                  type="text" 
                  value={tempUsername}
                  onChange={e => setTempUsername(e.target.value)}
                  placeholder="Your Username"
                  className="clean-input"
                  autoFocus
                />
                <button type="submit" className="btn-submit">Continue</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Package Detail Modal */}
      {selectedPkg && (
        <div className="modal-overlay" onClick={() => setSelectedPkg(null)}>
          <div className="clean-modal pkg-detail" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedPkg.name}</h2>
              <button className="btn-close" onClick={() => setSelectedPkg(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body" style={{textAlign: 'left'}}>
               {selectedPkg.image && (
                 <div className="modal-image-center">
                   <img src={selectedPkg.image} alt={selectedPkg.name} />
                 </div>
               )}
               <div className="modal-price-large">{selectedPkg.total_price} {selectedPkg.currency}</div>
               
               <div className="modal-desc html-desc">
                 <ReactMarkdown>{selectedPkg.description}</ReactMarkdown>
               </div>
               
               <button 
                  className="btn-submit"
                  style={{width: '100%', marginTop: '20px', padding: '15px', fontSize: '1.1rem'}}
                  onClick={() => handleBuy(selectedPkg.id)}
                  disabled={loadingPkg === selectedPkg.id}
                >
                  {loadingPkg === selectedPkg.id ? "Processing..." : "Add to Basket"}
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Clean Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .clean-shop-wrapper {
          position: relative;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px 0;
          font-family: inherit;
        }
        
        .shop-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 15px 25px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          margin-bottom: 25px;
          border: 1px solid #eaeaea;
        }
        
        .shop-logo {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1f2937;
        }
        
        .top-right-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .currency-selector-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 6px 12px;
          border-radius: 8px;
          color: #4b5563;
        }
        
        .currency-select {
          background: transparent;
          border: none;
          font-weight: bold;
          color: #1f2937;
          font-size: 0.95rem;
          outline: none;
          cursor: pointer;
        }
        
        .currency-spinner {
          color: #3b82f6;
        }
        
        .user-status-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 6px 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .user-status-box:hover {
          border-color: #cbd5e1;
          background: #f1f5f9;
        }
        
        .user-logged-in { display: flex; align-items: center; gap: 12px; }
        .user-text-info { text-align: right; }
        .user-label { font-size: 0.75rem; color: #64748b; font-weight: 600; text-transform: uppercase; }
        .user-name { font-weight: bold; color: #0f172a; font-size: 0.95rem; }
        .highlight-text { color: #3b82f6; }
        
        .mc-avatar-container { width: 35px; height: 35px; border-radius: 6px; overflow: hidden; }
        .mc-face { width: 100%; height: 100%; object-fit: cover; }

        .shop-layout { display: flex; gap: 30px; align-items: flex-start; }
        
        .shop-sidebar { width: 250px; flex-shrink: 0; }
        
        .sidebar-box {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          border: 1px solid #eaeaea;
        }
        
        .sidebar-title { font-size: 1rem; color: #9ca3af; margin-bottom: 15px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
        
        .category-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 5px; margin: 0;}
        
        .cat-btn {
          width: 100%; text-align: left; background: transparent; border: none;
          padding: 15px 15px; color: #4b5563; font-size: 1.1rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s ease; border-radius: 8px;
        }
        .cat-btn:hover { background: #f3f4f6; color: #1f2937; }
        .cat-btn.active { background: #eff6ff; color: #2563eb; font-weight: bold; }

        .shop-main { flex-grow: 1; min-width: 0; }
        
        .category-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          border: 1px solid #eaeaea;
          overflow: hidden;
        }
        
        .category-header {
          padding: 30px;
          border-bottom: 1px solid #f3f4f6;
          text-align: center;
          background: #f8fafc;
        }
        .category-header h2 { color: #0f172a; font-size: 2.2rem; margin: 0 0 10px 0; font-weight: 800; }
        .cat-desc { color: #64748b; font-size: 1.15rem; line-height: 1.6; max-width: 800px; margin: 0 auto;}
        .cat-desc img { max-width: 100%; border-radius: 8px; margin-top: 15px; }
        
        /* Grid Layout for Packages */
        .package-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
          padding: 30px;
        }
        
        .package-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
        }
        .package-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1);
          border-color: #cbd5e1;
        }
        
        .pkg-image-wrapper {
          height: 160px;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          cursor: pointer;
          border-bottom: 1px solid #f1f5f9;
        }
        .pkg-image { max-width: 100%; max-height: 100%; object-fit: contain; transition: transform 0.3s; }
        .package-card:hover .pkg-image { transform: scale(1.05); }
        .placeholder-icon { font-size: 4rem; color: #cbd5e1; }
        
        .pkg-details { padding: 20px; text-align: center; flex-grow: 1; cursor: pointer; }
        .pkg-name { color: #1e293b; font-size: 1.25rem; margin: 0 0 10px 0; font-weight: bold; }
        .pkg-price { color: #10b981; font-size: 1.4rem; font-weight: 800; }
        
        .pkg-actions {
          padding: 15px 20px;
          display: flex;
          gap: 10px;
          background: #f8fafc;
          border-top: 1px solid #f1f5f9;
        }
        
        .btn-buy {
          flex-grow: 1;
          background: #10b981; color: white; border: none; border-radius: 6px;
          padding: 12px; font-weight: bold; font-size: 1.1rem; cursor: pointer; transition: all 0.2s;
        }
        .btn-buy:hover:not(:disabled) { background: #059669; }
        .btn-buy:disabled { opacity: 0.6; cursor: not-allowed; }
        
        .btn-info {
          width: 42px; background: white; color: #64748b; border: 1px solid #cbd5e1;
          border-radius: 6px; cursor: pointer; transition: all 0.2s;
        }
        .btn-info:hover { color: #3b82f6; border-color: #3b82f6; background: #eff6ff; }
        
        .empty-category { text-align: center; padding: 60px 20px; color: #9ca3af; }
        .empty-icon { font-size: 3rem; margin-bottom: 15px; color: #cbd5e1;}

        /* Modals */
        .modal-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);
          z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        
        .clean-modal {
          background: white; width: 100%; max-width: 450px; border-radius: 16px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.2); overflow: hidden;
          animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .clean-modal.pkg-detail { max-width: 600px; }
        
        @keyframes popIn { 0% { transform: scale(0.95) translateY(10px); opacity: 0; } 100% { transform: scale(1) translateY(0); opacity: 1; } }
        
        .modal-header {
          padding: 20px 25px; border-bottom: 1px solid #f1f5f9;
          display: flex; justify-content: space-between; align-items: center;
          background: #f8fafc;
        }
        .modal-header h2 { margin: 0; font-size: 1.4rem; color: #0f172a; font-weight: bold; }
        
        .btn-close {
          background: transparent; border: none; color: #94a3b8; font-size: 1.8rem;
          cursor: pointer; transition: color 0.2s; padding: 0;
        }
        .btn-close:hover { color: #ef4444; }
        
        .modal-body { padding: 30px; text-align: center; }
        
        .mc-steve-icon { width: 80px; height: 80px; margin: 0 auto 20px; border-radius: 12px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .mc-steve-icon img { width: 100%; height: 100%; object-fit: cover; }
        .modal-body p { color: #64748b; margin-bottom: 25px; font-size: 1.1rem; line-height: 1.5;}
        
        .clean-input {
          width: 100%; padding: 15px; border: 2px solid #e2e8f0; border-radius: 8px;
          font-size: 1.2rem; color: #0f172a; margin-bottom: 20px; font-weight: bold;
          text-align: center; transition: border-color 0.2s;
        }
        .clean-input:focus { outline: none; border-color: #3b82f6; }
        
        .btn-submit {
          width: 100%; background: #3b82f6; color: white; border: none;
          padding: 15px; border-radius: 8px; font-weight: bold; font-size: 1.1rem;
          cursor: pointer; transition: background 0.2s;
        }
        .btn-submit:hover:not(:disabled) { background: #2563eb; }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed;}
        
        .modal-image-center { height: 150px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; background: #f8fafc; border-radius: 12px;}
        .modal-image-center img { max-height: 90%; max-width: 90%; object-fit: contain; }
        
        .modal-price-large { font-size: 2rem; font-weight: 900; color: #10b981; text-align: center; margin-bottom: 20px; }
        
        .html-desc { color: #475569; font-size: 1.1rem; line-height: 1.6; max-height: 350px; overflow-y: auto; padding-right: 10px; text-align: left;}
        .html-desc p { margin-bottom: 15px; }
        .html-desc ul { margin-left: 20px; margin-bottom: 15px; }

        @media (max-width: 800px) {
          .shop-layout { flex-direction: column; }
          .shop-sidebar { width: 100%; }
        }
      `}} />
    </div>
  );
}
