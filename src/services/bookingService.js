const sessionService = require('./sessionService');
const partyCartService = require('./partyCartService');

const REQUIRED_FIELDS = ['guestCount', 'menu', 'date', 'time'];
const LABELS = {
  guestCount: 'Guests',
  menu: 'Menu / cart',
  date: 'Date',
  time: 'Service window',
  venue: 'Venue',
  notes: 'Notes'
};

function startBooking(userId) {
  sessionService.updatePreferences(userId, 'booking', {
    stage: 'awaiting-details',
    details: {}
  });
}

function parseBookingDetails(text = '') {
  const details = {};
  if (!text) return details;
  const segments = text
    .split(/\n|,|;/)
    .map((segment) => segment.trim())
    .filter(Boolean);
  segments.forEach((segment) => {
    const [rawKey, ...rest] = segment.split(/[:\-]/);
    if (!rest.length) return;
    const key = rawKey.toLowerCase();
    const value = rest.join(':').trim();
    if (!value) return;
    if (/(guest|pax|people)/.test(key)) {
      details.guestCount = value;
    } else if (/(menu|cart|cuisine)/.test(key)) {
      details.menu = value;
    } else if (/(date|day)/.test(key)) {
      details.date = value;
    } else if (/(time|slot|window|service)/.test(key)) {
      details.time = value;
    } else if (/(venue|location|address)/.test(key)) {
      details.venue = value;
    } else if (/(note|pref|allerg|extra)/.test(key)) {
      details.notes = value;
    }
  });
  return details;
}

function hasStructuredData(parsed = {}) {
  return Object.keys(parsed).length > 0;
}

function mergeBookingDetails(userId, parsed = {}) {
  const session = sessionService.getSession(userId);
  const currentDetails = session.preferences.booking?.details || {};
  const details = { ...currentDetails, ...parsed };
  const missing = REQUIRED_FIELDS.filter((field) => !details[field]);
  const stage = missing.length ? 'awaiting-details' : 'submitted';
  sessionService.updatePreferences(userId, 'booking', { stage, details });
  return { details, missing, stage };
}

function formatBookingRecap(details = {}) {
  const order = [...REQUIRED_FIELDS, 'venue', 'notes'];
  return order
    .filter((field) => details[field])
    .map((field) => `• ${LABELS[field]}: ${details[field]}`)
    .join('\n');
}

function formatMissingFields(missing = []) {
  if (!missing.length) return '';
  return missing.map((field) => LABELS[field]).join(', ');
}

function getTemplate() {
  return partyCartService.formatBookingTemplate();
}

function getContacts() {
  return partyCartService.formatContactChannels();
}

function buildConfirmation(details = {}) {
  return {
    recap: formatBookingRecap(details),
    contacts: getContacts()
  };
}

module.exports = {
  startBooking,
  parseBookingDetails,
  hasStructuredData,
  mergeBookingDetails,
  formatBookingRecap,
  formatMissingFields,
  getTemplate,
  getContacts,
  buildConfirmation
};
