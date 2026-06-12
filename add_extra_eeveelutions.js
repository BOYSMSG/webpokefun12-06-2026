const fs = require('fs');
const path = require('path');

const baseDir = 'D:\\Downloads\\websitework\\website\\fakemons_fusions_eveelutions_images_and_details\\Eeveelution Extra';
const imagesDir = baseDir; // Assuming images are in the same directory or I need to find them. Wait, let me check the directory contents first.

const destImageDir = 'public\\images\\fakemons';
const jsonPath = 'src\\data\\fakemons.json';
const showcasePath = 'src\\data\\fakemon_showcase.json';

const fakemonsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const showcaseData = JSON.parse(fs.readFileSync(showcasePath, 'utf8'));

function parseDetails(txtPath, baseName) {
    const text = fs.readFileSync(txtPath, 'utf8');
    
    const stats = { hp: 100, attack: 100, defence: 100, special_attack: 100, special_defence: 100, speed: 100 };
    let primaryType = "normal";
    let secondaryType = null;
    let description = "";

    const statMatches = text.matchAll(/- (HP|ATK|DEF|SP\.ATK|SP\.DEF|SPEED):\s*(\d+)/gi);
    for (const match of statMatches) {
        const statName = match[1].toUpperCase();
        const statValue = parseInt(match[2], 10);
        if (statName === 'HP') stats.hp = statValue;
        if (statName === 'ATK') stats.attack = statValue;
        if (statName === 'DEF') stats.defence = statValue;
        if (statName === 'SP.ATK') stats.special_attack = statValue;
        if (statName === 'SP.DEF') stats.special_defence = statValue;
        if (statName === 'SPEED') stats.speed = statValue;
    }

    const typeMatch = text.match(/\*\*__Types:__\*\*[\s\S]*?- (.*?)\n/i);
    if (typeMatch) {
        const typeLine = typeMatch[1];
        const types = typeLine.match(/[a-zA-Z]+/g).filter(t => 
            !t.toLowerCase().startsWith('id') && t.length > 2 && t.toLowerCase() !== 'normal' || t.toLowerCase() === 'normal'
        );
        const cleanTypes = [];
        const parts = typeLine.split('/');
        for (const p of parts) {
            const m = p.match(/> ([a-zA-Z]+)/);
            if (m) cleanTypes.push(m[1].toLowerCase());
            else {
                const words = p.replace(/<[^>]+>/g, '').trim().split(' ');
                if (words.length > 0 && words[0]) cleanTypes.push(words[0].toLowerCase());
            }
        }
        
        if (cleanTypes.length > 0) primaryType = cleanTypes[0];
        if (cleanTypes.length > 1 && cleanTypes[1] !== primaryType) secondaryType = cleanTypes[1];
    }

    const dexMatch = text.match(/\*\*__PokAcdex Entry:__\*\*[\s\S]*?\*([^*]+)\*/i);
    if (dexMatch) {
        description = dexMatch[1].replace(/PokAcmon/g, 'Pokemon').replace(/\n/g, ' ').trim();
    } else {
        const dexMatch2 = text.match(/\*\*__Pok.*dex Entry:__\*\*[\s\S]*?\*([^*]+)\*/i);
        if (dexMatch2) {
            description = dexMatch2[1].replace(/Pok.*mon/gi, 'Pokemon').replace(/\n/g, ' ').trim();
        }
    }

    // Usually baseName has the format "Name - Type Type". We extract just the name.
    const realName = baseName.split(' - ')[0];
    let formattedName = realName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const id = realName.toLowerCase().replace(/[^a-z0-9]/g, '_');

    const imageFiles = fs.readdirSync(imagesDir);
    // Exact or prefix match
    let imgName = imageFiles.find(f => f.toLowerCase() === realName.toLowerCase() + '.png' || f.toLowerCase() === realName.toLowerCase() + '.gif' || f.toLowerCase() === realName.toLowerCase() + '.webp');
    
    if (!imgName) {
        imgName = imageFiles.find(f => f.toLowerCase().startsWith(realName.toLowerCase()) && !f.toLowerCase().includes('shiny') && !f.endsWith('.txt'));
    }
    
    // If not found, try baseName
    if (!imgName) {
        imgName = imageFiles.find(f => f.toLowerCase().startsWith(baseName.toLowerCase()) && !f.toLowerCase().includes('shiny') && !f.endsWith('.txt'));
    }

    let imagePath = null;
    if (imgName) {
        const srcImgPath = path.join(imagesDir, imgName);
        const destImgPath = path.join(destImageDir, imgName);
        if (!fs.existsSync(destImgPath)) {
            fs.copyFileSync(srcImgPath, destImgPath);
            console.log(`Copied image: ${imgName}`);
        }
        imagePath = `/images/fakemons/${imgName}`;
        
        const relatedImages = imageFiles.filter(f => f.toLowerCase().startsWith(realName.toLowerCase()) && f !== imgName && !f.endsWith('.txt'));
        for(const rel of relatedImages) {
            const rSrc = path.join(imagesDir, rel);
            const rDst = path.join(destImageDir, rel);
            if (!fs.existsSync(rDst)) fs.copyFileSync(rSrc, rDst);
            
            if (!showcaseData.some(s => s.filename === rel)) {
                showcaseData.push({
                    filename: rel,
                    name: rel.replace(/\.(png|gif|webp)$/, '').replace(/_/g, ' '),
                    image: `/images/fakemons/${rel}`
                });
            }
        }
        
        if (!showcaseData.some(s => s.filename === imgName)) {
            showcaseData.push({
                filename: imgName,
                name: imgName.replace(/\.(png|gif|webp)$/, '').replace(/_/g, ' '),
                image: imagePath
            });
        }
        
    } else {
        console.log(`WARN: No image found for ${realName}`);
    }

    return {
        id,
        name: formattedName,
        primaryType,
        secondaryType,
        baseStats: stats,
        description,
        image: imagePath || `/images/fakemons/${realName}.png`
    };
}

const txtFiles = fs.readdirSync(baseDir).filter(f => f.endsWith('.txt'));

let added = 0;
for (const file of txtFiles) {
    const baseName = file.replace(/\.txt$/i, '');
    try {
        const newData = parseDetails(path.join(baseDir, file), baseName);
        
        const exists = fakemonsData.some(f => f.id === newData.id || f.name.toLowerCase() === newData.name.toLowerCase());
        if (!exists) {
            fakemonsData.push(newData);
            console.log(`Added ${newData.name} to fakemons.json`);
            added++;
        } else {
            console.log(`${newData.name} already exists. Updating its stats/types just in case.`);
            // Update logic
            let idx = fakemonsData.findIndex(f => f.id === newData.id || f.name.toLowerCase() === newData.name.toLowerCase());
            fakemonsData[idx] = { ...fakemonsData[idx], ...newData, image: fakemonsData[idx].image }; // keep existing image if we didn't find one
            if (newData.image) fakemonsData[idx].image = newData.image;
        }
    } catch (e) {
        console.error(`Error processing ${file}: ${e.message}`);
    }
}

fs.writeFileSync(jsonPath, JSON.stringify(fakemonsData, null, 2), 'utf8');
fs.writeFileSync(showcasePath, JSON.stringify(showcaseData, null, 2), 'utf8');
console.log(`\nSuccessfully processed extra Eeveelutions!`);
