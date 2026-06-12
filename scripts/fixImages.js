const fs = require('fs');
const path = require('path');

const fakemonsPath = path.join(process.cwd(), 'src/data/fakemons.json');
const fusionsPath = path.join(process.cwd(), 'src/data/fusions.json');
const imagesDir = path.join(process.cwd(), 'public/images/fakemons');

let fakemons = JSON.parse(fs.readFileSync(fakemonsPath, 'utf8'));
let fusions = JSON.parse(fs.readFileSync(fusionsPath, 'utf8'));
const images = fs.readdirSync(imagesDir);

function findBestImage(name) {
    name = name.toLowerCase();
    
    // Exact match
    let match = images.find(img => img.toLowerCase().replace(/\.(png|gif|webp)$/, '') === name);
    if (match) return `/images/fakemons/${match}`;

    // Without shiny prefix
    match = images.find(img => img.toLowerCase().replace('shiny ', '').replace(/\.(png|gif|webp)$/, '') === name);
    if (match) return `/images/fakemons/${match}`;

    // Contains the name
    match = images.find(img => img.toLowerCase().includes(name));
    if (match) return `/images/fakemons/${match}`;

    // Name contains the image name
    match = images.find(img => {
        let cleanName = img.toLowerCase().replace('shiny ', '').replace(/\.(png|gif|webp)$/, '').trim();
        return cleanName.length > 3 && name.includes(cleanName);
    });
    if (match) return `/images/fakemons/${match}`;

    // Try splitting by space
    let firstWord = name.split(' ')[0];
    if (firstWord.length > 3) {
        match = images.find(img => img.toLowerCase().includes(firstWord));
        if (match) return `/images/fakemons/${match}`;
    }

    return `/images/fakemons/${name.replace(/ /g, '_')}.png`; // fallback
}

fakemons.forEach(f => {
    f.image = findBestImage(f.name);
});

fusions.forEach(f => {
    f.image = findBestImage(f.name);
});

fs.writeFileSync(fakemonsPath, JSON.stringify(fakemons, null, 2));
fs.writeFileSync(fusionsPath, JSON.stringify(fusions, null, 2));

console.log("Updated images mapping!");
