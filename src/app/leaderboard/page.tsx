"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LeaderboardPage() {
  const [activeMainTab, setActiveMainTab] = useState('ranked');
  const [activeSubTab, setActiveSubTab] = useState('alphazone');
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');

  const mainTabs = [
    { id: 'ranked', label: 'Pokefun Ranked (elo)', icon: 'fa-trophy', color: '#f59e0b' },
    { id: 'other', label: 'Other Leaderboards', icon: 'fa-list-ul', color: '#3b82f6' }
  ];

  const subTabs = [
    { id: 'pokedex', label: 'Pokedex', icon: 'fa-book', color: '#10b981' },
    { id: 'dungeon', label: 'Dungeons', icon: 'fa-skull', color: '#8b5cf6' },
    { id: 'alphazone', label: 'AlphaZone', icon: 'fa-fire', color: '#ef4444' },
    { id: 'raid', label: 'Raids', icon: 'fa-meteor', color: '#ec4899' },
    { id: 'battletower', label: 'BattleTower', icon: 'fa-chess-rook', color: '#6366f1' },
  ];

  const currentFetchMode = activeMainTab === 'ranked' ? 'ranked' : activeSubTab;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?mode=${currentFetchMode}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLeaderboardData(data.data || []);
          setSortBy(data.sort);
        } else {
          setLeaderboardData([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLeaderboardData([]);
        setLoading(false);
      });
  }, [currentFetchMode]);

  return (
    <div className="inner" style={{ paddingTop: '60px', paddingBottom: '80px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '15px', color: 'white', textShadow: '0 0 25px rgba(255,255,255,0.2)' }}>
          <i className="fa-solid fa-crown" style={{ color: '#fbbf24', marginRight: '20px' }}></i>
          Server Leaderboards
        </h1>
        <p style={{ fontSize: '1.4rem', color: 'gray' }}>See who reigns supreme across all Pokefun game modes.</p>
      </div>

      {/* Main Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        {mainTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveMainTab(tab.id)}
            style={{
              padding: '16px 35px',
              borderRadius: '40px',
              border: activeMainTab === tab.id ? `3px solid ${tab.color}` : '3px solid transparent',
              background: activeMainTab === tab.id ? `${tab.color}22` : 'rgba(255,255,255,0.05)',
              color: activeMainTab === tab.id ? tab.color : '#d1d5db',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: '0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: activeMainTab === tab.id ? `0 0 20px ${tab.color}40` : 'none'
            }}
          >
            <i className={`fa-solid ${tab.icon}`}></i> {tab.label}
          </button>
        ))}
      </div>

      {/* Sub Tabs for Other Leaderboards */}
      {activeMainTab === 'other' && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px', flexWrap: 'wrap', animation: 'fadeIn 0.3s ease-out' }}>
          {subTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                padding: '12px 25px',
                borderRadius: '30px',
                border: activeSubTab === tab.id ? `2px solid ${tab.color}` : '2px solid transparent',
                background: activeSubTab === tab.id ? `${tab.color}22` : 'rgba(255,255,255,0.05)',
                color: activeSubTab === tab.id ? tab.color : 'gray',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseOver={e => { if(activeSubTab !== tab.id) e.currentTarget.style.color = 'white'; }}
              onMouseOut={e => { if(activeSubTab !== tab.id) e.currentTarget.style.color = 'gray'; }}
            >
              <i className={`fa-solid ${tab.icon}`}></i> {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Leaderboard Table Area */}
      <div style={{ background: '#111827', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', boxShadow: '0 15px 50px rgba(0,0,0,0.6)' }}>
        
        {loading ? (
          <div style={{ padding: '120px', textAlign: 'center', color: 'gray', fontSize: '1.4rem' }}>
            <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#3b82f6' }}></i>
            <br />Loading live stats from game servers...
          </div>
        ) : leaderboardData.length === 0 ? (
          <div style={{ padding: '100px', textAlign: 'center', color: 'gray' }}>
            <i className="fa-solid fa-ghost" style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.5 }}></i>
            <p style={{ fontSize: '1.4rem' }}>No data found for this category yet.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.5)', color: 'gray', textTransform: 'uppercase', fontSize: '1.1rem', letterSpacing: '2px' }}>
                <th style={{ padding: '25px 30px', borderBottom: '2px solid rgba(255,255,255,0.05)', width: '10%' }}>Rank</th>
                <th style={{ padding: '25px 30px', borderBottom: '2px solid rgba(255,255,255,0.05)', width: '50%' }}>Player</th>
                <th style={{ padding: '25px 30px', borderBottom: '2px solid rgba(255,255,255,0.05)', width: '20%', textAlign: 'right' }}>Score ({sortBy})</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((player, index) => {
                
                // Identify the player name column (usually name, player, or player_name)
                const playerName = player.name || player.player_name || player.uuid || "Unknown Player";
                const score = player[sortBy] || 0;

                let rankIcon = null;
                let rowBg = 'transparent';
                let rankColor = 'gray';

                if (index === 0) {
                  rankIcon = <i className="fa-solid fa-medal" style={{ color: '#fbbf24', fontSize: '2rem' }}></i>;
                  rowBg = 'linear-gradient(90deg, rgba(251,191,36,0.1), transparent)';
                  rankColor = '#fbbf24';
                } else if (index === 1) {
                  rankIcon = <i className="fa-solid fa-medal" style={{ color: '#9ca3af', fontSize: '2rem' }}></i>;
                  rowBg = 'linear-gradient(90deg, rgba(156,163,175,0.1), transparent)';
                  rankColor = '#9ca3af';
                } else if (index === 2) {
                  rankIcon = <i className="fa-solid fa-medal" style={{ color: '#b45309', fontSize: '2rem' }}></i>;
                  rowBg = 'linear-gradient(90deg, rgba(180,83,9,0.1), transparent)';
                  rankColor = '#b45309';
                }

                return (
                  <tr key={index} style={{ 
                    background: rowBg,
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    transition: 'background 0.2s',
                  }} className="leaderboard-row">
                    <td style={{ padding: '25px 30px', fontWeight: 'bold', color: rankColor, fontSize: index < 3 ? '1.5rem' : '1.3rem' }}>
                      {rankIcon || `#${index + 1}`}
                    </td>
                    <td style={{ padding: '25px 30px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <img src={`https://minotar.net/helm/${playerName}/60.png`} alt={playerName} style={{ width: '60px', height: '60px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }} onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + playerName; }} />
                      <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', letterSpacing: '0.5px' }}>{playerName}</span>
                    </td>
                    <td style={{ padding: '25px 30px', textAlign: 'right', fontWeight: 'bold', fontSize: '1.5rem', color: '#10b981' }}>
                      {score.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <style>{`
        .leaderboard-row:hover {
          background: rgba(255,255,255,0.08) !important;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
