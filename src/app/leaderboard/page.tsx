"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const MODE_COLUMNS: Record<string, { label: string, key: string, color: string }[]> = {
  ranked: [
    { label: 'Elo', key: 'elo', color: '#10b981' },
    { label: 'Wins', key: 'wins', color: '#3b82f6' },
    { label: 'Losses', key: 'losses', color: '#ef4444' },
    { label: 'Streak', key: 'win_streak', color: '#f59e0b' },
    { label: 'Matches', key: 'total_matches', color: '#8b5cf6' },
  ],
  alphazone: [
    { label: 'Elo', key: 'elo', color: '#10b981' },
    { label: 'Kills', key: 'kills', color: '#ef4444' },
    { label: 'Deaths', key: 'deaths', color: '#6b7280' },
    { label: 'Wins', key: 'wins', color: '#3b82f6' },
    { label: 'Losses', key: 'losses', color: '#ef4444' },
  ],
  dungeon: [
    { label: 'Completed', key: 'dungeons_completed', color: '#10b981' },
    { label: 'Kills', key: 'dungeon_kills', color: '#ef4444' },
    { label: 'Deaths', key: 'dungeon_deaths', color: '#6b7280' },
    { label: 'Points', key: 'dungeon_points', color: '#3b82f6' },
  ],
  raid: [
    { label: 'Points', key: 'points', color: '#10b981' },
    { label: 'Won', key: 'total_raids_won', color: '#3b82f6' },
    { label: 'Damage', key: 'total_damage_dealt', color: '#ef4444' },
  ],
  battletower: [
    { label: 'Floor', key: 'highest_floor', color: '#10b981' },
    { label: 'Wins', key: 'total_wins', color: '#3b82f6' },
    { label: 'Losses', key: 'total_losses', color: '#ef4444' },
  ],
  pokedex: [
    { label: 'Caught', key: 'captures', color: '#10b981' },
  ]
};

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

  const activeColumns = MODE_COLUMNS[currentFetchMode] || [{ label: 'Score', key: sortBy, color: '#10b981' }];

  return (
    <div className="inner" style={{ paddingTop: '60px', paddingBottom: '80px', maxWidth: '1400px', margin: '0 auto', minHeight: '80vh', paddingLeft: '20px', paddingRight: '20px' }}>
      
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
      <div style={{ background: '#111827', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', boxShadow: '0 15px 50px rgba(0,0,0,0.6)', overflowX: 'auto' }}>
        
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
          <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.5)', color: 'gray', textTransform: 'uppercase', fontSize: '1.1rem', letterSpacing: '1px' }}>
                <th style={{ padding: '25px 30px', borderBottom: '2px solid rgba(255,255,255,0.05)', width: '10%' }}>Rank</th>
                <th style={{ padding: '25px 30px', borderBottom: '2px solid rgba(255,255,255,0.05)', width: '35%' }}>Player</th>
                {activeColumns.map(col => (
                  <th key={col.key} style={{ padding: '25px 20px', borderBottom: '2px solid rgba(255,255,255,0.05)', textAlign: 'center', color: 'white' }}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((player, index) => {
                
                const playerName = player.name || player.player_name || player.uuid || "Unknown Player";

                let rankIcon = null;
                let rowBg = 'transparent';
                let rankColor = 'gray';

                if (index === 0) {
                  rankIcon = <><span style={{ fontSize: '1.2rem', marginRight: '5px' }}>#1</span><i className="fa-solid fa-medal" style={{ color: '#fbbf24', fontSize: '2rem' }}></i></>;
                  rowBg = 'linear-gradient(90deg, rgba(251,191,36,0.1), transparent)';
                  rankColor = '#fbbf24';
                } else if (index === 1) {
                  rankIcon = <><span style={{ fontSize: '1.2rem', marginRight: '5px' }}>#2</span><i className="fa-solid fa-medal" style={{ color: '#9ca3af', fontSize: '2rem' }}></i></>;
                  rowBg = 'linear-gradient(90deg, rgba(156,163,175,0.1), transparent)';
                  rankColor = '#9ca3af';
                } else if (index === 2) {
                  rankIcon = <><span style={{ fontSize: '1.2rem', marginRight: '5px' }}>#3</span><i className="fa-solid fa-medal" style={{ color: '#b45309', fontSize: '2rem' }}></i></>;
                  rowBg = 'linear-gradient(90deg, rgba(180,83,9,0.1), transparent)';
                  rankColor = '#b45309';
                }

                const avatarUrl = player.socials?.image || `https://minotar.net/helm/${playerName}/60.png`;

                return (
                  <tr key={index} style={{ 
                    background: rowBg,
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    transition: 'background 0.2s',
                  }} className="leaderboard-row">
                    <td style={{ padding: '25px 30px', fontWeight: 'bold', color: rankColor, fontSize: index < 3 ? '1.5rem' : '1.3rem', display: 'flex', alignItems: 'center' }}>
                      {rankIcon || `#${index + 1}`}
                    </td>
                    <td style={{ padding: '25px 30px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <img src={avatarUrl} alt={playerName} style={{ width: '60px', height: '60px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = `https://minotar.net/helm/${playerName}/60.png`; }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        
                        {player.webUsername ? (
                          <Link href={`/profile/${player.webUsername}`} style={{ textDecoration: 'none' }}>
                            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', letterSpacing: '0.5px' }} className="hover-link">{playerName}</span>
                          </Link>
                        ) : (
                          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', letterSpacing: '0.5px' }}>{playerName}</span>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {player.socials?.discord && <i className="fa-brands fa-discord" style={{ color: '#5865F2', fontSize: '1.1rem' }} title="Discord Linked"></i>}
                          {player.socials?.youtube && <i className="fa-brands fa-youtube" style={{ color: '#FF0000', fontSize: '1.1rem' }} title="YouTube Linked"></i>}
                          {player.socials?.instagram && <i className="fa-brands fa-instagram" style={{ color: '#E1306C', fontSize: '1.1rem' }} title="Instagram Linked"></i>}
                          
                          {player.webUsername && (
                            <Link href={`/profile/${player.webUsername}`} style={{ textDecoration: 'none' }}>
                              <span style={{ fontSize: '0.75rem', background: '#3b82f622', color: '#60a5fa', padding: '3px 8px', borderRadius: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <i className="fa-solid fa-link"></i> VIEW PROFILE
                              </span>
                            </Link>
                          )}
                        </div>

                      </div>
                    </td>
                    
                    {activeColumns.map(col => {
                      const val = player[col.key] || 0;
                      return (
                        <td key={col.key} style={{ padding: '25px 20px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.4rem', color: col.color }}>
                          {val.toLocaleString()}
                        </td>
                      );
                    })}

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
        .hover-link:hover {
          color: #3b82f6 !important;
          text-decoration: underline;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
