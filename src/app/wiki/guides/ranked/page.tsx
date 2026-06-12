"use client";

import React from 'react';
import Link from 'next/link';

const TIERS = [
  { name: 'Iron 1-10', points: '1,000 - 1,900 pts', color: '#a0a0a0', rewards: [ { type: 'item', text: 'Exp Candy XL x2 + L x3' }, { type: 'bp', text: '+20 BP per level' }, { type: 'coin', text: '+2,000 Pokecoins per level' }, { type: 'key', text: 'CosmeticCrate (lvl 5 & 10)' }, { type: 'key', text: 'FusionCrate (lvl 10)' }, { type: 'pokemon', text: 'Crate: pokemon x2 (lvl 5, 10)' } ], note: 'Beginner tier - BP & coins start here!' },
  { name: 'Bronze 1-10', points: '2,100 - 3,900 pts', color: '#cd7f32', rewards: [ { type: 'item', text: 'Exp Candy XL x3 + L x3' }, { type: 'bp', text: '+35 BP per level' }, { type: 'coin', text: '+4,000 Pokecoins per level' }, { type: 'key', text: 'CosmeticCrate (lvl 1 & 10)' }, { type: 'key', text: 'FakemonCrate (lvl 5)' }, { type: 'pokemon', text: 'Crate: pokemon x2 (lvl 5, 10)' } ] },
  { name: 'Silver 1-10', points: '4,200 - 6,684 pts', color: '#c0c0c0', rewards: [ { type: 'item', text: 'Exp Candy XL x3 + Rare Candy x1' }, { type: 'bp', text: '+50 BP per level' }, { type: 'coin', text: '+8,000 Pokecoins per level' }, { type: 'key', text: 'FusionCrate (lvl 1 & 5)' }, { type: 'key', text: 'CosmeticCrate (lvl 5)' }, { type: 'key', text: 'FakemonCrate (lvl 10)' }, { type: 'pokemon', text: 'Crate: pokemon x2 (lvl 5 & 10)' } ] },
  { name: 'Gold 1-10', points: '7,300 - 11,800 pts', color: '#ffd700', rewards: [ { type: 'item', text: 'Exp Candy XL x4 + Rare Candy x2' }, { type: 'bp', text: '+75 BP per level' }, { type: 'coin', text: '+14,000 Pokecoins per level' }, { type: 'key', text: 'FakemonCrate (lvl 1 & 5)' }, { type: 'key', text: 'FusionCrate (lvl 5 & 10)' }, { type: 'key', text: 'LegendaryCrate (lvl 10)' }, { type: 'key', text: 'CosmeticCrate (lvl 10)' } ] },
  { name: 'Platinum 1-10', points: '12,300 - 18,600 pts', color: '#e5e4e2', rewards: [ { type: 'item', text: 'Exp Candy XL x3 + Rare Candy x2' }, { type: 'bp', text: '+10 BP per level' }, { type: 'key', text: 'pokemon (lvl 5 & 10)' }, { type: 'key', text: 'FakemonCrate (lvl 10)' } ] },
  { name: 'Diamond 1-10', points: '19,300 - 27,400 pts', color: '#b9f2ff', rewards: [ { type: 'item', text: 'Rare Candy x4' }, { type: 'bp', text: '+25 BP per level' }, { type: 'key', text: 'CosmeticCrate (lvl 5 & 10)' }, { type: 'key', text: 'FusionCrate (lvl 5 & 10)' }, { type: 'key', text: 'LegendaryCrate (lvl 10)' }, { type: 'key', text: 'GimmickStone (lvl 10)' } ] },
  { name: 'Master 1-10', points: '28,300 - 38,200 pts', color: '#b57edc', rewards: [ { type: 'item', text: 'Rare Candy x5 + Ability Capsule x1' }, { type: 'bp', text: '+50 BP per level' }, { type: 'key', text: 'CosmeticCrate x2 (lvl 5 & 10)' }, { type: 'key', text: 'FusionCrate (lvl 10)' }, { type: 'key', text: 'FakemonCrate (lvl 10)' }, { type: 'key', text: 'LegendaryCrate (lvl 10)' }, { type: 'key', text: 'GimmickStone (lvl 10)' } ] },
  { name: 'Grandmaster 1-10', points: '39,300 - 51,000 pts', color: '#ff4500', rewards: [ { type: 'item', text: 'Rare Candy x8 + Ability Patch x1' }, { type: 'bp', text: '+75 BP per level' }, { type: 'key', text: 'FusionCrate x2 (lvl 5 & 10)' }, { type: 'key', text: 'GimmickStone (lvl 5 & 10)' } ] },
  { name: 'Champion 1-10', points: '52,300 - 66,700 pts', color: '#ff6347', rewards: [ { type: 'item', text: 'Rare Candy x10 + Ability Patch x1 + Master Ball x1' }, { type: 'bp', text: '+100 BP per level' }, { type: 'key', text: 'CosmeticCrate x3 (lvl 5 & 10)' }, { type: 'key', text: 'LegendaryCrate (lvl 5 & 10)' }, { type: 'key', text: 'GimmickStone (lvl 10)' }, { type: 'key', text: 'pokemon_shiny (lvl 10)' } ] },
  { name: 'Legend 1-10', points: '68,300 - 85,400 pts', color: '#ff1493', rewards: [ { type: 'item', text: 'Rare Candy x12 + Ability Patch x2 + Master Ball x2' }, { type: 'bp', text: '+150 BP per level' }, { type: 'key', text: 'GimmickStone (lvl 5 & 10)' }, { type: 'key', text: 'FakemonCrate x3 (lvl 5 & 10)' }, { type: 'key', text: 'LegendaryCrate x2 (lvl 5 & 10)' }, { type: 'key', text: 'pokemon_shiny (lvl 5)' } ] },
  { name: 'Mythic 1-10', points: '87,300 - 107,100 pts', color: '#ff00ff', rewards: [ { type: 'item', text: 'Rare Candy x15 + Ability Patch x2 + Master Ball x2' }, { type: 'bp', text: '+200 BP per level' }, { type: 'key', text: 'CosmeticCrate x4 (lvl 5 & 10)' }, { type: 'key', text: 'GalacticCrate (lvl 5 & 10)' }, { type: 'key', text: 'pokemon_shiny (lvl 5)' } ] },
  { name: 'Divine 1-10', points: '109,300 - 132,700 pts', color: '#ffd700', rewards: [ { type: 'item', text: 'Rare Candy x15 + Ability Patch x3 + Master Ball x2' }, { type: 'bp', text: '+300 BP per level' }, { type: 'key', text: 'FusionCrate x4 (lvl 5 & 10)' }, { type: 'key', text: 'pokemon_paradox (lvl 5 & 10)' }, { type: 'key', text: 'pokemon_shiny (lvl 5)' } ] }
];

