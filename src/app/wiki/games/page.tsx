"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function GamesPage() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/version?limit=100')
      .then(res => res.json())
      .then(data => {
        setGames(data.results);
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

        <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#111827', marginBottom: '10px' }}>Games & Generations</h1>
        <p style={{ color: 'gray', fontSize: '1.2rem', marginBottom: '40px' }}>Every Pokémon game version ever released.</p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '3rem', color: '#8b5cf6' }}></i>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {games.map((game, i) => (
              <div key={i} style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#8b5cf6' }}></div>
                <h3 style={{ textTransform: 'capitalize', color: '#111827', fontSize: '1.1rem', fontWeight: 'bold' }}>Pokémon {game.name.replace(/-/g, ' ')}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
