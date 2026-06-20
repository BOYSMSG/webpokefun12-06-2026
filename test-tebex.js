const https = require('https');

https.get('https://headless.tebex.io/api/accounts/zytu-cdb6d834780837b0d14b729215f76fffb141eade/categories?includePackages=1', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => {
    console.log("Status:", resp.statusCode);
    console.log(data.substring(0, 500));
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
