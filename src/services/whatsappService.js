const https = require('https');
const { URL } = require('url');
const config = require('../config/env');

function postJson(urlString, payload, headers = {}) {
  const url = new URL(urlString);
  const body = JSON.stringify(payload);

  const options = {
    method: 'POST',
    hostname: url.hostname,
    path: url.pathname + url.search,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
      ...headers
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode >= 400) {
          return reject(new Error(`WhatsApp API error: ${res.statusCode} ${data}`));
        }
        try {
          resolve(JSON.parse(data || '{}'));
        } catch (error) {
          reject(error);
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function sendMessage(to, body) {
  if (!config.whatsapp.token || !config.whatsapp.phoneNumberId) {
    console.info('[whatsapp] Credentials missing, logging message instead.');
    console.info(body);
    return { skipped: true };
  }

  return postJson(
    `https://graph.facebook.com/v17.0/${config.whatsapp.phoneNumberId}/messages`,
    {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body }
    },
    {
      Authorization: `Bearer ${config.whatsapp.token}`
    }
  );
}

module.exports = { sendMessage };
