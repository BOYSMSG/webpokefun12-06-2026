
import React from 'react';

export default function GuidePage() {
  return (
    <div className="wiki-content-wrapper">
      <style dangerouslySetInnerHTML={{__html: `
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:#0a0a0f;color:#e0e0e0;line-height:1.7}
.container{max-width:960px;margin:0 auto;padding:40px 20px 80px}
h1{font-size:2.2em;color:#fff;margin-bottom:8px}
h1 small{font-size:0.4em;color:#666;display:block;margin-top:4px}
h2{font-size:1.5em;color:#f0a030;margin:40px 0 16px;padding-bottom:8px;border-bottom:2px solid #2a2a3a}
h3{font-size:1.15em;color:#80c0ff;margin:24px 0 10px}
p{margin:10px 0}
code,.cmd{font-family:'Cascadia Code','JetBrains Mono',monospace}
code{background:#1a1a2a;color:#a8d8ff;padding:2px 8px;border-radius:4px;font-size:.9em}
.cmd{background:#1e1e2e;padding:3px 10px;border-radius:4px;font-size:.9em;color:#a8d8ff}
table{width:100%;border-collapse:collapse;margin:12px 0;font-size:14px}
th,td{text-align:left;padding:10px 14px;border-bottom:1px solid #1e1e2e}
th{background:#1a1a2a;color:#f0a030;font-weight:600}
tr:hover td{background:#12121a}
.badge{display:inline-block;padding:2px 10px;border-radius:4px;font-size:12px;font-weight:600}
.badge-green{background:#1a3a1a;color:#4caf50}
.badge-blue{background:#1a2a3a;color:#64b5f6}
.badge-red{background:#3a1a1a;color:#ef5350}
.badge-yellow{background:#3a3a1a;color:#ffd54f}
.badge-purple{background:#2a1a3a;color:#ce93d8}
.badge-orange{background:#3a2a1a;color:#ffa726}
.alert{padding:14px 18px;border-radius:8px;margin:16px 0;border-left:4px solid}
.alert-info{background:#0d1b2a;border-color:#42a5f5}
.alert-warn{background:#2a1f0d;border-color:#ffa726}
.alert-tip{background:#0d2a1a;border-color:#66bb6a}
.alert-danger{background:#2a0d0d;border-color:#ef5350}
.alert-coin{background:#1a2a0d;border-color:#fbbf24}
.tower-card{background:#12121e;border-radius:12px;padding:20px;margin:20px 0;border:1px solid #2a2a3a}
.floor-table td:first-child{font-weight:bold;color:#80c0ff}
.footer{margin-top:60px;padding-top:20px;border-top:1px solid #2a2a3a;text-align:center;color:#555;font-size:13px}
.reward-row{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}
.rbadge{padding:4px 12px;border-radius:6px;font-size:12px;font-weight:600}
.rbadge-key{background:#2d5a1e;color:#98fb98;border:1px solid #4caf50}
.rbadge-token{background:#1a3a5e;color:#87ceeb;border:1px solid #4169e1}
.rbadge-item{background:#3a2a1e;color:#ffd700;border:1px solid #daa520}
.rbadge-currency{background:#3a3a1a;color:#fbbf24;border:1px solid #f59e0b}
.rbadge-boss{background:#4a0a4a;color:#e040e0;border:1px solid #9c27b0}
 
      /* Overrides to fit into the dark theme Nextjs layout */
      .wiki-content-wrapper { color: var(--text, #e0e0e0); font-family: 'Segoe UI', system-ui, sans-serif; }
      .wiki-content-wrapper body { background: transparent !important; padding: 0; }
      `}} />
      <div dangerouslySetInnerHTML={{__html: `
<div class="container">

<img src="/images/features/battletower.png" alt="battletower" className="guide-banner-img" style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "16px", marginBottom: "30px", boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }} />
      <h1>BattleTower — Epic PvE Challenge <small>2 Towers · 20 Floors Each · Singles + Doubles · Player Cap Lv.1-45</small></h1>

<div class="alert alert-info">
<strong>🏰 What is BattleTower?</strong> Fight through 20 progressive floors of NPC trainers. Each floor win gives <strong>currency, battletower_tokens, Rare Candies, and crate keys</strong>! Two towers: <strong>Sky Tower</strong> (Dragon/Flying theme) and <strong>Abyss Tower</strong> (Ghost/Dark theme).
</div>

<h2>🎮 How to Play (Flow)</h2>
<div class="tower-card">
<h3>Step-by-Step</h3>
<ol style="margin-left:20px">
<li><strong>Start:</strong> Use <code class="cmd">/warp battletower</code> or click the BattleTower NPC in spawn</li>
<li><strong>Choose Tower:</strong> Select Sky Tower or Abyss Tower from the menu</li>
<li><strong>Party Up:</strong> Team size 2-6 players (recommended: 4). All players must be Lv.1-45</li>
<li><strong>Battle:</strong> Each floor has 1-3 NPC trainers with Lv.22-65 Pokémon. Beat them all to advance</li>
<li><strong>Rewards:</strong> Each floor win gives instant rewards — currency, tokens, candies, crate keys</li>
<li><strong>Floor 20 ⭐:</strong> Boss floor! Defeat the tower boss for premium rewards</li>
<li><strong>Complete:</strong> Clear all 20 floors to get completion bonus (10,000 currency + 2 Nether Stars)</li>
<li><strong>Cooldown:</strong> After completion, you must wait <strong>24 hours</strong> before replaying the same tower</li>
</ol>
</div>

<div class="alert alert-tip">
<strong>💡 Tip:</strong> Build a balanced team of 4. Early floors use Singles, late floors use Doubles. Pokémon types are different every floor!
</div>

<h2>⏱ Cooldown System</h2>
<div class="alert alert-warn">
<strong>🕐 Each tower has a 24-hour cooldown</strong> after you complete it. You can run Sky Tower one day and Abyss Tower the next day — or wait 24h to replay the same tower. The cooldown is <strong>per player, per tower</strong> — not shared!
</div>

<h2>📊 Towers Overview</h2>

<table style="margin:20px 0">
<tr><th>Property</th><th>Sky Tower</th><th>Abyss Tower</th></tr>
<tr><td>Floors</td><td>20</td><td>20</td></tr>
<tr><td>Format</td><td>Singles + Doubles (alternating)</td><td>Singles + Doubles (alternating)</td></tr>
<tr><td>NPC Levels</td><td>22 → 65 (scaling)</td><td>22 → 65 (scaling)</td></tr>
<tr><td>Player Cap</td><td>Lv.1-45</td><td>Lv.1-45</td></tr>
<tr><td>Team Size</td><td>2-6 (ideal: 4)</td><td>2-6 (ideal: 4)</td></tr>
<tr><td>NPCs per Floor</td><td>1-3</td><td>1-3</td></tr>
<tr><td>NPC Skill Level</td><td>5 (max)</td><td>5 (max)</td></tr>
<tr><td>Boss</td><td>Omni-Master Eternus</td><td>Abyss Overlord Nyx</td></tr>
<tr><td>Completion Reward</td><td>10,000 currency + 2 Nether Stars + Title</td><td>10,000 currency + 2 Nether Stars + Title</td></tr>
<tr><td>Cooldown</td><td>24 hours</td><td>24 hours</td></tr>
</table>

<h2>💰 Full Rewards Per Floor</h2>
<p style="color:#aaa">Both towers give <strong>identical rewards</strong>. Here's exactly what you get per floor:</p>

<table class="floor-table">
<tr><th>Floor</th><th>NPCs</th><th>Format</th><th>Lv</th><th>Currency</th><th>Tokens</th><th>Rare Candy</th><th>Crate Keys</th></tr>
<tr><td>1</td><td>1</td><td>Singles</td><td>22</td><td>150</td><td>30</td><td>1</td><td class="rbadge rbadge-key">CosmeticCrate</td></tr>
<tr><td>2</td><td>1</td><td>Doubles</td><td>24</td><td>200</td><td>40</td><td>1</td><td class="rbadge rbadge-key">CosmeticCrate</td></tr>
<tr><td>3</td><td>1</td><td>Singles</td><td>26</td><td>250</td><td>50</td><td>2</td><td class="rbadge rbadge-key">CosmeticCrate</td></tr>
<tr><td>4</td><td>1</td><td>Doubles</td><td>28</td><td>300</td><td>60</td><td>2</td><td class="rbadge rbadge-key">CosmeticCrate</td></tr>
<tr><td>5</td><td>1</td><td>Singles</td><td>30</td><td>350</td><td>70</td><td>3</td><td class="rbadge rbadge-key">CosmeticCrate</td></tr>
<tr><td>6</td><td>2</td><td>Doubles</td><td>32</td><td>400</td><td>80</td><td>3</td><td><span class="rbadge rbadge-key">CosmeticCrate</span> <span class="rbadge rbadge-key">itemCrate</span></td></tr>
<tr><td>7</td><td>2</td><td>Singles</td><td>34</td><td>450</td><td>90</td><td>4</td><td><span class="rbadge rbadge-key">CosmeticCrate</span> <span class="rbadge rbadge-key">itemCrate</span></td></tr>
<tr><td>8</td><td>2</td><td>Doubles</td><td>36</td><td>500</td><td>100</td><td>4</td><td><span class="rbadge rbadge-key">CosmeticCrate</span> <span class="rbadge rbadge-key">itemCrate</span></td></tr>
<tr><td>9</td><td>2</td><td>Singles</td><td>38</td><td>550</td><td>110</td><td>5</td><td><span class="rbadge rbadge-key">CosmeticCrate</span> <span class="rbadge rbadge-key">itemCrate</span></td></tr>
<tr><td>10</td><td>2</td><td>Doubles</td><td>40</td><td>600</td><td>120</td><td>5</td><td><span class="rbadge rbadge-key">CosmeticCrate</span> <span class="rbadge rbadge-key">itemCrate</span></td></tr>
<tr><td>11</td><td>2</td><td>Doubles</td><td>42</td><td>650</td><td>130</td><td>6</td><td><span class="rbadge rbadge-key">CosmeticCrate</span> <span class="rbadge rbadge-key">FusionCrate</span> <span class="rbadge rbadge-key">pokemon</span></td></tr>
<tr><td>12</td><td>2</td><td>Singles</td><td>44</td><td>700</td><td>140</td><td>6</td><td><span class="rbadge rbadge-key">CosmeticCrate</span> <span class="rbadge rbadge-key">FusionCrate</span> <span class="rbadge rbadge-key">pokemon</span></td></tr>
<tr><td>13</td><td>2</td><td>Doubles</td><td>46</td><td>750</td><td>150</td><td>7</td><td><span class="rbadge rbadge-key">CosmeticCrate</span> <span class="rbadge rbadge-key">FusionCrate</span> <span class="rbadge rbadge-key">pokemon</span></td></tr>
<tr><td>14</td><td>2</td><td>Singles</td><td>48</td><td>800</td><td>160</td><td>7</td><td><span class="rbadge rbadge-key">CosmeticCrate</span> <span class="rbadge rbadge-key">FusionCrate</span> <span class="rbadge rbadge-key">pokemon</span></td></tr>
<tr><td>15</td><td>3</td><td>Doubles</td><td>50</td><td>850</td><td>170</td><td>8</td><td><span class="rbadge rbadge-key">CosmeticCrate</span> <span class="rbadge rbadge-key">FusionCrate</span> <span class="rbadge rbadge-key">pokemon</span></td></tr>
<tr><td>16</td><td>3</td><td>Singles</td><td>53</td><td>900</td><td>180</td><td>8</td><td><span class="rbadge rbadge-key">CosmeticCrate x2</span> <span class="rbadge rbadge-key">FusionCrate x2</span> <span class="rbadge rbadge-key">pokemon</span> <span class="rbadge rbadge-key">FakemonCrate</span></td></tr>
<tr><td>17</td><td>3</td><td>Doubles</td><td>56</td><td>950</td><td>190</td><td>9</td><td><span class="rbadge rbadge-key">CosmeticCrate x2</span> <span class="rbadge rbadge-key">FusionCrate x2</span> <span class="rbadge rbadge-key">pokemon</span> <span class="rbadge rbadge-key">FakemonCrate</span></td></tr>
<tr><td>18</td><td>3</td><td>Singles</td><td>59</td><td>1,000</td><td>200</td><td>9</td><td><span class="rbadge rbadge-key">CosmeticCrate x2</span> <span class="rbadge rbadge-key">FusionCrate x2</span> <span class="rbadge rbadge-key">pokemon</span> <span class="rbadge rbadge-key">FakemonCrate</span></td></tr>
<tr><td>19</td><td>3</td><td>Doubles</td><td>62</td><td>1,050</td><td>210</td><td>10</td><td><span class="rbadge rbadge-key">CosmeticCrate x2</span> <span class="rbadge rbadge-key">FusionCrate x2</span> <span class="rbadge rbadge-key">pokemon</span> <span class="rbadge rbadge-key">FakemonCrate</span></td></tr>
<tr><td>20 ⭐</td><td>3</td><td>Doubles</td><td>65</td><td>1,100</td><td>220</td><td>10+1MC</td><td><span class="rbadge rbadge-boss">CosmeticCrate x2</span> <span class="rbadge rbadge-boss">FusionCrate x2</span> <span class="rbadge rbadge-boss">pokemon</span> <span class="rbadge rbadge-boss">FakemonCrate</span> <span class="rbadge rbadge-boss">LegendaryCrate</span> <span class="rbadge rbadge-boss">GimmickStone</span> <span class="rbadge rbadge-boss">pokemon_shiny</span></td></tr>
</table>
<p style="color:#888;font-size:13px">MC = Master Candy (boss floor only). All floors also have a 30% chance for +1 Trial Key.</p>

<h2>📦 Total Rewards Per Full Clear</h2>
<div class="tower-card">
<div class="reward-row">
<span class="rbadge rbadge-currency">Currency: 11,550</span>
<span class="rbadge rbadge-token">BattleTower Tokens: 2,500</span>
<span class="rbadge rbadge-item">Rare Candies: 110</span>
<span class="rbadge rbadge-boss">Master Candy: 1</span>
</div>
<div class="reward-row">
<span class="rbadge rbadge-key">CosmeticCrate: 16</span>
<span class="rbadge rbadge-key">FusionCrate: 7</span>
<span class="rbadge rbadge-key">pokemon: 5</span>
<span class="rbadge rbadge-key">itemCrate: 5</span>
<span class="rbadge rbadge-key">FakemonCrate: 4</span>
<span class="rbadge rbadge-key">LegendaryCrate: 1</span>
<span class="rbadge rbadge-key">GimmickStone: 1</span>
<span class="rbadge rbadge-key">pokemon_shiny: 1</span>
</div>
<p style="color:#aaa;margin-top:10px">+ Completion bonus: <strong>10,000 currency</strong> + <strong>2 Nether Stars</strong> + Title</p>
<p style="color:#aaa">+ ~6 Trial Keys (30% chance per floor × 20 floors)</p>
</div>

<h2>🎯 BattleTower Tokens Shop</h2>
<div class="alert alert-coin">
<strong>🪙 What are BattleTower Tokens?</strong> Earned on every floor win (30-220 per floor). Use them in the BattleTower Token Shop to buy exclusive items — including crate keys, Rare Candies, Master Balls, and more! Check the shop via <code class="cmd">/battletoken shop</code>.
</div>

<h2>💡 Pro Tips</h2>
<ul style="margin-left:20px">
<li><b>Run both towers</b> — each has its own 24h cooldown, so you can do Sky today, Abyss tomorrow</li>
<li><b>Party up!</b> Minimum 2 players, but 4 is ideal. More players = easier clears</li>
<li><b>Floor 20 is the jackpot</b> — only floor with LegendaryCrate, GimmickStone, pokemon_shiny, and Master Candy</li>
<li><b>Don't skip floors</b> — each floor gives escalating tokens and keys. Full clear = 2,500 tokens</li>
<li><b>Trial Key chance</b> — every floor has a 30% bonus Trial Key drop. Lucky runs = extra keys!</li>
<li><b>Save tokens</b> — bigger items in the Token Shop need 500+ tokens. A full clear gives 2,500!</li>
</ul>

<h2>📋 Commands</h2>
<table>
<tr><th>Command</th><th>Description</th></tr>
<tr><td><code class="cmd">/warp battletower</code></td><td>Teleport to BattleTower lobby</td></tr>
<tr><td><code class="cmd">/battletoken shop</code></td><td>Open BattleTower Token Shop</td></tr>
<tr><td><code class="cmd">/battletokens</code></td><td>Check your token balance</td></tr>
</table>

<div class="footer">
<p>Pokefun BattleTower — Conquer Sky & Abyss! 🔥</p>
</div>
</div>
`}} />
    </div>
  );
}
