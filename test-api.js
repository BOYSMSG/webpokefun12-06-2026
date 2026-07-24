const https = require('https');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Node.js' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function testAPIs() {
  console.log("Testing minetools.eu with port 45042...");
  try {
    const data = await fetchJson("https://api.minetools.eu/ping/play.pokefun.in/45042");
    console.log("minetools.eu online:", !data.error, "players:", data.players?.online);
  } catch (e) {
    console.error("minetools.eu failed:", e.message);
  }

  console.log("Testing mcapi.us with port 45042...");
  try {
    const data = await fetchJson("https://mcapi.us/server/status?ip=play.pokefun.in&port=45042");
    console.log("mcapi.us online:", data.online, "players:", data.players?.now);
  } catch (e) {
    console.error("mcapi.us failed:", e.message);
  }
}

testAPIs();
