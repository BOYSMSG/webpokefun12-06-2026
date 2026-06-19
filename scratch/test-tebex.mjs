import https from 'https';

const token = "zytu-cdb6d834780837b0d14b729215f76fffb141eade";

https.get(`https://headless.tebex.io/api/accounts/${token}/categories?includePackages=1`, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed.data[0].packages[0], null, 2));
    } catch (e) {
      console.log(data);
    }
  });
});
