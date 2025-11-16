const fs = require('fs');
const path = require('path');

const envPath = process.env.DOTENV_CONFIG_PATH || path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split(/\r?\n/);
  lines.forEach((line) => {
    if (!line || line.trim().startsWith('#')) return;
    const [key, ...rest] = line.split('=');
    const value = rest.join('=').trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

module.exports = {
  port: parseInt(process.env.PORT, 10) || 4000,
  appUrl: process.env.APP_URL || 'http://localhost:4000',
  verifyToken: process.env.META_VERIFY_TOKEN || 'yumzy-partycart-verify',
  whatsapp: {
    token: process.env.META_WHATSAPP_TOKEN || '',
    phoneNumberId: process.env.META_WHATSAPP_PHONE_NUMBER_ID || ''
  }
};
