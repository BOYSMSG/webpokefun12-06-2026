const fs = require('fs');

const galleryHtmlPath = 'D:\\Downloads\\websitework\\website\\cosmeticpokemons\\coole skins\\Gallery.html';
const mainHtmlPath = 'D:\\Downloads\\websitework\\website\\cosmeticpokemons\\coole skins\\Main.html';

function parse(file) {
    const html = fs.readFileSync(file, 'utf-8');
    
    // 1. Extract posObj calls
    const posObjs = [];
    const regex = /posObj\('[^']+',\s*'([^']+)',\s*(\d+),\s*(\d+)/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
        posObjs.push({
            embedId: match[1],
            row: parseInt(match[2]), // 0-indexed or 1-indexed
            col: parseInt(match[3])
        });
    }

    // 2. Extract embedId -> imageSrc mapping
    const embeds = {};
    const embedRegex = /<div id='([^']+)'[^>]*><img src='(resources\/image_[^']+)'/g;
    while ((match = embedRegex.exec(html)) !== null) {
        embeds[match[1]] = match[2];
    }

    // 3. Extract table rows and cols
    const rows = html.split('</tr>');
    const tableData = rows.map(r => {
        let cols = r.split(/<td[^>]*>/);
        cols.shift();
        return cols.map(c => c.split('</td>')[0].replace(/<[^>]+>/g, '').trim());
    });

    // 4. Combine
    const results = [];
    for (let pos of posObjs) {
        let imgSrc = embeds[pos.embedId];
        if (imgSrc) {
            // Find text in the same row, in a previous column
            let r = pos.row;
            if (tableData[r]) {
                let name = "";
                for(let c = pos.col - 1; c >= 0; c--) {
                    let text = tableData[r][c];
                    if (text && text !== "Normal" && text !== "Shiny" && !text.includes("Reference")) {
                        name = text;
                        break;
                    }
                }
                if (name) {
                    results.push({ name, image: imgSrc });
                }
            }
        }
    }
    return results;
}

const resG = parse(galleryHtmlPath);
const resM = parse(mainHtmlPath);
const combined = [...resM, ...resG];
fs.writeFileSync('parsed_skins.json', JSON.stringify(combined, null, 2));
console.log("Parsed", combined.length, "skins.");
