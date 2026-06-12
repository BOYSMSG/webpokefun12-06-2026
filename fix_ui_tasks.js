const fs = require('fs');
const path = require('path');

// Fix Task B: SettingsWidget.tsx
const settingsPath = path.join(__dirname, 'src/components/SettingsWidget.tsx');
let settings = fs.readFileSync(settingsPath, 'utf8');
settings = settings.replace(/<button onClick=\{cycleLanguage\}.*?<\/button>/gs, '');
fs.writeFileSync(settingsPath, settings);
console.log('Fixed SettingsWidget');

// Fix Task C: Team Page
const teamPath = path.join(__dirname, 'src/app/team/page.tsx');
let team = fs.readFileSync(teamPath, 'utf8');
team = team.replace('{ name: "Smite", role: "Admin"', '{ name: "Smite", role: "Moderator"');
fs.writeFileSync(teamPath, team);
console.log('Fixed Team Page');

// Fix Task E: mainimages.json
const mainimagesPath = path.join(__dirname, 'src/data/mainimages.json');
let mainimages = JSON.parse(fs.readFileSync(mainimagesPath, 'utf8'));
const blockedNames = ['logo.png', 'logo2.png', 'logopfun.png', 'background.png', 'icon32x32.png', 'multiplayerscreen.png'];
mainimages = mainimages.filter(img => !blockedNames.includes(img.filename));
fs.writeFileSync(mainimagesPath, JSON.stringify(mainimages, null, 2));
console.log('Fixed mainimages.json');

// Fix Task D: Ranked styling
const rankedPath = path.join(__dirname, 'src/app/wiki/guides/ranked/page.tsx');
let ranked = fs.readFileSync(rankedPath, 'utf8');
// remove the hardcoded background: 'rgba(15, 23, 42, 0.6)' to support both themes
ranked = ranked.replace(/background: 'rgba\(15, 23, 42, 0\.6\)'/g, "background: 'var(--content-bg)'");
ranked = ranked.replace(/background: 'rgba\(15, 23, 42, 0\.8\)'/g, "background: 'var(--content-bg)'");
fs.writeFileSync(rankedPath, ranked);
console.log('Fixed Ranked Page');
