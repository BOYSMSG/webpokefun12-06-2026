"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function StoreConfigPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [topCustomer, setTopCustomer] = useState<any>(null);
  
  const [config, setConfig] = useState({
    saleActive: false,
    saleEndDate: '',
    saleTitle: '',
    saleSubtitle: '',
    discountPercentage: 20,
    featuredPackageId: ''
  });

  const myRole = (session?.user as any)?.role;
  const isAdmin = myRole === 'OWNER' || myRole === 'ADMIN';

  useEffect(() => {
    if (status === 'unauthenticated' || (status === 'authenticated' && !isAdmin)) {
      router.push('/');
      return;
    }

    if (status === 'authenticated' && isAdmin) {
      fetch('/api/store-config')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.config) {
            // Format date for datetime-local input
            const dateStr = new Date(data.config.saleEndDate).toISOString().slice(0, 16);
            setConfig({
              ...data.config,
              saleEndDate: dateStr,
              featuredPackageId: data.config.featuredPackageId || ''
            });
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });

      // Fetch Tebex Categories to select a featured package
      fetch('/api/tebex/categories')
        .then(res => res.json())
        .then(data => {
          if (data && data.data) {
            setCategories(data.data);
          }
        })
        .catch(err => console.error(err));

      // Fetch Recent Payments & Top Customer
      fetch('/api/tebex/recent-payments')
        .then(res => res.json())
        .then(data => {
          if (data && data.recent) {
            setRecentPayments(data.recent);
            setTopCustomer(data.top);
          }
        })
        .catch(err => console.error(err));
    }
  }, [status, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/store-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...config,
          saleEndDate: new Date(config.saleEndDate).toISOString()
        })
      });

      const data = await res.json();
      if (data.success) {
        setMessage('Store config saved successfully!');
      } else {
        setMessage(data.error || 'Failed to save config.');
      }
    } catch (err) {
      setMessage('An error occurred.');
    }
    setSaving(false);
  };

  if (loading || status === 'loading') {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Loading...</div>;
  }

  return (
    <div className="inner" style={{ paddingTop: '100px', paddingBottom: '60px', maxWidth: '600px', margin: '0 auto' }}>
      <button onClick={() => router.push('/admin')} style={{ marginBottom: '20px', padding: '8px 15px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        <i className="fa-solid fa-arrow-left"></i> Back to Admin Dashboard
      </button>

      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#facc15', marginBottom: '30px' }}>
        <i className="fa-solid fa-store"></i> Store Configuration
      </h1>

      <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '16px', border: '1px solid #444' }}>
        {message && (
          <div style={{ padding: '10px', marginBottom: '20px', borderRadius: '8px', background: message.includes('success') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: message.includes('success') ? '#10b981' : '#ef4444' }}>
            {message}
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '1.2rem', color: 'white' }}>
            <input 
              type="checkbox" 
              checked={config.saleActive}
              onChange={e => setConfig({...config, saleActive: e.target.checked})}
              style={{ marginRight: '10px', width: '20px', height: '20px' }}
            />
            Enable Store Sale Banner & Discounts
          </label>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'gray' }}>Sale Title</label>
          <input 
            type="text" 
            required 
            value={config.saleTitle}
            onChange={e => setConfig({...config, saleTitle: e.target.value})}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid #444', color: 'white' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'gray' }}>Sale Subtitle (Description)</label>
          <input 
            type="text" 
            required 
            value={config.saleSubtitle}
            onChange={e => setConfig({...config, saleSubtitle: e.target.value})}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid #444', color: 'white' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'gray' }}>Discount Percentage (%)</label>
          <input 
            type="number" 
            min="1" max="99" 
            required 
            value={config.discountPercentage}
            onChange={e => setConfig({...config, discountPercentage: parseInt(e.target.value)})}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid #444', color: 'white' }}
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'gray' }}>Sale End Date & Time (Countdown Target)</label>
          <input 
            type="datetime-local" 
            required 
            value={config.saleEndDate}
            onChange={e => setConfig({...config, saleEndDate: e.target.value})}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid #444', color: 'white' }}
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'gray' }}>Featured Store Package (Shows on sidebar)</label>
          <select 
            value={config.featuredPackageId}
            onChange={e => setConfig({...config, featuredPackageId: e.target.value})}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid #444', color: 'white' }}
          >
            <option value="">-- Let system choose --</option>
            {categories && categories.length > 0 && categories.map(cat => (
              <optgroup key={cat.id || Math.random()} label={cat.name || 'Category'}>
                {cat.packages && cat.packages.length > 0 && cat.packages.map((pkg: any) => (
                  <option key={pkg.id || Math.random()} value={pkg.id?.toString() || ''}>{pkg.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <button type="submit" disabled={saving} style={{ width: '100%', padding: '15px', background: '#facc15', color: 'black', fontWeight: 'bold', fontSize: '1.1rem', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </form>

      {/* Stats Section */}
      <div style={{ marginTop: '50px', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        
        {/* Top Customer */}
        <div style={{ flex: '1 1 300px', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px', border: '1px solid #444' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#facc15', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-crown"></i> Top Customer
          </h2>
          {topCustomer && topCustomer.player ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img src={`https://mc-heads.net/avatar/${topCustomer.player.name || 'steve'}/50`} alt="Avatar" style={{ borderRadius: '8px' }} />
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>{topCustomer.player.name}</div>
                <div style={{ color: 'gray' }}>Most Support</div>
              </div>
            </div>
          ) : (
            <p style={{ color: 'gray' }}>No data available.</p>
          )}
        </div>

        {/* Recent Payments */}
        <div style={{ flex: '1 1 300px', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px', border: '1px solid #444' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#10b981', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-receipt"></i> Recent Payments
          </h2>
          {recentPayments && recentPayments.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {recentPayments.map((p, idx) => (
                <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: idx < recentPayments.length - 1 ? '1px solid #333' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>
                    <img src={`https://mc-heads.net/avatar/${p.player?.name || 'steve'}/30`} alt="Avatar" style={{ borderRadius: '4px' }} />
                    {p.player?.name || 'Unknown'}
                  </div>
                  <div style={{ color: '#10b981', fontWeight: 'bold' }}>
                    {p.amount} {p.currency}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'gray' }}>No recent payments.</p>
          )}
        </div>

      </div>
    </div>
  );
}
