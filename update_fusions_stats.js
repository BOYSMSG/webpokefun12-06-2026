const fs = require('fs');
const path = require('path');

const modDataDir = 'D:\\Downloads\\websitework\\website\\fusionpokemons\\starlightfusion-fabric-1.8.0\\data\\cobblemon';
const fusionsJsonPath = 'src\\data\\fusions.json';

const fusions = JSON.parse(fs.readFileSync(fusionsJsonPath, 'utf8'));

// Recursively find all json files
function findJsonFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            findJsonFiles(filePath, fileList);
        } else if (file.endsWith('.json')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const allFiles = findJsonFiles(modDataDir);
const modSpecies = [];

for (const file of allFiles) {
    try {
        const data = JSON.parse(fs.readFileSync(file, 'utf8'));
        if (data && data.name) {
            modSpecies.push(data);
        }
    } catch(e) {}
}

let updated = 0;

for (let fusion of fusions) {
    // Find matching species by name or id
    // In fusions.json, id is usually lowercased name.
    // Let's try exact match or includes match.
    // Also, some are like Dragovoir Gardevoir.
    let speciesData = modSpecies.find(s => 
        s.name.toLowerCase() === fusion.name.toLowerCase() || 
        s.name.toLowerCase() === fusion.id.toLowerCase() ||
        fusion.name.toLowerCase().includes(s.name.toLowerCase()) ||
        s.name.toLowerCase().includes(fusion.name.toLowerCase().replace(' shiny', ''))
    );

    // Some specific cases: 
    // Arcevoir -> arcevoir
    // Dragovoir Gardevoir -> dragovoir might be in gardevoir_fusion.json or Dragovoir.json
    
    if (!speciesData) {
        // Look inside 'forms' of existing species if any
        for (const s of modSpecies) {
            if (s.forms) {
                const f = s.forms.find(form => 
                    form.name.toLowerCase() === fusion.name.toLowerCase() || 
                    fusion.name.toLowerCase().includes(form.name.toLowerCase())
                );
                if (f) {
                    speciesData = f;
                    break;
                }
            }
        }
    }

    if (speciesData) {
        // Update stats and types
        if (speciesData.primaryType) fusion.primaryType = speciesData.primaryType;
        if (speciesData.secondaryType) fusion.secondaryType = speciesData.secondaryType;
        if (speciesData.baseStats) fusion.baseStats = speciesData.baseStats;
        
        console.log(`Updated details for: ${fusion.name} (Matched with ${speciesData.name})`);
        updated++;
    }
}

if (updated > 0) {
    fs.writeFileSync(fusionsJsonPath, JSON.stringify(fusions, null, 2), 'utf8');
    console.log(`Successfully updated ${updated} fusions with correct stats and types!`);
} else {
    console.log(`No matches found to update.`);
}
