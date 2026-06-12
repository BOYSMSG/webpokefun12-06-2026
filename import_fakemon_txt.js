const fs = require('fs');
const path = require('path');

const dirs = [
    'D:/Downloads/websitework/website/images/POKEFUN..... BY BLOODY/Fakemon Details',
    'D:/Downloads/websitework/website/images/fakemons_fusions_eveelutions_images_and_details/Fakemon Details',
    'D:/Downloads/websitework/website/images/fakemons_fusions_eveelutions_images_and_details/Eeveelution Extra'
];

const fakemonsPath = path.join(__dirname, 'src/data/fakemons.json');
let fakemonsData = JSON.parse(fs.readFileSync(fakemonsPath, 'utf8'));

// Helper to parse text file into JSON
function parseFakemon(filename, content) {
    const baseName = path.basename(filename, '.txt');
    const name = baseName.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    const id = baseName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();

    let mon = {
        id: id,
        name: name,
        primaryType: "normal",
        secondaryType: null,
        baseStats: {
            hp: 50, attack: 50, defence: 50, special_attack: 50, special_defence: 50, speed: 50
        },
        abilities: [],
        forms: [],
        moves: [],
        description: "",
        image: `/images/fakemons/${baseName}.png` // Fallback
    };

    // Very naive parsing based on common structure
    const lines = content.split('\n');
    let currentSection = "";
    for (let line of lines) {
        line = line.trim();
        if (line.startsWith('**__')) {
            currentSection = line.replace(/[*_:]/g, '').trim().toLowerCase();
            continue;
        }
        
        if (!line || line === '-') continue;

        if (currentSection === "types") {
            // E.g. - <:flying:1432...> Flying/<:fairy:1432...> Fairy
            const match = line.replace(/<:[^>]+>/g, '').replace('-', '').trim();
            const parts = match.split('/');
            if (parts[0]) mon.primaryType = parts[0].replace(/[^a-zA-Z]/g, '').toLowerCase();
            if (parts[1]) mon.secondaryType = parts[1].replace(/[^a-zA-Z]/g, '').toLowerCase();
        }
        else if (currentSection === "stats") {
            const match = line.replace('-', '').trim().split(':');
            if (match.length >= 2) {
                const stat = match[0].trim().toLowerCase();
                const val = parseInt(match[1].trim());
                if (!isNaN(val)) {
                    if (stat === 'hp') mon.baseStats.hp = val;
                    if (stat === 'atk') mon.baseStats.attack = val;
                    if (stat === 'def') mon.baseStats.defence = val;
                    if (stat === 'sp.atk') mon.baseStats.special_attack = val;
                    if (stat === 'sp.def') mon.baseStats.special_defence = val;
                    if (stat === 'speed') mon.baseStats.speed = val;
                }
            }
        }
        else if (currentSection === "abilities") {
            const ability = line.replace('-', '').trim();
            if (ability && !ability.startsWith('<')) {
                let abName = ability.toLowerCase().replace(' (hidden)', '').trim();
                if (ability.includes('Hidden')) abName = 'h:' + abName;
                mon.abilities.push(abName);
            }
        }
        else if (currentSection === "pokedex entry") {
            mon.description += line.replace(/\*/g, '').trim() + " ";
        }
    }
    
    return mon;
}

let addedCount = 0;
let updatedCount = 0;
for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (!file.endsWith('.txt')) continue;
        
        const content = fs.readFileSync(path.join(dir, file), 'utf8');
        const parsedMon = parseFakemon(file, content);
        
        // Check if already exists
        const existingIdx = fakemonsData.findIndex(m => m.id === parsedMon.id || m.name.toLowerCase() === parsedMon.name.toLowerCase());
        
        if (existingIdx !== -1) {
            // Merge stats and types
            if (parsedMon.primaryType) fakemonsData[existingIdx].primaryType = parsedMon.primaryType;
            if (parsedMon.secondaryType) fakemonsData[existingIdx].secondaryType = parsedMon.secondaryType;
            if (parsedMon.baseStats.hp !== 50 || parsedMon.baseStats.attack !== 50) {
                fakemonsData[existingIdx].baseStats = parsedMon.baseStats;
            }
            if (parsedMon.abilities.length > 0) fakemonsData[existingIdx].abilities = parsedMon.abilities;
            updatedCount++;
        } else {
            fakemonsData.push(parsedMon);
            addedCount++;
        }
    }
}

fs.writeFileSync(fakemonsPath, JSON.stringify(fakemonsData, null, 2));
console.log(`Added ${addedCount} new mons. Updated ${updatedCount} existing mons.`);
