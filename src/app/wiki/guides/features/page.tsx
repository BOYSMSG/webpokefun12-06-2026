
import React from 'react';

export default function GuidePage() {
  return (
    <div className="wiki-content-wrapper">
      <style dangerouslySetInnerHTML={{__html: `
        :root {
            --bg-color: #0b0f19;
            --card-bg: rgba(255, 255, 255, 0.03);
            --card-border: rgba(255, 255, 255, 0.06);
            --accent-primary: #8b5cf6;
            --accent-secondary: #ec4899;
            --accent-gold: #f59e0b;
            --accent-green: #10b981;
            --accent-cyan: #06b6d4;
            --text-main: #f3f4f6;
            --text-muted: #9ca3af;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Outfit', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-main);
            min-height: 100vh;
            background-image: radial-gradient(at 10% 20%, rgba(139, 92, 246, 0.15) 0px, transparent 50%), radial-gradient(at 90% 80%, rgba(236, 72, 153, 0.15) 0px, transparent 50%);
            background-attachment: fixed;
            padding: 2rem;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        header {
            text-align: center;
            padding: 3rem 1rem;
        }

        header h1 {
            font-size: 3.5rem;
            font-weight: 800;
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        header p {
            color: var(--text-muted);
            font-size: 1.2rem;
            margin-top: 0.8rem;
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
        }

        .menu-badge {
            display: inline-block;
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
            color: #fff;
            padding: 0.6rem 1.5rem;
            border-radius: 50px;
            font-weight: 600;
            font-size: 1.1rem;
            margin-top: 1.5rem;
            box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
        }

        .menu-badge code {
            background: rgba(0,0,0,0.3);
            padding: 0.2rem 0.6rem;
            border-radius: 6px;
            font-size: 1rem;
        }

        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }

        .feature-card-img { width: 100%; height: 150px; object-fit: cover; border-radius: 10px; margin-bottom: 15px; }
        .feature-card {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 16px;
            padding: 1.8rem;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .feature-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .feature-card:hover::before { opacity: 1; }
        .feature-card:hover { transform: translateY(-4px); border-color: rgba(139, 92, 246, 0.3); box-shadow: 0 8px 30px rgba(0,0,0,0.3); }

        .feature-icon {
            font-size: 2.2rem;
            margin-bottom: 0.8rem;
        }

        .feature-card h3 {
            font-size: 1.3rem;
            font-weight: 700;
            margin-bottom: 0.6rem;
        }

        .feature-card p {
            color: var(--text-muted);
            font-size: 0.95rem;
            line-height: 1.6;
        }

        .feature-card .details {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid rgba(255,255,255,0.05);
            font-size: 0.85rem;
            color: var(--text-muted);
        }

        .feature-card .details li {
            list-style: none;
            padding: 0.3rem 0;
        }

        .feature-card .details li::before {
            content: '▸ ';
            color: var(--accent-primary);
        }

        .section-title {
            text-align: center;
            font-size: 2rem;
            font-weight: 700;
            margin: 3rem 0 1.5rem;
            color: var(--text-main);
        }

        .section-title span { background: linear-gradient(135deg, var(--accent-gold), var(--accent-secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

        .worlds-section {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.2rem;
            margin-top: 1.5rem;
        }

        .world-card {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 14px;
            padding: 1.5rem;
            text-align: center;
            transition: all 0.3s ease;
        }

        .world-card:hover { border-color: rgba(139, 92, 246, 0.3); transform: translateY(-2px); }

        .world-card .world-icon { font-size: 2rem; margin-bottom: 0.5rem; }

        .world-card h4 { font-size: 1.1rem; font-weight: 600; }

        .world-card p { color: var(--text-muted); font-size: 0.85rem; margin-top: 0.3rem; }

        .store-banner {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.15));
            border: 1px solid rgba(139, 92, 246, 0.3);
            border-radius: 16px;
            padding: 2rem;
            text-align: center;
            margin-top: 3rem;
        }

        .store-banner h2 { font-size: 1.8rem; font-weight: 700; }

        .store-banner p { color: var(--text-muted); margin-top: 0.5rem; }

        .store-banner .btn {
            display: inline-block;
            margin-top: 1rem;
            padding: 0.8rem 2rem;
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
            color: #fff;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            transition: transform 0.2s ease;
        }

        .store-banner .btn:hover { transform: scale(1.05); }

        .badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; }

        .badge-new { background: rgba(16, 185, 129, 0.2); color: var(--accent-green); border: 1px solid rgba(16, 185, 129, 0.3); }

        .badge-hot { background: rgba(245, 158, 11, 0.2); color: var(--accent-gold); border: 1px solid rgba(245, 158, 11, 0.3); }

        .badge-popular { background: rgba(139, 92, 246, 0.2); color: var(--accent-primary); border: 1px solid rgba(139, 92, 246, 0.3); }

        @media (max-width: 768px) {
            header h1 { font-size: 2.2rem; }
            .feature-grid { grid-template-columns: 1fr; }
        }
     
      /* Overrides to fit into the dark theme Nextjs layout */
      .wiki-content-wrapper { color: var(--text, #e0e0e0); font-family: 'Segoe UI', system-ui, sans-serif; }
      .wiki-content-wrapper body { background: transparent !important; padding: 0; }
      `}} />
      <div dangerouslySetInnerHTML={{__html: `
    <div class="container">
        <header>
            <h1>PokéFun Features</h1>
            <p>Explore everything PokéFun has to offer — from custom bosses and raids to gyms, fusion, cosmetics, and more!</p>
            <div class="menu-badge">Type <code>/menu</code> in-game to explore all features!</div>
        </header>

        <div class="feature-grid">
            
                <img src="/images/features/image09_bosspokemons1.png" alt="Natural Bosses" class="feature-card-img" />
                <div class="feature-icon">
                <img src="/images/features/image27_Team_Raids_Battle.png" alt="Custom Raids" class="feature-card-img" />
                <div class="feature-icon">
                <img src="/images/features/megapokemons-1.png" alt="Battle Gimmicks" class="feature-card-img" />
                <div class="feature-icon">
                <img src="/images/features/fusion pokemons1.png" alt="Pokémon Fusion" class="feature-card-img" />
                <div class="feature-icon">
                <img src="/images/features/image13_customeforms.png" alt="Gym System" class="feature-card-img" />
                <div class="feature-icon">
                <img src="/images/features/cosmetic skins1.png" alt="Cosmetic Skins" class="feature-card-img" />
                <div class="feature-icon">
                <img src="/images/features/hugecity2.png" alt="Player Economy" class="feature-card-img" />
                <div class="feature-icon">
                <img src="/images/features/cool spawn-2.png" alt="Alpha Pokémon" class="feature-card-img" />
                <div class="feature-icon">
                <img src="/images/features/dungeon.png" alt="Dungeon System" class="feature-card-img" />
                <div class="feature-icon">
                <img src="/images/features/battletower.png" alt="Ranked Battle Tower" class="feature-card-img" />
                <div class="feature-icon">
                <img src="/images/features/pokefun.png" alt="Starter Kits" class="feature-card-img" />
                <div class="feature-icon">
                <img src="/images/features/safarizone.png" alt="BattlePass & Events" class="feature-card-img" />
                <div class="feature-icon"><div class="feature-card">
                <div class="feature-icon">🌍</div>
                <h3>Natural Bosses <span class="badge badge-hot">CobbleBosses</span></h3>
                <p>Powerful boss Pokémon spawn naturally in the world! Defeat them for epic loot, Pokécoins, BattlePoints, and rare items. Bosses have tiers from D to S, including Cosmetic, Fusion, Spacemon, Lasermon, Mega, Legendary, and Mythical variants.</p>
                <div class="details">
                    <li>3,000+ unique bosses across all tiers</li>
                    <li>Custom glowing effects & particles</li>
                    <li>Chance to drop Fusion Crate Keys & rare loot</li>
                    <li>Shiny and special aspect variants</li>
                </div>
            </div>

            <div class="feature-card">
                <div class="feature-icon">⚔️</div>
                <h3>Custom Raids <span class="badge badge-hot">NovaRaids</span></h3>
                <p>Team up with friends in the raid system to battle powerful legendary and mythical boss Pokémon. Earn Raid Points (RP), XP, BattlePoints, and exclusive rewards!</p>
                <div class="details">
                    <li>Automatic raid schedule with announcements</li>
                    <li>Cooperative PvE battles (scale with players)</li>
                    <li>Catch phase after defeating the boss</li>
                    <li>Raid Shop: buy DNA Fusion Keys, gear, crates & more</li>
                    <li>Rewards based on damage dealt</li>
                </div>
            </div>

            <div class="feature-card">
                <div class="feature-icon">💥</div>
                <h3>Battle Gimmicks</h3>
                <p>All major battle gimmicks are fully active! Mega Evolution, Dynamax, Gigantamax, and Z-Moves — use them in PvP, raids, gyms, and boss fights.</p>
                <div class="details">
                    <li>Mega Evolution — Mega stones available</li>
                    <li>Dynamax & Gigantamax — Max particles & moves</li>
                    <li>Z-Moves — Powerful finishing moves</li>
                    <li>Tera Types — Change your Pokémon's type mid-battle</li>
                </div>
            </div>

            <div class="feature-card">
                <div class="feature-icon">🧬</div>
                <h3>Pokémon Fusion <span class="badge badge-new">PokeFusion</span></h3>
                <p>Create unique and powerful fused Pokémon through our advanced fusion system! Combine 2-3 Pokémon to create entirely new species with custom models and aspects.</p>
                <div class="details">
                    <li>30+ fusion recipes with custom models</li>
                    <li>Use DNA Fusion Keys (Magma Cream) in /fusion GUI</li>
                    <li>Zero cooldown — fuse as much as you want</li>
                    <li>Buy keys at Dungeon, Raid & AlphaZone shops</li>
                    <li>Anti-dupe protection disabled for easy trading</li>
                </div>
            </div>

            <div class="feature-card">
                <div class="feature-icon">🏟️</div>
                <h3>Gym System <span class="badge badge-popular">CobblemonNPCs</span></h3>
                <p>Challenge custom gyms across 18 types! Battle NPC trainers and gym leaders to earn badges, rewards, and prove you are the best trainer.</p>
                <div class="details">
                    <li>18 type-based gyms (Bug, Dark, Dragon, etc.)</li>
                    <li>Each gym has multiple trainers + a leader</li>
                    <li>Defeat all gyms to challenge the Champion</li>
                    <li>Rewards: money, BP, items,稀有Pokemon</li>
                    <li>NPCs have competitive movesets & strategies</li>
                </div>
            </div>

            <div class="feature-card">
                <div class="feature-icon">🎨</div>
                <h3>Cosmetic Skins</h3>
                <p>Unlock hundreds of unique skins and cosmetics for your favorite Pokémon! Change their appearance with special aspects while keeping their stats and moves.</p>
                <div class="details">
                    <li>Hundreds of skins: Spaceworld, Lasermon, Fusion & more</li>
                    <li>Cosmetic Crate Keys from shops & rewards</li>
                    <li>Shiny cosmetic variants also available</li>
                    <li>Apply aspects to any Pokémon</li>
                </div>
            </div>

            <div class="feature-card">
                <div class="feature-icon">💰</div>
                <h3>Player Economy</h3>
                <p>Trade with players, set up shops, and participate in a living economy. Use /trade for player-to-player trading or explore the GTS for global exchanges.</p>
                <div class="details">
                    <li>/trade — Direct player trading</li>
                    <li>GTS — Global Trade System</li>
                    <li>Player shops & auction house</li>
                    <li>Multiple currencies: Pokécoins, BattlePoints, Dungeon Points, Raid Points, Alpha Points</li>
                </div>
            </div>

            <div class="feature-card">
                <div class="feature-icon">🔮</div>
                <h3>Alpha Pokémon <span class="badge badge-new">AlphaZone</span></h3>
                <p>Special Alpha Pokémon spawn in the AlphaZone PvP battlegrounds! Fight other players, defeat alpha bosses, and earn Alpha Points for exclusive rewards.</p>
                <div class="details">
                    <li>4 game modes: Solo, Duo, Squad, Chaos</li>
                    <li>Alpha boss spawns during matches</li>
                    <li>Ranked progression with levels & tiers</li>
                    <li>Alpha Shop: buy keys, items & more</li>
                    <li>Zero cooldown on all arenas</li>
                </div>
            </div>

            <div class="feature-card">
                <div class="feature-icon">🏔️</div>
                <h3>Dungeon System <span class="badge badge-hot">Cobblemon Dungeons</span></h3>
                <p>Explore hand-crafted dungeons with scripted boss fights, loot rooms, and epic rewards. 15 unique dungeons with varying difficulty!</p>
                <div class="details">
                    <li>15 dungeons: Abyssal Depths to Void Gates</li>
                    <li>Scripted boss battles with custom rewards</li>
                    <li>Dungeon Points (DP) earned per dungeon</li>
                    <li>Dungeon Shop: DNA Fusion Keys, crate keys, ranks</li>
                    <li>Boss loot tables with rare drops</li>
                </div>
            </div>

            <div class="feature-card">
                <div class="feature-icon">🏆</div>
                <h3>Ranked Battle Tower</h3>
                <p>Climb the ranked ladder in the Battle Tower! 20 floors of escalating difficulty with rewards at every level. Iron to Transcendent tiers.</p>
                <div class="details">
                    <li>20 floors with increasing difficulty</li>
                    <li>23,100 total BattlePoints available</li>
                    <li>Crate keys & exclusive rewards per rank</li>
                    <li>24-hour cooldown between runs</li>
                    <li>Boss floor (Floor 20) with premium loot</li>
                </div>
            </div>

            <div class="feature-card">
                <div class="feature-icon">🎁</div>
                <h3>Starter Kits</h3>
                <p>New to PokéFun? Claim your starter kit with essential items, Pokéballs, and a strong starter Pokémon to begin your adventure!</p>
                <div class="details">
                    <li>Free starter Pokémon with good IVs</li>
                    <li>Starter Pokéballs & healing items</li>
                    <li>Quick start guide & warp access</li>
                    <li>Daily rewards for returning players</li>
                </div>
            </div>

            <div class="feature-card">
                <div class="feature-icon">🎡</div>
                <h3>BattlePass & Events</h3>
                <p>Seasonal BattlePass with exclusive rewards! Complete challenges, earn XP, and unlock rare cosmetics, keys, and Pokémon. Regular server events too!</p>
                <div class="details">
                    <li>Seasonal BattlePass with free & premium tracks</li>
                    <li>Daily & weekly challenges</li>
                    <li>Exclusive cosmetic rewards</li>
                    <li>Special holiday events & tournaments</li>
                </div>
            </div>
        </div>

        <h2 class="section-title"><span>✦</span> PokéFun Worlds <span>✦</span></h2>
        <p style="text-align:center;color:var(--text-muted);margin-bottom:1rem;">PokéFun features multiple unique worlds, each with its own theme and gameplay.</p>

        <div class="worlds-section">
            <div class="world-card">
                <div class="world-icon">🌆</div>
                <h4>City Server</h4>
                <p>Huge villages, farms, city cars, ride systems, race tracks, and live events. A bustling urban world to explore!</p>
            </div>
            <div class="world-card">
                <div class="world-icon">🏛️</div>
                <h4>Lobby</h4>
                <p>Main hub world with warp portals to all game modes. Use <code>/menu</code> to navigate or warp directly.</p>
            </div>
            <div class="world-card">
                <div class="world-icon">🔄</div>
                <h4>Reset World</h4>
                <p>A periodically reset survival world for fresh gameplay. Build, explore, and compete before the next reset!</p>
            </div>
            <div class="world-card">
                <div class="world-icon">🌲</div>
                <h4>3 Survival Regions</h4>
                <p>Three themed survival worlds: <strong>Solar</strong> (sun-drenched biomes, desert, savanna), <strong>Lunar</strong> (moonlit biomes, dark forests, mushroom fields), and <strong>Eclipse</strong> (twilight biomes, end areas, rare resources). Each with unique mobs, resources, and difficulty!</p>
            </div>
            <div class="world-card">
                <div class="world-icon">🦁</div>
                <h4>Safari World</h4>
                <p>A massive safari world with boosted shiny rates and legendary encounter chances. All biomes available with home TP support.</p>
            </div>
            <div class="world-card">
                <div class="world-icon">🏠</div>
                <h4>Home & TP System</h4>
                <p>Set multiple homes per world, use <code>/tpa</code> to teleport to friends, and warp between all game worlds seamlessly.</p>
            </div>
        </div>

        <h2 class="section-title"><span>✦</span> Server Information <span>✦</span></h2>
        <p style="text-align:center;color:var(--text-muted);margin-bottom:2rem;">Everything you need to know about PokéFun.</p>

        <div class="feature-grid">
            <div class="feature-card">
                <h3>🎮 Cosmetic Servers</h3>
                <p>PokéFun has dedicated cosmetic servers where you can show off your rare skins, cosmetics, and custom Pokémon. Participate in cosmetic-themed events and contests!</p>
            </div>
            <div class="feature-card">
                <h3>⭐ Special Systems</h3>
                <p>Custom systems include: size variation (tiny-huge Pokémon), custom model data items, advanced loot tables, player warps, guilds, and an interactive GTS market.</p>
            </div>
            <div class="feature-card">
                <h3>🔗 Quick Warps</h3>
                <p>Use <code>/warp</code> commands to instantly travel: <code>/warp dungeon</code>, <code>/warp raid</code>, <code>/warp alphazone</code>, <code>/warp fusion</code>, <code>/warp gym</code>, <code>/warp safari</code>, <code>/warp city</code>, and more!</p>
            </div>
        </div>

        <div class="store-banner">
            <h2>🌟 Support PokéFun</h2>
            <p>Every purchase supports the server and helps us grow with future content updates!</p>
            <p>Ranks, crate keys, cosmetics, and more available at our store.</p>
            <a class="btn" href="https://store.pokefun.in" target="_blank">Visit Store → store.pokefun.in</a>
        </div>

        <div style="text-align:center;margin:3rem 0;color:var(--text-muted);font-size:0.9rem;">
            <p>Type <code>/menu</code> in-game to explore all features interactively!</p>
            <p style="margin-top:0.3rem;">PokéFun — The Ultimate Cobblemon Experience</p>
        </div>
    </div>
`}} />
    </div>
  );
}
