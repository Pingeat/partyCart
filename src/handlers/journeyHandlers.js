const partyCartService = require('../services/partyCartService');
const sessionService = require('../services/sessionService');
const bookingService = require('../services/bookingService');
const messageTemplates = require('../services/messageTemplateService');

function buildGreeting(name = 'there') {
  return messageTemplates.buildGreeting(name);
}

function handleMenuFlow(userId, payload = {}) {
  const summary = partyCartService.formatMenuSummary();
  const deepDive = partyCartService.formatMenuCollections();
  sessionService.updatePreferences(userId, 'menus', payload);
  return messageTemplates.buildMenuShowcase(summary, deepDive);
}

function handleCounterFlow(userId, payload = {}) {
  const summary = partyCartService.formatLiveCounters();
  sessionService.updatePreferences(userId, 'liveCounters', payload);
  return messageTemplates.buildCounterSpotlight(summary);
}

function handleRestaurantFlow(userId, payload = {}) {
  const summary = partyCartService.formatRestaurants();
  sessionService.updatePreferences(userId, 'restaurants', payload);
  return messageTemplates.buildRestaurantSpotlight(summary);
}

function handleParcelFlow(userId, payload = {}) {
  const summary = partyCartService.formatParcelInfo();
  sessionService.updatePreferences(userId, 'parcel', payload);
  return messageTemplates.buildParcelBrief(summary);
}

function handlePlanFlow(userId, payload = {}) {
  const summary = partyCartService.formatConciergePerks();
  sessionService.updatePreferences(userId, 'planning', payload);
  return messageTemplates.buildPlanPerks(summary);
}

function handleExploreFlow(userId, payload = {}) {
  const packs = partyCartService.formatExploreDeck();
  sessionService.updatePreferences(userId, 'explore', payload);
  return messageTemplates.buildExploreShowcase(packs);
}

function handleBookingFlow(userId, payload = {}) {
  bookingService.startBooking(userId);
  sessionService.updatePreferences(userId, 'bookingIntent', payload);
  return messageTemplates.buildBookingPrompt(bookingService.getTemplate());
}

function handleEnquiryFlow(userId, payload = {}) {
  const contacts = bookingService.getContacts();
  sessionService.updatePreferences(userId, 'enquiry', payload);
  return messageTemplates.buildEnquiryContacts(contacts);
}

module.exports = {
  buildGreeting,
  handleMenuFlow,
  handleCounterFlow,
  handleRestaurantFlow,
  handleParcelFlow,
  handlePlanFlow,
  handleExploreFlow,
  handleBookingFlow,
  handleEnquiryFlow
};
