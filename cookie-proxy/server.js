const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.text({ type: '*/*' }));

app.all('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send('Missing ?url=');

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers['authorization'] && { 'Authorization': req.headers['authorization'] })
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined
    });

    const data = await response.text();

    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(response.status).send(data);
  } catch (err) {
    res.status(500).send('Proxy error: ' + err.message);
  }
});

app.options('/proxy', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Proxy running on port ' + PORT));