"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705898',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

export default function PokemonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  const [pokemon, setPokemon] = useState<any>(null);
  const [species, setSpecies] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json()),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then(res => res.json())
    ])
    .then(([pokeData, speciesData]) => {
      setPokemon(pokeData);
      setSpecies(speciesData);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id]);

  const playCry = () => {
    if (pokemon?.cries?.latest) {
      const audio = new Audio(pokemon.cries.latest);
      audio.volume = 0.5;
      audio.play();
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '4rem', color: '#ef4444', marginBottom: '20px' }}></i>
        <h2 style={{ color: 'white' }}>Loading Pokémon Data...</h2>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <h1 style={{ color: '#ef4444', fontSize: '3rem' }}>Pokémon Not Found</h1>
        <button onClick={() => router.push('/wiki/pokedex')} style={{ marginTop: '20px', padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>Return to Dex</button>
      </div>
    );
  }

  const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1).replace('-', ' ');
  const mainType = pokemon.types[0].type.name;
  const mainColor = TYPE_COLORS[mainType] || '#8b5cf6';

  // Get English flavor text
  const flavorTextEntry = species?.flavor_text_entries?.find((f: any) => f.language.name === 'en');
  const description = flavorTextEntry ? flavorTextEntry.flavor_text.replace(/\f/g, ' ') : "No description available.";

  return (
    <div style={{ minHeight: '100vh', background: '#111827', width: '100%' }}>
      {/* Dynamic Header Background based on Type */}
      <div style={{ height: '350px', background: `linear-gradient(to bottom, ${mainColor}40, transparent)`, position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 0 }}></div>
      
      <div className="inner" style={{ paddingTop: '100px', paddingBottom: '80px', maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1, paddingLeft: '20px', paddingRight: '20px' }}>
        
        <Link href="/wiki/pokedex" style={{ color: 'gray', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '30px', fontWeight: 'bold', fontSize: '1.1rem' }}>
          <i className="fa-solid fa-arrow-left"></i> Back to Pokédex
        </Link>

        <div style={{ display: 'flex', gap: '50px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          
          {/* Left Column: Image and Basic Info */}
          <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
              width: '100%', 
              background: 'rgba(255,255,255,0.03)', 
              borderRadius: '30px', 
              padding: '40px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              border: `1px solid ${mainColor}40`,
              boxShadow: `0 20px 50px ${mainColor}20`,
              position: 'relative'
            }}>
              <span style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '1.5rem', fontWeight: 900, color: 'rgba(255,255,255,0.2)' }}>
                #{String(pokemon.id).padStart(4, '0')}
              </span>
              
              <img 
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`} 
                alt={name} 
                style={{ width: '250px', height: '250px', objectFit: 'contain', filter: `drop-shadow(0 20px 20px rgba(0,0,0,0.5))` }} 
              />
              
              <h1 style={{ fontSize: '3rem', fontWeight: 900, color: 'white', margin: '20px 0 10px 0', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                {name}
              </h1>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {pokemon.types.map((t: any) => (
                  <span key={t.type.name} style={{ 
                    background: TYPE_COLORS[t.type.name], 
                    color: 'white', 
                    padding: '8px 20px', 
                    borderRadius: '20px', 
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    fontSize: '0.9rem',
                    letterSpacing: '1px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                  }}>
                    {t.type.name}
                  </span>
                ))}
              </div>

              <button 
                onClick={playCry} 
                style={{ 
                  background: 'rgba(255,255,255,0.1)', 
                  color: 'white', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  padding: '12px 25px', 
                  borderRadius: '30px', 
                  cursor: 'pointer', 
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '1.1rem',
                  transition: 'background 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >
                <i className="fa-solid fa-volume-high"></i> Play Cry
              </button>
            </div>
            
            {/* Physical Details */}
            <div style={{ display: 'flex', gap: '20px', width: '100%', marginTop: '20px' }}>
              <div style={{ flex: 1, background: '#1f2937', padding: '20px', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: 'gray', fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>Height</span>
                <span style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>{pokemon.height / 10} m</span>
              </div>
              <div style={{ flex: 1, background: '#1f2937', padding: '20px', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: 'gray', fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>Weight</span>
                <span style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>{pokemon.weight / 10} kg</span>
              </div>
            </div>
          </div>

          {/* Right Column: Stats and Info */}
          <div style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Dex Entry */}
            <div>
              <h2 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '15px' }}>Pokédex Entry</h2>
              <p style={{ color: '#d1d5db', fontSize: '1.2rem', lineHeight: '1.6', background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '20px', borderLeft: `4px solid ${mainColor}` }}>
                "{description}"
              </p>
            </div>

            {/* Abilities */}
            <div>
              <h2 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '15px' }}>Abilities</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                {pokemon.abilities.map((a: any) => (
                  <div key={a.ability.name} style={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.05)', padding: '15px 25px', borderRadius: '15px', flex: 1, minWidth: '150px' }}>
                    <span style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'capitalize', display: 'block', marginBottom: '5px' }}>
                      {a.ability.name.replace('-', ' ')}
                    </span>
                    {a.is_hidden && <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '3px 8px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>Hidden Ability</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Base Stats */}
            <div>
              <h2 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '15px' }}>Base Stats</h2>
              <div style={{ background: '#1f2937', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {pokemon.stats.map((s: any) => {
                  const statName = s.stat.name.toUpperCase().replace('SPECIAL-ATTACK', 'SP. ATK').replace('SPECIAL-DEFENSE', 'SP. DEF');
                  const maxStat = 255;
                  const percentage = (s.base_stat / maxStat) * 100;
                  
                  // Color logic based on stat value
                  let barColor = '#ef4444'; // Red for low
                  if (s.base_stat > 60) barColor = '#f59e0b'; // Orange
                  if (s.base_stat > 90) barColor = '#10b981'; // Green
                  if (s.base_stat > 120) barColor = '#3b82f6'; // Blue

                  return (
                    <div key={s.stat.name} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span style={{ color: 'gray', fontWeight: 'bold', width: '80px', fontSize: '0.9rem' }}>{statName}</span>
                      <span style={{ color: 'white', fontWeight: 900, width: '40px', textAlign: 'right' }}>{s.base_stat}</span>
                      <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', height: '12px', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${percentage}%`, background: barColor, height: '100%', borderRadius: '10px', transition: 'width 1s ease-out' }}></div>
                      </div>
                    </div>
                  );
                })}
                <div style={{ marginTop: '10px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: 'gray' }}>
                  <span>Total</span>
                  <span style={{ color: 'white', fontSize: '1.2rem' }}>{pokemon.stats.reduce((acc: number, s: any) => acc + s.base_stat, 0)}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
