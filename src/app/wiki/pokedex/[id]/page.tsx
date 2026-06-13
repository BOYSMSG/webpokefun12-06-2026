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

const ALL_TYPES = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'];

const EvolutionNode = ({ node }: { node: any }) => {
  const speciesId = node.species.url.split('/').filter(Boolean).pop();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      <Link href={`/wiki/pokedex/${speciesId}`} style={{ textDecoration: 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', transition: 'transform 0.2s', width: '100px' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
          <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesId}.png`} alt={node.species.name} style={{ width: '60px', height: '60px', filter: 'drop-shadow(0 5px 5px rgba(0,0,0,0.3))' }} />
          <span style={{ color: 'white', fontWeight: 'bold', textTransform: 'capitalize', fontSize: '0.8rem' }}>{node.species.name}</span>
        </div>
      </Link>
      
      {node.evolves_to.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {node.evolves_to.map((child: any, idx: number) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <i className="fa-solid fa-arrow-right" style={{ color: 'gray', fontSize: '1.2rem' }}></i>
              <EvolutionNode node={child} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function PokemonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  const [pokemon, setPokemon] = useState<any>(null);
  const [species, setSpecies] = useState<any>(null);
  const [weaknesses, setWeaknesses] = useState<Record<string, number>>({});
  const [evolutionChain, setEvolutionChain] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        const typePromises = pokeData.types.map((t: any) => fetch(t.type.url).then(res => res.json()));
        const typesData = await Promise.all(typePromises);
        
        const damageRelations: Record<string, number> = {};
        typesData.forEach((typeData: any) => {
          const relations = typeData.damage_relations;
          relations.double_damage_from.forEach((t: any) => damageRelations[t.name] = (damageRelations[t.name] ?? 1) * 2);
          relations.half_damage_from.forEach((t: any) => damageRelations[t.name] = (damageRelations[t.name] ?? 1) * 0.5);
          relations.no_damage_from.forEach((t: any) => damageRelations[t.name] = 0);
        });
        
        // Fill in missing types as 1x
        ALL_TYPES.forEach(t => {
          if (damageRelations[t] === undefined) damageRelations[t] = 1;
        });

        setWeaknesses(damageRelations);

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

  const playCry = () => {
    const cryUrl = pokemon?.cries?.legacy || pokemon?.cries?.latest;
    if (cryUrl) {
      const audio = new Audio(cryUrl);
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

  const flavorTextEntry = species?.flavor_text_entries?.find((f: any) => f.language.name === 'en');
  const description = flavorTextEntry ? flavorTextEntry.flavor_text.replace(/\f/g, ' ') : "No description available.";

  // Level up moves
  const levelUpMoves = pokemon.moves
    .filter((m: any) => m.version_group_details.some((v: any) => v.move_learn_method.name === 'level-up'))
    .map((m: any) => {
      const details = m.version_group_details.find((v: any) => v.move_learn_method.name === 'level-up');
      return { name: m.move.name.replace('-', ' '), level: details.level_learned_at };
    })
    .sort((a: any, b: any) => a.level - b.level);

  const uniqueLevelMoves = Array.from(new Map(levelUpMoves.map((item: any) => [item.name, item])).values());

  // TM moves
  const tmMoves = pokemon.moves
    .filter((m: any) => m.version_group_details.some((v: any) => v.move_learn_method.name === 'machine'))
    .map((m: any) => ({ name: m.move.name.replace('-', ' ') }))
    .sort((a: any, b: any) => a.name.localeCompare(b.name));

  const uniqueTmMoves = Array.from(new Map(tmMoves.map((item: any) => [item.name, item])).values());

  return (
    <div style={{ minHeight: '100vh', background: '#111827', width: '100%' }}>
      <div style={{ height: '350px', background: `linear-gradient(to bottom, ${mainColor}40, transparent)`, position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 0 }}></div>
      
      <div className="inner" style={{ paddingTop: '100px', paddingBottom: '80px', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1, paddingLeft: '20px', paddingRight: '20px' }}>
        
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
          <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Dex Entry */}
            <div>
              <h2 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '15px' }}>Pokédex Entry</h2>
              <p style={{ color: '#d1d5db', fontSize: '1.2rem', lineHeight: '1.6', background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '20px', borderLeft: `4px solid ${mainColor}` }}>
                "{description}"
              </p>
            </div>

            {/* Abilities & Items Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '15px' }}>Abilities</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {pokemon.abilities.map((a: any) => (
                    <div key={a.ability.name} style={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.05)', padding: '15px 20px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'white', fontSize: '1.1rem', fontWeight: 'bold', textTransform: 'capitalize' }}>
                        {a.ability.name.replace('-', ' ')}
                      </span>
                      {a.is_hidden && <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '3px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold' }}>Hidden</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '15px' }}>Held Items</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {pokemon.held_items.length === 0 ? (
                    <div style={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.05)', padding: '15px 20px', borderRadius: '15px', color: 'gray' }}>
                      No held items.
                    </div>
                  ) : pokemon.held_items.map((i: any) => (
                    <div key={i.item.name} style={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.05)', padding: '15px 20px', borderRadius: '15px' }}>
                      <span style={{ color: 'white', fontSize: '1.1rem', fontWeight: 'bold', textTransform: 'capitalize' }}>
                        {i.item.name.replace('-', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Type Effectiveness (Bulbapedia Style) */}
            <div>
              <h2 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '5px' }}>Type Effectiveness</h2>
              <p style={{ color: 'gray', marginBottom: '15px' }}>Under normal battle conditions, this Pokémon is:</p>
              
              <div style={{ background: '#1f2937', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {(() => {
                  const normal = ALL_TYPES.filter(t => (weaknesses[t] ?? 1) === 1);
                  const weak = ALL_TYPES.filter(t => (weaknesses[t] ?? 1) > 1).sort((a, b) => (weaknesses[b] ?? 1) - (weaknesses[a] ?? 1));
                  const resistant = ALL_TYPES.filter(t => (weaknesses[t] ?? 1) > 0 && (weaknesses[t] ?? 1) < 1).sort((a, b) => (weaknesses[b] ?? 1) - (weaknesses[a] ?? 1));
                  const immune = ALL_TYPES.filter(t => (weaknesses[t] ?? 1) === 0);

                  const renderGroup = (title: string, types: string[]) => (
                    <div>
                      <h3 style={{ color: 'gray', fontSize: '1.1rem', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px' }}>{title}</h3>
                      {types.length === 0 ? (
                        <span style={{ color: 'white', fontWeight: 'bold' }}>None</span>
                      ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                          {types.map(type => {
                            const mult = weaknesses[type] ?? 1;
                            let badgeColor = '#6b7280'; // 1x gray
                            if (mult === 4) badgeColor = '#dc2626'; // Red
                            else if (mult === 2) badgeColor = '#f87171'; // Light red
                            else if (mult === 0.5) badgeColor = '#34d399'; // Light green
                            else if (mult === 0.25) badgeColor = '#10b981'; // Green
                            else if (mult === 0) badgeColor = '#111827'; // Black
                            
                            let multStr = `${mult}×`;
                            if (mult === 0.5) multStr = '½×';
                            if (mult === 0.25) multStr = '¼×';
                            if (mult === 0) multStr = '0×';
                            
                            return (
                              <div key={type} style={{ background: TYPE_COLORS[type], borderRadius: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid rgba(0,0,0,0.2)', width: '110px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                                <span style={{ color: 'white', padding: '6px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                                  {type}
                                </span>
                                <div style={{ background: badgeColor, color: 'white', textAlign: 'center', padding: '4px', fontSize: '0.9rem', fontWeight: 900 }}>
                                  {multStr}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );

                  return (
                    <>
                      {renderGroup('Weak to:', weak)}
                      {renderGroup('Damaged normally by:', normal)}
                      {renderGroup('Resistant to:', resistant)}
                      {renderGroup('Immune to:', immune)}
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Evolution Chain */}
            {evolutionChain && (
              <div>
                <h2 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '15px' }}>Evolution Chain</h2>
                <div style={{ background: '#1f2937', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto' }}>
                  <EvolutionNode node={evolutionChain} />
                </div>
              </div>
            )}

            {/* Base Stats */}
            <div>
              <h2 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '15px' }}>Base Stats</h2>
              <div style={{ background: '#1f2937', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {pokemon.stats.map((s: any) => {
                  const statName = s.stat.name.toUpperCase().replace('SPECIAL-ATTACK', 'SP. ATK').replace('SPECIAL-DEFENSE', 'SP. DEF');
                  const maxStat = 255;
                  const percentage = (s.base_stat / maxStat) * 100;
                  
                  let barColor = '#ef4444';
                  if (s.base_stat > 60) barColor = '#f59e0b';
                  if (s.base_stat > 90) barColor = '#10b981';
                  if (s.base_stat > 120) barColor = '#3b82f6';

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

            {/* Moves List */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '15px' }}>Level Up Moves</h2>
                <div style={{ background: '#1f2937', padding: '10px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', maxHeight: '400px', overflowY: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                        <th style={{ padding: '15px', color: 'gray', width: '60px' }}>Lv.</th>
                        <th style={{ padding: '15px', color: 'gray' }}>Move Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(uniqueLevelMoves as any[]).map((move: any, index: number) => (
                        <tr key={index} style={{ borderBottom: index === uniqueLevelMoves.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '15px', fontWeight: 'bold', color: mainColor }}>{move.level === 0 ? 'Evo' : move.level}</td>
                          <td style={{ padding: '15px', textTransform: 'capitalize', fontWeight: 'bold' }}>{move.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h2 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '15px' }}>TM Moves</h2>
                <div style={{ background: '#1f2937', padding: '10px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', maxHeight: '400px', overflowY: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                        <th style={{ padding: '15px', color: 'gray' }}>Move Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uniqueTmMoves.length === 0 && <tr><td style={{ padding: '15px', color: 'gray', textAlign: 'center' }}>No TMs found.</td></tr>}
                      {(uniqueTmMoves as any[]).map((move: any, index: number) => (
                        <tr key={index} style={{ borderBottom: index === uniqueTmMoves.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '15px', textTransform: 'capitalize', fontWeight: 'bold' }}>{move.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
