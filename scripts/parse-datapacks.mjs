import fs from 'fs';
import path from 'path';

const DIRS = [
  "D:/Downloads/websitework/website/fakemons/Laser's Fakemon Pack v1.5.5/data/cobblemon/species",
  "D:/Downloads/websitework/website/fakemons/SpaceworldMons-3.0-1.21.1/data/cobblemon/species"
];

const OUTPUT_FILE = path.join(process.cwd(), 'src/data/fakemons.json');

const fakemons = [];

function parseDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      parseDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const data = JSON.parse(content);
        
        // Extract basic data
        const extracted = {
          id: data.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          name: data.name,
          nationalPokedexNumber: data.nationalPokedexNumber || null,
          primaryType: data.primaryType,
          secondaryType: data.secondaryType,
          baseStats: data.baseStats,
          abilities: data.abilities,
          moves: data.moves || [],
          forms: data.forms?.map(form => ({
            name: form.name,
            primaryType: form.primaryType || data.primaryType,
            secondaryType: form.secondaryType || data.secondaryType,
            baseStats: form.baseStats || data.baseStats,
            abilities: form.abilities || data.abilities,
            aspects: form.aspects || [],
            moves: form.moves || []
          })) || []
        };
        fakemons.push(extracted);
      } catch (e) {
        console.error(`Error parsing ${fullPath}:`, e.message);
      }
    }
  }
}

console.log('Parsing Fakemon Datapacks...');
for (const dir of DIRS) {
  parseDirectory(dir);
}

// Ensure the directory exists
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(fakemons, null, 2));
console.log(`Successfully parsed ${fakemons.length} Fakemons into ${OUTPUT_FILE}`);
