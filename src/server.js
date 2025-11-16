const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const config = require('./config/env');
const { verifyWebhook, processWebhook } = require('./webhooks/whatsappWebhook');
const { buildGreeting } = require('./handlers/journeyHandlers');

const publicDir = path.join(__dirname, '..', 'public');

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

function serveStatic(reqPath, res) {
  const filePath = path.join(publicDir, reqPath === '/' ? 'index.html' : reqPath.replace(/^\//, ''));
  if (!filePath.startsWith(publicDir)) {
    sendJson(res, 403, { message: 'Forbidden' });
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      sendJson(res, 404, { message: 'Asset not found' });
      return;
    }
    const ext = path.extname(filePath);
    const contentType =
      ext === '.html'
        ? 'text/html'
        : ext === '.json'
        ? 'application/json'
        : ext === '.txt'
        ? 'text/plain'
        : 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

function collectBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      resolve(data);
    });
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;

  if (req.method === 'GET' && pathname === '/healthz') {
    return sendJson(res, 200, { status: 'ok', uptime: process.uptime() });
  }

  if (req.method === 'GET' && pathname === '/api/ping') {
    return sendJson(res, 200, { message: buildGreeting('partner') });
  }

  if (pathname.startsWith('/webhook/whatsapp')) {
    if (req.method === 'GET') {
      const response = verifyWebhook(query);
      res.writeHead(response.status, { 'Content-Type': 'text/plain' });
      return res.end(response.body);
    }
    if (req.method === 'POST') {
      const rawBody = await collectBody(req);
      let parsedBody = {};
      try {
        parsedBody = rawBody ? JSON.parse(rawBody) : {};
      } catch (error) {
        return sendJson(res, 400, { message: 'Invalid JSON' });
      }
      const response = await processWebhook(parsedBody);
      res.writeHead(response.status, { 'Content-Type': 'text/plain' });
      return res.end(response.body);
    }
    return sendJson(res, 405, { message: 'Method not allowed' });
  }

  if (req.method === 'GET') {
    return serveStatic(pathname, res);
  }

  return sendJson(res, 404, { message: 'Route not found' });
});

if (require.main === module) {
  server.listen(config.port, () => {
    console.log(`Yumzy Partycart server ready on ${config.appUrl}`);
  });
}

module.exports = server;
