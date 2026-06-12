"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function PokedexLayout({ children }: { children: React.ReactNode }) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navItems = [
    {
      id: 'data',
      label: 'Pokémon data',
      icon: 'fa-solid fa-compact-disc',
      links: [
        { href: '/wiki/pokedex', label: 'National Pokédex' },
        { href: '/wiki/pokedex/moves', label: 'Moves' },
        { href: '/wiki/pokedex/type-chart', label: 'Type chart' },
        { href: '/wiki/pokedex/abilities', label: 'Abilities' },
        { href: '/wiki/pokedex/items', label: 'Items' },
        { href: '/wiki/pokedex/evolution-chains', label: 'Evolution chains' },
      ]
    },
    {
      id: 'mechanics',
      label: 'Game mechanics',
      icon: 'fa-solid fa-gear',
      links: [
        { href: '/wiki/pokedex/breeding', label: 'Breeding & egg groups' },
        { href: '/wiki/pokedex/evs', label: 'Effort Values (EVs)' },
        { href: '/wiki/pokedex/natures', label: 'Natures' },
        { href: '/wiki/pokedex/ivs', label: 'IVs/Personality' },
      ]
    },
    {
      id: 'games',
      label: 'Pokémon games',
      icon: 'fa-solid fa-gamepad',
      links: [
        { href: '/wiki/pokedex/games/scarlet-violet', label: 'Scarlet & Violet' },
        { href: '/wiki/pokedex/games/sword-shield', label: 'Sword & Shield' },
        { href: '/wiki/pokedex/games/cobblemon', label: 'Cobblemon Exclusives' },
      ]
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      {/* PokemonDB Style Sub-Navbar */}
      <nav style={{ background: '#222', borderBottom: '4px solid #cc0000', position: 'sticky', top: '70px', zIndex: 1000, boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex' }}>
          
          {navItems.map((item) => (
            <div 
              key={item.id}
              style={{ position: 'relative' }}
              onMouseEnter={() => setActiveDropdown(item.id)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button style={{ 
                background: activeDropdown === item.id ? '#111' : 'transparent', 
                color: activeDropdown === item.id ? 'white' : '#ccc',
                border: 'none', 
                padding: '15px 25px', 
                fontSize: '1rem', 
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 0.2s, color 0.2s',
                height: '100%'
              }}>
                <i className={item.icon}></i> {item.label}
              </button>

              {/* Dropdown Menu */}
              {activeDropdown === item.id && (
                <div style={{ 
                  position: 'absolute', 
                  top: '100%', 
                  left: 0, 
                  background: '#111', 
                  minWidth: '220px', 
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  borderBottomLeftRadius: '8px',
                  borderBottomRightRadius: '8px',
                  overflow: 'hidden',
                  zIndex: 1001
                }}>
                  {item.links.map((link, idx) => (
                    <Link key={idx} href={link.href} style={{ textDecoration: 'none' }}>
                      <div style={{ 
                        padding: '12px 20px', 
                        color: '#ccc', 
                        fontSize: '0.95rem',
                        fontWeight: 'bold',
                        borderBottom: idx === item.links.length - 1 ? 'none' : '1px solid #222',
                        transition: 'background 0.2s, color 0.2s'
                      }}
                      onMouseOver={e => { e.currentTarget.style.background = '#333'; e.currentTarget.style.color = 'white'; }}
                      onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ccc'; }}
                      >
                        {link.label}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

        </div>
      </nav>

      {/* Main Content Area */}
      <div style={{ background: '#111827', minHeight: 'calc(100vh - 70px)' }}>
        {children}
      </div>
    </div>
  );
}
