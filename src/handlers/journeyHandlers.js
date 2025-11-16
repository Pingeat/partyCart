const partyCartService = require('../services/partyCartService');
const sessionService = require('../services/sessionService');
const bookingService = require('../services/bookingService');

function buildGreeting(name = 'there') {
  return `Hey ${name}! I'm the Yumzy Partycart concierge. Tap in for curated menus, 10/20/30-pax carts, live counters, parcel ops, and full planning. Reply with MENU, EXPLORE, COUNTER, RESTAURANT, PARCEL, PLAN, BOOK, ENQUIRE, or HELP.`;
}

function handleMenuFlow(userId, payload = {}) {
  const summary = partyCartService.formatMenuSummary();
  const deepDive = partyCartService.formatMenuCollections();
  sessionService.updatePreferences(userId, 'menus', payload);
  return `Yumzy curated menus:\n\n${summary}\n\nChef specials:\n${deepDive}\n\nReply BOOK to freeze one with your date.`;
}

function handleCounterFlow(userId, payload = {}) {
  const summary = partyCartService.formatLiveCounters();
  sessionService.updatePreferences(userId, 'liveCounters', payload);
  return `Live counter theatre we can set up:\n\n${summary}\n\nTell me your venue/date for chef availability.`;
}

function handleRestaurantFlow(userId, payload = {}) {
  const summary = partyCartService.formatRestaurants();
  sessionService.updatePreferences(userId, 'restaurants', payload);
  return `Trusted restaurant partners on the app:\n\n${summary}\n\nDrop dishes + delivery slot to trigger the kitchen.`;
}

function handleParcelFlow(userId, payload = {}) {
  const summary = partyCartService.formatParcelInfo();
  sessionService.updatePreferences(userId, 'parcel', payload);
  return `Partycart parcel desk:\n${summary}\n\nShare pickup ↔ drop landmarks and handling notes.`;
}

function handlePlanFlow(userId, payload = {}) {
  const summary = partyCartService.formatConciergePerks();
  sessionService.updatePreferences(userId, 'planning', payload);
  return `Concierge perks:\n${summary}\n\nTell me budgets, venues, and agenda beats so I can craft a deck.`;
}

function handleExploreFlow(userId, payload = {}) {
  const packs = partyCartService.formatExploreDeck();
  sessionService.updatePreferences(userId, 'explore', payload);
  return `Party orders ready from the explore tab:\n\n${packs}\n\nPick a cart + date and I'll keep the kitchen on standby.`;
}

function handleBookingFlow(userId, payload = {}) {
  bookingService.startBooking(userId);
  sessionService.updatePreferences(userId, 'bookingIntent', payload);
  return `Let's lock your booking. ${bookingService.getTemplate()}\n\nYou can paste that template with your details or say ENQUIRE for a quick call.`;
}

function handleEnquiryFlow(userId, payload = {}) {
  const contacts = bookingService.getContacts();
  sessionService.updatePreferences(userId, 'enquiry', payload);
  return `Here are the concierge hotlines:\n${contacts}\n\nMessage me again with MENU, BOOK, or EXPLORE when you're ready.`;
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
