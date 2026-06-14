const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const tokenMatch = env.match(/TEBEX_PUBLIC_TOKEN="?([^"\n]+)"?/);
const secretMatch = env.match(/TEBEX_PRIVATE_KEY="?([^"\n]+)"?/);
const token = tokenMatch ? tokenMatch[1].trim() : '';
process.env.TEBEX_PRIVATE_KEY = secretMatch ? secretMatch[1].trim() : '';

async function test() {
  // Test 1: Query param
  let res = await fetch(`https://headless.tebex.io/api/accounts/${token}/categories?includePackages=1&currency=EUR`);
  let data = await res.json();
  console.log("Categories raw keys:", Object.keys(data));
  if (data.data) {
     console.log("First category packages:", data.data[0]?.packages?.length);
     console.log("First package sample:", data.data[0]?.packages?.[0]);
  } else {
     console.log("Data:", data);
  }
  let exRes = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
  let exData = await exRes.json();
  console.log("Exchange Rate EUR:", exData.rates['EUR']);
  console.log("Exchange Rate INR:", exData.rates['INR']);
}

test();
