import React from "react";
import Link from "next/link";
import fs from "fs";
import path from "path";

export default function FusionDex() {
  const fusionsPath = path.join(process.cwd(), 'src/data/fusions.json');
  let fusions: any[] = [];
  
  if (fs.existsSync(fusionsPath)) {
    fusions = JSON.parse(fs.readFileSync(fusionsPath, 'utf-8'));
  }

  // Find image for fusion using fakemon_showcase
  const showcasePath = path.join(process.cwd(), 'src/data/fakemon_showcase.json');
  let showcase: any[] = [];
  if (fs.existsSync(showcasePath)) {
    showcase = JSON.parse(fs.readFileSync(showcasePath, 'utf-8'));
  }

  const getFusionImage = (fusionName: string) => {
     const match = showcase.find(s => s.name.toLowerCase().includes(fusionName.toLowerCase()));
     return match ? match.image : `/images/fakemons/${fusionName.toLowerCase().replace(/ /g, '_')}.png`;
  };

  return (
    <div className="inner" style={{ padding: "60px 0", maxWidth: "1200px", margin: "0 auto" }}>
      <Link href="/wiki" style={{ color: "#0070f3", textDecoration: "none", fontWeight: "bold", display: "inline-block", marginBottom: "20px" }}>
        &larr; Back to Wiki
      </Link>
      
      <h1 style={{ fontSize: "3rem", textAlign: "center", marginBottom: "10px", fontWeight: 800 }}>Fusion Dex</h1>
      <p style={{ textAlign: "center", color: "gray", fontSize: "1.2rem", maxWidth: "800px", margin: "0 auto 50px" }}>
        Discover powerful fused Pokemon! View their custom typings, stats, and movesets.
      </p>

      {fusions.length === 0 ? (
         <p style={{ textAlign: "center" }}>No Fusions found in datapack.</p>
      ) : (
        <div className="fakemons-grid">
          {fusions.map((fusion, idx) => (
            <Link href={`/wiki/fusions/${fusion.id}`} key={idx} style={{ textDecoration: "none", color: "inherit" }}>
              <div className="fakemon-card">
                <img 
                  src={fusion.image}
                  alt={fusion.name} 
                  className="fakemon-img"
                />
                <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "5px", textTransform: "capitalize" }}>
                  {fusion.name.replace(/_/g, ' ')}
                </h3>
                <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "10px" }}>
                  {fusion.primaryType && (
                     <span className={`type-badge type-${fusion.primaryType.toLowerCase()}`}>{fusion.primaryType}</span>
                  )}
                  {fusion.secondaryType && (
                     <span className={`type-badge type-${fusion.secondaryType.toLowerCase()}`}>{fusion.secondaryType}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .type-badge {
           display: inline-block;
           padding: 4px 10px;
           border-radius: 4px;
           font-size: 0.8rem;
           font-weight: bold;
           color: #fff;
           text-transform: uppercase;
        }
        .type-normal { background: #A8A77A; }
        .type-fire { background: #EE8130; }
        .type-water { background: #6390F0; }
        .type-electric { background: #F7D02C; }
        .type-grass { background: #7AC74C; }
        .type-ice { background: #96D9D6; }
        .type-fighting { background: #C22E28; }
        .type-poison { background: #A33EA1; }
        .type-ground { background: #E2BF65; }
        .type-flying { background: #A98FF3; }
        .type-psychic { background: #F95587; }
        .type-bug { background: #A6B91A; }
        .type-rock { background: #B6A136; }
        .type-ghost { background: #735797; }
        .type-dragon { background: #6F35FC; }
        .type-dark { background: #705848; }
        .type-steel { background: #B7B7CE; }
        .type-fairy { background: #D685AD; }
      `}} />
    </div>
  );
}
