
import React from 'react';

export default function GuidePage() {
  return (
    <div className="wiki-content-wrapper">
      <style dangerouslySetInnerHTML={{__html: `
:root { --bg: #0a0a0f; --surface: #12121a; --text: #e0e0e0; --accent: #f09819; --blue: #4fc3f7; --red: #ef5350; --green: #66bb6a; --purple: #ce93d8; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', system-ui, sans-serif; background: var(--bg); color: var(--text); line-height: 1.7; padding: 20px; }
nav { position: sticky; top: 0; background: #0d0d15; border-bottom: 1px solid #2a2a3a; padding: 10px 0; z-index: 100; margin-bottom: 20px; }
nav ul { list-style: none; display: flex; flex-wrap: wrap; gap: 2px; justify-content: center; }
nav a { color: #888; text-decoration: none; padding: 4px 10px; border-radius: 4px; font-size: 13px; transition: all .2s; }
nav a:hover { color: #fff; background: #1e1e2e; }
.container { max-width: 1000px; margin: 0 auto; }
h1 { font-size: 2.2em; color: var(--accent); text-align: center; margin-bottom: 8px; }
h1 small { font-size: 0.4em; color: #666; display: block; }
h2 { font-size: 1.4em; color: var(--accent); margin: 30px 0 12px; border-bottom: 2px solid #2a2a3a; padding-bottom: 6px; }
h3 { font-size: 1.1em; color: var(--blue); margin: 20px 0 8px; }
h4 { color: var(--purple); margin: 14px 0 6px; }
p { margin: 8px 0; color: #ccc; }
code { background: #1a1a2a; color: #a8d8ff; padding: 2px 8px; border-radius: 4px; font-size: 0.9em; }
pre { background: #12121e; border: 1px solid #2a2a3a; border-radius: 8px; padding: 14px; overflow-x: auto; margin: 10px 0; font-size: 13px; }
table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 14px; }
th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid #1e1e2e; }
th { background: #1a1a2a; color: var(--accent); }
tr:hover td { background: #12121a; }
.alert { padding: 12px 16px; border-radius: 8px; margin: 12px 0; border-left: 4px solid; font-size: 14px; }
.alert-info { background: #0d1b2a; border-color: var(--blue); }
.alert-warn { background: #2a1f0d; border-color: #ffa726; }
.alert-tip { background: #0d2a1a; border-color: var(--green); }
.alert-danger { background: #2a0d0d; border-color: var(--red); }
.footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #2a2a3a; text-align: center; color: #555; font-size: 13px; }
 
      /* Overrides to fit into the dark theme Nextjs layout */
      .wiki-content-wrapper { color: var(--text, #e0e0e0); font-family: 'Segoe UI', system-ui, sans-serif; }
      .wiki-content-wrapper body { background: transparent !important; padding: 0; }
      `}} />
      <div dangerouslySetInnerHTML={{__html: `
<nav>
<ul>
<li><a href="#overview">Overview</a></li>
<li><a href="#join">How to Join</a></li>
<li><a href="#flow">Raid Flow</a></li>
<li><a href="#points">Points &amp; XP</a></li>
<li><a href="#levels">Levels</a></li>
<li><a href="#shop">Raid Shop</a></li>
<li><a href="#leaderboard">Leaderboard</a></li>
<li><a href="#tips">Tips</a></li>
</ul>
</nav>
<div class="container">

<img src="/images/features/image27_Team_Raids_Battle.png" alt="raid" className="guide-banner-img" style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "16px", marginBottom: "30px", boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }} />
      <h1>Raids <small>Pokemon Raids — Complete Player Guide</small></h1>

<div class="alert alert-info">
<strong>New to raids?</strong> Join at <code>/warp raid</code> and fight powerful boss Pokemon with other players! Earn Raid Points (RP), XP, BattlePoints, and rare rewards!
</div>

<section id="overview">
<h2>What are Raids?</h2>
<p>Raids are <strong>cooperative PvE battles</strong> where players team up to defeat powerful boss Pokemon. Raids happen automatically on a schedule — listen for announcements or check <code>/raid list</code> to see active raids!</p>

<h3>Why Raid?</h3>
<ul>
<li><strong>Raid Points (RP)</strong> — Spend in the Raid Shop on rare items, keys, and gear</li>
<li><strong>BattlePoints (BP)</strong> — Each boss defeated awards BP (1.25–15 BP depending on tier)</li>
<li><strong>XP</strong> — Level up your raid rank for better rewards</li>
<li><strong>Rare Pokemon</strong> — Catch the boss Pokemon after defeating it (if catch phase is enabled)</li>
<li><strong>Items &amp; Keys</strong> — Crate keys, healing items, EV items, and more</li>
</ul>
</section>

<section id="join">
<h2>How to Join</h2>
<ol>
<li>Warp to the raid area: <code>/warp raid</code></li>
<li>Check active raids: <code>/raid list</code></li>
<li>Join a raid: <code>/raid join</code> (joins the nearest active raid)</li>
<li>Fight the boss with other players!</li>
</ol>

<h3>Commands</h3>
<table>
<tr><th>Command</th><th>Description</th></tr>
<tr><td><code>/warp raid</code></td><td>Teleport to the raid arena</td></tr>
<tr><td><code>/raid list</code></td><td>List all active raids</td></tr>
<tr><td><code>/raid join</code></td><td>Join the nearest active raid</td></tr>
<tr><td><code>/raid leave</code></td><td>Leave the current raid</td></tr>
<tr><td><code>/raid queue</code></td><td>View raid queue status</td></tr>
<tr><td><code>/raid shop</code></td><td>Open the Raid Shop</td></tr>
<tr><td><code>/raid stats</code></td><td>View your raid stats</td></tr>
</table>
</section>

<section id="flow">
<h2>Raid Flow</h2>
<ol>
<li><strong>Announcement:</strong> A raid is announced in chat. Go to <code>/warp raid</code> and prepare!</li>
<li><strong>Setup Phase:</strong> Brief preparation period (bar turns blue). Get your Pokemon ready!</li>
<li><strong>Fight Phase:</strong> Battle the boss! The boss has high HP (scales with players) and powerful moves. Deal damage to earn rewards. Duration: ~10 minutes.</li>
<li><strong>Catch Phase (~60s):</strong> After the boss is defeated, you can throw Pokeballs to try and catch it! Use Premier or Ultra Balls for best chance.</li>
<li><strong>Rewards:</strong> Distributed based on damage dealt and participation.</li>
</ol>

<div class="alert alert-warn">
<strong>No-Go Moves:</strong> The following moves/abilities/items are BANNED in raids and will NOT work: Destiny Bond, Ruination, Nature's Madness, Super Fang, OHKO moves (Fissure, Guillotine, Horn Drill, Sheer Cold), Perish Song, Wonder Guard ability, Healer ability, Quick Claw item.
</div>
</section>

<section id="points">
<h2>Points &amp; XP</h2>

<h3>Raid Points (RP)</h3>
<table>
<tr><th>Placement</th><th>Points Earned</th></tr>
<tr><td>1st Place (top damage)</td><td>10 RP</td></tr>
<tr><td>2nd Place</td><td>5 RP</td></tr>
<tr><td>3rd Place</td><td>3 RP</td></tr>
<tr><td>Participant</td><td>1 RP</td></tr>
<tr><td>Win Bonus</td><td>+5 RP</td></tr>
</table>

<h3>XP Rewards</h3>
<table>
<tr><th>Action</th><th>XP</th></tr>
<tr><td>Per boss defeated</td><td>50 XP</td></tr>
<tr><td>Per 100 damage dealt</td><td>1 XP</td></tr>
<tr><td>Participation</td><td>10 XP</td></tr>
</table>

<h3>BattlePoints (BP)</h3>
<table>
<tr><th>Boss Tier</th><th>BP Reward</th></tr>
<tr><td>E / D Tier</td><td>1.25 BP</td></tr>
<tr><td>C / B Tier</td><td>2.5 BP</td></tr>
<tr><td>A Tier</td><td>5 BP</td></tr>
<tr><td>S Tier / Pseudo-Legendary</td><td>10 BP</td></tr>
<tr><td>Gmax / Mega / Paradox / UB / Legendary / Mythical</td><td>15 BP</td></tr>
</table>
</section>

<section id="levels">
<h2>Raid Levels</h2>
<p>Your raid level increases with XP. Higher levels unlock better rewards:</p>
<table>
<tr><th>Level</th><th>XP Required</th></tr>
<tr><td>1</td><td>0</td></tr>
<tr><td>2</td><td>100</td></tr>
<tr><td>3</td><td>250</td></tr>
<tr><td>4</td><td>500</td></tr>
<tr><td>5</td><td>1,000</td></tr>
<tr><td>6</td><td>2,000</td></tr>
<tr><td>7</td><td>3,500</td></tr>
<tr><td>8</td><td>5,500</td></tr>
<tr><td>9</td><td>8,000</td></tr>
<tr><td>10</td><td>11,000</td></tr>
</table>
</section>

<section id="shop">
<h2>Raid Shop</h2>
<p>Spend your Raid Points at the shop using <code>/raid shop</code>:</p>

<h3>Key Items</h3>
<table>
<tr><th>Item</th><th>Cost (RP)</th></tr>
<tr><td>BP Voucher (10 BP)</td><td>50</td></tr>
<tr><td>Cosmetic Crate Key</td><td>100</td></tr>
<tr><td>Item Crate Key</td><td>200</td></tr>
<tr><td>Fusion Crate Key</td><td>350</td></tr>
<tr><td>Fakemon Crate Key</td><td>500</td></tr>
<tr><td>Gimmick Stone Key</td><td>600</td></tr>
<tr><td>Legendary Crate Key</td><td>800</td></tr>
<tr><td>Paradox Crate Key</td><td>900</td></tr>
<tr><td>Galactic Crate Key</td><td>1,000</td></tr>
<tr><td>Ultra Beast Crate Key</td><td>1,200</td></tr>
<tr><td>Shiny Crate Key</td><td>1,500</td></tr>
<tr><td>Cosmetic Shiny Key</td><td>2,000</td></tr>
<tr><td>Fusion Shiny Key</td><td>2,500</td></tr>
<tr><td>Fakemon Shiny Key</td><td>3,000</td></tr>
<tr><td>Fusion Shiny Pokemon Key (All)</td><td>3,500</td></tr>
<tr><td>Legendary Shiny Key</td><td>4,000</td></tr>
</table>

<h3>Poke Balls</h3>
<table>
<tr><th>Item</th><th>Cost (RP)</th></tr>
<tr><td>Poke Ball</td><td>5</td></tr>
<tr><td>Great Ball</td><td>10</td></tr>
<tr><td>Quick Ball</td><td>30</td></tr>
<tr><td>Ultra Ball</td><td>50</td></tr>
<tr><td>Master Ball</td><td>300</td></tr>
</table>

<h3>Legendary Weapons &amp; Armor</h3>
<table>
<tr><th>Item</th><th>Cost (RP)</th></tr>
<tr><td>Primeape Gloves</td><td>4,500</td></tr>
<tr><td>Sirfetch'd Sword</td><td>5,000</td></tr>
<tr><td>Starmie Sword</td><td>5,500</td></tr>
<tr><td>Tinkaton Hammer</td><td>6,000</td></tr>
<tr><td>Ceruledge Sword</td><td>7,000</td></tr>
<tr><td>Metagross Hammer / Bastiodon Shield</td><td>8,000</td></tr>
<tr><td>Zacian Sword</td><td>10,000</td></tr>
<tr><td>Armor Sets (Ceruledge, Armarouge, Astral, Avatar, Deathmantle, Destroyer, Glacier, Justicar, Scarlet, Strider)</td><td>500–7,000 each piece</td></tr>
</table>

<div class="alert alert-tip">
<strong>Tip:</strong> The BP Voucher (50 RP) is the best value — 50 RP for 10 BP! Use BP to buy items in the <code>/bpshop</code>.
</div>
</section>

<section id="leaderboard">
<h2>Leaderboard</h2>
<p>During a raid, you can see the <strong>top 5 damage dealers</strong> on the scoreboard (right side of screen). The top 3 earn bonus Raid Points!</p>
<ul>
<li><strong>1st:</strong> 10 RP + best rewards</li>
<li><strong>2nd:</strong> 5 RP</li>
<li><strong>3rd:</strong> 3 RP</li>
<li><strong>Everyone:</strong> 1 RP + participation rewards</li>
</ul>
<p>Your raid stats (wins, bosses defeated, total damage) can be viewed with <code>/raid stats</code>.</p>
</section>

<section id="tips">
<h2>Tips &amp; Strategy</h2>
<div class="alert alert-tip">
<strong>Bring your best Pokemon.</strong> Raid bosses have high stats (level 100-200+), scaled HP, and competitive movesets. Use super-effective moves and bring type advantages!
</div>
<div class="alert alert-tip">
<strong>Deal damage for BP.</strong> Every 100 damage = 1 XP, and more damage = better rewards. Use setup moves (Swords Dance, Nasty Plot) early!
</div>
<div class="alert alert-tip">
<strong>Team up!</strong> Raids are multiplayer — more players = faster kills. Coordinate with others for type coverage.
</div>
<div class="alert alert-tip">
<strong>Catch the boss.</strong> During catch phase, use Premier or Ultra Balls for best catch rate. Shiny bosses are rare — don't miss your chance!
</div>
<div class="alert alert-tip">
<strong>Use /raid shop frequently.</strong> Save up for legendary gear and shiny crate keys. The BP Voucher is the most efficient purchase for BattlePoints.
</div>
<div class="alert alert-info">
<strong>Reminder:</strong> Raids happen automatically! Listen for chat announcements and check <code>/raid list</code>. You can also see raid schedules in Discord.
</div>
</section>

<div class="footer">
Raids Player Guide — Join at <code>/warp raid</code> and become the ultimate raid champion!
</div>
</div>
`}} />
    </div>
  );
}
