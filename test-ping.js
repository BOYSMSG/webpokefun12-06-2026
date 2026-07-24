const https = require('https');

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function scrapePlayers() {
  try {
    console.log("Fetching minecraftbestservers.com...");
    const html = await fetchHtml("https://minecraftbestservers.com/server-pokefun.4851/");
    // Look for something like "18 online" or "Players</td><td>18 online"
    const match = html.match(/(\d+)\s+online/i);
    if (match) {
      console.log("Scraped Player Count:", match[1]);
    } else {
      console.log("Could not find player count in HTML.");
    }
  } catch (e) {
    console.error("Scraping failed:", e.message);
  }
}

scrapePlayers();
