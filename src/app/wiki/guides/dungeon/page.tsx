
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
    --accent: #58a6ff;
    --green: #3fb950;
    --gold: #d29922;
    --red: #f85149;
    --purple: #bc8cff;
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
  a { color: var(--accent); text-decoration: none; }
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
  .badge-blue { background: #1a2a3a; color: var(--accent); }
  .info-box { background: #1a2333; border: 1px solid #2a3a5a; border-radius: 8px; padding: 15px; margin: 15px 0; }
  .info-box strong { color: var(--accent); }
  .toc { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 20px; margin-bottom: 30px; }
  .toc h3 { margin-top: 0; color: var(--accent); }
  .toc ol { padding-left: 20px; }
  .toc a { color: var(--text-dim); }
  .toc a:hover { color: var(--accent); }
  .section { margin-bottom: 10px; }
  .cmd { background: #1e1e1e; color: #d4d4d4; padding: 2px 6px; border-radius: 3px; font-family: 'Consolas', 'Courier New', monospace; font-size: 0.9em; }
  .note { color: var(--gold); font-style: italic; }
  .dungeon-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px; margin: 10px 0; }
  .dungeon-list li { list-style: none; background: var(--surface); border: 1px solid var(--border); padding: 8px 12px; border-radius: 6px; text-align: center; }
  @media (max-width: 600px) { body { padding: 12px; } table { font-size: 0.8em; } th, td { padding: 5px 8px; } }
 
      /* Overrides to fit into the dark theme Nextjs layout */
      .wiki-content-wrapper { color: var(--text, #e0e0e0); font-family: 'Segoe UI', system-ui, sans-serif; }
      .wiki-content-wrapper body { background: transparent !important; padding: 0; }
      `}} />
      <div dangerouslySetInnerHTML={{__html: `
<div class="container">

<img src="/images/features/dungeon.png" alt="dungeon" className="guide-banner-img" style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "16px", marginBottom: "30px", boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }} />
      <h1> PokeFun Dungeons — Complete Player Guide</h1>
<p><em>Last updated: June 2026</em></p>

<div class="toc">
<h3>Table of Contents</h3>
<ol>
  <li><a href="#overview">What Are Dungeons?</a></li>
  <li><a href="#joining">How to Join a Dungeon</a></li>
  <li><a href="#tiers">Alpha Pokemon Tiers</a></li>
  <li><a href="#spawning">Alpha Spawning &amp; Behavior</a></li>
  <li><a href="#quests">Quests</a></li>
  <li><a href="#bosses">Boss Battles</a></li>
  <li><a href="#raids">Raids</a></li>
  <li><a href="#loot">Loot Drops</a></li>
  <li><a href="#rewards">Rank Rewards</a></li>
  <li><a href="#shop">Dungeon Shop</a></li>
  <li><a href="#commands">Commands</a></li>
  <li><a href="#cooldowns">Cooldowns &amp; Limits</a></li>
  <li><a href="#tips">Tips &amp; Strategy</a></li>
</ol>
</div>

<!-- ==================== OVERVIEW ==================== -->
<div class="section" id="overview">
<h2>1. What Are Dungeons?</h2>
<p>Dungeons are instanced PvE battle arenas where you and your party fight waves of <strong>Alpha Pokemon</strong> (glowing, boosted wild Pokemon) and powerful <strong>Bosses</strong>. Each dungeon run has a time limit, quest objectives, and loot rewards. Complete quests, earn <strong>Dungeon Points</strong>, and climb the <strong>Rank system</strong> to unlock better rewards.</p>

<h3>Available Dungeons (17)</h3>
<div class="dungeon-list">
<ul>
  <li>Abyssal Depths</li>
  <li>Ancient Ruins</li>
  <li>Blazing Caldera</li>
  <li>Crystal Caverns</li>
  <li>Dragon's Lair</li>
  <li>Frozen Tundra</li>
  <li>Lunar Sanctum</li>
  <li>Ocean Abyss</li>
  <li>Shadow Realm</li>
  <li>Sky Citadel</li>
  <li>Solar Bastion</li>
  <li>Storm Peak</li>
  <li>Verdant Jungle</li>
  <li>Void Gates</li>
</ul>
</div>
<p>Each dungeon has different <strong>tier requirements</strong>, <strong>time limits</strong>, and <strong>quest objectives</strong>. Premium &amp; fee-based dungeons may require an entry fee.</p>
</div>

<!-- ==================== JOINING ==================== -->
<div class="section" id="joining">
<h2>2. How to Join a Dungeon</h2>
<ol>
  <li>Form a party (minimum players varies per dungeon, typically <strong>2–4</strong>).</li>
  <li>Use <span class="cmd">/warp dungeon</span> or open the <strong>Dungeon Menu</strong> from the lobby to join a dungeon match.</li>
  <li>Once all party members are ready, the dungeon starts after a <strong>10-second countdown</strong>.</li>
  <li>You'll be teleported to the dungeon world at the spawn point.</li>
  <li>You have a limited time (typically <strong>20–50 minutes</strong>) to complete your quests.</li>
  <li>When the timer ends or all quests are complete, you'll be teleported to the <strong>reward area</strong> where you can catch reward Pokemon for <strong>60 seconds</strong>.</li>
</ol>
</div>

<!-- ==================== TIERS ==================== -->
<div class="section" id="tiers">
<h2>3. Alpha Pokemon Tiers</h2>
<p>Alphas are grouped into <strong>7 standard tiers</strong> plus an <strong>Elite</strong> and <strong>Boss Tier</strong>. Higher tiers = stronger, bigger, and more rewarding alphas.</p>

<table>
  <tr>
    <th>Tier</th><th>Level</th><th>Damage x</th><th>Health x</th><th>Speed x</th><th>Size</th><th>IVs</th><th>Points</th><th>Glow</th>
  </tr>
  <tr><td>Tier 1</td><td>3</td><td>0.5x</td><td>1.0x</td><td>0.5x</td><td>0.5</td><td>0</td><td>1</td><td><span class="badge badge-blue">GRAY</span></td></tr>
  <tr><td>Tier 2</td><td>5</td><td>1.0x</td><td>2.0x</td><td>0.7x</td><td>0.7</td><td>5</td><td>3</td><td><span class="badge badge-green">GREEN</span></td></tr>
  <tr><td>Tier 3</td><td>10</td><td>1.5x</td><td>3.0x</td><td>0.9x</td><td>0.9</td><td>10</td><td>5</td><td><span class="badge badge-blue">BLUE</span></td></tr>
  <tr><td>Tier 4</td><td>15</td><td>2.0x</td><td>5.0x</td><td>1.1x</td><td>1.1</td><td>15</td><td>8</td><td><span class="badge badge-purple">PURPLE</span></td></tr>
  <tr><td>Tier 5</td><td>20</td><td>3.0x</td><td>8.0x</td><td>1.2x</td><td>1.2</td><td>20</td><td>12</td><td><span class="badge badge-red">RED</span></td></tr>
  <tr><td>Tier 6</td><td>30</td><td>4.0x</td><td>10.0x</td><td>1.3x</td><td>1.3</td><td>25</td><td>18</td><td><span class="badge badge-purple">DARK PURPLE</span></td></tr>
  <tr><td>Tier 7</td><td>35</td><td>5.0x</td><td>14.0x</td><td>1.4x</td><td>1.5</td><td>31</td><td>25</td><td><span class="badge badge-gold">GOLD</span></td></tr>
  <tr><td>Boss Tier</td><td>50</td><td>10.0x</td><td>15.0x</td><td>1.8x</td><td>2.0</td><td>31</td><td>60</td><td><span class="badge badge-red">DARK RED</span></td></tr>
</table>

<p><strong>Note:</strong> Some dungeons may also have an <strong>Elite</strong> tier (similar to Tier 6/7 range). Boss Tier alphas are <strong>legendary-only</strong> (Mewtwo, Rayquaza, Dialga, Arceus, etc.).</p>
</div>

<!-- ==================== SPAWNING ==================== -->
<div class="section" id="spawning">
<h2>4. Alpha Spawning &amp; Behavior</h2>

<h3>Initial Spawn</h3>
<p>When a dungeon starts, <strong>1 alpha per tier type</strong> spawns at its designated position — roughly <strong>5–7 alphas</strong> in total. Not all positions are filled immediately.</p>

<h3>Dynamic Respawn</h3>
<p>Alphas respawn dynamically during the run:</p>
<ul>
  <li>Every <strong>0.5 seconds</strong>, the dungeon checks for empty spawn positions.</li>
  <li>Up to <strong>2 new alphas</strong> spawn per check.</li>
  <li>Killed alphas can respawn after just <strong>10 seconds</strong> (200 ticks).</li>
  <li><strong>Maximum 15 alphas</strong> alive at any time (hard cap).</li>
</ul>

<h3>Aggression &amp; Targeting</h3>
<ul>
  <li>Alphas <strong>detect and target</strong> any player within the dungeon, regardless of distance.</li>
  <li>They will only <strong>chase and attack</strong> if you are within <strong>8 blocks</strong> (<code>aggressiveRange</code>).</li>
  <li>Outside 8 blocks, they register you as a target but won't pursue — you can fight from a safe distance with ranged moves.</li>
  <li>Alphas glow with their tier's particle effect (flame, dragon breath, soul fire).</li>
</ul>

<h3>Visual Effects by Tier</h3>
<table>
  <tr><th>Tier</th><th>Particle Type</th><th>Glow Color</th></tr>
  <tr><td>Tier 1–3</td><td>FLAME</td><td>GRAY / GREEN / BLUE</td></tr>
  <tr><td>Tier 4–5</td><td>DRAGON_BREATH</td><td>PURPLE / RED</td></tr>
  <tr><td>Tier 6–7</td><td>SOUL_FIRE_FLAME</td><td>DARK_PURPLE / GOLD</td></tr>
  <tr><td>Boss Tier</td><td>SOUL_FIRE_FLAME</td><td>DARK_RED</td></tr>
</table>
</div>

<!-- ==================== QUESTS ==================== -->
<div class="section" id="quests">
<h2>5. Quests</h2>
<p>Each dungeon has <strong>3–4 quests</strong> you must complete to earn rewards. Quest types:</p>
<ul>
  <li><strong>KILL_ALPHA</strong> — Defeat a specific number of a given tier (e.g., "Defeat 15 BOSS_TIER alphas").</li>
  <li><strong>COLLECT_POINTS</strong> — Earn a target amount of Dungeon Points from killing alphas.</li>
  <li><strong>FIND_GEMS</strong> — Find a number of rare dungeon gems hidden in chests.</li>
</ul>
<p>Quest progress is shared among party members. Once all quests are done, the dungeon run ends and rewards are distributed.</p>
</div>

<!-- ==================== BOSSES ==================== -->
<div class="section" id="bosses">
<h2>6. Boss Battles</h2>
<p>Some dungeons have a dedicated <strong>boss room</strong> with powerful scripted boss Pokemon. Bosses have:</p>
<ul>
  <li><strong>Level 100</strong> with 31 IVs</li>
  <li><strong>5x damage multiplier</strong> and <strong>12x health multiplier</strong></li>
  <li><strong>Size 3.0</strong> — massive on the battlefield</li>
  <li><strong>Shiny</strong> by default with glowing effects</li>
  <li><strong>Special attacks:</strong> AOE, BEAM, or PROJECTILE every 6 seconds (120 ticks), dealing 50 damage with knockback</li>
  <li>Special attacks have a 2-second warmup (40 ticks)</li>
</ul>

<h3>Example Bosses (from Abyssal Depths)</h3>
<table>
  <tr><th>Boss</th><th>Special Move</th><th>Weight</th></tr>
  <tr><td>Keldeo</td><td>AOE</td><td>10</td></tr>
  <tr><td>Calyrex (Shadow)</td><td>BEAM</td><td>8</td></tr>
  <tr><td>Naganadel</td><td>PROJECTILE</td><td>3</td></tr>
  <tr><td>Meloetta (Pirouette)</td><td>PROJECTILE</td><td>9</td></tr>
  <tr><td>Volcanion</td><td>AOE</td><td>6</td></tr>
</table>
<p>Weight determines how likely a boss is to be selected when the boss room activates.</p>
</div>

<!-- ==================== RAIDS ==================== -->
<div class="section" id="raids">
<h2>7. Raids</h2>
<p>Many dungeons have <strong>raid waves</strong> — periodic mass spawns of alphas that attack the party.</p>
<ul>
  <li>Raid waves occur every <strong>2400 ticks (2 minutes)</strong> (if <code>raid.json</code> exists) or every <strong>600 ticks (30 seconds)</strong> (fallback).</li>
  <li>Each wave has <strong>multiple stages</strong> with different tiers, counts, and intervals.</li>
  <li>Example raid waves (Abyssal Depths):
    <ul>
      <li>Wave 1: 6x Tier 2 alphas</li>
      <li>Wave 2: 9x Tier 6 alphas</li>
      <li>Wave 3: 4x Boss Tier alphas</li>
      <li>Wave 4: 2x Shaymin (Boss Tier)</li>
    </ul>
  </li>
  <li>Raids spawn within <strong>50 blocks</strong> of the dungeon spawn point.</li>
  <li>Raid alphas count toward quest progress and can drop loot.</li>
</ul>
</div>

<!-- ==================== LOOT ==================== -->
<div class="section" id="loot">
<h2>8. Loot Drops</h2>
<p>Every defeated alpha has a chance to drop items. The global loot table:</p>

<div class="info-box" style="border-color:var(--gold)">
<strong>🎁 NEW! Crate Key Drops</strong> — All 15 crate key types can drop as loot! Higher dungeon ranks have higher chances. Keys added as command-based items.
</div>

<table>
  <tr><th>Item</th><th>Amount</th><th>Chance</th></tr>
  <tr><td><strong>Crate Keys</strong> (all 15 types)</td><td>1</td><td>Varies by rank (see below)</td></tr>
  <tr><td>Dungeon Points</td><td>2–5</td><td>10%</td></tr>
  <tr><td>Exp Candy XL</td><td>2–5</td><td>12%</td></tr>
  <tr><td>Iron Ingot</td><td>3–5</td><td>10%</td></tr>
  <tr><td>Ultra Ball</td><td>4–8</td><td>10%</td></tr>
  <tr><td>Rare Candy</td><td>1–3</td><td>8%</td></tr>
  <tr><td>Golden Apple</td><td>1–2</td><td>6%</td></tr>
  <tr><td>Fire/Water/Thunder/Leaf Stone</td><td>1</td><td>6% each</td></tr>
  <tr><td>Max Revive</td><td>1–2</td><td>5%</td></tr>
  <tr><td>Diamond</td><td>1</td><td>5%</td></tr>
  <tr><td>PP Up</td><td>1–2</td><td>4%</td></tr>
  <tr><td>Ice Stone / Moon Stone / Dusk Stone</td><td>1</td><td>4–5%</td></tr>
  <tr><td>Protein / Calcium / HP Up</td><td>1–2</td><td>5% each</td></tr>
  <tr><td>Shiny Stone / Dawn Stone</td><td>1</td><td>3% each</td></tr>
  <tr><td>Diamond Block</td><td>1–2</td><td>2%</td></tr>
  <tr><td>Leftovers</td><td>1</td><td>1.5%</td></tr>
  <tr><td>Focus Sash</td><td>1</td><td>1.2%</td></tr>
  <tr><td>Life Orb / Assault Vest</td><td>1</td><td>1% each</td></tr>
  <tr><td>Choice Band / Specs / Scarf</td><td>1</td><td>0.8% each</td></tr>
  <tr><td>Ability Capsule</td><td>1</td><td>0.8%</td></tr>
  <tr><td>Magma Cream</td><td>1</td><td>0.5%</td></tr>
</table>

<p><span class="note">Note:</span> Dungeon Points drop directly into your balance (reduced to 2-5 per kill). Items drop on the ground near the defeated alpha. Crate keys are delivered via command.</p>
</div>

<!-- ==================== REWARDS ==================== -->
<div class="section" id="rewards">
<h2>9. Rank Rewards</h2>
<p>After completing a dungeon run, you receive <strong>rank-based rewards</strong>. Your rank is determined by performance (kills, points, quest completion speed).</p>

<table>
  <tr><th>Rank</th><th>Pokemon Level</th><th>Reward Chance</th><th>Crate Key Chance</th><th>Points</th></tr>
  <tr><td><span class="badge badge-gold">Rank 1 (Elite)</span></td><td>70</td><td>100% Pokemon Lv.50</td><td>40% (all crate keys)</td><td>2-5 (10% chance)</td></tr>
  <tr><td><span class="badge badge-blue">Rank 2 (Veteran)</span></td><td>50</td><td>50% Pokemon Lv.40</td><td>40% (all crate keys)</td><td>2-5 (10% chance)</td></tr>
  <tr><td><span class="badge badge-green">Rank 3 (Rookie)</span></td><td>30</td><td>50% Pokemon Lv.30</td><td>40% (all crate keys)</td><td>2-5 (10% chance)</td></tr>
</table>

<p>Reward Pokemon come from a massive weighted list featuring:</p>
<ul>
  <li><strong>Anime/Crossover themes:</strong> Solo Leveling, Demon Slayer, JJK, DC, Marvel, Dragon Ball, Sonic, Sanrio, Persona, JoJo, Frieren, Berserk, God of War, Nier, OPM, Hollow, and many more.</li>
  <li><strong>Galactic skins:</strong> Arcanine, Charizard, Dragonite, Lapras, Pidgeot, Rayquaza, Snorlax, Tyranitar — all available with the <strong>Galactic</strong> aspect (weight 99) and Galactic Shiny (weight 1).</li>
  <li><strong>Legendary Pokemon:</strong> Mewtwo, Rayquaza, Kyogre, Groudon, Lugia, Ho-Oh, Dialga, Palkia, Giratina, Arceus and more!</li>
  <li><strong>Forms:</strong> Mega Evolutions (Mega X/Y), G-Max forms, and special aspects.</li>
  <li><strong>Shiny variants</strong> (lower weight = rarer).</li>
</ul>

<h3>🎁 Crate Key Rewards (All Ranks, 40% Chance)</h3>
<p>Each rank has a <strong>40% chance</strong> to drop crate keys. All 15 key types are available:</p>
<table>
  <tr><th>Key Type</th><th>Rarity</th><th>What It Unlocks</th></tr>
  <tr><td>CosmeticCrate</td><td>★ Common</td><td>Cosmetic skins for Pokemon</td></tr>
  <tr><td>ItemCrate</td><td>★ Common</td><td>Valuable items &amp; resources</td></tr>
  <tr><td>pokemon</td><td>★ Common</td><td>Random Pokemon</td></tr>
  <tr><td>FusionCrate</td><td>★★ Uncommon</td><td>Fusion Pokemon</td></tr>
  <tr><td>FakemonCrate</td><td>★★ Uncommon</td><td>Custom Fakemon</td></tr>
  <tr><td>GimmickStone</td><td>★★ Uncommon</td><td>Special form items</td></tr>
  <tr><td>pokemon_paradox</td><td>★★★ Rare</td><td>Paradox Pokemon (past/future)</td></tr>
  <tr><td>pokemon_ultrabeast</td><td>★★★ Rare</td><td>Ultra Beasts</td></tr>
  <tr><td>GalacticCrate</td><td>★★★ Rare</td><td>Galactic aspect Pokemon</td></tr>
  <tr><td>LegendaryCrate</td><td>★★★★ Epic</td><td>Legendary Pokemon</td></tr>
  <tr><td>pokemon_shiny</td><td>★★★★ Epic</td><td>Shiny Pokemon</td></tr>
  <tr><td>pokemon_fusion_shiny</td><td>★★★★★ Legendary</td><td>Shiny Fusion Pokemon</td></tr>
  <tr><td>CosmeticCrateShiny</td><td>★★★★★ Legendary</td><td>Shiny Cosmetic skins</td></tr>
  <tr><td>FusionCrateShiny</td><td>★★★★★ Legendary</td><td>Shiny Fusion Crate</td></tr>
  <tr><td>FakemonCrateShiny</td><td>★★★★★ Legendary</td><td>Shiny Fakemon</td></tr>
  <tr><td>LegendaryCrateShiny</td><td>★★★★★ Mythic</td><td>Shiny Legendary Pokemon</td></tr>
</table>

<p>Some dungeons also have a <strong>reward chest</strong> where you can claim specific reward Pokemon (e.g., Dragonite, Tyranitar, Garchomp, Mewtwo, Rayquaza) at the end of the run — you have <strong>60 seconds</strong> to catch them.</p>
</div>

<!-- ==================== SHOP ==================== -->
<div class="section" id="shop">
<h2>10. Dungeon Shop</h2>
<p>Spend your <strong>Dungeon Points</strong> in the dungeon shop. Access via <span class="cmd">/dungeon shop</span>.</p>

<div class="info-box" style="border-color:var(--gold)">
<strong>💰 Updated Prices!</strong> Cosmetic Crate prices increased (2x), ItemCrate reduced for easier access.
</div>

<table>
  <tr><th>Item</th><th>Cost (Dungeon Points)</th></tr>
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

<p><span class="note">💡 Tip:</span> Cheapest key (ItemCrate = 500 points). One dungeon run gives ~200-250 points. Save 2-3 runs for your first key!</p>
</div>

<!-- ==================== COMMANDS ==================== -->
<div class="section" id="commands">
<h2>11. Commands</h2>
<table>
  <tr><th>Command</th><th>Description</th></tr>
  <tr><td><span class="cmd">/warp dungeon</span></td><td>Open dungeon menu to join/create a party</td></tr>
  <tr><td><span class="cmd">/dungeon leave</span></td><td>Leave the current dungeon</td></tr>
  <tr><td><span class="cmd">/dungeon shop</span></td><td>Open the dungeon shop</td></tr>
  <tr><td><span class="cmd">/dungeon points</span></td><td>Check your Dungeon Points balance</td></tr>
  <tr><td><span class="cmd">/dungeon progress</span></td><td>Check current quest progress</td></tr>
  <tr><td><span class="cmd">/dungeon party invite &lt;player&gt;</span></td><td>Invite a player to your party</td></tr>
  <tr><td><span class="cmd">/dungeon party accept</span></td><td>Accept a party invite</td></tr>
  <tr><td><span class="cmd">/dungeon list</span></td><td>List available dungeons</td></tr>
  <tr><td><span class="cmd">/dungeon info &lt;name&gt;</span></td><td>View dungeon details</td></tr>
</table>
</div>

<!-- ==================== COOLDOWNS ==================== -->
<div class="section" id="cooldowns">
<h2>12. Cooldowns &amp; Limits</h2>
<table>
  <tr><th>Limit</th><th>Value</th></tr>
  <tr><td>Global dungeon cooldown</td><td>24 hours per dungeon</td></tr>
  <tr><td>Dungeon time limit</td><td>20–50 minutes (varies)</td></tr>
  <tr><td>Maximum alphas alive</td><td>15</td></tr>
  <tr><td>Alpha respawn cooldown</td><td>10 seconds</td></tr>
  <tr><td>New alphas per tick</td><td>2 max</td></tr>
  <tr><td>Raid interval</td><td>~2 minutes</td></tr>
  <tr><td>Reward catch time</td><td>60 seconds</td></tr>
  <tr><td>Waiting timeout</td><td>120 seconds</td></tr>
  <tr><td>Results screen</td><td>10 seconds</td></tr>
  <tr><td>Start countdown</td><td>10 seconds</td></tr>
  <tr><td>Minimum players</td><td>1–4 (varies by dungeon)</td></tr>
</table>
</div>

<!-- ==================== TIPS ==================== -->
<div class="section" id="tips">
<h2>13. Tips &amp; Strategy</h2>
<div class="info-box">
  <strong> Tip: Stay within 8 blocks to trigger alpha aggro.</strong>
  Alphas know where you are but will only chase within 8 blocks. Stay close to fight; kite from far for safety.
</div>

<div class="info-box">
  <strong> Tip: Focus on quest objectives first.</strong>
  Ignore unnecessary fights. Kill only the tier required by your quests to save time.
</div>

<div class="info-box">
  <strong> Tip: Use the 10-second respawn window.</strong>
  Killed alphas respawn after only 10 seconds. If you need many kills of one tier, stay near its spawn positions.
</div>

<div class="info-box">
  <strong> Tip: Watch out for raid waves.</strong>
  Every 2 minutes, a wave of alphas spawns. Be ready — raid alphas are tough and can overwhelm an unprepared party.
</div>

<div class="info-box">
  <strong> Tip: Save Dungeon Points for shiny keys.</strong>
  Shiny variant keys cost more but give shiny Pokemon. Save up!
</div>

<div class="info-box">
  <strong> Tip: Higher rank = better reward Pokemon.</strong>
  Rank 1 gives level 70 Pokemon. Kill more alphas and earn more points to boost your rank.
</div>

<div class="info-box">
  <strong> Tip: Bring strong Pokemon for Boss Tier alphas.</strong>
  Boss Tier alphas have 10x damage and 15x health. Don't face them with underleveled Pokemon.
</div>

<div class="info-box">
  <strong> Tip: Cooldown is per dungeon, per player.</strong>
  Each dungeon has a 24-hour individual cooldown. You can run different dungeons back-to-back.
</div>

<div class="info-box" style="border-color:var(--gold)">
  <strong>🎁 New! Crate Keys in Rewards!</strong>
  Every rank has 40% chance to drop any of the 15 crate key types. Higher keys (LegendaryCrate, pokemon_shiny) are rarer. Grind more runs for better keys!
</div>

<div class="info-box" style="border-color:var(--gold)">
  <strong>📊 Points Economy:</strong> ~200-250 points per dungeon run. Cheapest key (ItemCrate = 500pts) needs 2-3 runs. Best key (LegendaryCrateShiny = 8,400pts) needs ~34 runs. Play consistently!
</div>

<div class="info-box">
  <strong> Note for mobile users:</strong> This wiki is designed to work on mobile browsers. Use landscape mode for best table viewing.
</div>
</div>

<hr style="border-color: var(--border); margin: 40px 0 20px;">
<p style="text-align: center; color: var(--text-dim);">
  PokeFun Dungeons Guide v1.0 &mdash; <a href="https://discord.gg/pokefun" target="_blank">Join our Discord</a>
</p>

</div>
`}} />
    </div>
  );
}
