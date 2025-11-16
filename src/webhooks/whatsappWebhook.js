const config = require('../config/env');
const whatsappService = require('../services/whatsappService');
const sessionService = require('../services/sessionService');
const {
  buildGreeting,
  handleMenuFlow,
  handleCounterFlow,
  handleRestaurantFlow,
  handleParcelFlow,
  handlePlanFlow
} = require('../handlers/journeyHandlers');

function verifyWebhook(query) {
  const mode = query['hub.mode'];
  const token = query['hub.verify_token'];
  const challenge = query['hub.challenge'];

  if (mode === 'subscribe' && token === config.verifyToken) {
    return { status: 200, body: challenge };
  }
  return { status: 403, body: 'Forbidden' };
}

async function processWebhook(body = {}) {
  const change = body?.entry?.[0]?.changes?.[0]?.value;
  const message = change?.messages?.[0];
  if (!message) {
    return { status: 200, body: 'noop' };
  }

  const from = message.from;
  const profileName = change?.contacts?.[0]?.profile?.name || 'there';
  const textBody = (message.text?.body || '').trim();
  const normalized = textBody.toLowerCase();

  sessionService.appendTranscript(from, 'guest', textBody);

  let reply;
  if (normalized.startsWith('menu')) {
    reply = handleMenuFlow(from);
  } else if (normalized.startsWith('counter')) {
    reply = handleCounterFlow(from);
  } else if (normalized.startsWith('restaurant')) {
    reply = handleRestaurantFlow(from);
  } else if (normalized.startsWith('parcel')) {
    reply = handleParcelFlow(from);
  } else if (normalized.startsWith('plan')) {
    reply = handlePlanFlow(from);
  } else if (normalized.startsWith('help')) {
    reply = buildGreeting(profileName);
  } else {
    reply = `${buildGreeting(profileName)}\n\nYou can also reply with MENU, COUNTER, RESTAURANT, PARCEL, or PLAN.`;
  }

  sessionService.appendTranscript(from, 'concierge', reply);

  try {
    await whatsappService.sendMessage(from, reply);
  } catch (error) {
    console.error('[whatsapp] Failed to send message', error.message);
  }

  return { status: 200, body: 'ok' };
}

module.exports = {
  verifyWebhook,
  processWebhook
};
