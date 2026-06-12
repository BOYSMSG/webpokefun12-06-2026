const fs = require('fs');
const path = require('path');

const modDataDir = 'D:\\Downloads\\websitework\\website\\fusionpokemons\\starlightfusion-fabric-1.8.0\\data\\cobblemon';
const fusionsJsonPath = 'src\\data\\fusions.json';

const fusions = JSON.parse(fs.readFileSync(fusionsJsonPath, 'utf8'));

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
        const fileName = path.basename(file, '.json');
        
        // If it's a new species, it has a name. If it's an addition, it might just have target and forms.
        data._fileName = fileName;
        modSpecies.push(data);
    } catch(e) {}
}

let updated = 0;

for (let fusion of fusions) {
    let matchFound = false;
    let foundType1, foundType2, foundStats;

    // Search logic
    for (const sp of modSpecies) {
        // Direct name match or filename match
        const isNameMatch = sp.name && (sp.name.toLowerCase() === fusion.name.toLowerCase() || sp.name.toLowerCase() === fusion.id.toLowerCase() || fusion.id.toLowerCase().includes(sp.name.toLowerCase()));
        const isFileMatch = sp._fileName.toLowerCase() === fusion.id.toLowerCase() || sp._fileName.toLowerCase() === fusion.name.toLowerCase().replace(/ /g, '_');
        const isTargetMatch = sp.target && sp.target.includes(fusion.name.split(' ')[0].toLowerCase());
        
        if (isNameMatch || isFileMatch || (sp.target && sp.target.includes(fusion.id.toLowerCase()))) {
            if (sp.primaryType) foundType1 = sp.primaryType;
            if (sp.secondaryType) foundType2 = sp.secondaryType;
            if (sp.baseStats) foundStats = sp.baseStats;
            
            // If it defines forms, maybe the stats are inside the form
            if (sp.forms && sp.forms.length > 0) {
                // Try to find a specific form, else use first
                let form = sp.forms[0];
                for (const f of sp.forms) {
                    if (fusion.name.toLowerCase().includes(f.name.toLowerCase())) {
                        form = f;
                        break;
                    }
                }
                if (form.primaryType) foundType1 = form.primaryType;
                if (form.secondaryType) foundType2 = form.secondaryType;
                if (form.baseStats) foundStats = form.baseStats;
            }
            matchFound = true;
            break;
        }

        // Deep search in forms
        if (!matchFound && sp.forms) {
            for (const f of sp.forms) {
                if (f.name && (fusion.name.toLowerCase().includes(f.name.toLowerCase()) || f.name.toLowerCase().includes(fusion.id.toLowerCase()))) {
                    if (f.primaryType) foundType1 = f.primaryType;
                    if (f.secondaryType) foundType2 = f.secondaryType;
                    if (f.baseStats) foundStats = f.baseStats;
                    matchFound = true;
                    break;
                }
            }
        }
        if (matchFound) break;
    }

    if (matchFound) {
        let changed = false;
        if (foundType1 && fusion.primaryType !== foundType1) { fusion.primaryType = foundType1; changed = true; }
        if (foundType2 && fusion.secondaryType !== foundType2) { fusion.secondaryType = foundType2; changed = true; }
        else if (!foundType2 && fusion.secondaryType) { delete fusion.secondaryType; changed = true; } // remove if no secondary
        
        if (foundStats) {
            fusion.baseStats = foundStats;
            changed = true;
        }

        if (changed) {
            console.log(`Updated details for: ${fusion.name}`);
            updated++;
        }
    }
}

if (updated > 0) {
    fs.writeFileSync(fusionsJsonPath, JSON.stringify(fusions, null, 2), 'utf8');
    console.log(`Successfully updated ${updated} fusions with correct stats and types!`);
} else {
    console.log(`No updates made.`);
}
