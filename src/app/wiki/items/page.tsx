"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ItemsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/item?limit=100')
      .then(res => res.json())
      .then(data => {
        setItems(data.results);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '50px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Link href="/wiki" style={{ color: 'gray', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '30px', fontWeight: 'bold' }}>
          <i className="fa-solid fa-arrow-left"></i> Back to Hub
        </Link>

        <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#111827', marginBottom: '10px' }}>Items & Berries</h1>
        <p style={{ color: 'gray', fontSize: '1.2rem', marginBottom: '40px' }}>A database of all items, Poké Balls, TMs, and Berries.</p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '3rem', color: '#10b981' }}></i>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {items.map((item, i) => (
              <div key={i} style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.name}.png`} alt={item.name} style={{ width: '40px', height: '40px', marginBottom: '10px' }} />
                <h3 style={{ textTransform: 'capitalize', color: '#111827', fontSize: '1.1rem', fontWeight: 'bold' }}>{item.name.replace(/-/g, ' ')}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
