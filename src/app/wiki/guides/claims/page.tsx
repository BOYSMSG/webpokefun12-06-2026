"use client";

import React from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const claimsContent = `
# HuskClaims Guide

Protect your builds, chests, and pets using the **Claim system**! 
You get **free claim blocks** when you join, and you passively earn more just by playing on the server! If you need a massive amount of claim blocks, you can also get them from the [Server Store](https://pokefun.in/store).

### Claims Commands
| Command | Description | Alias | Perm |
|---|---|---|---|
| \`/AbandonClaim\` | Deletes the claim you’re standing in. | | claims |
| \`/ClaimExplosions\` | Toggles if explosions are allowed in the claim. | | claims |
| \`/Trust\` | Gives another player permission to edit in your claim. | \`/t\` | claims |
| \`/UnTrust\` | Revokes any permissions granted to a player in your claim. | \`/ut\` | claims |
| \`/AccessTrust\` | Gives a player permission to use your buttons, levers, and beds. | \`/at\` | claims |
| \`/ContainerTrust\` | Gives a player permission to use your buttons, levers, beds, crafting gear, containers, and animals. | \`/ct\` | claims |
| \`/TrustList\` | Lists the permissions for the claim you’re standing in. | | claims |
| \`/SubdivideClaims\` | Switches your shovel to subdivision mode, so you can subdivide your claims. | \`/sc\` | claims |
| \`/RestrictSubclaim\` | Restricts a subclaim, so that it inherits no permissions from the parent claim. | \`/rsc\` | claims |
| \`/BasicClaims\` | Puts your shovel back in basic claims mode. | \`/bc\` | claims |
| \`/PermissionTrust\` | Grants a player permission to share his permission level with others. | \`/pt\` | claims |
| \`/Untrust All\` | Removes all permissions for all players in your claim. | | claims |
| \`/AbandonAllClaims\` | Deletes all of your claims. | | claims |
| \`/BuyClaimBlocks\` | Converts server money to claim blocks. | \`/BuyClaim\` | buysellclaimblocks |
| \`/SellClaimBlocks\` | Converts claim blocks to server money. | \`/SellClaim\` | buysellclaimblocks |
| \`/GivePet\` | Gives away a tamed animal. | | givepet |
| \`/ClaimsList\` | Lists a player’s claims and claim block details. | | claims |
| \`/IgnorePlayer\` | Ignores a target player’s chat messages. | \`/Ignore\` | ignore |
| \`/UnIgnorePlayer\` | Un-ignores a target player’s chat messages. | \`/UnIgnore\` | ignore |
| \`/IgnoredPlayerList\` | Lists all players currently ignored. | \`/IgnoreList\` | ignore |
| \`/Siege\` | Besieges a player (disabled by default). | | siege |
| \`/Trapped\` | Gets a player out of a land claim he’s trapped inside. | | trapped |
| \`/UnlockDrops\` | Allows other players to pick up items you dropped when you died. | | unlockdrops |

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
