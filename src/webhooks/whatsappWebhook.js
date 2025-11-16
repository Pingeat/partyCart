const config = require('../config/env');
const whatsappService = require('../services/whatsappService');
const sessionService = require('../services/sessionService');
const bookingService = require('../services/bookingService');
const {
  buildGreeting,
  handleMenuFlow,
  handleCounterFlow,
  handleRestaurantFlow,
  handleParcelFlow,
  handlePlanFlow,
  handleExploreFlow,
  handleBookingFlow,
  handleEnquiryFlow
} = require('../handlers/journeyHandlers');

const COMMANDS = ['menu', 'counter', 'restaurant', 'parcel', 'plan', 'explore', 'book', 'enquire', 'help'];

function detectCommand(text = '') {
  return COMMANDS.find((command) => text.startsWith(command));
}

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
  const command = detectCommand(normalized);

  sessionService.appendTranscript(from, 'guest', textBody);
  const session = sessionService.getSession(from);
  const bookingState = session.preferences.booking;

  let reply;
  if (!command && bookingState?.stage === 'awaiting-details' && textBody) {
    const parsed = bookingService.parseBookingDetails(textBody);
    if (bookingService.hasStructuredData(parsed)) {
      const { details, missing, stage } = bookingService.mergeBookingDetails(from, parsed);
      if (stage === 'submitted') {
        reply = bookingService.buildConfirmation(details);
      } else {
        reply = `Almost locked in! I still need: ${bookingService.formatMissingFields(missing)}\n\n${bookingService.getTemplate()}`;
      }
    } else {
      reply = `Let's use the template so I capture every detail:\n${bookingService.getTemplate()}`;
    }
  } else if (command === 'menu') {
    reply = handleMenuFlow(from);
  } else if (command === 'counter') {
    reply = handleCounterFlow(from);
  } else if (command === 'restaurant') {
    reply = handleRestaurantFlow(from);
  } else if (command === 'parcel') {
    reply = handleParcelFlow(from);
  } else if (command === 'plan') {
    reply = handlePlanFlow(from);
  } else if (command === 'explore') {
    reply = handleExploreFlow(from);
  } else if (command === 'book') {
    reply = handleBookingFlow(from);
  } else if (command === 'enquire') {
    reply = handleEnquiryFlow(from);
  } else if (command === 'help') {
    reply = buildGreeting(profileName);
  } else {
    reply = `${buildGreeting(profileName)}\n\nYou can also reply with MENU, EXPLORE, COUNTER, RESTAURANT, PARCEL, PLAN, BOOK, or ENQUIRE.`;
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
