"use client";

import React, { useState } from 'react';
import bosses from '@/data/cobblebosses.json';

const FILTERS = [
  { id: 'all', label: 'All Bosses' },
  { id: 'Cosmetic', label: 'Cosmetics' },
  { id: 'Fusion', label: 'Fusions' },
  { id: 'Spacemon', label: 'Spacemons' },
  { id: 'Laser', label: 'Lasermons' },
  { id: 'S-Tier', label: 'S-Tier' },
  { id: 'A-Tier', label: 'A-Tier' },
  { id: 'B-Tier', label: 'B-Tier' },
  { id: 'C-Tier', label: 'C-Tier' },
  { id: 'D-Tier', label: 'D-Tier' },
  { id: 'Mega', label: 'Mega Tier' },
  { id: 'Legendary', label: 'Legendary' },
  { id: 'Mythical', label: 'Mythical' }
];

export default function GuidePage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedBoss, setSelectedBoss] = useState<any>(null);

  const filteredBosses = bosses.filter(b => {
    const s = search.toLowerCase();
    const nameMatch = (b.nickname || '').toLowerCase().includes(s) || b.id.toLowerCase().includes(s);
    const speciesMatch = b.pokemons && b.pokemons.some(p => p.toLowerCase().includes(s));
    const aspectMatch = (b.properties || '').toLowerCase().includes(s);
    const matchesSearch = nameMatch || speciesMatch || aspectMatch;
    
    let matchesFilter = true;
    if (filter !== 'all') {
      matchesFilter = (b.tier || '').toLowerCase() === filter.toLowerCase();
    }
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="wiki-content-wrapper">
      <style dangerouslySetInnerHTML={{__html: `
        :root {
            --bg-color: transparent;
            --card-bg: rgba(255, 255, 255, 0.03);
            --card-border: rgba(255, 255, 255, 0.06);
            --accent-primary: #8b5cf6;
            --accent-secondary: #ec4899;
            --text-main: #f3f4f6;
            --text-muted: #9ca3af;
            --success: #10b981;
            --warning: #f59e0b;
        }
        .wiki-content-wrapper { color: var(--text-main); font-family: 'Outfit', sans-serif; }
        header { padding: 2.5rem 2rem 1.5rem 2rem; max-width: 1400px; margin: 0 auto; text-align: center; }
        .title { font-size: 3rem; font-weight: 800; background: linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #f43f5e 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.5rem; letter-spacing: -0.05em; }
        .subtitle { color: var(--text-muted); font-size: 1.1rem; margin-bottom: 2rem; font-weight: 300; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1.5rem; max-width: 1200px; margin: 0 auto 3rem auto; padding: 0 1rem; }
        .stat-card { background: rgba(255, 255, 255, 0.02); border: 1px solid var(--card-border); border-radius: 16px; padding: 1.5rem; text-align: center; backdrop-filter: blur(10px); }
        .stat-val { font-size: 2.2rem; font-weight: 700; color: #fff; background: linear-gradient(135deg, #fff 0%, #a78bfa 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .stat-lbl { font-size: 0.85rem; text-transform: uppercase; color: var(--text-muted); font-weight: 500; }
        .controls-container { max-width: 1400px; margin: 0 auto 2rem auto; padding: 0 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .search-input { width: 100%; padding: 1rem 1.5rem; font-size: 1rem; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--card-border); border-radius: 12px; color: #fff; outline: none; transition: all 0.3s ease; }
        .search-input:focus { border-color: var(--accent-primary); background: rgba(255, 255, 255, 0.05); }
        .filter-pills { display: flex; flex-wrap: wrap; gap: 0.6rem; justify-content: center; }
        .filter-pill { padding: 0.6rem 1.2rem; border-radius: 30px; font-size: 0.85rem; font-weight: 500; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--card-border); color: var(--text-muted); cursor: pointer; transition: all 0.2s ease; }
        .filter-pill.active { background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%); color: #fff; border-color: transparent; }
        .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 1.5rem; max-width: 1400px; margin: 0 auto 3rem auto; padding: 0 2rem; }
        .boss-card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 20px; padding: 1.5rem; cursor: pointer; transition: all 0.3s ease; display: flex; flex-direction: column; position: relative; overflow: hidden; }
        .boss-card:hover { transform: translateY(-8px); border-color: rgba(255, 255, 255, 0.15); box-shadow: 0 20px 40px -15px rgba(0,0,0,0.5); }
        .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
        .boss-name { font-size: 1.25rem; font-weight: 700; color: #fff; max-width: 70%; line-height: 1.2; }
        .tier-badge { padding: 0.3rem 0.75rem; border-radius: 8px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
        .card-details { display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.85rem; }
        .detail-row { display: flex; justify-content: space-between; }
        .detail-lbl { color: var(--text-muted); }
        .detail-val { color: #fff; font-weight: 500; }
        
        .tier-s { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
        .tier-a { background: rgba(192, 132, 252, 0.15); color: #c084fc; border: 1px solid rgba(192, 132, 252, 0.3); }
        .tier-b { background: rgba(96, 165, 250, 0.15); color: #60a5fa; border: 1px solid rgba(96, 165, 250, 0.3); }
        .tier-c { background: rgba(156, 163, 175, 0.15); color: #9ca3af; border: 1px solid rgba(156, 163, 175, 0.3); }
        .tier-d { background: rgba(209, 213, 219, 0.1); color: #cbd5e1; border: 1px solid rgba(209, 213, 219, 0.2); }
        .tier-cosmetic { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
        .tier-fusion { background: rgba(217, 70, 239, 0.15); color: #f472b6; border: 1px solid rgba(217, 70, 239, 0.3); }
        .tier-spacemon { background: rgba(45, 212, 191, 0.15); color: #2dd4bf; border: 1px solid rgba(45, 212, 191, 0.3); }
        .tier-laser { background: rgba(239, 68, 68, 0.15); color: #fb7185; border: 1px solid rgba(239, 68, 68, 0.3); }
        .tier-mega { background: rgba(139, 92, 246, 0.15); color: #a78bfa; border: 1px solid rgba(139, 92, 246, 0.3); }
        .tier-legendary { background: rgba(251, 146, 60, 0.15); color: #fb923c; border: 1px solid rgba(251, 146, 60, 0.3); }
        .tier-mythical { background: rgba(20, 184, 166, 0.15); color: #2dd4bf; border: 1px solid rgba(20, 184, 166, 0.3); }
        
        /* Drawer */
        .drawer-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); z-index: 100; opacity: 0; pointer-events: none; transition: opacity 0.3s; }
        .drawer-overlay.open { opacity: 1; pointer-events: auto; }
        .drawer { position: fixed; top: 0; right: -550px; width: 500px; max-width: 100%; height: 100vh; background: #0f172a; z-index: 101; transition: right 0.3s; padding: 2rem; overflow-y: auto; box-shadow: -10px 0 40px rgba(0,0,0,0.8); border-left: 1px solid rgba(255,255,255,0.1); }
        .drawer.open { right: 0; }
        .drawer-close-btn { position: absolute; top: 1.5rem; right: 1.5rem; background: rgba(255,255,255,0.05); border: 1px solid var(--card-border); border-radius: 50%; width: 36px; height: 36px; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .drawer-tname { font-size: 1.8rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem; }
        .drawer-section-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; margin-top: 1.5rem; text-transform: uppercase; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 0.5rem; display: flex; align-items: center; gap: 8px; }
        .poke-specs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.82rem; }
        .poke-spec { display: flex; justify-content: space-between; background: rgba(0,0,0,0.15); padding: 0.35rem 0.6rem; border-radius: 6px; }
        .poke-spec-lbl { color: var(--text-muted); }
        .poke-spec-val { color: #fff; font-weight: 500; }
        .reward-pill-large { display: flex; justify-content: space-between; padding: 0.8rem 1.2rem; border-radius: 12px; background: rgba(255,255,255,0.02); border: 1px solid var(--card-border); margin-bottom: 0.5rem; }
        .reward-item-row { display: flex; justify-content: space-between; padding: 0.6rem 1rem; background: rgba(255,255,255,0.01); border: 1px dashed rgba(255,255,255,0.06); border-radius: 10px; margin-bottom: 0.5rem; font-size: 0.85rem; }
      `}} />

      <header>
          <div className="title">PokéFun Boss Wiki</div>
          <div className="subtitle">Premium Interactive CobbleBosses Directory & Drop Database</div>
      </header>

      <div className="stats-grid">
          <div className="stat-card"><div className="stat-val">3097</div><div className="stat-lbl">Total Bosses</div></div>
          <div className="stat-card"><div className="stat-val">341</div><div className="stat-lbl">Cosmetic Bosses</div></div>
          <div className="stat-card"><div className="stat-val">25</div><div className="stat-lbl">Fusion Bosses</div></div>
          <div className="stat-card"><div className="stat-val">104</div><div className="stat-lbl">Spacemons</div></div>
          <div className="stat-card"><div className="stat-val">118</div><div className="stat-lbl">Lasermons</div></div>
      </div>

      <div className="controls-container">
          <div className="search-wrapper">
              <input type="text" className="search-input" placeholder="Search by name, tier, skin, aspect, or Pokémon species..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="filter-pills">
              {FILTERS.map(f => (
                <button key={f.id} className={`filter-pill ${filter === f.id ? 'active' : ''}`} onClick={() => setFilter(f.id)}>
                  {f.label}
                </button>
              ))}
          </div>
      </div>

      <div className="cards-grid">
          {filteredBosses.length === 0 ? (
            <div style={{gridColumn: '1/-1', textAlign:'center', color:'#9ca3af'}}>No bosses found matching your filters.</div>
          ) : (
            filteredBosses.map(b => (
              <div key={b.id} className="boss-card" onClick={() => setSelectedBoss(b)}>
                  <div className="card-header">
                      <div className="boss-name">{b.nickname || b.id}</div>
                      <span className={`tier-badge ${b.tier_class || ''}`}>{b.tier}</span>
                  </div>
                  <div className="card-details">
                      <div className="detail-row">
                          <span className="detail-lbl">Pokemon Species</span>
                          <span className="detail-val">{(b.pokemons||[]).join(', ')}</span>
                      </div>
                      <div className="detail-row">
                          <span className="detail-lbl">Level Range</span>
                          <span className="detail-val">{b.min_level} - {b.max_level}</span>
                      </div>
                      <div className="detail-row">
                          <span className="detail-lbl">Spawn Chance</span>
                          <span className="detail-val">{b.chance}%</span>
                      </div>
                  </div>
              </div>
            ))
          )}
      </div>

      <div className={`drawer-overlay ${selectedBoss ? 'open' : ''}`} onClick={() => setSelectedBoss(null)}></div>
      <div className={`drawer ${selectedBoss ? 'open' : ''}`}>
          <button className="drawer-close-btn" onClick={() => setSelectedBoss(null)}>&times;</button>
          
          {selectedBoss && (
            <>
              <div style={{marginTop: '1rem', marginBottom: '2rem'}}>
                  <div className="drawer-tname">{selectedBoss.nickname || selectedBoss.id}</div>
                  <div style={{display: 'flex', gap: '0.75rem', alignItems: 'center'}}>
                      <span className={`tier-badge ${selectedBoss.tier_class || ''}`}>{selectedBoss.tier}</span>
                      <span style={{color: '#9ca3af', fontSize: '0.9rem'}}>ID: <span style={{color: '#fff', fontWeight: 500}}>{selectedBoss.id}</span></span>
                  </div>
              </div>

              <div className="drawer-section-title">Boss Characteristics</div>
              <div className="poke-specs-grid">
                  <div className="poke-spec"><span className="poke-spec-lbl">Pokemons</span><span className="poke-spec-val">{(selectedBoss.pokemons||[]).join(', ')}</span></div>
                  <div className="poke-spec"><span className="poke-spec-lbl">Properties</span><span className="poke-spec-val">{selectedBoss.properties || 'None'}</span></div>
                  <div className="poke-spec"><span className="poke-spec-lbl">Spawn Chance</span><span className="poke-spec-val">{selectedBoss.chance}%</span></div>
                  <div className="poke-spec"><span className="poke-spec-lbl">Levels</span><span className="poke-spec-val">{selectedBoss.min_level === selectedBoss.max_level ? selectedBoss.min_level : `${selectedBoss.min_level} - ${selectedBoss.max_level}`}</span></div>
              </div>

              <div className="drawer-section-title">Rewards Database</div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                  <div className="reward-pill-large" style={{borderColor: 'rgba(251,191,36,0.2)', background: 'rgba(251,191,36,0.02)'}}>
                      <span style={{color: '#fbbf24', fontWeight: 600}}>Pokécoins Drop</span>
                      <span style={{color: '#fff', fontWeight: 700}}>{selectedBoss.pokecoins || 0}</span>
                  </div>
                  <div className="reward-pill-large" style={{borderColor: 'rgba(217,70,239,0.2)', background: 'rgba(217,70,239,0.02)'}}>
                      <span style={{color: '#f472b6', fontWeight: 600}}>Battle Points Drop</span>
                      <span style={{color: '#fff', fontWeight: 700}}>{selectedBoss.battlepoints || 0}</span>
                  </div>
                  
                  <div style={{fontWeight: 600, fontSize: '0.9rem', marginTop: '0.5rem', color: '#9ca3af'}}>Additional Loot Pool:</div>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                      {(selectedBoss.loot || []).map((l: any, i: number) => (
                        <div key={i} className="reward-item-row">
                            <span style={{color: '#f3f4f6'}}>{l.name}</span>
                            <span style={{background: 'rgba(16,185,129,0.15)', color: '#34d399', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600}}>
                                {l.chance}%
                            </span>
                        </div>
                      ))}
                  </div>
              </div>
            </>
          )}
      </div>
    </div>
  );
}