export default function RankedGuidePage() {
  const getBadgeStyle = (type: string) => {
    switch(type) {
      case 'key': return { background: 'rgba(76, 175, 80, 0.1)', color: '#4caf50', border: '1px solid #4caf50' };
      case 'item': return { background: 'rgba(65, 105, 225, 0.1)', color: '#87ceeb', border: '1px solid #4169e1' };
      case 'bp': return { background: 'rgba(255, 105, 180, 0.1)', color: '#ffb6c1', border: '1px solid #ff69b4' };
      case 'pokemon': return { background: 'rgba(218, 165, 32, 0.1)', color: '#ffd700', border: '1px solid #daa520' };
      case 'coin': return { background: 'rgba(184, 134, 11, 0.1)', color: '#ffd700', border: '1px solid #b8860b' };
      default: return { background: 'rgba(255, 255, 255, 0.1)', border: '1px solid #fff' };
    }
  };

  return (
    <div className="inner" style={{ paddingTop: '80px', paddingBottom: '60px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <img src="/images/features/teambattles.png" alt="ranked" className="guide-banner-img" style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "16px", marginBottom: "30px", boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }} />
      <h1 className="gradient-text" style={{ fontSize: '3rem', fontFamily: 'var(--font-display)', marginBottom: '10px' }}>Pokefun Ranked Battle Guide</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Compete in ranked PvP battles, climb tiers, and earn exclusive rewards including crate keys, Battle Points & Pokecoins!</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ background: 'var(--content-bg)', border: '1px solid #4caf50', borderRadius: '16px', padding: '25px' }}>
          <h3 style={{ color: '#4caf50', marginTop: 0, marginBottom: '15px', fontSize: '1.4rem' }}>How it Works</h3>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>Queue via <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', color: '#ffd700' }}>/ranked join</code> or the Ranked NPC</li>
            <li>Win matches to earn <b>Ranked Points</b> (ELO) and climb the ladder</li>
            <li>Each win: <b>+25 ELO</b> | Each loss: <b>-10 ELO</b></li>
            <li>Starting ELO: <b>1000</b></li>
            <li><b>15 tiers</b> (Iron to Transcendent) with <b>10 sub-levels</b> = <b>150 total levels!</b></li>
            <li>Clean point progression: each tier has a fixed step that grows</li>
            <li>Each level unlock gives <b>instant rewards</b></li>
          </ul>
        </div>

        <div style={{ background: 'var(--content-bg)', border: '1px solid #ff4500', borderRadius: '16px', padding: '25px' }}>
          <h3 style={{ color: '#ff4500', marginTop: 0, marginBottom: '15px', fontSize: '1.4rem' }}>Battle Points (BP)</h3>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>Earn <b>Battle Points</b> starting from <b>Iron tier</b></li>
            <li>BP amounts increase per tier: <b>5 BP to 500 BP</b> per level</li>
            <li><b>Pokecoins</b> also added from Iron tier onwards!</li>
            <li>Use BP in the Ranked Shop for exclusive items and keys</li>
            <li>Higher tiers = way more BP & coins to climb and earn big!</li>
          </ul>
        </div>
      </div>

      <h2 style={{ color: '#ffd700', borderBottom: '2px solid rgba(255, 215, 0, 0.3)', paddingBottom: '10px', marginBottom: '30px', fontSize: '2rem' }}>Complete Tier List & Rewards</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {TIERS.map((tier, index) => (
          <div key={index} style={{ background: 'var(--content-bg)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '25px', transition: 'all 0.3s ease' }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = tier.color; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = "0 8px 25px " + tier.color + "22"; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: tier.color }}>{tier.name}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '1rem', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '20px' }}>{tier.points}</span>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {tier.rewards.map((reward, i) => (
                <span key={i} style={{ ...getBadgeStyle(reward.type), padding: '4px 12px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 500 }}>
                  {reward.text}
                </span>
              ))}
            </div>
            {tier.note && <p style={{ color: 'var(--text-secondary)', marginTop: '12px', fontSize: '0.9rem', fontStyle: 'italic' }}>{tier.note}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
