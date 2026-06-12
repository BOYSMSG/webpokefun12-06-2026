
import React from 'react';

export default function GuidePage() {
  return (
    <div className="wiki-content-wrapper">
      <style dangerouslySetInnerHTML={{__html: `
  :root {
    --bg: #0d1117;
    --surface: #161b22;
    --border: #30363d;
    --text: #e6edf3;
    --text-dim: #8b949e;
    --accent: #ff0844;
    --green: #3fb950;
    --gold: #d29922;
    --red: #f85149;
    --purple: #bc8cff;
    --blue: #58a6ff;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.7;
    padding: 20px;
  }
  .container { max-width: 960px; margin: 0 auto; }
  h1 { font-size: 2.2em; border-bottom: 1px solid var(--border); padding-bottom: 10px; margin-bottom: 30px; color: var(--accent); }
  h2 { font-size: 1.5em; margin-top: 40px; margin-bottom: 15px; color: var(--gold); border-left: 4px solid var(--gold); padding-left: 12px; }
  h3 { font-size: 1.2em; margin-top: 25px; margin-bottom: 10px; color: var(--text); }
  p, li { color: var(--text-dim); margin-bottom: 8px; }
  ul, ol { padding-left: 24px; margin-bottom: 15px; }
  a { color: var(--blue); text-decoration: none; }
  a:hover { text-decoration: underline; }
  table { width: 100%; border-collapse: collapse; margin: 15px 0 25px; font-size: 0.9em; }
  th, td { border: 1px solid var(--border); padding: 8px 12px; text-align: left; }
  th { background: var(--surface); color: var(--gold); font-weight: 600; }
  td { color: var(--text-dim); }
  tr:hover td { background: #1c2333; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.8em; font-weight: 600; margin: 1px; }
  .badge-green { background: #1a3a2a; color: var(--green); }
  .badge-gold { background: #3a2f1a; color: var(--gold); }
  .badge-red { background: #3a1a1a; color: var(--red); }
  .badge-purple { background: #2a1a3a; color: var(--purple); }
  .badge-blue { background: #1a2a3a; color: var(--blue); }
  .badge-royale { background: #3a1a1a; color: #ef4444; }
  .badge-ffa { background: #3a2f1a; color: #f59e0b; }
  .badge-imposter { background: #2a1a3a; color: #8b5cf6; }
  .badge-team { background: #1a2a3a; color: #10b981; }
  .info-box { background: #1a2333; border: 1px solid #2a3a5a; border-radius: 8px; padding: 15px; margin: 15px 0; }
  .info-box strong { color: var(--blue); }
  .toc { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 20px; margin-bottom: 30px; }
  .toc h3 { margin-top: 0; color: var(--accent); }
  .toc ol { padding-left: 20px; }
  .toc a { color: var(--text-dim); }
  .toc a:hover { color: var(--accent); }
  .section { margin-bottom: 10px; }
  .cmd { background: #1e1e1e; color: #d4d4d4; padding: 2px 6px; border-radius: 3px; font-family: 'Consolas', 'Courier New', monospace; font-size: 0.9em; }
  .note { color: var(--gold); font-style: italic; }
  .arena-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px; margin: 10px 0; }
  .arena-list li { list-style: none; background: var(--surface); border: 1px solid var(--border); padding: 8px 12px; border-radius: 6px; text-align: center; }
  .mode-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 20px; margin: 20px 0; }
  .mode-card h3 { margin-top: 0; }
  @media (max-width: 600px) { body { padding: 12px; } table { font-size: 0.8em; } th, td { padding: 5px 8px; } }
 
      /* Overrides to fit into the dark theme Nextjs layout */
      .wiki-content-wrapper { color: var(--text, #e0e0e0); font-family: 'Segoe UI', system-ui, sans-serif; }
      .wiki-content-wrapper body { background: transparent !important; padding: 0; }
      `}} />
      <div dangerouslySetInnerHTML={{__html: `
<div class="container">

<img src="/images/features/cool spawn-2.png" alt="alphazone" className="guide-banner-img" style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "16px", marginBottom: "30px", boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }} />
      <h1> PokeFun AlphaZone — Complete Player Guide</h1>
<p><em>Last updated: June 2026</em></p>

<div class="toc">
<h3>Table of Contents</h3>
<ol>
  <li><a href="#overview">What is AlphaZone?</a></li>
  <li><a href="#joining">How to Join</a></li>
  <li><a href="#modes">Game Modes</a></li>
  <li><a href="#points">Alpha Points &amp; Economy</a></li>
  <li><a href="#levels">Level System</a></li>
  <li><a href="#leaderboards">Leaderboards</a></li>
  <li><a href="#alpha">Alpha Pokemon &amp; Tiers</a></li>
  <li><a href="#raids">Raid Events</a></li>
  <li><a href="#loot">Loot Chests</a></li>
  <li><a href="#rewards">Match Rewards</a></li>
  <li><a href="#shop">AlphaZone Shop</a></li>
  <li><a href="#commands">Commands</a></li>
  <li><a href="#tips">Tips &amp; Strategy</a></li>
</ol>
</div>

<!-- ==================== OVERVIEW ==================== -->
<div class="section" id="overview">
<h2>1. What is AlphaZone?</h2>
<p>AlphaZone is a <strong>Cobblemon PvP Battlegrounds</strong> system with <strong>4 game modes</strong>. Players fight using their Pokemon inside battle arenas, with alpha boss spawns, loot chests, raid events, entry fees, leveling, and ranked progression.</p>

<h3>Available Arenas (7)</h3>
<div class="arena-list">
<ul>
  <li>Blazing Wastes</li>
  <li>Crimson Arena</li>
  <li>Crystal Mines</li>
  <li>Forbidden Jungle</li>
  <li>Frozen Abyss</li>
  <li>Sample Arena</li>
  <li>Skyward Colosseum</li>
</ul>
</div>
<p>Each arena has different <strong>modes</strong>, <strong>player limits</strong>, and <strong>configurations</strong>. Join randomly or pick a specific arena.</p>
</div>

<!-- ==================== JOINING ==================== -->
<div class="section" id="joining">
<h2>2. How to Join</h2>
<ol>
  <li>Use <span class="cmd">/warp alphazone</span> to go to the AlphaZone lobby.</li>
  <li>Open the AlphaZone menu from the lobby NPC or use <span class="cmd">/alphazone menu</span>.</li>
  <li>Choose <strong>Random Join</strong> or select a specific arena.</li>
  <li>Wait in the lobby until enough players join — match starts automatically.</li>
  <li>Use <span class="cmd">/alphazone leave</span> to leave at any time.</li>
</ol>
</div>

<!-- ==================== MODES ==================== -->
<div class="section" id="modes">
<h2>3. Game Modes</h2>

<div class="mode-card">
<h3><span class="badge badge-royale">Royale</span> Alpha Royale</h3>
<p><b>Players:</b> 2–20 | <b>Win:</b> Last player standing</p>
<ul>
  <li>3 lives per player, respawn timer</li>
  <li><strong>Shrinking border</strong> — zone damage outside safe area</li>
  <li>Alpha spawns, loot chests, raid events</li>
  <li>Match timer (configurable, ends when 1 remains or time runs out)</li>
</ul>
</div>

<div class="mode-card">
<h3><span class="badge badge-ffa">FFA</span> Free For All</h3>
<p><b>Players:</b> 1+ | <b>Win:</b> No winner — infinite PvP loop</p>
<ul>
  <li>Instant respawn (3s), infinite lives</li>
  <li>No border, no time limit — join/leave anytime</li>
  <li>Alpha events + raids enabled</li>
  <li>Kill tracking for leaderboards</li>
</ul>
</div>

<div class="mode-card">
<h3><span class="badge badge-imposter">Imposter</span> Imposter Mode</h3>
<p><b>Players:</b> 3–10 | <b>Win:</b> Imposter eliminates all OR crew survives 3 min / completes 5 tasks</p>
<ul>
  <li>1 random player = imposter (hidden identity)</li>
  <li>Tasks auto-complete every 30 seconds</li>
  <li>Fixed 180s (3 min) match</li>
  <li>No alpha events, no border, no raids</li>
</ul>
</div>

<div class="mode-card">
<h3><span class="badge badge-team">Team</span> Team Duels</h3>
<p><b>Players:</b> 2–6 | <b>Win:</b> First team to 25 kills</p>
<ul>
  <li>Challenge via <span class="cmd">/alphazone duel &lt;player&gt; 1/2/3</span></li>
  <li>1v1, 2v2, or 3v3 battles</li>
  <li>No alpha spawns, no border, no raids</li>
  <li>Pure team PvP</li>
</ul>
</div>
</div>

<!-- ==================== POINTS ==================== -->
<div class="section" id="points">
<h2>4. Alpha Points &amp; Economy</h2>
<p>AlphaZone uses its own currency: <strong>Alpha Points</strong> (<code>impactor:alpha_points</code>) — completely separate from Dungeon Points.</p>

<h3>How to Earn Alpha Points</h3>
<ul>
  <li><strong>Player Kills</strong> — kill another player to earn points</li>
  <li><strong>Alpha Kills</strong> — killing alpha Pokemon in the arena</li>
  <li><strong>Raid Participation</strong> — kill raid alphas and bosses</li>
  <li><strong>Loot Chests</strong> — opening chests in the arena</li>
  <li><strong>Wins</strong> — winning a Royale match</li>
  <li><strong>Survival Time</strong> — staying alive in the match</li>
</ul>

<h3>Point Steal System</h3>
<div class="info-box">
<strong> Point Steal:</strong> When you eliminate a player, you <strong>steal ALL their match-earned Alpha Points</strong>. The victim's points reset to 0. This creates high-risk, high-reward gameplay.
</div>

<p><strong>Point Steal works in:</strong> Royale (yes), FFA (yes), Imposter (yes), Team Duels (yes — team with most kills wins).</p>
</div>

<!-- ==================== LEVELS ==================== -->
<div class="section" id="levels">
<h2>5. Level System</h2>
<p>Earn XP from player kills, alpha kills, raid participation, wins, and survival time. Level up to unlock rank titles and rewards.</p>

<table>
  <tr><th>Level</th><th>XP Required</th><th>Reward</th></tr>
  <tr><td>1</td><td>0</td><td>Bronze rank</td></tr>
  <tr><td>2</td><td>200</td><td>Iron rank</td></tr>
  <tr><td>3</td><td>500</td><td>Gold rank</td></tr>
  <tr><td>4</td><td>1000</td><td>Diamond rank</td></tr>
  <tr><td>5</td><td>2000</td><td>Rare Candy x5</td></tr>
  <tr><td>10</td><td>5000</td><td>Mewtwo Lv.50</td></tr>
  <tr><td>20</td><td>15000</td><td>Legend rank</td></tr>
  <tr><td>50</td><td>50000</td><td>Mythic rank</td></tr>
</table>

<p>Check your stats: <span class="cmd">/alphazone stats</span></p>
</div>

<!-- ==================== LEADERBOARDS ==================== -->
<div class="section" id="leaderboards">
<h2>6. Leaderboards</h2>
<p>AlphaZone tracks: Wins, Kills, Deaths, KD Ratio, Alpha Kills, Win Streak, Highest Streak, Level, XP.</p>
<ul>
  <li><span class="cmd">/alphazone top wins</span> — Top 10 by wins</li>
  <li><span class="cmd">/alphazone top kills</span> — Top 10 by kills</li>
  <li><span class="cmd">/alphazone top level</span> — Top 10 by level/XP</li>
  <li><span class="cmd">/alphazone leaderboard</span> — Default (wins)</li>
</ul>
</div>

<!-- ==================== ALPHA TIERS ==================== -->
<div class="section" id="alpha">
<h2>7. Alpha Pokemon &amp; Tiers</h2>
<p>Alpha Pokemon spawn during FFA and Royale matches. They cannot be captured. Killing them grants Alpha Points, XP, and rewards.</p>

<table>
  <tr><th>Tier</th><th>Level</th><th>Damage x</th><th>Health x</th><th>Points Reward</th></tr>
  <tr><td>Tier 1</td><td>50</td><td>1.0x</td><td>1.0x</td><td>10</td></tr>
  <tr><td>Tier 2</td><td>60</td><td>1.5x</td><td>2.0x</td><td>20</td></tr>
  <tr><td>Tier 3</td><td>70</td><td>2.0x</td><td>3.0x</td><td>30</td></tr>
  <tr><td>Elite</td><td>85</td><td>3.0x</td><td>5.0x</td><td>50</td></tr>
  <tr><td>Boss Tier</td><td>100</td><td>5.0x</td><td>10.0x</td><td>100</td></tr>
</table>

<p><strong>Expanded Species:</strong> All tiers now include <strong>285+ additional species</strong> including:</p>
<ul>
  <li><strong>Fakemon</strong> — All custom fakemon species from the Fakemon Crate (Alloette, Beryllius, Gorochu, Godzillante, and 165+ more)</li>
  <li><strong>Fusion-exclusive Pokemon</strong> — Acideon, Blazetoise, Charredbone, Eeveeon, Wyveon, Pyrochu, and more</li>
  <li><strong>Paradox Pokemon</strong> — Fluttermane, Great Tusk, Iron Valiant, Walking Wake, and all others</li>
  <li><strong>Ultra Beasts</strong> — All Ultra Beasts across appropriate tiers</li>
  <li><strong>Form variants</strong> — Rotom forms, Gourgeist sizes, Calyrex forms, and more</li>
</ul>
<p>Alpha events occur every ~25–60 seconds (configurable per arena). Max 3–5 alphas can be alive at once.</p>
</div>

<!-- ==================== RAIDS ==================== -->
<div class="section" id="raids">
<h2>8. Raid Events</h2>
<p>Periodic raid events trigger automatically during FFA and Royale matches:</p>
<ul>
  <li>A random player becomes the <strong>raid target</strong></li>
  <li>Waves of alpha Pokemon spawn near the target player</li>
  <li>A <strong>boss Pokemon</strong> spawns midway through the raid</li>
  <li>All alive players get <strong>completion rewards</strong> when the raid ends</li>
</ul>

<h3>Raid Rewards</h3>
<ul>
  <li><strong>Per kill:</strong> Alpha Points + XP for each alpha/boss killed</li>
  <li><strong>Completion:</strong> Bonus Alpha Points for all surviving players</li>
</ul>

<h3>Example Raid (Crimson Arena)</h3>
<table>
  <tr><th>Wave</th><th>Enemies</th><th>Delay</th></tr>
  <tr><td>1</td><td>5x Tier 1 alphas</td><td>0s</td></tr>
  <tr><td>2</td><td>5x Tier 2 alphas</td><td>~10s</td></tr>
  <tr><td>3</td><td>2x Tier 5 alphas</td><td>~15s</td></tr>
  <tr><td>4</td><td>1x Elite alpha</td><td>~25s</td></tr>
  <tr><td>Boss</td><td>Dialga (Boss Tier)</td><td>~25s</td></tr>
</table>
</div>

<!-- ==================== LOOT ==================== -->
<div class="section" id="loot">
<h2>9. Loot Chests</h2>
<p>Chests spawn at fixed positions in each arena. Opening them gives random items:</p>

<div class="info-box" style="border-color:var(--gold)">
<strong>🎁 NEW!</strong> Crate keys added to all arena loot tables! Find CosmeticCrate, pokemon keys, FusionCrate, LegendaryCrate and more inside chests!
</div>

<table>
  <tr><th>Item</th><th>Chance</th></tr>
  <tr><td>Poke Ball (2-6)</td><td>35%</td></tr>
  <tr><td>Potion (2-4)</td><td>30%</td></tr>
  <tr><td>Arrow (8-16)</td><td>20%</td></tr>
  <tr><td>Dusk Ball (1-3)</td><td>18%</td></tr>
  <tr><td>Exp Candy M (1-2)</td><td>15%</td></tr>
  <tr><td>Gold Ingot (2-5)</td><td>15%</td></tr>
  <tr><td>Alpha Points (50-100)</td><td>15%</td></tr>
  <tr><td>Genius/Muscle/Health Feather (1-3)</td><td>12% each</td></tr>
  <tr><td>Moon Ball / Fast Ball</td><td>10% each</td></tr>
  <tr><td>Diamond (1-2)</td><td>10%</td></tr>
  <tr><td>Ice Heal / Antidote (1-3)</td><td>20% each</td></tr>
  <tr><td>Health Mochi (1-2)</td><td>8%</td></tr>
  <tr><td>Rare Candy (1-3)</td><td>8%</td></tr>
  <tr><td>Ice Stone / Dusk Stone</td><td>7% each</td></tr>
  <tr><td>Calcium / Carbos</td><td>6% each</td></tr>
  <tr><td>Max Revive</td><td>5%</td></tr>
  <tr><td>Exp Candy XL</td><td>5%</td></tr>
  <tr><td>Dawn Stone</td><td>5%</td></tr>
  <tr><td>PP Up (1-2)</td><td>4%</td></tr>
  <tr><td>Dragon Scale</td><td>4%</td></tr>
  <tr><td>Quick Claw / Focus Band</td><td>2% each</td></tr>
  <tr><td>Crate Keys (CosmeticCrate, pokemon)</td><td>2% each</td></tr>
  <tr><td>Leftovers</td><td>1.5%</td></tr>
  <tr><td>Lucky Egg</td><td>1.5%</td></tr>
  <tr><td>Crate Keys (FusionCrate, FakemonCrate)</td><td>1% each</td></tr>
  <tr><td>Assault Vest</td><td>1%</td></tr>
  <tr><td>Weakness Policy</td><td>1%</td></tr>
  <tr><td>Choice Band / Choice Specs / Choice Scarf</td><td>0.8% each</td></tr>
  <tr><td>Ability Capsule</td><td>0.8%</td></tr>
  <tr><td>LegendaryCrate Key</td><td>0.5%</td></tr>
  <tr><td>Magma Cream</td><td>0.8%</td></tr>
</table>
</div>

<!-- ==================== REWARDS ==================== -->
<div class="section" id="rewards">
<h2>10. Match Rewards</h2>
<p>At the end of each match, rewards are distributed based on your <strong>rank/performance</strong>:</p>
<ul>
  <li><strong>Alpha Points</strong> deposited to your balance</li>
  <li><strong>XP</strong> toward level progression</li>
  <li><strong>Random Pokemon</strong> from a weighted species list (with anime themes, mega evolutions, shiny variants)</li>
  <li><strong>Items</strong> &amp; <strong>commands</strong></li>
  <li><strong>Alpha Points</strong> (1–2) as item drops in each rank tier (reduced for economy balance)</li>
</ul>

<h3>Weighted Pokemon System</h3>
<p>Higher weight = higher chance. Example:</p>
<ul>
  <li>Dragonite (weight 10) — common</li>
  <li>Tyranitar (weight 8) — common</li>
  <li>Mewtwo Shiny (weight 1) — rare</li>
  <li>Rayquaza Shiny (weight 1) — rare</li>
  <li>Aerodactyl (Solo Leveling aspect, weight 1) — rare</li>
  <li>Greninja (various anime aspects, weight 1 each) — rare</li>
  <li>Galactic aspect — Arcanine, Charizard, Dragonite, Lapras, Pidgeot, Rayquaza, Snorlax, Tyranitar with Galactic skin</li>
  <li>Ho-Oh now available as a reward Pokemon</li>
</ul>

<h3>⚠️ Updated Economy</h3>
<ul>
  <li><strong>Match Points:</strong> 1st place=10pts, 2nd=5pts, 3rd=3pts, participant=1pt, win bonus=5pts</li>
  <li><strong>Per kill:</strong> Tier 1=0pts, Tier 2=1pt, Tier 3=2pts, Tier 4=4pts, Tier 5=6pts, Elite=10pts, Boss=15pts</li>
  <li><strong>End reward points:</strong> 1-2 points (item drop, 10% chance)</li>
  <li><strong>Zero cooldown:</strong> All arenas now have 0 min cooldown — play unlimited matches!</li>
  <li><strong>Target grind:</strong> ~25-35 points per FFA match. Cheapest key (ItemCrate=500pts) in ~5-6 hours of play</li>
</ul>
</div>

<!-- ==================== SHOP ==================== -->
<div class="section" id="shop">
<h2>11. AlphaZone Shop</h2>
<p>Spend your <strong>Alpha Points</strong> at the shop. Access via <span class="cmd">/alphazone shop</span>.</p>

<div class="info-box" style="border-color:var(--gold)">
<strong>💰 Updated Prices!</strong> Cosmetic Crate prices increased (2x), ItemCrate reduced for easier access.
</div>

<table>
  <tr><th>Item</th><th>Cost (Alpha Points)</th></tr>
  <tr><td>Cosmetic Crate Key</td><td>1,250</td></tr>
  <tr><td>Cosmetic Crate (Shiny)</td><td>3,750</td></tr>
  <tr><td>Item Crate Key</td><td>500</td></tr>
  <tr><td>Fusion Crate Key</td><td>1,250</td></tr>
  <tr><td>Fusion Crate (Shiny)</td><td>3,750</td></tr>
  <tr><td>Fakemon Crate Key</td><td>2,000</td></tr>
  <tr><td>Fakemon Crate (Shiny)</td><td>6,000</td></tr>
  <tr><td>Legendary Crate Key</td><td>2,800</td></tr>
  <tr><td>Legendary Crate (Shiny)</td><td>8,400</td></tr>
  <tr><td>Paradox Pokemon Key</td><td>2,500</td></tr>
  <tr><td>Normal Pokemon Key</td><td>1,000</td></tr>
  <tr><td>Fusion Pokemon Key</td><td>1,250</td></tr>
  <tr><td>Shiny Fusion Pokemon Key</td><td>3,750</td></tr>
  <tr><td>Shiny Pokemon Key</td><td>3,000</td></tr>
  <tr><td>Ultra Beast Key</td><td>3,000</td></tr>
</table>

<p><span class="note">💡 Tip:</span> Cheapest key (ItemCrate = 500 AP). All arenas now have ZERO cooldown — grind unlimited matches!</p>
</div>

<!-- ==================== COMMANDS ==================== -->
<div class="section" id="commands">
<h2>12. Commands</h2>
<table>
  <tr><th>Command</th><th>Description</th></tr>
  <tr><td><span class="cmd">/warp alphazone</span></td><td>Go to the AlphaZone lobby</td></tr>
  <tr><td><span class="cmd">/alphazone menu</span></td><td>Open the main AlphaZone menu</td></tr>
  <tr><td><span class="cmd">/alphazone join</span></td><td>Randomly join an arena</td></tr>
  <tr><td><span class="cmd">/alphazone join &lt;arena&gt;</span></td><td>Join a specific arena</td></tr>
  <tr><td><span class="cmd">/alphazone leave</span></td><td>Leave current arena</td></tr>
  <tr><td><span class="cmd">/alphazone stats</span></td><td>View your stats (kills, wins, level, etc.)</td></tr>
  <tr><td><span class="cmd">/alphazone shop</span></td><td>Open the Alpha Points shop</td></tr>
  <tr><td><span class="cmd">/alphazone top wins</span></td><td>Leaderboard by wins</td></tr>
  <tr><td><span class="cmd">/alphazone top kills</span></td><td>Leaderboard by kills</td></tr>
  <tr><td><span class="cmd">/alphazone top level</span></td><td>Leaderboard by level/XP</td></tr>
  <tr><td><span class="cmd">/alphazone duel &lt;player&gt; 1/2/3</span></td><td>Challenge to 1v1/2v2/3v3</td></tr>
  <tr><td><span class="cmd">/alphazone accept</span></td><td>Accept a duel invite</td></tr>
  <tr><td><span class="cmd">/alphazone deny</span></td><td>Deny a duel invite</td></tr>
  <tr><td><span class="cmd">/alphazone team add &lt;player&gt;</span></td><td>Add player to your team</td></tr>
</table>
</div>

<!-- ==================== TIPS ==================== -->
<div class="section" id="tips">
<h2>13. Tips &amp; Strategy</h2>
<div class="info-box">
  <strong> Tip: Point Steal is huge.</strong>
  If you see someone with many kills, eliminate them to steal ALL their points. High risk, high reward.
</div>
<div class="info-box">
  <strong> Tip: Open loot chests early.</strong>
  Chests give items AND Alpha Points. Loot up before engaging other players.
</div>
<div class="info-box">
  <strong> Tip: Watch for raid events.</strong>
  When a raid starts, alphas spawn near the raid target. You can earn bonus points by participating — but also beware of enemy players attacking during the chaos.
</div>
<div class="info-box">
  <strong> Tip: Royale border shrinks.</strong>
  Stay inside the safe zone. The border deals damage to players and Pokemon outside it.
</div>
<div class="info-box">
  <strong> Tip: Use /alphazone stats to track progress.</strong>
  Check your wins, kills, KD ratio, and level to see how you're improving.
</div>
<div class="info-box">
  <strong> Tip: Save Alpha Points for shiny/rare keys.</strong>
  Shiny variant keys cost more but give shiny Pokemon. The Legendary + Shiny Key (8,400 AP) is endgame.
</div>
<div class="info-box" style="border-color:var(--green)">
  <strong>🎉 Zero Cooldown!</strong>
  All arenas now have <strong>0 min cooldown</strong> — play unlimited matches back-to-back! Grind Alpha Points as much as you want.
</div>
<div class="info-box">
  <strong> Tip: Imposter mode tasks.</strong>
  Tasks auto-complete every 30 seconds. Survive 2.5 min and you win as crewmate. Find the imposter before they find you.
</div>
<div class="info-box">
  <strong> Note:</strong> Alpha Points are separate from Dungeon Points. You cannot spend Alpha Points in the Dungeon shop or vice versa.
</div>
</div>

<hr style="border-color: var(--border); margin: 40px 0 20px;">
<p style="text-align: center; color: var(--text-dim);">
  PokeFun AlphaZone Guide v1.0 &mdash; <a href="https://discord.gg/pokefun" target="_blank">Join our Discord</a>
</p>

</div>
`}} />
    </div>
  );
}
