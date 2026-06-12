"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
  grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
  ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
  rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705898',
  steel: '#B7B7CE', fairy: '#D685AD',
};

// Recursive component for Evolution Chain
const EvolutionNode = ({ node }: { node: any }) => {
  const speciesId = node.species.url.split('/').filter(Boolean).pop();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <Link href={`/wiki/pokedex/${speciesId}`} style={{ textDecoration: 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
          <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesId}.png`} alt={node.species.name} style={{ width: '80px', height: '80px', filter: 'drop-shadow(0 5px 5px rgba(0,0,0,0.3))' }} />
          <span style={{ color: 'white', fontWeight: 'bold', textTransform: 'capitalize' }}>{node.species.name}</span>
        </div>
      </Link>
      
      {node.evolves_to.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {node.evolves_to.map((child: any, idx: number) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <i className="fa-solid fa-arrow-right" style={{ color: 'gray', fontSize: '1.5rem' }}></i>
              <EvolutionNode node={child} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function PokemonDBPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  const [pokemon, setPokemon] = useState<any>(null);
  const [species, setSpecies] = useState<any>(null);
  const [weaknesses, setWeaknesses] = useState<Record<string, number>>({});
  const [evolutionChain, setEvolutionChain] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'moves'>('info');

  useEffect(() => {
    if (!id) return;
    
    Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json()),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then(res => res.json())
    ])
    .then(async ([pokeData, speciesData]) => {
      setPokemon(pokeData);
      setSpecies(speciesData);
      
      try {
        // Fetch Weaknesses
        const typePromises = pokeData.types.map((t: any) => fetch(t.type.url).then(res => res.json()));
        const typesData = await Promise.all(typePromises);
        
        const damageRelations: Record<string, number> = {};
        typesData.forEach((td: any) => {
          const rel = td.damage_relations;
          rel.double_damage_from.forEach((t: any) => damageRelations[t.name] = (damageRelations[t.name] ?? 1) * 2);
          rel.half_damage_from.forEach((t: any) => damageRelations[t.name] = (damageRelations[t.name] ?? 1) * 0.5);
          rel.no_damage_from.forEach((t: any) => damageRelations[t.name] = 0);
        });
        setWeaknesses(damageRelations);

        // Fetch Evolution Chain
        if (speciesData.evolution_chain?.url) {
          const evoData = await fetch(speciesData.evolution_chain.url).then(res => res.json());
          setEvolutionChain(evoData.chain);
        }
      } catch (e) {
        console.error("Error fetching extra data", e);
      }
      
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '4rem', color: '#ef4444', marginBottom: '20px' }}></i>
        <h2 style={{ color: 'white' }}>Loading Pokémon Database...</h2>
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

  // Group weaknesses
  const groupedWeaknesses: Record<number, string[]> = { 4: [], 2: [], 0.5: [], 0.25: [], 0: [] };
  Object.entries(weaknesses).forEach(([type, mult]) => {
    if (groupedWeaknesses[mult]) groupedWeaknesses[mult].push(type);
  });

  // Calculate Min/Max stats at Level 100
  const calcStat = (base: number, statName: string, type: 'min' | 'max') => {
    if (statName === 'hp') {
      if (type === 'min') return Math.floor(2 * base) + 110;
      return Math.floor(2 * base + 31 + 63) + 110;
    } else {
      if (type === 'min') return Math.floor((2 * base + 5) * 0.9);
      return Math.floor((2 * base + 31 + 63 + 5) * 1.1);
    }
  };

  // Extract moves
  const extractMoves = (method: string) => {
    return pokemon.moves
      .filter((m: any) => m.version_group_details.some((v: any) => v.move_learn_method.name === method))
      .map((m: any) => {
        const details = m.version_group_details.find((v: any) => v.move_learn_method.name === method);
        return { name: m.move.name.replace('-', ' '), level: details.level_learned_at || '--' };
      })
      .sort((a: any, b: any) => (a.level === '--' ? 1 : b.level === '--' ? -1 : a.level - b.level));
  };
  
  const levelMoves = extractMoves('level-up');
  const tmMoves = extractMoves('machine');
  const eggMoves = extractMoves('egg');
  const tutorMoves = extractMoves('tutor');

  return (
    <div style={{ minHeight: '100vh', background: '#111827', width: '100%' }}>
      <div style={{ height: '350px', background: `linear-gradient(to bottom, ${mainColor}40, transparent)`, position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 0 }}></div>
      
      <div className="inner" style={{ paddingTop: '100px', paddingBottom: '80px', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1, paddingLeft: '20px', paddingRight: '20px' }}>
        
        <Link href="/wiki/pokedex" style={{ color: 'gray', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '30px', fontWeight: 'bold', fontSize: '1.1rem' }}>
          <i className="fa-solid fa-arrow-left"></i> Back to Pokédex
        </Link>

        {/* Top Header Section */}
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: '40px' }}>
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img 
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`} 
              alt={name} 
              style={{ width: '300px', height: '300px', objectFit: 'contain', filter: `drop-shadow(0 20px 20px rgba(0,0,0,0.5))` }} 
            />
          </div>

          <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', margin: '0 0 10px 0', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
              {name}
            </h1>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'gray', marginBottom: '20px' }}>
              #{String(pokemon.id).padStart(4, '0')}
            </span>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              {pokemon.types.map((t: any) => (
                <span key={t.type.name} style={{ background: TYPE_COLORS[t.type.name], color: 'white', padding: '8px 25px', borderRadius: '20px', fontWeight: 800, textTransform: 'uppercase', fontSize: '1rem', letterSpacing: '1px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                  {t.type.name}
                </span>
              ))}
            </div>

            <p style={{ color: '#d1d5db', fontSize: '1.2rem', lineHeight: '1.6', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '20px', borderLeft: `4px solid ${mainColor}` }}>
              "{species?.flavor_text_entries?.find((f: any) => f.language.name === 'en')?.flavor_text.replace(/\f/g, ' ')}"
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid rgba(255,255,255,0.1)', marginBottom: '30px' }}>
          <button 
            onClick={() => setActiveTab('info')}
            style={{ padding: '15px 30px', fontSize: '1.2rem', fontWeight: 'bold', color: activeTab === 'info' ? 'white' : 'gray', background: 'transparent', border: 'none', borderBottom: activeTab === 'info' ? `3px solid ${mainColor}` : '3px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Pokémon Info
          </button>
          <button 
            onClick={() => setActiveTab('moves')}
            style={{ padding: '15px 30px', fontSize: '1.2rem', fontWeight: 'bold', color: activeTab === 'moves' ? 'white' : 'gray', background: 'transparent', border: 'none', borderBottom: activeTab === 'moves' ? `3px solid ${mainColor}` : '3px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Movesets
          </button>
        </div>

        {/* INFO TAB */}
        {activeTab === 'info' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
            
            {/* Pokédex Data */}
            <div style={{ background: '#1f2937', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Pokédex Data</h2>
              <table style={{ width: '100%', color: '#d1d5db', fontSize: '1.1rem' }}>
                <tbody>
                  <tr><td style={{ padding: '8px 0', color: 'gray', width: '120px' }}>National №</td><td style={{ fontWeight: 'bold', color: 'white' }}>{String(pokemon.id).padStart(4, '0')}</td></tr>
                  <tr><td style={{ padding: '8px 0', color: 'gray' }}>Species</td><td style={{ fontWeight: 'bold' }}>{species?.genera.find((g:any) => g.language.name === 'en')?.genus}</td></tr>
                  <tr><td style={{ padding: '8px 0', color: 'gray' }}>Height</td><td style={{ fontWeight: 'bold' }}>{pokemon.height / 10} m</td></tr>
                  <tr><td style={{ padding: '8px 0', color: 'gray' }}>Weight</td><td style={{ fontWeight: 'bold' }}>{pokemon.weight / 10} kg</td></tr>
                  <tr>
                    <td style={{ padding: '8px 0', color: 'gray', verticalAlign: 'top' }}>Abilities</td>
                    <td style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      {pokemon.abilities.map((a: any) => (
                        <span key={a.ability.name} style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                          1. {a.ability.name.replace('-', ' ')} {a.is_hidden && <span style={{ fontSize: '0.8rem', color: '#ef4444' }}>(Hidden Ability)</span>}
                        </span>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Training */}
            <div style={{ background: '#1f2937', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Training</h2>
              <table style={{ width: '100%', color: '#d1d5db', fontSize: '1.1rem' }}>
                <tbody>
                  <tr><td style={{ padding: '8px 0', color: 'gray', width: '150px' }}>EV yield</td><td style={{ fontWeight: 'bold', color: 'white' }}>{pokemon.stats.filter((s:any)=>s.effort > 0).map((s:any)=>`${s.effort} ${s.stat.name.replace('special-', 'Sp. ')}`).join(', ')}</td></tr>
                  <tr><td style={{ padding: '8px 0', color: 'gray' }}>Catch rate</td><td style={{ fontWeight: 'bold' }}>{species?.capture_rate}</td></tr>
                  <tr><td style={{ padding: '8px 0', color: 'gray' }}>Base Friendship</td><td style={{ fontWeight: 'bold' }}>{species?.base_happiness}</td></tr>
                  <tr><td style={{ padding: '8px 0', color: 'gray' }}>Base Exp.</td><td style={{ fontWeight: 'bold' }}>{pokemon.base_experience}</td></tr>
                  <tr><td style={{ padding: '8px 0', color: 'gray' }}>Growth Rate</td><td style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{species?.growth_rate?.name}</td></tr>
                </tbody>
              </table>
            </div>

            {/* Breeding */}
            <div style={{ background: '#1f2937', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Breeding</h2>
              <table style={{ width: '100%', color: '#d1d5db', fontSize: '1.1rem' }}>
                <tbody>
                  <tr><td style={{ padding: '8px 0', color: 'gray', width: '120px' }}>Egg Groups</td><td style={{ fontWeight: 'bold', color: 'white', textTransform: 'capitalize' }}>{species?.egg_groups.map((e:any) => e.name).join(', ')}</td></tr>
                  <tr>
                    <td style={{ padding: '8px 0', color: 'gray' }}>Gender</td>
                    <td style={{ fontWeight: 'bold' }}>
                      {species?.gender_rate === -1 ? 'Genderless' : (
                        <div style={{ display: 'flex', gap: '15px' }}>
                          <span style={{ color: '#3b82f6' }}>♂ {((8 - species.gender_rate) / 8 * 100).toFixed(1)}%</span>
                          <span style={{ color: '#ec4899' }}>♀ {(species.gender_rate / 8 * 100).toFixed(1)}%</span>
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr><td style={{ padding: '8px 0', color: 'gray' }}>Egg cycles</td><td style={{ fontWeight: 'bold' }}>{species?.hatch_counter} <span style={{ color: 'gray', fontSize: '0.9rem' }}>({species?.hatch_counter * 255} steps)</span></td></tr>
                </tbody>
              </table>
            </div>

            {/* Base Stats */}
            <div style={{ background: '#1f2937', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                Base Stats <span style={{ fontSize: '0.9rem', color: 'gray', fontWeight: 'normal' }}>Min/Max at Lv. 100</span>
              </h2>
              <table style={{ width: '100%', color: '#d1d5db', fontSize: '1rem', borderCollapse: 'collapse' }}>
                <tbody>
                  {pokemon.stats.map((s: any) => {
                    const statName = s.stat.name.toUpperCase().replace('SPECIAL-ATTACK', 'SP. ATK').replace('SPECIAL-DEFENSE', 'SP. DEF');
                    const maxStat = 255;
                    const percentage = (s.base_stat / maxStat) * 100;
                    
                    let barColor = '#ef4444';
                    if (s.base_stat > 60) barColor = '#f59e0b';
                    if (s.base_stat > 90) barColor = '#10b981';
                    if (s.base_stat > 120) barColor = '#3b82f6';

                    return (
                      <tr key={s.stat.name}>
                        <td style={{ padding: '8px 0', color: 'gray', fontWeight: 'bold', width: '70px' }}>{statName}</td>
                        <td style={{ padding: '8px 10px', color: 'white', fontWeight: 900, width: '40px', textAlign: 'right' }}>{s.base_stat}</td>
                        <td style={{ padding: '8px 10px', width: '100%' }}>
                          <div style={{ background: 'rgba(255,255,255,0.05)', height: '10px', borderRadius: '10px', overflow: 'hidden' }}>
                            <div style={{ width: `${percentage}%`, background: barColor, height: '100%', borderRadius: '10px' }}></div>
                          </div>
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', color: 'gray', fontSize: '0.9rem' }}>{calcStat(s.base_stat, s.stat.name, 'min')}</td>
                        <td style={{ padding: '8px 0', textAlign: 'right', color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>{calcStat(s.base_stat, s.stat.name, 'max')}</td>
                      </tr>
                    );
                  })}
                  <tr style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <td style={{ padding: '15px 0', color: 'gray', fontWeight: 'bold' }}>Total</td>
                    <td style={{ padding: '15px 10px', color: 'white', fontWeight: 900, fontSize: '1.2rem', textAlign: 'right' }}>{pokemon.stats.reduce((acc: number, s: any) => acc + s.base_stat, 0)}</td>
                    <td colSpan={3}></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Type Defenses */}
            <div style={{ background: '#1f2937', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', gridColumn: '1 / -1' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Type Defenses</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px' }}>
                {[
                  { label: "Takes 4x Damage", mult: 4, color: '#ef4444' },
                  { label: "Takes 2x Damage", mult: 2, color: '#f87171' },
                  { label: "Takes 0.5x Damage", mult: 0.5, color: '#34d399' },
                  { label: "Takes 0.25x Damage", mult: 0.25, color: '#10b981' },
                  { label: "Immune To (0x)", mult: 0, color: '#9ca3af' },
                ].map(({ label, mult }) => {
                  const types = groupedWeaknesses[mult];
                  if (!types || types.length === 0) return null;
                  return (
                    <div key={mult} style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', gap: '10px' }}>
                      <span style={{ color: 'gray', fontSize: '1rem', fontWeight: 'bold' }}>{label}</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {types.map(t => (
                          <span key={t} style={{ background: TYPE_COLORS[t] || 'gray', color: 'white', padding: '6px 15px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Evolution Chart */}
            {evolutionChain && (
              <div style={{ background: '#1f2937', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', gridColumn: '1 / -1' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Evolution Chart</h2>
                <div style={{ overflowX: 'auto', paddingBottom: '20px' }}>
                  <EvolutionNode node={evolutionChain} />
                </div>
              </div>
            )}

          </div>
        )}

        {/* MOVES TAB */}
        {activeTab === 'moves' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
            
            {/* Level Up Moves */}
            <div style={{ background: '#1f2937', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Moves Learnt by Level Up</h2>
              <table style={{ width: '100%', color: '#d1d5db', fontSize: '1.1rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: 'gray' }}>
                    <th style={{ padding: '10px 0' }}>Lv.</th>
                    <th style={{ padding: '10px' }}>Move</th>
                  </tr>
                </thead>
                <tbody>
                  {levelMoves.length === 0 && <tr><td colSpan={2} style={{ padding: '20px', textAlign: 'center', color: 'gray' }}>No level up moves found.</td></tr>}
                  {levelMoves.map((m: any, idx: number) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px 0', fontWeight: 'bold', color: mainColor }}>{m.level === 0 ? 'Evo' : m.level}</td>
                      <td style={{ padding: '12px 10px', fontWeight: 'bold', textTransform: 'capitalize', color: 'white' }}>{m.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Machine/TM Moves */}
            <div style={{ background: '#1f2937', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Moves Learnt by TM/HM</h2>
              <table style={{ width: '100%', color: '#d1d5db', fontSize: '1.1rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: 'gray' }}>
                    <th style={{ padding: '10px' }}>Move</th>
                  </tr>
                </thead>
                <tbody>
                  {tmMoves.length === 0 && <tr><td style={{ padding: '20px', textAlign: 'center', color: 'gray' }}>No TM moves found.</td></tr>}
                  {tmMoves.map((m: any, idx: number) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px 10px', fontWeight: 'bold', textTransform: 'capitalize', color: 'white' }}>{m.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Egg Moves */}
            <div style={{ background: '#1f2937', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Egg Moves</h2>
              <table style={{ width: '100%', color: '#d1d5db', fontSize: '1.1rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: 'gray' }}>
                    <th style={{ padding: '10px' }}>Move</th>
                  </tr>
                </thead>
                <tbody>
                  {eggMoves.length === 0 && <tr><td style={{ padding: '20px', textAlign: 'center', color: 'gray' }}>No egg moves found.</td></tr>}
                  {eggMoves.map((m: any, idx: number) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px 10px', fontWeight: 'bold', textTransform: 'capitalize', color: 'white' }}>{m.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tutor Moves */}
            <div style={{ background: '#1f2937', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Tutor Moves</h2>
              <table style={{ width: '100%', color: '#d1d5db', fontSize: '1.1rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: 'gray' }}>
                    <th style={{ padding: '10px' }}>Move</th>
                  </tr>
                </thead>
                <tbody>
                  {tutorMoves.length === 0 && <tr><td style={{ padding: '20px', textAlign: 'center', color: 'gray' }}>No tutor moves found.</td></tr>}
                  {tutorMoves.map((m: any, idx: number) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px 10px', fontWeight: 'bold', textTransform: 'capitalize', color: 'white' }}>{m.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
