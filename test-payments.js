const https = require('https');

const options = {
  hostname: 'plugin.tebex.io',
  port: 443,
  path: '/payments?limit=100',
  method: 'GET',
  headers: {
    'X-Tebex-Secret': '8ade4a17e3704bb90cc7cfeff5758dde3713c6e2'
  }
};

const req = https.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => console.log(data.substring(0, 500)));
});

req.on('error', error => console.error(error));
req.end();
