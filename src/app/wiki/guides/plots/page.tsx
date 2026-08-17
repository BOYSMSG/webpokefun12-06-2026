"use client";

import React from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const plotsContent = `
# Plots and Property Guide

PokefunProperty creates a living **player civilization** on our server with two gameplay areas:

<div style={{ padding: "20px", background: "rgba(0,0,0,0.3)", borderRadius: "12px", marginBottom: "20px", borderLeft: "5px solid #ff9800" }}>
  <h2 style={{ fontSize: "2rem", color: "#ff9800", marginBottom: "10px" }}>⛏️ Survival World</h2>
  <p style={{ fontSize: "1.5rem", lineHeight: "1.6" }}>Mining, ores, grinding, exploration, Nether, End and resource collection. <strong>Survival is the resource world.</strong></p>
</div>

<div style={{ padding: "20px", background: "rgba(0,0,0,0.3)", borderRadius: "12px", marginBottom: "30px", borderLeft: "5px solid #14b8a6" }}>
  <h2 style={{ fontSize: "2rem", color: "#14b8a6", marginBottom: "10px" }}>🏙️ City World</h2>
  <p style={{ fontSize: "1.5rem", lineHeight: "1.6" }}>Permanent homes, storage, shops, properties, businesses, buying/selling land and a real-estate economy. <strong>The city is where players live.</strong></p>
</div>

<div style={{ padding: "20px", background: "rgba(20, 184, 166, 0.1)", borderRadius: "12px", marginBottom: "30px", border: "1px solid #14b8a6" }}>
  <p style={{ fontSize: "1.6rem", fontWeight: "bold", color: "#14b8a6", textAlign: "center", fontStyle: "italic" }}>
    ✨ Plots feature a special system that works exactly like real estate! If you love property dealing and owning multiple houses, this system is insane! ✨
  </p>
</div>

### Plot Limits
* <span style={{ fontSize: "1.3rem" }}>**Default players** can claim up to **3 plots**.</span>
* <span style={{ fontSize: "1.3rem" }}>**Rank holders** can claim up to **20 plots**!</span>

### Player Commands
| Command | Description |
|---|---|
| \`/plot gui\` | Open your plot management GUI. |
| \`/plot info [id]\` | Show plot details (current plot if no id). |
| \`/plot list\` | List your owned plots. |
| \`/plot tp [id]\` | Teleport to your plot (or by id). |
| \`/plot sethome\` | Set the plot's home teleport point. |
| \`/plot expand\` | Upgrade to the next plot type (pays the difference). |
| \`/plot sell <price>\` | List the plot for sale at a fixed price. |
| \`/plot buy\` | Buy the plot you are standing on. |
| \`/plot transfer <player>\` | Transfer ownership to another player. |
| \`/plot trust <player>\` | Grant build access to a player. |
| \`/plot untrust <player>\` | Revoke build access. |
| \`/plot ban <player>\` | Forbid a player from entering. |
| \`/plot members\` | List trusted / banned players. |
| \`/plot abandon\` | Give up the plot (contents preserved for the next owner). |
| \`/plot delete <plot>\` (or \`remove\` / \`demolish\`) | Permanently delete a plot: the land claim is removed and the plot becomes available again. |
| \`/plot browse\` (or \`all\` / \`plots\`) | Browse every plot on the server with sorting. |
| \`/plot bid <amount>\` | Place a bid on the current auction. |
| \`/plot offer <amount>\` | Make a direct cash offer to buy an owned plot you are standing on. |
| \`/plot offers\` | Open the Offers GUI to accept or reject incoming offers on your plots. |
| \`/plot auction\` | Start an auction for your plot. |
| \`/plot auctioninfo\` (or \`/auc\`) | Show the current auction status. |
| \`/worldtp <world>\` | Universal teleport command to teleport you to your last known location in that world. |
| \`/survival\` | Quick warp to the Survival world. |
| \`/city\` | Quick warp to the City world. |

---
**Need more plots?**
Check out our [Ranks on the Store](https://pokefun.in/store) to upgrade your limits!
`;

export default function PlotsGuidePage() {
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
            blockquote: ({node, ...props}) => <blockquote style={{ borderLeft: "4px solid var(--ghost-accent-color)", paddingLeft: "15px", color: "#9ca3af", fontStyle: "italic", margin: "15px 0", background: "rgba(0,0,0,0.2)", padding: "10px 15px", borderRadius: "0 8px 8px 0" }} {...props} />,
          }}
        >
          {plotsContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}
