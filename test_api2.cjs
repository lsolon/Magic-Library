const http = require('http');

const data = JSON.stringify({ query: 'O Senhor dos Anéis' });
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/search-book',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, res => {
  console.log(`STATUS: ${res.statusCode}`);
  let body = '';
  res.on('data', d => { body += d; });
  res.on('end', () => { console.log('BODY:', body); });
});
req.on('error', error => { console.error(error); });
req.write(data);
req.end();
