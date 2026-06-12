import React from "react";

export default function RulesPage() {
  const rules = [
    { title: "1. No Stealing or Griefing", desc: "Do not steal from other players’ chests or bases. Griefing (destroying or damaging someone else's builds) is strictly forbidden." },
    { title: "2. No Real Money Trading (RMT)", desc: "Selling or trading items for real money is only allowed through official transactions handled by the owner or staff. Unapproved RMT is banned." },
    { title: "3. Respect All Builds", desc: "Do not damage, alter, or build on someone else's structures without permission." },
    { title: "4. No Duplication or Exploits", desc: "Using bugs, glitches, or machines to duplicate items or gain unfair advantages is not allowed. Please report any bugs to staff immediately." },
    { title: "5. No Scamming or Misleading Trades", desc: "Be honest in trades and auctions. Both parties must agree clearly before confirming a trade." },
    { title: "6. Fair Gameplay Only", desc: "Do not use hacks, cheat mods, or any unfair methods. Play the game as it was meant to be played." },
    { title: "7. No Offensive Content", desc: "Inappropriate builds, signs, books, or chat messages are strictly banned. Keep the server family-friendly and welcoming." },
    { title: "8. No Abusive Behavior", desc: "Bullying, threats, harassment, or toxic behavior is not tolerated. Always be respectful and kind to others." },
    { title: "9. Follow Staff Instructions", desc: "Respect all staff decisions and follow their instructions. Staff are here to keep the server safe and fun." },
    { title: "10. Owner’s Authority", desc: "The owner can add, change, or remove rules at any time. All players must follow the latest rules immediately." },
    { title: "11. No XP Farms or Auto Item Machines", desc: "XP farming, AFK machines, or auto item duplicators are not allowed. Use fair and manual gameplay methods." },
    { title: "12. Have Fun and Be Creative!", desc: "Build cool stuff, make friends, explore, and enjoy your time on Pokefun SMP." }
  ];

  return (
    <div className="inner" style={{ padding: "80px 0", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h1 style={{ fontSize: "3.5rem", fontWeight: 800, marginBottom: "10px", color: "var(--text-color)" }}>Server Rules</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.4rem" }}>🛡️ Pokefun SMP Rules & Guidelines</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
        {rules.map((rule, idx) => (
          <div key={idx} className="fakemon-card" style={{ padding: "35px", borderLeft: "6px solid var(--ghost-accent-color)", backgroundColor: "var(--content-bg)" }}>
            <strong style={{ fontSize: "1.8rem", display: "block", color: "var(--ghost-accent-color)", marginBottom: "15px" }}>
              {rule.title}
            </strong>
            <p style={{ color: "var(--text-color)", fontSize: "1.5rem", lineHeight: "1.8", margin: 0, fontWeight: 500 }}>
              {rule.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
