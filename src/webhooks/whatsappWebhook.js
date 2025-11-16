const config = require('../config/env');
const whatsappService = require('../services/whatsappService');
const sessionService = require('../services/sessionService');
const bookingService = require('../services/bookingService');
const messageTemplates = require('../services/messageTemplateService');
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

  console.info('[webhook] Incoming WhatsApp message', {
    from,
    profileName,
    textBody,
    command: command || 'fallback',
    messageId: message.id
  });

  sessionService.appendTranscript(from, 'guest', textBody);
  const session = sessionService.getSession(from);
  const bookingState = session.preferences.booking;

  let reply;
  if (!command && bookingState?.stage === 'awaiting-details' && textBody) {
    const parsed = bookingService.parseBookingDetails(textBody);
    if (bookingService.hasStructuredData(parsed)) {
      const { details, missing, stage } = bookingService.mergeBookingDetails(from, parsed);
      if (stage === 'submitted') {
        const confirmation = bookingService.buildConfirmation(details);
        reply = messageTemplates.buildBookingConfirmation(confirmation);
      } else {
        reply = messageTemplates.buildBookingMissingFields(
          bookingService.formatMissingFields(missing),
          bookingService.getTemplate()
        );
      }
    } else {
      reply = messageTemplates.buildBookingTemplateHint(bookingService.getTemplate());
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
    reply = messageTemplates.buildFallback(profileName);
  }

  if (!reply) {
    reply = messageTemplates.buildGreeting(profileName);
  }

  sessionService.appendTranscript(from, 'concierge', reply.preview);

  console.info('[webhook] Prepared reply', {
    to: from,
    preview: reply.preview,
    type: reply.payload?.type,
    template: reply.payload?.template?.name
  });

  try {
    await whatsappService.sendMessage(from, reply.payload);
  } catch (error) {
    console.error('[whatsapp] Failed to send message', {
      to: from,
      error: error.message,
      statusCode: error.statusCode,
      code: error.response?.error?.code,
      template: reply.payload?.template?.name
    });

    const missingTemplate = error.response?.error?.code === 132001;
    if (missingTemplate && reply.preview) {
      console.warn('[whatsapp] Falling back to text message for missing template', {
        to: from,
        template: reply.payload?.template?.name
      });
      try {
        await whatsappService.sendMessage(from, {
          type: 'text',
          text: { body: reply.preview }
        });
      } catch (fallbackError) {
        console.error('[whatsapp] Fallback text send failed', fallbackError.message);
      }
    }
  }

  return { status: 200, body: 'ok' };
}

module.exports = {
  verifyWebhook,
  processWebhook
};
