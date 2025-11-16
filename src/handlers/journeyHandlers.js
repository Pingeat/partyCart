const partyCartService = require('../services/partyCartService');
const sessionService = require('../services/sessionService');

function buildGreeting(name = 'there') {
  return `Hi ${name}! I'm the Yumzy Partycart concierge. I can share curated menus, live counters, restaurant partners, parcel support, or a full planning desk. Reply with MENU, COUNTER, RESTAURANT, PARCEL, PLAN, or HELP.`;
}

function handleMenuFlow(userId, payload = {}) {
  const summary = partyCartService.formatMenuSummary();
  sessionService.updatePreferences(userId, 'menus', payload);
  return `Yumzy curated menus:\n\n${summary}\n\nShare guest count + vibe so I can lock tasting slots.`;
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

module.exports = {
  buildGreeting,
  handleMenuFlow,
  handleCounterFlow,
  handleRestaurantFlow,
  handleParcelFlow,
  handlePlanFlow
};
