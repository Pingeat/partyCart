const https = require('https');
const { URL } = require('url');
const config = require('../config/env');

function safeJsonParse(value) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

function buildHttpError(statusCode, responseText) {
  const parsed = safeJsonParse(responseText);
  const details = parsed?.error?.message || responseText || 'Unknown error';
  const error = new Error(`WhatsApp API error: ${statusCode} ${details}`);
  error.statusCode = statusCode;
  error.raw = responseText;
  error.response = parsed;
  return error;
}

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
        const parsed = safeJsonParse(data);
        if (res.statusCode >= 400) {
          return reject(buildHttpError(res.statusCode, data));
        }
        resolve(parsed || {});
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function sendMessage(to, message = {}) {
  if (!config.whatsapp.token || !config.whatsapp.phoneNumberId) {
    console.info('[whatsapp] Credentials missing, logging message instead.');
    console.info(JSON.stringify({ to, ...message }, null, 2));
    return { skipped: true };
  }

  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: message.type || 'text'
  };

  if (payload.type === 'template') {
    payload.template = message.template;
  } else if (message.text?.body) {
    payload.text = { body: message.text.body };
  } else {
    payload.text = { body: message.body || '' };
  }

  console.info('[whatsapp] Sending message', {
    to,
    type: payload.type,
    template: payload.template?.name
  });

  const response = await postJson(
    `https://graph.facebook.com/v17.0/${config.whatsapp.phoneNumberId}/messages`,
    payload,
    {
      Authorization: `Bearer ${config.whatsapp.token}`
    }
  );

  const messageId = response?.messages?.[0]?.id;
  if (messageId) {
    console.info('[whatsapp] Message accepted', { to, messageId });
  }

  return response;
}

module.exports = { sendMessage };
