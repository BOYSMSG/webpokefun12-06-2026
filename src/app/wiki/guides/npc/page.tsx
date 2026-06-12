"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import trainersData from '@/data/trainersData.json';

const CATEGORIES = [
  'All', 'Gyms', 'Starter Tier', 'EV HP', 'EV Attack', 'EV Defense', 'EV Speed',
  'Mega Tier', 'Fusion Tier', 'Cosmetic Tier', 'Paradox Tier',
  'F-Tier', 'E-Tier', 'D-Tier', 'C-Tier', 'B-Tier', 'A-Tier', 'S-Tier',
  'Legendary', 'Mythical', 'Unbeatable', 'Other'
];

export default function NpcGuidePage() {
  const [activeTab, setActiveTab] = useState<'npcs' | 'evs' | 'gyms' | 'warps'>('npcs');
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedNpc, setSelectedNpc] = useState<any>(null);

  const filteredNpcs = trainersData.filter(t => {
    if (filter !== 'All' && t.category !== filter) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const evTrainers = trainersData.filter(t => t.category.startsWith('EV '));
  const gymTrainers = trainersData.filter(t => t.category === 'Gyms');

  return (
    <div className="inner" style={{ paddingTop: '10px', paddingBottom: '60px' }}>
      <div style={{ textAlign: 'center', marginBottom: '10px', color: 'white' }}>
        <img src="/images/features/image13_customeforms.png" alt="npc" className="guide-banner-img" style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "16px", marginBottom: "30px", boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }} />
      <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '15px' }}>Pokefun Master Wiki</h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>The complete guide to NPCs, Gyms, EV Training, and Warps.</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px', flexWrap: 'wrap' }}>
        {['npcs', 'gyms', 'evs', 'warps'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            style={{
              padding: '12px 24px',
              borderRadius: '30px',
              border: '1px solid #dddddd',
              background: activeTab === tab ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' : '#ffffff',
              color: activeTab === tab ? '#ffffff' : '#333333',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: activeTab === tab ? '0 4px 15px rgba(139, 92, 246, 0.3)' : 'none'
            }}
          >
            {tab === 'npcs' ? 'NPC Database' : tab === 'gyms' ? 'Gym Guide' : tab === 'evs' ? 'EV Training' : 'Warps Directory'}
          </button>
        ))}
      </div>

      {activeTab === 'npcs' && (
        <>
          <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto 40px' }}>
            <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#666666' }} size={20} />
            <input 
              type="text" 
              placeholder="Search NPCs by name, ID, or Tier..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '15px 20px 15px 45px', borderRadius: '12px', background: '#f0f0f0', border: '1px solid #dddddd', fontSize: '1rem', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '40px' }}>
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                style={{ padding: '12px 24px', borderRadius: '30px', background: filter === cat ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' : '#f0f0f0', border: filter === cat ? 'none' : '1px solid #dddddd', color: filter === cat ? '#fff' : '#666666', cursor: 'pointer', fontSize: '1.6rem', transition: 'all 0.2s', fontWeight: 600 }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {filteredNpcs.map(npc => (
              <div 
                key={npc.id} 
                onClick={() => setSelectedNpc(npc)}
                style={{ background: '#ffffff', border: '1px solid #f0f0f0', borderRadius: '16px', padding: '20px', cursor: 'pointer', transition: 'transform 0.2s, borderColor 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#f0f0f0'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{npc.name}</h3>
                  <span style={{ background: 'rgba(139,92,246,0.15)', color: '#c084fc', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>{npc.category}</span>
                </div>
                <div style={{ color: '#666666', fontSize: '0.9rem', marginBottom: '15px' }}>Warp: {npc.warp}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>💰 {npc.money}</span>
                  <span>⚔️ BP: {npc.bp}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'evs' && (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ background: '#ffffff', border: '1px solid #f0f0f0', borderRadius: '16px', padding: '30px', marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--accent-primary)', marginBottom: '15px' }}>EV Training Guide</h2>
            <p style={{ color: '#666666', lineHeight: 1.6 }}>EV (Effort Value) Training is the fastest way to make your Pokemon stronger in specific stats! Battling these trainers guarantees you earn the EVs you need.</p>
            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>{evTrainers.length}</div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>Total EV Trainers Available</div>
                <div style={{ color: '#666666' }}>No Cooldowns! Battle as much as you want.</div>
              </div>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #f0f0f0', borderRadius: '16px', padding: '30px' }}>
            <h2 style={{ color: 'var(--accent-primary)', marginBottom: '20px' }}>EV Trainer Locations</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #dddddd' }}>
                    <th style={{ padding: '15px 10px', color: '#666666' }}>Trainer Name</th>
                    <th style={{ padding: '15px 10px', color: '#666666' }}>Stat Trained</th>
                    <th style={{ padding: '15px 10px', color: '#666666' }}>Warp Command</th>
                  </tr>
                </thead>
                <tbody>
                  {evTrainers.map(t => (
                    <tr key={t.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '15px 10px', fontWeight: 600 }}>{t.name} <span style={{ fontSize: '0.8rem', color: '#666666' }}>({t.id})</span></td>
                      <td style={{ padding: '15px 10px', color: '#ef4444', fontWeight: 700 }}>{t.category.replace('EV ', '')}</td>
                      <td style={{ padding: '15px 10px' }}><span style={{ background: 'rgba(139,92,246,0.15)', color: '#c084fc', padding: '6px 12px', borderRadius: '6px', fontFamily: 'monospace' }}>{t.warp}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'gyms' && (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ background: '#ffffff', border: '1px solid #f0f0f0', borderRadius: '16px', padding: '30px', marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--accent-primary)', marginBottom: '15px' }}>The Gym Challenge</h2>
            <p style={{ color: '#666666', lineHeight: 1.6 }}>
              Gyms are scattered throughout the open world. You must find them and challenge their leaders in order to collect all the badges. Badges unlock new tiers in the shop and allow you to command higher-level Pokemon.
            </p>

            <div style={{ marginTop: "40px" }}>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "20px", color: "var(--accent-cyan)" }}>Gym Progression Flow</h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ background: "rgba(0,0,0,0.03)", padding: "20px", borderRadius: "12px", borderLeft: "4px solid var(--accent-cyan)" }}>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "10px", color: "var(--text-color)" }}>1. Gain Required Total Wins</h3>
                  <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", margin: 0 }}>
                    Before entering a Gym, you must prove yourself against regular trainers on the map (like F-Tier or E-Tier).
                  </p>
                </div>

                <div style={{ background: "rgba(0,0,0,0.03)", padding: "20px", borderRadius: "12px", borderLeft: "4px solid var(--accent-cyan)" }}>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "10px", color: "var(--text-color)" }}>2. Defeat the Gym Entrance Trainers</h3>
                  <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", margin: 0 }}>
                    Once you meet the Total Wins requirement, the Gym unlocks! Inside, you must defeat the 3 Entrance Trainers (NPCs).
                  </p>
                </div>

                <div style={{ background: "rgba(0,0,0,0.03)", padding: "20px", borderRadius: "12px", borderLeft: "4px solid var(--accent-cyan)" }}>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "10px", color: "var(--text-color)" }}>3. Challenge the Sub Gym Leader (NPC)</h3>
                  <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", margin: 0 }}>
                    After taking out all 3 Entrance Trainers, the Sub Gym Leader will accept your challenge.
                    <br /><br />
                    Defeating this NPC is crucial. They will reward you with a special 1st Generation Pokemon Item which acts as your Official Gym Pass!
                    <br /><br />
                    <strong style={{ color: "var(--accent-gold)" }}>NPC Lv 100 | Player Max Lv 70</strong>
                  </p>
                </div>

                <div style={{ background: "rgba(0,0,0,0.03)", padding: "20px", borderRadius: "12px", borderLeft: "4px solid var(--accent-cyan)" }}>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "10px", color: "var(--text-color)" }}>4. Battle the REAL Gym Leader (Player)</h3>
                  <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", margin: 0 }}>
                    Take the Pass (Special Item) you just earned and give it to the REAL PLAYER Gym Leader! (Give gym leader entrance fee - on discord you can check those details). 
                    <br /><br />
                    Defeat them in a true PvP battle to earn your Gym Badge and top-tier rewards!
                  </p>
                </div>
              </div>

              <div style={{ marginTop: "40px", padding: "20px", background: "rgba(236, 72, 153, 0.1)", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(236, 72, 153, 0.3)" }}>
                <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--accent-secondary)", marginBottom: "10px" }}>Elite 4 Coming Soon...</h2>
                <p style={{ color: "var(--text-secondary)", margin: 0 }}>Prepare your strongest teams. The ultimate challenge awaits.</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {gymTrainers.map(gym => (
              <div 
                key={gym.id} 
                onClick={() => setSelectedNpc(gym)}
                style={{ background: '#ffffff', border: '1px solid #f0f0f0', borderRadius: '16px', padding: '20px', cursor: 'pointer', transition: 'transform 0.2s, borderColor 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#f0f0f0'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{gym.name}</h3>
                </div>
                <div style={{ color: '#666666', fontSize: '0.9rem', marginBottom: '15px' }}>
                  <span style={{ color: '#c084fc', fontFamily: 'monospace' }}>{gym.warp}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '10px' }}>
                  <span>💰 {gym.money}</span>
                  <span>⚔️ BP: {gym.bp}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {gym.pokemon.map((p: string, i: number) => (
                    <span key={i} style={{ background: '#f0f0f0', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem', border: '1px solid #dddddd' }}>{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'warps' && (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ background: '#ffffff', border: '1px solid #f0f0f0', borderRadius: '16px', padding: '30px' }}>
            <h2 style={{ color: 'var(--accent-primary)', marginBottom: '20px' }}>Important Warps Directory</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px' }}>
                <h3 style={{ marginBottom: '10px',  }}>Training Warps</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#666666', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <li><span style={{ color: '#c084fc', fontFamily: 'monospace' }}>/warp ev_training25</span> - Low Level EV</li>
                  <li><span style={{ color: '#c084fc', fontFamily: 'monospace' }}>/warp ev_training50</span> - Mid Level EV</li>
                  <li><span style={{ color: '#c084fc', fontFamily: 'monospace' }}>/warp ev_training100</span> - Max Level EV</li>
                </ul>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px' }}>
                <h3 style={{ marginBottom: '10px',  }}>Progression Warps</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#666666', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <li><span style={{ color: '#c084fc', fontFamily: 'monospace' }}>/warp tier_f</span> - Beginner Trainers</li>
                  <li><span style={{ color: '#c084fc', fontFamily: 'monospace' }}>/warp tier_a</span> - Advanced Trainers</li>
                  <li><span style={{ color: '#c084fc', fontFamily: 'monospace' }}>/warp gym_normal</span> - Normal Gym</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedNpc && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setSelectedNpc(null)}>
          <div style={{ background: '#111827', border: '1px solid #dddddd', borderRadius: '20px', width: '100%', maxWidth: '500px', padding: '30px', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedNpc(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#666666', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            <h2 style={{ marginBottom: '5px', fontSize: '1.8rem' }}>{selectedNpc.name}</h2>
            <div style={{ color: '#666666', marginBottom: '20px' }}>Warp: {selectedNpc.warp}</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                <span style={{ color: '#666666' }}>Category / Tier</span>
                <span style={{ fontWeight: 600 }}>{selectedNpc.category}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                <span style={{ color: '#666666' }}>Warp Command</span>
                <span style={{ color: '#c084fc', fontFamily: 'monospace' }}>{selectedNpc.warp}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                <span style={{ color: '#666666' }}>Cooldown</span>
                <span style={{ fontWeight: 600 }}>{selectedNpc.cooldown} Hours</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                <span style={{ color: '#666666' }}>Rewards</span>
                <span style={{ fontWeight: 600 }}>💰 {selectedNpc.money} | ⚔️ {selectedNpc.bp} BP</span>
              </div>
              {selectedNpc.items && (
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                  <span style={{ color: '#666666' }}>Item Drops</span>
                  <span style={{ fontWeight: 600, color: '#10b981', textAlign: 'right' }}>{selectedNpc.items}</span>
                </div>
              )}
            </div>
            
            <h3 style={{ marginTop: '25px', marginBottom: '15px', color: 'var(--accent-primary)' }}>Pokemon Team</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {selectedNpc.pokemon.map((p: string, i: number) => (
                <span key={i} style={{ background: '#f0f0f0', padding: '6px 16px', borderRadius: '20px', fontSize: '0.9rem', border: '1px solid #dddddd' }}>{p}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
