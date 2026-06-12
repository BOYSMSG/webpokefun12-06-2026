"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

export default function PokedexIndex() {
  const [pokemonList, setPokemonList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(151); // Lazy loading chunks

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1025')
      .then(res => res.json())
      .then(data => {
        const results = data.results.map((p: any, index: number) => ({
          ...p,
          id: index + 1,
          name: p.name.charAt(0).toUpperCase() + p.name.slice(1).replace('-', ' ')
        }));
        setPokemonList(results);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredPokemon = useMemo(() => {
    if (!searchTerm) return pokemonList;
    return pokemonList.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [pokemonList, searchTerm]);

  // Load more on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 500) {
        setLimit(prev => Math.min(prev + 50, filteredPokemon.length));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [filteredPokemon.length]);

  return (
    <div className="inner" style={{ paddingTop: '80px', paddingBottom: '80px', maxWidth: '1400px', margin: '0 auto', minHeight: '80vh', paddingLeft: '20px', paddingRight: '20px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '15px', color: 'white', textShadow: '0 0 25px rgba(255,255,255,0.2)' }}>
          <i className="fa-solid fa-book-open" style={{ color: '#ef4444', marginRight: '20px' }}></i>
          Official Pokémon Dex
        </h1>
        <p style={{ fontSize: '1.4rem', color: 'gray', maxWidth: '800px', margin: '0 auto' }}>
          Explore the complete Pokédex! Search for any Pokémon to view their base stats, abilities, typings, and more.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '50px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
          <i className="fa-solid fa-search" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'gray', fontSize: '1.2rem' }}></i>
          <input 
            type="text" 
            placeholder="Search Pokémon by name..." 
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setLimit(151); // reset limit on search
            }}
            style={{
              width: '100%',
              padding: '18px 20px 18px 50px',
              borderRadius: '30px',
              border: '2px solid rgba(255,255,255,0.1)',
              background: '#1f2937',
              color: 'white',
              fontSize: '1.2rem',
              outline: 'none',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              transition: 'border 0.2s'
            }}
            onFocus={e => e.currentTarget.style.border = '2px solid #ef4444'}
            onBlur={e => e.currentTarget.style.border = '2px solid rgba(255,255,255,0.1)'}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px', color: 'gray', fontSize: '1.5rem' }}>
          <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '3rem', color: '#ef4444', marginBottom: '20px' }}></i>
          <br />Loading Pokédex Database...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '25px' }}>
          {filteredPokemon.slice(0, limit).map((pokemon) => (
            <Link key={pokemon.id} href={`/wiki/pokedex/${pokemon.id}`} style={{ textDecoration: 'none' }}>
              <div 
                className="pokemon-card"
                style={{
                  background: 'linear-gradient(180deg, #1f2937 0%, #111827 100%)',
                  borderRadius: '20px',
                  padding: '20px',
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', top: '10px', left: '15px', color: 'rgba(255,255,255,0.2)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  #{String(pokemon.id).padStart(4, '0')}
                </div>
                
                <img 
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`} 
                  alt={pokemon.name} 
                  style={{ width: '120px', height: '120px', objectFit: 'contain', marginBottom: '15px', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.5))' }} 
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to standard sprite if artwork missing
                    e.currentTarget.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
                  }}
                />
                
                <h3 style={{ margin: 0, color: 'white', fontSize: '1.2rem', fontWeight: 700 }}>
                  {pokemon.name}
                </h3>
              </div>
            </Link>
          ))}
          {filteredPokemon.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'gray', padding: '50px', fontSize: '1.5rem' }}>
              No Pokémon found matching "{searchTerm}"
            </div>
          )}
        </div>
      )}

      <style>{`
        .pokemon-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.4) !important;
        }
      `}</style>
    </div>
  );
}
