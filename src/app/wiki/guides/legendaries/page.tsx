"use client";

import React from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const legendariesContent = `
# 🌌 POKEFUN — LEGENDARYVAULT

**⚔️ Legendary Ritual & Summoning Guide ⚔️**

> **Welcome, Trainers! 👋**
> LegendaryVault brings a whole new way to encounter powerful Pokémon through Rituals, Shrines, Temples, Laboratories & Special Machines! ✨

---

## 🪽 LEGENDARY BIRD RITUALS

### ❄️ ARTICUNO
**Required:** Charged Ice Orb  
**Location:** Articuno Shrine  
**Ritual:**
1. Get a Normal Orb
2. Combine it with an Ice Stone → Ice Orb
3. Keep the Ice Orb in your inventory
4. Defeat 100 Ice-type Pokémon to charge it
5. Find the Articuno Shrine
6. Right-click the shrine with the Charged Ice Orb
7. ❄️ Articuno awakens!

### ⚡ ZAPDOS
**Required:** Charged Electric Orb  
**Location:** Zapdos Shrine  
**Ritual:**
1. Obtain a Normal Orb
2. Combine it with a Thunder Stone
3. Defeat 100 Electric-type Pokémon while carrying it
4. Take the Charged Electric Orb to the Zapdos Shrine
5. ⚡ Activate the shrine and awaken Zapdos!

### 🔥 MOLTRES
**Required:** Charged Fire Orb  
**Location:** Moltres Shrine  
**Ritual:**
1. Obtain a Normal Orb
2. Combine it with a Fire Stone
3. Defeat 100 Fire-type Pokémon
4. Bring the Charged Fire Orb to the Moltres Shrine
5. 🔥 Activate the shrine and awaken Moltres!

---

## 🌊 LUGIA RITUAL
**Required:** Lugia Core  
**Location:** Lugia Shrine  
**You need:**
* ❄️ Articuno Core
* ⚡ Zapdos Core
* 🔥 Moltres Core

**Steps:**
1. Use a Core Extractor on Articuno, Zapdos and Moltres to obtain their cores.
2. Combine all 3 cores → Lugia Core
3. 🌊 Take the Lugia Core to the Lugia Shrine and activate it!

---

## 🌈 HO-OH RITUAL
**Required:** Rainbow Feather  
**Location:** Ho-Oh Shrine  
**Ritual:**
1. Obtain a Rainbow Feather from LegendaryVault rewards
2. Find the Ho-Oh Shrine
3. Right-click the shrine with the Rainbow Feather
4. 🌈🔥 Ho-Oh awakens!

---

## 🌳 CELEBI RITUAL
**Required:** GS Ball  
**Location:** Celebi Shrine  
**Ritual:**
1. Obtain a GS Ball from LegendaryVault rewards
2. Find the Celebi Shrine
3. Use the GS Ball on the shrine
4. 🌿✨ Celebi appears!

---

## 🌌 CREATION TRIO
> Rare Orbs required for these rituals can be obtained through Dungeon Rewards.

### ⏳ DIALGA
**Required:** Adamant Orb  
**Location:** Time Shrine  
🟡 Find an Adamant Orb → Take it to the Time Shrine → Activate it → Dialga awakens!

### 🌌 PALKIA
**Required:** Lustrous Orb  
**Location:** Space Shrine  
🔵 Find a Lustrous Orb → Take it to the Space Shrine → Activate it → Palkia awakens!

### 🕳️ GIRATINA
**Required:** Griseous Orb  
**Location:** Distortion Shrine  
🟣 Find a Griseous Orb → Take it to the Distortion Shrine → Activate it → Giratina awakens!

*✨ Each encounter features its own special awakening sequence!*

---

## 👑 ARCEUS — HALL OF ORIGIN
**⚠️ THE ULTIMATE RITUAL**  
**Location:** Hall of Origin  

**You need ALL 18 Plates:**
🔥 Fire • 💧 Water • 🌱 Grass • ⚡ Electric • ❄️ Ice • 🥊 Fighting • ☠️ Poison • 🌍 Ground • 🪽 Flying • 🔮 Psychic • 🐛 Bug • 🪨 Rock • 👻 Ghost • 🐉 Dragon • 🌑 Dark • ⚙️ Steel • ✨ Fairy • ⚪ Normal

**🏛️ Ritual Steps:**
1. Collect all 18 Plates
2. Find the Hall of Origin
3. Insert every Plate into its matching pillar
4. The Hall ritual activates
5. 🎵 An Azure Flute is revealed
6. Collect the Azure Flute
7. Use it at the Hall of Origin
8. Complete the awakening sequence
9. 👑✨ ARCEUS DESCENDS!

---

## 🧬 MEWTWO — CLONING RITUAL
Mewtwo isn't summoned from a shrine…
🔬 It is CREATED through the Clone Machine!

**Required:**
* 🧬 1× Fresh Mew
* 🔬 Clone Chamber Type 1
* 🧪 Clone Chamber Type 2
* 🔗 Clone Tubes
* 🔴 1× Master Ball

**⚙️ Process:**
1. Connect both Clone Chambers using Clone Tubes
2. Have Mew in your party
3. Interact with Chamber 1
4. Mew temporarily enters the machine
5. Cloning begins
6. Wait until cloning reaches 100%
7. Use a Master Ball on Chamber 2
8. 🧬 Mewtwo is released!
9. Your original Mew is safely returned

> **⚠️ IMPORTANT:** One Mew can produce only ONE Mewtwo. A different Mew is required for another Mewtwo.

---

## 🤖 GENESECT RITUAL
**Location:** Genesect Laboratory  

**Required — ALL 4 Drives:**
🔥 Burn Drive • ❄️ Chill Drive • 💧 Douse Drive • ⚡ Shock Drive  
*(🎁 Drives can be obtained through Dungeon Rewards.)*

**⚙️ Ritual:**
1. Find a Genesect Laboratory
2. Insert each Drive
3. Every unique Drive increases ritual progress
4. Install all 4 Drives
5. 🤖 Genesect awakens!

---

## ❤️ MAGEARNA RITUAL
**Required:** Soul Heart  
**Location:** Heartless Magearna Shrine  
**Ritual:**
1. Obtain a Soul Heart from Dungeon Rewards
2. Find the Heartless Magearna Shrine
3. Insert the Soul Heart
4. Restoration sequence begins
5. ❤️⚙️ Magearna awakens!

---

## ⚡ REGIELEKI RITUAL
**Required:** Electric Titan Key  
**Location:** Mountain Electric Temple  
**Ritual:**
1. Obtain the Electric Titan Key from Dungeon Rewards
2. Find the Electric Temple
3. Use the key on the temple
4. ⚡ Regieleki awakens!

---

## 🐉 REGIDRAGO RITUAL
**Required:** Dragon Titan Key  
**Location:** Underground Dragon Temple  
**Ritual:**
1. Obtain a Dragon Titan Key
2. Locate the Dragon Temple
3. Activate it using the key
4. 🐉 Regidrago awakens!

---

## 🗿 REGIGIGAS — TITAN VAULT
**⚠️ PARTY REQUIREMENT**  
You must have ALL 5 Regis in your party simultaneously:  
🪨 Regirock • ❄️ Regice • ⚙️ Registeel • ⚡ Regieleki • 🐉 Regidrago

**Once all five are in your party:**
1. Find the Titan Vault
2. Interact with it
3. 👑🗿 REGIGIGAS AWAKENS!

---

## 🥋 KUBFU → URSHIFU
Kubfu evolves through special Training Altars inside the Dojos.

### 💧 RAPID STRIKE STYLE
**Required:** 🥋 Kubfu | 📜 Scroll of Waters | 💧 Water Dojo Training Altar  
**Process:** Use the Scroll of Waters at the Water Dojo altar.  
➡️ Urshifu — Rapid Strike Style

### 🌑 SINGLE STRIKE STYLE
**Required:** 🥋 Kubfu | 📜 Scroll of Darkness | 🌑 Dark Dojo Training Altar  
**Process:** Use the Scroll of Darkness at the Dark Dojo altar.  
➡️ Urshifu — Single Strike Style

---

## 📕 LEGENDARY GUIDEBOOK
Don't know what you need for a ritual?
The in-game Legendary Guidebook has you covered! 📖✨
Right-click the guidebook to check:
🔹 Required ritual items
🔹 Required shrine/structure
🔹 Current ritual readiness
🔹 Missing items
🔹 Party requirements

---

## ♻️ RITUALS ARE REPEATABLE!
Yes — Legendary rituals can be completed multiple times! 🔥
However, every successful summon requires the necessary ritual items again.

### 🗺️ WHERE TO SEARCH?
Explore the world and discover:  
🏰 Dungeons | 🥋 Dojos | 🎁 Trial Rewards | 🗿 Shrines | 🏛️ Temples | 🌎 The World

Collect the items, complete the rituals and claim your Legendary Pokémon! ✨

> **Good luck, Trainers!**
> Catch them all and become a legend! 🌟

— *🏆 POKEFUN STAFF TEAM*
`;

