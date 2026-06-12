import fs from 'fs';
import path from 'path';

const DIRS = [
  "D:/Downloads/websitework/website/fusionpokemons/Cobblemon Fusiomon - By JIDAIT (1.0.0)/data/cobblemon/species",
  "D:/Downloads/websitework/website/fusionpokemons/Cobblefusions!/data/cobblemon/species_additions"
];

const OUTPUT_FILE = path.join(process.cwd(), 'src/data/fusions.json');

const fusions = [];

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
        
        // For species_additions, the actual name might be embedded or implied.
        // We will fallback to the filename if name is missing.
        const baseName = path.basename(entry.name, '.json');
        
        const extracted = {
          id: data.target || data.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') || baseName,
          name: data.name || baseName.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          nationalPokedexNumber: data.nationalPokedexNumber || null,
          primaryType: data.primaryType || (data.forms && data.forms[0]?.primaryType),
          secondaryType: data.secondaryType || (data.forms && data.forms[0]?.secondaryType),
          baseStats: data.baseStats || (data.forms && data.forms[0]?.baseStats),
          abilities: data.abilities || (data.forms && data.forms[0]?.abilities),
          moves: data.moves || [],
          forms: data.forms?.map(form => ({
            name: form.name,
            primaryType: form.primaryType,
            secondaryType: form.secondaryType,
            baseStats: form.baseStats,
            abilities: form.abilities,
            aspects: form.aspects || [],
            moves: form.moves || []
          })) || []
        };
        
        // Add image field for mapping
        extracted.image = `/images/fakemons/${extracted.name}.png`; 
        
        fusions.push(extracted);
      } catch (e) {
        console.error(`Error parsing ${fullPath}:`, e.message);
      }
    }
  }
}

console.log('Parsing Fusion Datapacks...');
for (const dir of DIRS) {
  parseDirectory(dir);
}

const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(fusions, null, 2));
console.log(`Successfully parsed ${fusions.length} Fusions into ${OUTPUT_FILE}`);
