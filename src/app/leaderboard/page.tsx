"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('ranked');
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');

  const tabs = [
    { id: 'ranked', label: 'Ranked PvP', icon: 'fa-trophy', color: '#f59e0b' },
    { id: 'alphazone', label: 'AlphaZone', icon: 'fa-fire', color: '#ef4444' },
    { id: 'dungeon', label: 'Dungeons', icon: 'fa-skull', color: '#8b5cf6' },
  ];

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?mode=${activeTab}`)
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
  }, [activeTab]);

  return (
    <div className="inner" style={{ paddingTop: '40px', paddingBottom: '60px', maxWidth: '1000px', margin: '0 auto', minHeight: '80vh' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '10px', color: 'white', textShadow: '0 0 20px rgba(255,255,255,0.2)' }}>
          <i className="fa-solid fa-crown" style={{ color: '#fbbf24', marginRight: '15px' }}></i>
          Server Leaderboards
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'gray' }}>See who reigns supreme across all Pokefun game modes.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 25px',
              borderRadius: '30px',
              border: activeTab === tab.id ? `2px solid ${tab.color}` : '2px solid transparent',
              background: activeTab === tab.id ? `${tab.color}22` : 'rgba(255,255,255,0.05)',
              color: activeTab === tab.id ? tab.color : '#d1d5db',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: '0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <i className={`fa-solid ${tab.icon}`}></i> {tab.label}
          </button>
        ))}
      </div>

      {/* Leaderboard Table Area */}
      <div style={{ background: '#111827', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
        
        {loading ? (
          <div style={{ padding: '100px', textAlign: 'center', color: 'gray', fontSize: '1.2rem' }}>
            <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '2rem', marginBottom: '15px', color: '#3b82f6' }}></i>
            <br />Loading live stats from game servers...
          </div>
        ) : leaderboardData.length === 0 ? (
          <div style={{ padding: '80px', textAlign: 'center', color: 'gray' }}>
            <i className="fa-solid fa-ghost" style={{ fontSize: '3rem', marginBottom: '15px', opacity: 0.5 }}></i>
            <p>No data found for this category yet.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.4)', color: 'gray', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>
                <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', width: '10%' }}>Rank</th>
                <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', width: '50%' }}>Player</th>
                <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', width: '20%', textAlign: 'right' }}>Score ({sortBy})</th>
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
                  rankIcon = <i className="fa-solid fa-medal" style={{ color: '#fbbf24', fontSize: '1.5rem' }}></i>;
                  rowBg = 'linear-gradient(90deg, rgba(251,191,36,0.1), transparent)';
                  rankColor = '#fbbf24';
                } else if (index === 1) {
                  rankIcon = <i className="fa-solid fa-medal" style={{ color: '#9ca3af', fontSize: '1.5rem' }}></i>;
                  rowBg = 'linear-gradient(90deg, rgba(156,163,175,0.1), transparent)';
                  rankColor = '#9ca3af';
                } else if (index === 2) {
                  rankIcon = <i className="fa-solid fa-medal" style={{ color: '#b45309', fontSize: '1.5rem' }}></i>;
                  rowBg = 'linear-gradient(90deg, rgba(180,83,9,0.1), transparent)';
                  rankColor = '#b45309';
                }

                return (
                  <tr key={index} style={{ 
                    background: rowBg,
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    transition: 'background 0.2s',
                  }} className="leaderboard-row">
                    <td style={{ padding: '20px', fontWeight: 'bold', color: rankColor, fontSize: index < 3 ? '1.2rem' : '1rem' }}>
                      {rankIcon || `#${index + 1}`}
                    </td>
                    <td style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <img src={`https://minotar.net/helm/${playerName}/40.png`} alt={playerName} style={{ width: '40px', height: '40px', borderRadius: '8px' }} onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + playerName; }} />
                      <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'white' }}>{playerName}</span>
                    </td>
                    <td style={{ padding: '20px', textAlign: 'right', fontWeight: 'bold', fontSize: '1.2rem', color: '#10b981' }}>
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
          background: rgba(255,255,255,0.05) !important;
        }
      `}</style>
    </div>
  );
}
