const catalog = require('../data/catalog');

function formatMenuSummary() {
  return catalog.menus
    .map(
      (menu, index) =>
        `${index + 1}. ${menu.title} — ${menu.focus}\n   Ideal for: ${menu.perfectFor}\n   ₹${menu.pricePerGuest}/guest • Highlights: ${menu.highlights.join(', ')}`
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

module.exports = {
  formatMenuSummary,
  formatLiveCounters,
  formatRestaurants,
  formatParcelInfo,
  formatConciergePerks
};
