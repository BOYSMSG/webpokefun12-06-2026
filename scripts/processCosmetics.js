const fs = require('fs');
const path = require('path');

const parsedSkins = require('../parsed_skins.json');
const srcResourcesDir = 'D:\\Downloads\\websitework\\website\\cosmeticpokemons\\coole skins';
const destImagesDir = path.join(__dirname, '..', 'public', 'images', 'cosmetics');

if (!fs.existsSync(destImagesDir)) {
    fs.mkdirSync(destImagesDir, { recursive: true });
}

const finalCosmetics = [];

parsedSkins.forEach((item, index) => {
    let name = item.name.trim();
    // filter out garbage names
    if (
        name.toLowerCase().startsWith('http') ||
        name.toLowerCase() === 'pokemon' ||
        name.toLowerCase() === 'persona' ||
        name.toLowerCase() === 'reference' ||
        name.toLowerCase() === 'normal' ||
        name.toLowerCase() === 'shiny' ||
        name === '' ||
        name.length < 2
    ) {
        return;
    }

    const sourcePath = path.join(srcResourcesDir, item.image);
    if (!fs.existsSync(sourcePath)) {
        console.warn('Missing image:', sourcePath);
        return;
    }

    const ext = path.extname(item.image) || '.jpg';
    
    // Some names have / or \ in them, replace with _
    let safeName = name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    
    // Add index to avoid overwriting (since there are normal/shiny variants)
    const newFileName = `${safeName}_${index}${ext}`;
    const destPath = path.join(destImagesDir, newFileName);
    
    fs.copyFileSync(sourcePath, destPath);

    finalCosmetics.push({
        id: `cosmetic_${index}`,
        name: name,
        image: `/images/cosmetics/${newFileName}`
    });
});

fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'cosmetics.json'), JSON.stringify(finalCosmetics, null, 2));

console.log(`Processed ${finalCosmetics.length} cosmetics.`);