export default function LegendariesGuidePage() {
  return (
    <div className="inner" style={{ paddingTop: "80px", paddingBottom: "60px", maxWidth: "900px", margin: "0 auto", color: "white" }}>
      <Link href="/wiki" style={{ color: "#a3a3a3", textDecoration: "none", marginBottom: "20px", display: "inline-block" }}>
        <i className="fa-solid fa-arrow-left"></i> Back to Wiki
      </Link>
      <div style={{ background: "rgba(30, 34, 39, 0.7)", padding: "40px", borderRadius: "16px", border: "1px solid #333", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({node, ...props}) => <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--ghost-accent-color)", marginBottom: "20px", borderBottom: "2px solid #333", paddingBottom: "10px" }} {...props} />,
            h2: ({node, ...props}) => <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#fff", marginTop: "30px", marginBottom: "15px", borderBottom: "1px solid #444", paddingBottom: "5px" }} {...props} />,
            h3: ({node, ...props}) => <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#a3a3a3", marginTop: "20px", marginBottom: "10px" }} {...props} />,
            p: ({node, ...props}) => <p style={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#d1d5db", marginBottom: "15px" }} {...props} />,
            ul: ({node, ...props}) => <ul style={{ marginLeft: "20px", marginBottom: "15px", color: "#d1d5db" }} {...props} />,
            ol: ({node, ...props}) => <ol style={{ marginLeft: "20px", marginBottom: "15px", color: "#d1d5db" }} {...props} />,
            li: ({node, ...props}) => <li style={{ marginBottom: "5px" }} {...props} />,
            a: ({node, ...props}) => <a style={{ color: "var(--ghost-accent-color)", textDecoration: "underline" }} {...props} />,
            table: ({node, ...props}) => <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px", background: "rgba(0,0,0,0.3)", borderRadius: "8px", overflow: "hidden" }} {...props} />,
            th: ({node, ...props}) => <th style={{ background: "rgba(255,255,255,0.1)", padding: "12px", textAlign: "left", color: "white", borderBottom: "1px solid #444" }} {...props} />,
            td: ({node, ...props}) => <td style={{ padding: "12px", borderBottom: "1px solid #333", color: "#d1d5db" }} {...props} />,
            code: ({node, ...props}) => <code style={{ background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: "4px", color: "#facc15" }} {...props} />,
            blockquote: ({node, ...props}) => <blockquote style={{ borderLeft: "4px solid var(--ghost-accent-color)", paddingLeft: "15px", color: "#9ca3af", fontStyle: "italic", margin: "15px 0", background: "rgba(0,0,0,0.2)", padding: "10px 15px", borderRadius: "0 8px 8px 0" }} {...props} />,
            hr: ({node, ...props}) => <hr style={{ border: "0", borderTop: "1px solid #444", margin: "30px 0" }} {...props} />,
            strong: ({node, ...props}) => <strong style={{ color: "#fff", fontWeight: 700 }} {...props} />
          }}
        >
          {legendariesContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}
