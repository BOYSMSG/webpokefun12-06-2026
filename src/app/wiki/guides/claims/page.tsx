"use client";

import React from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const claimsContent = `
# HuskClaims Guide

Protect your builds, chests, and pets using the **Claim system**! 
You get **free claim blocks** when you join, and you passively earn more just by playing on the server! If you need a massive amount of claim blocks, you can also get them from the [Server Store](https://pokefun.in/store).

### Creating & Managing Claims
| Command | Description |
|---|---|
| \`/claim <radius>\` | Create a claim around your current position. (Or just use the golden shovel tool!) |
| \`/claimslist\` (or \`/claims\`) | View the list of all your claims. |
| \`/extendclaim <blocks>\` | Extend your claim by a number of blocks in the direction you are facing. |
| \`/reduceclaim <blocks>\` | Reduce your claim by a number of blocks in the direction you are facing. |
| \`/unclaim\` | Remove the claim you are currently standing in. |
| \`/unclaimall\` | Remove ALL your claims (Requires confirmation). |

### Trusting Friends in your Claim
| Command | Description |
|---|---|
| \`/trust <username>\` | Grant **Build Trust** (place/break blocks) to a friend. |
| \`/containertrust <username>\` | Grant **Container Trust** (open chests, hoppers, etc) to a friend. |
| \`/accesstrust <username>\` | Grant **Access Trust** (use doors, buttons, levers) to a friend. |
| \`/permissiontrust <username>\` | Grant **Management Trust** (allow them to trust others) to a friend. |
| \`/trustlist\` | View a list of all trusted players in the claim you are standing in. |
| \`/untrust <username>\` | Revoke a player's trust level. |
| \`/claimban <username>\` | Ban a specific user from entering your claim. |

### Claim Blocks & Settings
| Command | Description |
|---|---|
| \`/claimblocks\` | View your current claim block balance. |
| \`/buyclaimblocks <amount>\` | Buy claim blocks using in-game money. |
| \`/claimexplosions [on/off]\` | Toggle allowing explosion damage inside your claim. |
| \`/transferpet <username>\` | Transfer ownership of a tamed animal (pet) to another player. |
| \`/unlockdrops\` | Unlock your locked item drops from when you died, allowing anyone to pick them up. |
| \`/trapped\` | Teleports you outside a claim if you get stuck in someone else's land. |

---
**Need more claim blocks?**
Check out our [Ranks on the Store](https://pokefun.in/store) to upgrade your limits!
`;

export default function ClaimsGuidePage() {
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
            h2: ({node, ...props}) => <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#fff", marginTop: "30px", marginBottom: "15px" }} {...props} />,
            h3: ({node, ...props}) => <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#a3a3a3", marginTop: "20px", marginBottom: "10px" }} {...props} />,
            p: ({node, ...props}) => <p style={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#d1d5db", marginBottom: "15px" }} {...props} />,
            ul: ({node, ...props}) => <ul style={{ marginLeft: "20px", marginBottom: "15px", color: "#d1d5db" }} {...props} />,
            li: ({node, ...props}) => <li style={{ marginBottom: "5px" }} {...props} />,
            a: ({node, ...props}) => <a style={{ color: "var(--ghost-accent-color)", textDecoration: "underline" }} {...props} />,
            table: ({node, ...props}) => <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px", background: "rgba(0,0,0,0.3)", borderRadius: "8px", overflow: "hidden" }} {...props} />,
            th: ({node, ...props}) => <th style={{ background: "rgba(255,255,255,0.1)", padding: "12px", textAlign: "left", color: "white", borderBottom: "1px solid #444" }} {...props} />,
            td: ({node, ...props}) => <td style={{ padding: "12px", borderBottom: "1px solid #333", color: "#d1d5db" }} {...props} />,
            code: ({node, ...props}) => <code style={{ background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: "4px", color: "#facc15" }} {...props} />,
          }}
        >
          {claimsContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}
