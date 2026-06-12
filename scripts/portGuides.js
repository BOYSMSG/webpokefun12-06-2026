const fs = require('fs');
const path = require('path');

const sourceDir = path.join(process.cwd(), 'D:/Downloads/websitework/website/websites/feturesdetail');
// Fallback if that absolute path fails (sometimes process.cwd() gets duplicated if not careful):
const actualSourceDir = 'D:/Downloads/websitework/website/websites/feturesdetail';
const destBaseDir = path.join(process.cwd(), 'src/app/wiki/guides');

const fileMapping = {
    'alphazone.html': 'alphazone',
    'battletower.html': 'battletower',
    'cobblebosses.html': 'cobblebosses',
    'cobblemonnpcs.html': 'npc',
    'dungeon.html': 'dungeon',
    'features.html': 'features',
    'fusion.html': 'fusion',
    'raids.html': 'raid',
    'ranked.html': 'ranked'
};

if (!fs.existsSync(destBaseDir)) {
    fs.mkdirSync(destBaseDir, { recursive: true });
}

for (const [filename, slug] of Object.entries(fileMapping)) {
    const sourcePath = path.join(actualSourceDir, filename);
    if (!fs.existsSync(sourcePath)) {
        console.error("Missing: " + sourcePath);
        continue;
    }

    let htmlContent = fs.readFileSync(sourcePath, 'utf8');
    
    // Extract everything inside <head> styles and <body>
    let styleMatch = htmlContent.match(/<style>([\s\S]*?)<\/style>/);
    let bodyMatch = htmlContent.match(/<body>([\s\S]*?)<\/body>/);
    
    let style = styleMatch ? styleMatch[1] : '';
    let body = bodyMatch ? bodyMatch[1] : htmlContent; // fallback to all if no body tag
    
    // Scope the styles to this component to avoid bleeding, or just inject
    // actually, let's just dump it in dangerouslySetInnerHTML to preserve 100% of the content.
    
    const destDir = path.join(destBaseDir, slug);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    
    const pageTsxContent = `
import React from 'react';

export default function GuidePage() {
  return (
    <div className="wiki-content-wrapper">
      <style dangerouslySetInnerHTML={{__html: \`${style.replace(/`/g, '\\`').replace(/\$/g, '\\$')} 
      /* Overrides to fit into the dark theme Nextjs layout */
      .wiki-content-wrapper { color: var(--text, #e0e0e0); font-family: 'Segoe UI', system-ui, sans-serif; }
      .wiki-content-wrapper body { background: transparent !important; padding: 0; }
      \`}} />
      <div dangerouslySetInnerHTML={{__html: \`${body.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`}} />
    </div>
  );
}
`;

    fs.writeFileSync(path.join(destDir, 'page.tsx'), pageTsxContent);
    console.log(`Ported ${filename} to /wiki/guides/${slug}`);
}
