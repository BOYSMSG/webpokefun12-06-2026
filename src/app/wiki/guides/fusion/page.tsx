
import React from 'react';

export default function GuidePage() {
  return (
    <div className="wiki-content-wrapper">
      <style dangerouslySetInnerHTML={{__html: `
:root { --bg: #0a0a0f; --surface: #12121a; --text: #e0e0e0; --accent: #f0a030; --blue: #4fc3f7; --red: #ef5350; --green: #66bb6a; --purple: #ce93d8; }
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
.key-basic { background: #fff; color: #000; padding: 2px 8px; border-radius: 3px; font-weight: bold; }
.key-fire { background: #ff4444; color: #fff; padding: 2px 8px; border-radius: 3px; font-weight: bold; }
.key-water { background: #4488ff; color: #fff; padding: 2px 8px; border-radius: 3px; font-weight: bold; }
.key-legendary { background: #ffaa00; color: #000; padding: 2px 8px; border-radius: 3px; font-weight: bold; }
.key-dna { background: #da70d6; color: #fff; padding: 2px 8px; border-radius: 3px; font-weight: bold; }
.footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #2a2a3a; text-align: center; color: #555; font-size: 13px; }
 
      /* Overrides to fit into the dark theme Nextjs layout */
      .wiki-content-wrapper { color: var(--text, #e0e0e0); font-family: 'Segoe UI', system-ui, sans-serif; }
      .wiki-content-wrapper body { background: transparent !important; padding: 0; }
      `}} />
      <div dangerouslySetInnerHTML={{__html: `
<nav>
<ul>
<li><a href="#overview">Overview</a></li>
<li><a href="#howto">How to Fuse</a></li>
<li><a href="#gui">GUI Guide</a></li>
<li><a href="#recipes">Fusion Recipes</a></li>
<li><a href="#keys">Fusion Keys</a></li>
<li><a href="#shops">Where to Buy</a></li>
<li><a href="#faq">FAQ</a></li>
</ul>
</nav>
<div class="container">

<img src="/images/features/fusion pokemons1.png" alt="fusion" className="guide-banner-img" style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "16px", marginBottom: "30px", boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }} />
      <h1>PokeFusion <small>Pokemon Fusion — Player Guide</small></h1>

<div class="alert alert-info">
<strong>Server-side only!</strong> You don't need to install any mod. Just join the server and use <code>/fusion</code> to open the fusion GUI!
</div>

<section id="overview">
<h2>What is PokeFusion?</h2>
<p>PokeFusion lets you combine <strong>2-3 Pokemon</strong> from your party into a <strong>brand new Pokemon</strong> using DNA Fusion Keys. The source Pokemon are consumed and you get a new fused Pokemon with best-of-both IVs!</p>

<h3>Quick Facts</h3>
<ul>
<li><strong>Max Pokemon per fusion:</strong> 3</li>
<li><strong>Source consumed:</strong> Yes</li>
<li><strong>Key required:</strong> DNA Fusion Key (1 per fusion)</li>
<li><strong>IV mode:</strong> Best of Both</li>
<li><strong>Broadcast:</strong> Fusions are announced in chat</li>
</ul>
</section>

<section id="howto">
<h2>How to Fuse — Step by Step</h2>
<ol>
<li><strong>Open GUI:</strong> Type <code>/fusion</code> or <code>/pokefusion</code></li>
<li><strong>Select Pokemon:</strong> Click on party Pokemon in the bottom row (slots 36-41). Max 3 selections.</li>
<li><strong>Check Recipe:</strong> The GUI auto-detects if your selected species match a fusion recipe. The result preview slot shows what you'll get.</li>
<li><strong>Insert Keys:</strong> Make sure you have the required DNA Fusion Keys in your inventory. The GUI shows how many keys are needed.</li>
<li><strong>Click FUSE!</strong> Press the green FUSE button (slot 49). The keys and source Pokemon are consumed, and the result is added to your party.</li>
</ol>

<div class="alert alert-tip">
<strong>Tip:</strong> If your party is full when fusing, the fusion is cancelled and your original Pokemon are restored. Make sure you have space!
</div>
</section>

<section id="gui">
<h2>Fusion GUI Layout</h2>
<table>
<tr><th>Slot</th><th>Purpose</th></tr>
<tr><td>4</td><td>Info book — shows instructions</td></tr>
<tr><td>10, 13, 16</td><td>Selected Pokemon display (up to 3)</td></tr>
<tr><td>22</td><td>Result preview — shows what the fusion will produce</td></tr>
<tr><td>28, 31, 34</td><td>Key requirement slots — shows which key type and how many needed</td></tr>
<tr><td>36-41</td><td>Your party Pokemon (click to select/unselect)</td></tr>
<tr><td>45</td><td>Clear button — reset selection</td></tr>
<tr><td>49</td><td><strong>FUSE button!</strong> Click to perform fusion</td></tr>
</table>
</section>

<section id="recipes">
<h2>All Fusion Recipes</h2>
<p>Below are all available fusions on the server. Each requires <strong>1 DNA Fusion Key</strong>. Source Pokemon are consumed, result uses custom aspect (correct model), best-of-both IVs.</p>

<table>
<tr><th>Result</th><th>Required Pokemon</th><th>Level</th></tr>
<tr><td><strong>Venustoise</strong></td><td>Blastoise + Venusaur</td><td>45</td></tr>
<tr><td><strong>Vaporevoir</strong></td><td>Gardevoir + Vaporeon</td><td>50</td></tr>
<tr><td><strong>Umbrevoir</strong></td><td>Gardevoir + Umbreon</td><td>50</td></tr>
<tr><td><strong>Sylvevoir</strong></td><td>Gardevoir + Sylveon</td><td>50</td></tr>
<tr><td><strong>Reshievoir</strong></td><td>Gardevoir + Reshiram</td><td>65</td></tr>
<tr><td><strong>Leafevoir</strong></td><td>Gardevoir + Leafeon</td><td>50</td></tr>
<tr><td><strong>Joltevoir</strong></td><td>Gardevoir + Jolteon</td><td>50</td></tr>
<tr><td><strong>Glacevoir</strong></td><td>Gardevoir + Glaceon</td><td>50</td></tr>
<tr><td><strong>Flarevoir</strong></td><td>Gardevoir + Flareon</td><td>50</td></tr>
<tr><td><strong>Espevoir</strong></td><td>Gardevoir + Espeon</td><td>50</td></tr>
<tr><td><strong>Dragovoir</strong></td><td>Gardevoir + Dragonite</td><td>50</td></tr>
<tr><td><strong>Arcevoir</strong></td><td>Arceus + Gardevoir</td><td>80</td></tr>
<tr><td><strong>Eternevoir</strong></td><td>Eternatus + Gardevoir</td><td>70</td></tr>
<tr><td><strong>Umbrizard</strong></td><td>Charizard + Umbreon</td><td>45</td></tr>
<tr><td><strong>Pyrochu</strong></td><td>Pichu + Growlithe</td><td>20</td></tr>
<tr><td><strong>Togechu</strong></td><td>Pichu + Togepi</td><td>15</td></tr>
<tr><td><strong>Mimikvee</strong></td><td>Mimikyu + Eevee</td><td>25</td></tr>
<tr><td><strong>Blazetoise</strong></td><td>Blastoise + Charizard</td><td>55</td></tr>
<tr><td><strong>Bulbakoal</strong></td><td>Bulbasaur + Torkoal</td><td>30</td></tr>
<tr><td><strong>Charredbone</strong></td><td>Charmander (solo)</td><td>25</td></tr>
<tr><td><strong>Charsey</strong></td><td>Charizard + Chansey</td><td>50</td></tr>
<tr><td><strong>Luxpa</strong></td><td>Luxray + Hoopa</td><td>55</td></tr>
<tr><td><strong>Eterneon</strong></td><td>Espeon + Eternatus</td><td>60</td></tr>
<tr><td><strong>Miraiceus</strong></td><td>Arceus + Miraidon</td><td>80</td></tr>
<tr><td><strong>Shiny Garchomp</strong></td><td>Gabite + Salamence</td><td>50</td></tr>
<tr><td><strong>Darkzor</strong></td><td>Scizor + Darkrai</td><td>65</td></tr>
<tr><td><strong>Giraruledge</strong></td><td>Ceruledge + Giratina</td><td>70</td></tr>
<tr><td><strong>Armartina</strong></td><td>Armarouge + Giratina</td><td>70</td></tr>
<tr><td><strong>Armaraeon A</strong></td><td>Armarouge + Dialga</td><td>70</td></tr>
<tr><td><strong>Armaraeon B</strong></td><td>Armarouge + Palkia</td><td>70</td></tr>
</table>
</section>

<section id="keys">
<h2>Fusion Key</h2>
<p>All fusions require the <strong>DNA Fusion Key</strong> (Magma Cream). Keys are auto-detected in your inventory — no need to place in GUI.</p>

<table>
<tr><th>Key</th><th>Item</th></tr>
<tr><td><span class="key-dna">DNA Fusion Key</span></td><td>Magma Cream</td></tr>
</table>

<h3>Key Properties</h3>
<ul>
<li><strong>Stack size:</strong> Always 1</li>
<li><strong>Consumption:</strong> Keys are consumed on successful fusion</li>
<li><strong>Acquisition:</strong> Buy from Dungeon Shop (200 DP) or Raid Shop (150 RP)</li>
</ul>
</section>

<section id="shops">
<h2>Where to Buy DNA Fusion Keys</h2>
<p><strong>DNA Fusion Keys</strong> (Magma Cream) are used in the <code>/fusion</code> GUI to fuse Pokemon. Available at:</p>

<table>
<tr><th>Shop</th><th>Cost</th></tr>
<tr><td>Dungeon Shop (/dungeon shop)</td><td>1,500 Dungeon Points</td></tr>
<tr><td>Raid Shop (/warp raid → /raid shop)</td><td>1,000 Raid Points</td></tr>
<tr><td>AlphaZone Shop (/alphazone shop)</td><td>1,500 Alpha Points</td></tr>
</table>

<div class="alert alert-info">
<strong>Note:</strong> DNA Fusion Keys are different from Fusion Crate Keys. Crate Keys (<code>/crate open FusionCrate</code>) give pre-made fusion Pokemon from crates, while DNA Fusion Keys let you fuse your own Pokemon in the <code>/fusion</code> GUI.
</div>
</section>

<section id="faq">
<h2>FAQ</h2>

<h3>Q: Do I need to install anything to use fusion?</h3>
<p><strong>A:</strong> No! PokeFusion is completely server-side. You just need Cobblemon on your client.</p>

<h3>Q: What happens to my original Pokemon?</h3>
<p><strong>A:</strong> By default, source Pokemon are consumed (removed). Make sure you want to fuse before clicking FUSE!</p>

<h3>Q: How are IVs calculated?</h3>
<p><strong>A:</strong> All fusions use <strong>Best of Both</strong> — the highest IV from either parent for each stat.</p>

<h3>Q: Can I get a shiny from fusion?</h3>
<p><strong>A:</strong> Yes! The fusion inherits the shiny status from the <strong>first selected Pokemon</strong>. The Garchomp recipe (Gabite + Salamence) always produces a shiny.</p>

<h3>Q: Where do I get DNA Fusion Keys?</h3>
<p><strong>A:</strong> Buy them from the <strong>Dungeon Shop</strong> (200 Dungeon Points) or <strong>Raid Shop</strong> (150 Raid Points).</p>

<h3>Q: What's the difference between DNA Fusion Key and Fusion Crate Key?</h3>
<p><strong>A:</strong> <strong>DNA Fusion Key</strong> (magma cream) is used in the <code>/fusion</code> GUI to fuse Pokemon. <strong>Fusion Crate Key</strong> is used with <code>/crate open FusionCrate</code> to get pre-made fusion Pokemon from crates.</p>
</section>

<div class="footer">
PokeFusion Player Guide — Use <code>/fusion</code> to start fusing!
</div>
</div>
`}} />
    </div>
  );
}
