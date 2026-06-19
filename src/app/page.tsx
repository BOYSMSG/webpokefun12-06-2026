"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function HomePage() {
  const [playerCount, setPlayerCount] = useState<number | null>(null);
  const [storeConfig, setStoreConfig] = useState<any>(null);

  useEffect(() => {
    fetch("https://api.mcsrvstat.us/3/play.pokefun.in")
      .then(res => res.json())
      .then(data => {
        if (data.online) {
          setPlayerCount(data.players.online);
        } else {
          setPlayerCount(0);
        }
      })
      .catch(() => setPlayerCount(0));

    fetch('/api/store-config')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.config) {
          setStoreConfig(data.config);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="p-body-inner" style={{ display: "flex", alignItems: "center", justifyContent: "center", maxWidth: "1200px", margin: "0 auto", color: "white", gap: "60px", position: "relative", zIndex: 10 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "20px", justifyContent: "flex-end" }}>
              <Link id="store" href="/store" className="info-card" style={{ display: "flex", alignItems: "center", gap: "30px", textDecoration: "none", color: "white", fontWeight: 900 }}>
                  <i className="fa-solid fa-cart-shopping"></i>
                  <div className="info-text">
                      <div className="if-large">STORE <span className="count" style={{ background: '#f59e0b' }}>SHOP</span></div>
                      <div className="if-small">Browse Ranks & Items</div>
                  </div>
              </Link>
              <div id="players" className="info-card" style={{ display: "flex", alignItems: "center", gap: "30px", color: "white", fontWeight: 900 }}>
                  <i className="fa-regular fa-circle-play"></i>
                  <div className="info-text">
                      <div className="if-large">PLAYERS <span className="count">{playerCount !== null ? playerCount : "..."}</span></div>
                      <div className="if-small">play.pokefun.in</div>
                  </div>
              </div>
          </div>
          <div id="logo">
              <a href="/">
                  <img className="animate__infinite animate__slower animate__animated animate__pulse" src="/images/pokefun_logo.jpg" alt="Pokefun" />
              </a>
              <div className="circle">
                  <div className="circle"></div>
              </div>
          </div>
          <a id="discord" target="_blank" href="https://discord.gg/NtE8QBkmwR" className="info-card" style={{ flex: 1, display: "flex", alignItems: "center", gap: "30px", justifyContent: "flex-start", textDecoration: "none", color: "white", fontWeight: 900 }}>
              <i className="fa-brands fa-discord"></i>
              <div className="info-text">
                  <div className="if-large">DISCORD <span className="count">JOIN</span></div>
                  <div className="if-small">Join the Community</div>
              </div>
          </a>
      </div>
      <div className="custom-shape-divider-bottom-1675067978 custom-shadow" style={{ position: "relative", zIndex: 10, marginTop: "-120px", width: "100vw", marginLeft: "calc(-50vw + 50%)" }}>
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
          </svg>
      </div>
      <div className="custom-shape-divider-bottom-1675067978" style={{ position: "relative", zIndex: 10, marginTop: "-120px", width: "100vw", marginLeft: "calc(-50vw + 50%)" }}>
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
          </svg>
      </div>
      <div id="tsparticles" style={{ zIndex: 1 }}></div>

      <main id="site-main" className="site-main outer" style={{ position: "relative", zIndex: 10 }}>
          <div className="inner posts">

              {/* ALL EPIC FEATURES */}
              <div className="inner" style={{ marginTop: "60px", marginBottom: "60px" }}>
                  <div style={{ textAlign: "center", marginBottom: "40px", marginTop: "20px" }}>
                      <img src="/images/logo.png" alt="Pokefun Logo" className="animate__animated animate__pulse animate__infinite animate__slower" style={{ height: "150px", margin: "0 auto 20px", display: "block", filter: "drop-shadow(0 0 20px rgba(6, 182, 212, 0.6))" }} />
                      <h2 className="animate__animated animate__fadeInUp" style={{ fontSize: "5.4rem", fontFamily: "'Righteous', cursive", fontWeight: 800, color: "var(--accent-gold)", textShadow: "0 4px 15px rgba(245, 158, 11, 0.5)", textTransform: "uppercase", letterSpacing: "2px" }}>The Best Cobblemon Server & Community</h2>
                  </div>

                  {/* COMMUNITY PROMO */}
                  <div style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #065f46 100%)', borderRadius: '20px', padding: '50px', textAlign: 'center', marginBottom: '80px', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 15px 40px rgba(0,0,0,0.5)' }}>
                      <h3 style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', textShadow: '0 4px 10px rgba(0,0,0,0.5)', marginBottom: '20px' }}>Join the Pokefun Community Hub!</h3>
                      <p style={{ fontSize: '1.5rem', color: '#f3f4f6', textShadow: '0 2px 5px rgba(0,0,0,0.5)', marginBottom: '40px', maxWidth: '800px', margin: '0 auto 40px', lineHeight: '1.6' }}>
                          Share your best moments, watch 60-second Reels, post your insane builds, and connect with other trainers! Get rewards for top posts!
                      </p>
                      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                          <Link href="/community">
                              <button style={{ background: '#8b5cf6', color: 'white', border: 'none', padding: '18px 45px', borderRadius: '30px', fontSize: '1.3rem', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', boxShadow: '0 4px 15px rgba(139,92,246,0.6)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
                                  Explore Feed
                              </button>
                          </Link>
                          <Link href="/community/reels">
                              <button style={{ background: 'white', color: '#065f46', border: 'none', padding: '18px 45px', borderRadius: '30px', fontSize: '1.3rem', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', boxShadow: '0 4px 15px rgba(255,255,255,0.3)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
                                  <i className="fa-solid fa-play"></i> Watch Reels
                              </button>
                          </Link>
                      </div>
                  </div>
                  <div className="section-title" style={{ textAlign: "center", marginBottom: "40px", fontSize: "32px", fontWeight: 800 }}>EPIC SERVER FEATURES</div>
                  <div className="fakemons-grid">
                      
                      <div className="fakemon-card">
                          <img src="/images/features/image09_bosspokemons1.png" style={{ width: "180px", height: "180px", objectFit: "contain", margin: "0 auto 15px", display: "block" }} alt="Natural Bosses" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Natural Bosses</h3>
                          <p style={{ color: "gray", marginTop: "10px" }}>Powerful bosses spawn naturally in the world! Defeat them for epic loot.</p>
                      </div>

                      <div className="fakemon-card">
                          <img src="/images/features/image27_Team_Raids_Battle.png" style={{ width: "180px", height: "180px", objectFit: "contain", margin: "0 auto 15px", display: "block" }} alt="Custom Raids" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Custom Raids</h3>
                          <p style={{ color: "gray", marginTop: "10px" }}>Team up with friends in the new Raid System to battle legendary foes.</p>
                      </div>

                      <div className="fakemon-card">
                          <img src="/images/features/image29_Z_Mega1s.png" style={{ width: "180px", height: "180px", objectFit: "contain", margin: "0 auto 15px", display: "block" }} alt="Battle Gimmicks" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Battle Gimmicks</h3>
                          <p style={{ color: "gray", marginTop: "10px" }}>Mega Evolution, Dynamax, Gigantamax, and Z-Moves are all fully active!</p>
                      </div>

                      <div className="fakemon-card">
                          <img src="/images/features/fusion pokemons1.png" style={{ width: "180px", height: "180px", objectFit: "contain", margin: "0 auto 15px", display: "block" }} alt="Pokémon Fusion" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Pokémon Fusion</h3>
                          <p style={{ color: "gray", marginTop: "10px" }}>Create unique and powerful Pokémon through our advanced fusion system.</p>
                      </div>

                      <div className="fakemon-card">
                          <img src="/images/features/battletower.png" style={{ width: "180px", height: "180px", objectFit: "contain", margin: "0 auto 15px", display: "block" }} alt="Gym System" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Gym System</h3>
                          <p style={{ color: "gray", marginTop: "10px" }}>Challenge our custom gyms and prove you are the best trainer.</p>
                      </div>

                      <div className="fakemon-card">
                          <img src="/images/features/cosmetic skins1.png" style={{ width: "180px", height: "180px", objectFit: "contain", margin: "0 auto 15px", display: "block" }} alt="Cosmetic Skins" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Cosmetic Skins</h3>
                          <p style={{ color: "gray", marginTop: "10px" }}>Unlock hundreds of unique skins and cosmetics for your favorite Pokémon.</p>
                      </div>

                      <div className="fakemon-card">
                          <img src="/images/features/hugecity2.png" style={{ width: "180px", height: "180px", objectFit: "contain", margin: "0 auto 15px", display: "block" }} alt="Player Economy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Player Economy</h3>
                          <p style={{ color: "gray", marginTop: "10px" }}>Trade with players, set up shops, and participate in a living GTS economy.</p>
                      </div>

                      <div className="fakemon-card">
                          <img src="/images/features/cool spawn-2.png" style={{ width: "180px", height: "180px", objectFit: "contain", margin: "0 auto 15px", display: "block" }} alt="Legendary Monuments" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Legendary Monuments</h3>
                          <p style={{ color: "gray", marginTop: "10px" }}>Explore hidden structures containing rare treasures and secrets.</p>
                      </div>

                      <div className="fakemon-card">
                          <img src="/images/features/DISTORTION WORLD1.png" style={{ width: "180px", height: "180px", objectFit: "contain", margin: "0 auto 15px", display: "block" }} alt="Distortion World" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Distortion World</h3>
                          <p style={{ color: "gray", marginTop: "10px" }}>Explore the twisted and inverted Distortion World!</p>
                      </div>

                      <div className="fakemon-card">
                          <img src="/images/features/Flying Taxi-Photoroom.png" style={{ width: "180px", height: "180px", objectFit: "contain", margin: "0 auto 15px", display: "block" }} alt="Flying Taxi" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Flying Taxi</h3>
                          <p style={{ color: "gray", marginTop: "10px" }}>Travel quickly across the region using the Flying Taxi service.</p>
                      </div>

                      <div className="fakemon-card">
                          <img src="/images/features/Gmax forms-1.png" style={{ width: "180px", height: "180px", objectFit: "contain", margin: "0 auto 15px", display: "block" }} alt="Gigantamax Forms" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Gigantamax Forms</h3>
                          <p style={{ color: "gray", marginTop: "10px" }}>Discover and battle incredible Gigantamax Pokemon.</p>
                      </div>

                      <div className="fakemon-card">
                          <img src="/images/features/battleroyalsalphzone.png" style={{ width: "180px", height: "180px", objectFit: "contain", margin: "0 auto 15px", display: "block" }} alt="Battle Royals & Alpha Zone" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Battle Royals & Alpha Zone</h3>
                          <p style={{ color: "gray", marginTop: "10px" }}>Compete in chaotic Battle Royals in the dangerous Alpha Zone.</p>
                      </div>

                      <div className="fakemon-card">
                          <img src="/images/features/battletower.png" style={{ width: "180px", height: "180px", objectFit: "contain", margin: "0 auto 15px", display: "block" }} alt="Battle Tower" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Battle Tower</h3>
                          <p style={{ color: "gray", marginTop: "10px" }}>Test your skills in the Battle Tower and earn rare rewards.</p>
                      </div>

                      <div className="fakemon-card">
                          <img src="/images/features/coolfakemons.png" style={{ width: "180px", height: "180px", objectFit: "contain", margin: "0 auto 15px", display: "block" }} alt="Cool Fakemons" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Cool Fakemons</h3>
                          <p style={{ color: "gray", marginTop: "10px" }}>Hundreds of unique Fakemons to catch and train.</p>
                      </div>

                      <div className="fakemon-card">
                          <img src="/images/features/customeforms.png" style={{ width: "180px", height: "180px", objectFit: "contain", margin: "0 auto 15px", display: "block" }} alt="Custom Forms" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Custom Forms</h3>
                          <p style={{ color: "gray", marginTop: "10px" }}>Discover unique regional forms of your favorite Pokemon.</p>
                      </div>

                      <div className="fakemon-card">
                          <img src="/images/features/dungeon.png" style={{ width: "180px", height: "180px", objectFit: "contain", margin: "0 auto 15px", display: "block" }} alt="Dungeons" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Dungeons</h3>
                          <p style={{ color: "gray", marginTop: "10px" }}>Explore challenging dungeons for legendary loot.</p>
                      </div>

                      <div className="fakemon-card">
                          <img src="/images/features/hugecity.png" style={{ width: "180px", height: "180px", objectFit: "contain", margin: "0 auto 15px", display: "block" }} alt="Huge Cities" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Huge Cities</h3>
                          <p style={{ color: "gray", marginTop: "10px" }}>Explore massive cities full of NPCs and quests.</p>
                      </div>

                      <div className="fakemon-card">
                          <img src="/images/features/image15_epicarmours.png" style={{ width: "180px", height: "180px", objectFit: "contain", margin: "0 auto 15px", display: "block" }} alt="Epic Armours" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Epic Armours</h3>
                          <p style={{ color: "gray", marginTop: "10px" }}>Equip your character with epic custom armor sets.</p>
                      </div>

                      <div className="fakemon-card">
                          <img src="/images/features/image22_pokecostume.png" style={{ width: "180px", height: "180px", objectFit: "contain", margin: "0 auto 15px", display: "block" }} alt="Poke Costumes" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Poke Costumes</h3>
                          <p style={{ color: "gray", marginTop: "10px" }}>Dress up your Pokemon with special costumes.</p>
                      </div>

                      <div className="fakemon-card">
                          <img src="/images/features/image26_primal_forms.png" style={{ width: "180px", height: "180px", objectFit: "contain", margin: "0 auto 15px", display: "block" }} alt="Primal Forms" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Primal Forms</h3>
                          <p style={{ color: "gray", marginTop: "10px" }}>Unleash the ancient power of Primal Reversion.</p>
                      </div>

                      <div className="fakemon-card">
                          <img src="/images/features/minigamstasks-.png" style={{ width: "180px", height: "180px", objectFit: "contain", margin: "0 auto 15px", display: "block" }} alt="Minigames & Tasks" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Minigames & Tasks</h3>
                          <p style={{ color: "gray", marginTop: "10px" }}>Complete daily tasks and play fun minigames.</p>
                      </div>

                      <div className="fakemon-card">
                          <img src="/images/features/rankedmacthcs.png" style={{ width: "180px", height: "180px", objectFit: "contain", margin: "0 auto 15px", display: "block" }} alt="Ranked Matches" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Ranked Matches</h3>
                          <p style={{ color: "gray", marginTop: "10px" }}>Climb the ladder in competitive Ranked Matches.</p>
                      </div>

                      <div className="fakemon-card">
                          <img src="/images/features/safarizone.png" style={{ width: "180px", height: "180px", objectFit: "contain", margin: "0 auto 15px", display: "block" }} alt="Safari Zone" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Safari Zone</h3>
                          <p style={{ color: "gray", marginTop: "10px" }}>Catch rare Pokemon in the Safari Zone.</p>
                      </div>

                      <div className="fakemon-card">
                          <img src="/images/features/teambattles.png" style={{ width: "180px", height: "180px", objectFit: "contain", margin: "0 auto 15px", display: "block" }} alt="Team Battles" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Team Battles</h3>
                          <p style={{ color: "gray", marginTop: "10px" }}>Form a team and battle other players.</p>
                      </div>

                  </div>
              </div>

              {/* Leaderboard Call to Action */}
              <div className="inner" style={{ marginTop: '20px', marginBottom: '60px', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(180, 83, 9, 0.2))', padding: '50px', borderRadius: '20px', border: '1px solid rgba(245, 158, 11, 0.3)', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                <i className="fa-solid fa-crown" style={{ fontSize: '4rem', color: '#fbbf24', marginBottom: '20px', textShadow: '0 0 20px rgba(245, 158, 11, 0.5)' }}></i>
                <h2 style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', marginBottom: '15px', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>Global Leaderboards</h2>
                <p style={{ color: '#444', fontWeight: '500', fontSize: '1.4rem', marginBottom: '30px', maxWidth: '700px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
                  Check out the top players across Ranked PvP, AlphaZone, and Dungeons. Do you have what it takes to be #1?
                </p>
                <Link href="/leaderboard" style={{ background: '#f59e0b', color: 'black', padding: '18px 40px', borderRadius: '40px', fontWeight: 'bold', fontSize: '1.3rem', textDecoration: 'none', display: 'inline-block', boxShadow: '0 4px 15px rgba(245,158,11,0.5)', transition: 'transform 0.2s' }}>
                  View Leaderboards
                </Link>
              </div>

                <div className="post-continue">
                    <a href="/modpacks">Join Now</a>
                </div>
          </div>
      </main>
    </>
  );
}
