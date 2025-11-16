const catalog = require('../data/catalog');

function formatMenuSummary() {
  return catalog.menus
    .map(
      (menu, index) =>
        `${index + 1}. ${menu.title} — ${menu.focus}\n   ${menu.serves} | Ideal for ${menu.perfectFor}\n   ${menu.pricePerGuest}/guest • Highlights: ${menu.highlights.join(', ')}`
    )
    .join('\n\n');
}

function formatLiveCounters() {
  return catalog.liveCounters
    .map(
      (counter, index) =>
        `${index + 1}. ${counter.title}\n   ${counter.description}\n   Add-ons: ${counter.addOns.join(', ')}`
    )
    .join('\n\n');
}

function formatRestaurants() {
  return catalog.restaurantPartners
    .map(
      (partner, index) =>
        `${index + 1}. ${partner.name}\n   Best for: ${partner.bestFor}\n   Signatures: ${partner.signatureDishes.join(', ')}`
    )
    .join('\n\n');
}

function formatParcelInfo() {
  return `Time slots: ${catalog.parcelService.timeSlots.join(' | ')}\nSafety: ${catalog.parcelService.packageSafety.join(' | ')}\nMax weight: ${catalog.parcelService.maxWeightKg} kg`;
}

function formatConciergePerks() {
  return catalog.conciergePerks.map((perk, index) => `${index + 1}. ${perk}`).join('\n');
}

function formatExploreDeck() {
  return catalog.explorePacks
    .map(
      (pack) =>
        `✨ ${pack.title} (${pack.serves})\n   Starts ${pack.price}\n   Menu peek: ${pack.menu.join(' • ')}\n   ${pack.vibe}`
    )
    .join('\n\n');
}

function formatMenuCollections() {
  return catalog.menuCollections
    .map((collection) => {
      const courses = collection.courses
        .map((course) => `   • ${course.course}: ${course.items.join(', ')}`)
        .join('\n');
      const upgrades = collection.upgrades.map((addon) => `   ◦ ${addon}`).join('\n');
      return `🍽️ ${collection.title}\n   ${collection.serves} | ${collection.basePrice}\n${courses}\n   Service: ${collection.service}\n   Upgrades:\n${upgrades}`;
    })
    .join('\n\n');
}

function formatBookingTemplate() {
  const { headline, fields } = catalog.bookingTemplate;
  const template = fields.map((field) => `${field.label}: ${field.placeholder}`).join('\n');
  return `${headline}\n${template}`;
}

function formatContactChannels() {
  const { bookingDesk, cateringDesk, email } = catalog.contacts;
  return `☎️ Booking desk: ${bookingDesk}\n👨‍🍳 Catering ops: ${cateringDesk}\n✉️ concierge: ${email}`;
}

module.exports = {
  formatMenuSummary,
  formatLiveCounters,
  formatRestaurants,
  formatParcelInfo,
  formatConciergePerks,
  formatExploreDeck,
  formatMenuCollections,
  formatBookingTemplate,
  formatContactChannels
};
