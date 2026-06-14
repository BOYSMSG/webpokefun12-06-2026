"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

export default function ShopClient({ initialCategories }: { initialCategories: any[] }) {
  const [categories, setCategories] = useState<any[]>(initialCategories);
  const [activeCategoryId, setActiveCategoryId] = useState<number | string>('home');
  const [selectedPkg, setSelectedPkg] = useState<any | null>(null);
  const [loadingPkg, setLoadingPkg] = useState<number | null>(null);
  
  // Currency State
  const [currency, setCurrency] = useState<string>('USD');
  const [isFetchingCurrency, setIsFetchingCurrency] = useState<boolean>(false);
  const [giftcardNumber, setGiftcardNumber] = useState('');
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [topCustomer, setTopCustomer] = useState<any>(null);
  
  // Minecraft Username State
  const [mcUsername, setMcUsername] = useState<string>('');
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [tempUsername, setTempUsername] = useState<string>('');
  
  const router = useRouter();

  useEffect(() => {
    // Load saved username and currency
    const savedName = localStorage.getItem('mcUsername');
    if (savedName) setMcUsername(savedName);

    const savedCurrency = localStorage.getItem('pokefun_shop_currency');
    if (savedCurrency) {
      setCurrency(savedCurrency);
      fetchCategoriesWithCurrency(savedCurrency);
    }
    
    // Fetch real recent payments
    fetch('/api/tebex/recent-payments')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          setRecentPayments(data.slice(0, 5));
          if (data.length > 0) {
            setTopCustomer(data[0]); // Just pick the most recent for now as top
          }
        }
      })
      .catch(err => console.error("Failed to load real payments:", err));

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

  const handleCheckGiftcard = () => {
    alert("Giftcards can be applied on the final checkout page!");
  };

  const activeCategory = categories.find(c => c.id === activeCategoryId);

  return (
    <div className="cobblemon-shop-wrapper">
      
      {/* Global Style Override for Shop Page */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Keep global header and footer visible, just hide the default sidebar */
        .desktop-sidebar-container { display: none !important; } 
        main { padding-top: 40px !important; }
      `}} />

      {/* TOP NAV & STATUS */}
      <div className="shop-top-bar">
        <div className="shop-logo">
           <img src="/images/logo.png" alt="Logo" style={{height: '60px'}} onError={(e) => e.currentTarget.style.display='none'} />
        </div>
        
        <div className="top-right-actions">
          
          <div className="currency-selector-wrapper">
            {isFetchingCurrency ? <i className="fa-solid fa-spinner fa-spin currency-spinner"></i> : <i className="fa-solid fa-earth-americas"></i>}
            <select className="currency-select" value={currency} onChange={handleCurrencyChange} disabled={isFetchingCurrency}>
              <option value="USD">USD ($)</option>
              <option value="AUD">AUD ($)</option>
              <option value="BRL">BRL (R$)</option>
              <option value="CAD">CAD ($)</option>
              <option value="DKK">DKK (kr)</option>
              <option value="EUR">EUR (€)</option>
              <option value="NOK">NOK (kr)</option>
              <option value="NZD">NZD ($)</option>
              <option value="PLN">PLN (zł)</option>
              <option value="GBP">GBP (£)</option>
              <option value="SEK">SEK (kr)</option>
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
          {/* Categories Module */}
          <div className="sidebar-box module-box">
            <ul className="category-list">
              <li>
                 <a href="/" className="cat-btn back-home-btn" style={{ fontWeight: 'bold' }}>
                    <i className="fa-solid fa-earth-americas"></i> Back to Main Website
                 </a>
              </li>
              <li>
                <button 
                  onClick={() => setActiveCategoryId('home')}
                  className={activeCategoryId === 'home' ? 'cat-btn active' : 'cat-btn'}
                >
                  <i className="fa-solid fa-house"></i> Store Home
                </button>
              </li>
              {categories.map(category => (
                <li key={category.id}>
                  <button 
                    onClick={() => setActiveCategoryId(category.id)}
                    className={activeCategoryId === category.id ? 'cat-btn active' : 'cat-btn'}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
              <li>
                <a href="/modpacks" className="cat-btn">
                  Modpack links
                </a>
              </li>
            </ul>
          </div>

          {/* Featured Package Module */}
          <div className="sidebar-box module-box featured-box">
            <h3 className="module-title">Featured Package</h3>
            <div className="featured-item">
              <img src="https://i.imgur.com/Kz8V5wN.png" alt="Pokefun" className="featured-img" />
              <div className="featured-price">50$</div>
              <div className="featured-price-sub">$50.00</div>
              <button className="btn-cyan w-full">Add to Basket</button>
            </div>
          </div>

          {/* Giftcard Module */}
          <div className="sidebar-box module-box text-center">
            <h3 className="module-title">Giftcard Balance</h3>
            <div className="giftcard-form">
              <input 
                type="text" 
                placeholder="Enter gift card number" 
                className="input-dark"
                value={giftcardNumber}
                onChange={(e) => setGiftcardNumber(e.target.value)}
              />
              <button className="btn-grey w-full" onClick={handleCheckGiftcard}>Check</button>
            </div>
          </div>

          {/* Top Customer Module */}
          <div className="sidebar-box module-box text-center">
            <h3 className="module-title">Top Customer</h3>
            {topCustomer ? (
              <div className="recent-payment-item" style={{justifyContent: 'center', margin: '0'}}>
                <img src={`https://mc-heads.net/avatar/${topCustomer.player.name}/32`} alt="Avatar" className="rp-avatar" style={{width:'40px', height:'40px'}}/>
                <div className="rp-info">
                  <div className="rp-name" style={{fontSize: '1rem'}}>{topCustomer.player.name}</div>
                </div>
              </div>
            ) : (
              <p className="module-empty-text">No recent top purchaser to display.</p>
            )}
          </div>

          {/* Recent Payments Module */}
          <div className="sidebar-box module-box">
            <h3 className="module-title">Recent Payments</h3>
            {recentPayments.length > 0 ? (
              recentPayments.map((payment, index) => (
                <div className="recent-payment-item" key={index}>
                  <img src={`https://mc-heads.net/avatar/${payment.player.name}/32`} alt="Avatar" className="rp-avatar"/>
                  <div className="rp-info">
                    <div className="rp-name">{payment.player.name}</div>
                    <div className="rp-desc">{payment.packages && payment.packages[0] ? payment.packages[0].name : "Store Package"} - {payment.currency.iso_4217} {payment.amount}</div>
                    <div className="rp-date">{new Date(payment.date).toLocaleDateString()}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="module-empty-text" style={{textAlign: 'center'}}>No recent payments found.</p>
            )}
          </div>

        </div>

        {/* Main Content */}
        <div className="shop-main">
          {activeCategoryId === 'home' ? (
            <div className="category-container store-home-container" style={{ padding: '40px', background: '#111', border: '1px solid #222', borderRadius: '12px', color: '#ccc' }}>
              <h2 style={{ color: 'white', fontSize: '3rem', marginBottom: '20px', textAlign: 'center', fontWeight: '800' }}>WELCOME TO THE OFFICIAL <br/><span style={{color: '#4bc8c8'}}>POKEFUN STORE</span></h2>
              
              <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '20px', textAlign: 'center' }}>
                <strong>POKEFUN JAVA</strong> is a free-to-play 1st Public cracked Minecraft Server of <strong>Cobblemon 1.7.1 and many more</strong>. Purchase items here to enhance your Pokémon journey, unlock special perks, and show off a unique style on the server!
              </p>
            
              <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '20px', textAlign: 'center' }}>
                To begin, please select a category from the sidebar.
              </p>
            
              <div style={{ background: 'rgba(251, 191, 36, 0.1)', borderLeft: '5px solid #fbbf24', padding: '20px', marginBottom: '30px', color: '#fbbf24', fontSize: '1.2rem', borderRadius: '4px' }}>
                <strong>NOTE</strong> - Please ensure you enter your correct <strong>Java Edition Gamertag</strong> to receive your items.<br/>
                Purchases are credited to the player name entered at checkout.
              </div>
            
              <h3 style={{ color: 'white', fontSize: '2.2rem', marginTop: '40px', marginBottom: '20px', borderBottom: '2px solid #333', paddingBottom: '10px' }}>⭐ EPIC SERVER FEATURES ⭐</h3>
              <p style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Dive into the most feature-rich Cobblemon experience!</p>
              <ul style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '30px', listStyle: 'none', padding: 0 }}>
                <li>💰 <strong>Global Trade System (GTS) & Shops:</strong> Buy, sell, and trade Pokémon and items with players worldwide to get rich!</li>
                <li>🎁 <strong>Daily Rewards & Kits:</strong> Claim free Daily Rewards, vote for crate keys, and unlock weekly/monthly Kits.</li>
                <li>🛡️ <strong>Land Claiming Menu:</strong> Protect your builds and resources with easy-to-use claim tools and menus.</li>
                <li>🔥 <strong>Exclusive Evolutions & Mechanics:</strong> Mega, D-Max, G-Max, Pasture Breeding, and Ultra Beasts are all active!</li>
                <li>✨ <strong>Unique Content:</strong> Enjoy Rideable Pokémon, Custom Skins, Abilities, and the challenging Pokémon GYMS.</li>
                <li>💡 <strong>Plus Many More:</strong> PokeBuilder, Orbs/Plates, Daily Quests, and Fusion Pokémon coming soon!</li>
              </ul>
            
              <h3 style={{ color: 'white', fontSize: '2.2rem', marginTop: '40px', marginBottom: '20px', borderBottom: '2px solid #333', paddingBottom: '10px' }}>SUPPORT</h3>
              <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '15px' }}>
                Need questions answered? Waited more than 20 minutes for your package? Ask the community/staff on <strong>Discord</strong>, or submit a support ticket there for payment issues.
              </p>
              <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Public Contact Email: <a href="mailto:contactmcpefun@gmail.com" style={{color: '#4bc8c8', fontWeight: 'bold'}}>contactmcpefun@gmail.com</a></p>
              <a href="https://discord.com/invite/NtE8QBkmwR" target="_blank" rel="noopener noreferrer" className="btn-cyan" style={{ display: 'inline-block', textDecoration: 'none', padding: '15px 30px', borderRadius: '8px', marginBottom: '40px', fontWeight: 'bold', fontSize: '1.2rem' }}>
                <i className="fa-brands fa-discord"></i> Join Our Discord Server
              </a>
            
              <h3 style={{ color: 'white', fontSize: '2.2rem', marginTop: '40px', marginBottom: '20px', borderBottom: '2px solid #333', paddingBottom: '10px' }}>REFUND POLICY</h3>
              <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '15px' }}>
                All payments are final and non-refundable. Attempting a chargeback will result in a permanent banishment from all of our servers and associated stores.
              </p>
              <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '15px' }}>
                Payments are taken and secured by Tebex, a trusted leader in online gaming transactions.
              </p>
              <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '15px' }}>
                It could take between 1-20 minutes for your purchase to be credited in-game. If you are still not credited after this time, please open a support ticket on our Discord with proof of purchase.
              </p>
              <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '15px' }}>
                If you are banned from POKEFUN JAVA for breaking our rules, you will lose access to your purchased goods for the duration of your ban. The strict "no refund policy" will also remain in place.
              </p>
            </div>
          ) : (
            <div className="category-container">
              {activeCategory ? (
                <>
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
                </>
              ) : (
                 <div className="empty-category">
                   <i className="fa-solid fa-box-open empty-icon"></i>
                   <h3>No category selected</h3>
                   <p>Please select a category from the sidebar to view items.</p>
                 </div>
              )}
            </div>
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
        .cobblemon-shop-wrapper {
          position: relative;
          width: 100%;
          max-width: 1300px;
          margin: 0 auto;
          padding: 20px 0;
          font-family: 'Righteous', 'Karla', sans-serif;
        }
        
        .shop-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: transparent;
          padding: 10px 0;
          margin-bottom: 40px;
        }
        
        .top-right-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .giftcard-btn {
          background: #111;
          color: white;
          border: 2px solid #333;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .giftcard-btn:hover { border-color: #4bc8c8; color: #4bc8c8; }
        
        .currency-selector-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #111;
          border: 2px solid #333;
          padding: 10px 15px;
          border-radius: 8px;
          color: white;
        }
        
        .currency-select {
          background: transparent;
          border: none;
          font-weight: bold;
          color: white;
          font-size: 1.1rem;
          outline: none;
          cursor: pointer;
        }
        .currency-select option { background: #111; color: white; }
        
        .user-status-box {
          background: #111;
          border: 2px solid #333;
          border-radius: 8px;
          padding: 8px 15px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .user-status-box:hover {
          border-color: #4bc8c8;
        }
        
        .user-logged-in { display: flex; align-items: center; gap: 15px; }
        .user-text-info { text-align: right; }
        .user-label { font-size: 0.9rem; color: #aaa; font-weight: 600; text-transform: uppercase; }
        .user-name { font-weight: bold; color: white; font-size: 1.2rem; }
        .highlight-text { color: #4bc8c8; }
        
        .mc-avatar-container { width: 45px; height: 45px; border-radius: 6px; overflow: hidden; }
        .mc-face { width: 100%; height: 100%; object-fit: cover; }

        .shop-layout { display: flex; gap: 30px; align-items: flex-start; }
        
        .shop-sidebar { width: 320px; flex-shrink: 0; display: flex; flex-direction: column; gap: 20px; }
        
        .module-box {
          background: #111;
          padding: 25px;
          border-radius: 12px;
          border: 2px solid #222;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
        }
        
        .module-title { font-size: 1.4rem; color: white; margin-bottom: 20px; font-weight: 800; text-align: center; }
        .module-empty-text { font-size: 1.1rem; color: #ccc; margin: 0; }
        
        .category-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 10px; margin: 0;}
        
        .cat-btn {
          width: 100%; text-align: left; background: transparent; border: none;
          padding: 15px 20px; color: #ccc; font-size: 1.3rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s ease; border-radius: 8px;
          font-family: inherit;
          display: flex; align-items: center; gap: 12px; text-decoration: none;
        }
        .cat-btn:hover { background: #222; color: white; }
        .cat-btn.active { background: #222; color: #4bc8c8; font-weight: bold; border-left: 4px solid #4bc8c8; }

        .back-home-btn { color: #4bc8c8; }
        
        /* Featured */
        .featured-item { text-align: center; }
        .featured-img { width: 100%; max-width: 180px; margin: 0 auto 15px; display: block; }
        .featured-price { font-size: 1.5rem; font-weight: bold; color: white; }
        .featured-price-sub { font-size: 1.1rem; color: #aaa; margin-bottom: 15px; }
        
        /* Form Inputs */
        .input-dark {
          width: 100%; background: black; border: 2px solid #333; color: white;
          padding: 15px; font-size: 1.1rem; text-align: center; margin-bottom: 15px; border-radius: 8px;
        }
        .input-dark:focus { outline: none; border-color: #4bc8c8; }
        
        /* Buttons */
        .w-full { width: 100%; }
        .btn-cyan {
          background: #4bc8c8; color: black; border: none; padding: 15px; border-radius: 8px;
          font-weight: bold; cursor: pointer; transition: 0.2s; font-size: 1.2rem;
        }
        .btn-cyan:hover { background: #3ab0b0; }
        .btn-grey {
          background: #ccc; color: black; border: none; padding: 15px; border-radius: 8px;
          font-weight: bold; cursor: pointer; transition: 0.2s; font-size: 1.2rem;
        }
        .btn-grey:hover { background: #bbb; }
        
        /* Recent Payments */
        .recent-payment-item { display: flex; gap: 15px; align-items: center; margin-bottom: 15px; }
        .recent-payment-item:last-child { margin-bottom: 0; }
        .rp-avatar { width: 40px; height: 40px; border-radius: 8px; }
        .rp-info { text-align: left; }
        .rp-name { color: white; font-size: 1.1rem; font-weight: bold; }
        .rp-desc { color: #ccc; font-size: 0.9rem; }
        .rp-date { color: #888; font-size: 0.85rem; }

        .shop-main { flex-grow: 1; min-width: 0; }
        
        .category-container {
          background: transparent;
        }
        
        .category-header {
          padding: 40px;
          border-bottom: 2px solid #222;
          text-align: left;
          background: #111;
          border-radius: 12px 12px 0 0;
          border: 2px solid #222;
          border-bottom: none;
        }
        .category-header h2 { color: white; font-size: 3rem; margin: 0 0 10px 0; font-weight: 800; }
        .cat-desc { color: #ccc; font-size: 1.3rem; line-height: 1.6; max-width: 1000px; margin: 0;}
        .cat-desc img { max-width: 100%; border-radius: 8px; margin-top: 15px; }
        
        /* Grid Layout for Packages */
        .package-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 30px;
          padding: 40px;
          background: #111;
          border-radius: 0 0 12px 12px;
          border: 2px solid #222;
          border-top: none;
        }
        
        .package-card {
          background: #121212;
          border: 2px solid #222;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
        }
        .package-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.8);
          border-color: #4bc8c8;
        }
        
        .pkg-image-wrapper {
          height: 280px;
          background: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
          cursor: pointer;
          border-bottom: 2px solid #222;
        }
        .pkg-image { max-width: 100%; max-height: 100%; object-fit: contain; transition: transform 0.3s; transform: scale(1.5); }
        .package-card:hover .pkg-image { transform: scale(1.6); }
        .placeholder-icon { font-size: 6rem; color: #333; }
        
        .pkg-details { padding: 25px; text-align: center; flex-grow: 1; cursor: pointer; }
        .pkg-name { color: white; font-size: 1.8rem; margin: 0 0 10px 0; font-weight: bold; }
        .pkg-price { color: #4bc8c8; font-size: 1.6rem; font-weight: 800; margin-bottom: 15px; }
        
        .pkg-actions {
          padding: 0 25px 25px 25px;
          display: flex;
          gap: 15px;
          background: #121212;
        }
        
        .btn-buy {
          flex-grow: 1;
          background: #4bc8c8; color: black; border: none; border-radius: 8px;
          padding: 15px; font-weight: bold; font-size: 1.3rem; cursor: pointer; transition: all 0.2s;
        }
        .btn-buy:hover:not(:disabled) { background: #3ab0b0; }
        .btn-buy:disabled { opacity: 0.6; cursor: not-allowed; }
        
        .btn-info {
          width: 55px; background: #222; color: #aaa; border: 2px solid #333;
          border-radius: 8px; cursor: pointer; transition: all 0.2s; font-size: 1.3rem;
        }
        .btn-info:hover { color: #4bc8c8; border-color: #4bc8c8; background: #333; }
        
        .empty-category { text-align: center; padding: 60px 20px; color: #9ca3af; }
        .empty-icon { font-size: 3rem; margin-bottom: 15px; color: #cbd5e1;}

        /* Modals */
        .modal-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(8px);
          z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        
        .clean-modal {
          background: #111; width: 100%; max-width: 500px; border-radius: 16px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5); overflow: hidden; border: 2px solid #222;
          animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .clean-modal.pkg-detail { max-width: 700px; }
        
        @keyframes popIn { 0% { transform: scale(0.95) translateY(10px); opacity: 0; } 100% { transform: scale(1) translateY(0); opacity: 1; } }
        
        .modal-header {
          padding: 25px 30px; border-bottom: 2px solid #222;
          display: flex; justify-content: space-between; align-items: center;
          background: #1a1a1a;
        }
        .modal-header h2 { margin: 0; font-size: 1.8rem; color: white; font-weight: bold; }
        
        .btn-close {
          background: transparent; border: none; color: #aaa; font-size: 2rem;
          cursor: pointer; transition: color 0.2s; padding: 0;
        }
        .btn-close:hover { color: #ef4444; }
        
        .modal-body { padding: 40px; text-align: center; }
        
        .mc-steve-icon { width: 100px; height: 100px; margin: 0 auto 20px; border-radius: 12px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.5); }
        .mc-steve-icon img { width: 100%; height: 100%; object-fit: cover; }
        .modal-body p { color: #ccc; margin-bottom: 25px; font-size: 1.3rem; line-height: 1.5;}
        
        .clean-input {
          width: 100%; padding: 18px; border: 2px solid #333; border-radius: 8px; background: #222;
          font-size: 1.4rem; color: white; margin-bottom: 20px; font-weight: bold;
          text-align: center; transition: border-color 0.2s;
        }
        .clean-input:focus { outline: none; border-color: #10b981; }
        
        .btn-submit {
          width: 100%; background: #10b981; color: white; border: none;
          padding: 18px; border-radius: 8px; font-weight: 900; font-size: 1.4rem;
          cursor: pointer; transition: background 0.2s;
        }
        .btn-submit:hover:not(:disabled) { background: #059669; }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed;}
        
        .modal-image-center { height: 250px; display: flex; align-items: center; justify-content: center; margin-bottom: 30px; background: #f8fafc; border-radius: 12px; border: 2px solid #e2e8f0;}
        .modal-image-center img { max-height: 90%; max-width: 90%; object-fit: contain; transform: scale(1.3); }
        
        .modal-price-large { font-size: 2.5rem; font-weight: 900; color: #10b981; text-align: center; margin-bottom: 20px; }
        
        .html-desc { color: #cbd5e1; font-size: 1.3rem; line-height: 1.6; max-height: 400px; overflow-y: auto; padding-right: 15px; text-align: left;}
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
