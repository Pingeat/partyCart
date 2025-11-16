const DEFAULT_LANGUAGE = { code: 'en_US' };

function clamp(text = '', limit = 1024) {
  if (!text) return '';
  if (text.length <= limit) return text;
  return `${text.slice(0, limit - 1)}…`;
}

function createTemplatePayload(name, { headerText, bodyParams = [], buttons = [] } = {}) {
  const components = [];
  if (headerText) {
    components.push({
      type: 'header',
      parameters: [{ type: 'text', text: clamp(headerText, 60) }]
    });
  }
  if (bodyParams.length) {
    components.push({
      type: 'body',
      parameters: bodyParams.map((text) => ({ type: 'text', text: clamp(text) }))
    });
  }
  buttons.slice(0, 3).forEach((button, index) => {
    const params = [];
    if (button.subType === 'url') {
      params.push({ type: 'text', text: clamp(button.text || '') });
    } else if (button.payload) {
      params.push({ type: 'payload', payload: button.payload });
    }
    components.push({
      type: 'button',
      sub_type: button.subType || 'quick_reply',
      index: `${index}`,
      parameters: params
    });
  });
  return {
    type: 'template',
    template: {
      name,
      language: DEFAULT_LANGUAGE,
      components
    }
  };
}

function createTextPayload(body = '') {
  return {
    type: 'text',
    text: { body: clamp(body, 4096) }
  };
}

function buildPreview(title, body) {
  return [title, body].filter(Boolean).join('\n').trim();
}

function buildMenuShowcase(summary, deepDive) {
  const curatedMenus = clamp(summary.split('\n\n').slice(0, 2).join('\n\n'));
  const chefHighlights = clamp(deepDive.split('\n\n').shift() || deepDive);
  return {
    preview: buildPreview('Yumzy curated menus', `${curatedMenus}\n\nChef specials:\n${chefHighlights}`),
    payload: createTemplatePayload('pc_menu_showcase', {
      headerText: 'Chef-curated menus',
      bodyParams: [curatedMenus, `Chef specials:\n${chefHighlights}`],
      buttons: [{ payload: 'BOOK' }, { payload: 'EXPLORE' }]
    })
  };
}

function buildCounterSpotlight(summary) {
  const counters = clamp(summary.split('\n\n').slice(0, 2).join('\n\n'));
  return {
    preview: buildPreview('Live counters', counters),
    payload: createTemplatePayload('pc_counter_stage', {
      headerText: 'Live counter theatre',
      bodyParams: ['Chefs-on-wheels ready:', counters],
      buttons: [{ payload: 'BOOK' }, { payload: 'PLAN' }]
    })
  };
}

function buildRestaurantSpotlight(summary) {
  const partners = clamp(summary.split('\n\n').slice(0, 2).join('\n\n'));
  return {
    preview: buildPreview('Restaurant partners', partners),
    payload: createTemplatePayload('pc_partner_spotlight', {
      headerText: 'Partner kitchens',
      bodyParams: ['Trusted restaurants on standby:', partners],
      buttons: [{ payload: 'BOOK' }, { payload: 'PARCEL' }]
    })
  };
}

function buildParcelBrief(summary) {
  return {
    preview: buildPreview('Parcel desk', summary),
    payload: createTemplatePayload('pc_parcel_brief', {
      headerText: 'Partycart Parcel desk',
      bodyParams: ['Fast & safe drops:', summary],
      buttons: [{ payload: 'PARCEL' }, { payload: 'ENQUIRE' }]
    })
  };
}

function buildPlanPerks(summary) {
  return {
    preview: buildPreview('Concierge perks', summary),
    payload: createTemplatePayload('pc_concierge_perks', {
      headerText: 'Concierge perks',
      bodyParams: ['Here’s what we unlock for you:', summary],
      buttons: [{ payload: 'PLAN' }, { payload: 'BOOK' }]
    })
  };
}

function buildExploreShowcase(packs) {
  return {
    preview: buildPreview('Party carts ready', packs),
    payload: createTemplatePayload('pc_explore_packs', {
      headerText: 'Party carts ready',
      bodyParams: ['Pick a cart + date:', packs],
      buttons: [{ payload: 'BOOK' }, { payload: 'MENU' }]
    })
  };
}

function buildBookingPrompt(templateText) {
  return {
    preview: buildPreview('Booking template', templateText),
    payload: createTemplatePayload('pc_booking_prompt', {
      headerText: 'Lock your booking',
      bodyParams: ['Copy → paste with your details:', templateText],
      buttons: [{ payload: 'ENQUIRE' }, { payload: 'HELP' }]
    })
  };
}

function buildBookingTemplateHint(templateText) {
  return {
    preview: buildPreview('Need structured details', templateText),
    payload: createTemplatePayload('pc_booking_template_hint', {
      headerText: 'Almost there!',
      bodyParams: ["Let's use the format so I capture every detail:", templateText],
      buttons: [{ payload: 'HELP' }, { payload: 'ENQUIRE' }]
    })
  };
}

function buildBookingMissingFields(missingLabel, templateText) {
  return {
    preview: buildPreview('Missing booking info', `${missingLabel}\n${templateText}`),
    payload: createTemplatePayload('pc_booking_missing_info', {
      headerText: 'Need a few more fields',
      bodyParams: [`Still need: ${missingLabel}`, templateText],
      buttons: [{ payload: 'HELP' }, { payload: 'ENQUIRE' }]
    })
  };
}

function buildEnquiryContacts(contacts) {
  return {
    preview: buildPreview('Concierge hotlines', contacts),
    payload: createTemplatePayload('pc_enquiry_contacts', {
      headerText: 'Concierge desk',
      bodyParams: ['Reach us anytime:', contacts],
      buttons: [{ payload: 'MENU' }, { payload: 'BOOK' }]
    })
  };
}

function buildBookingConfirmation({ recap, contacts }) {
  const confirmation = `🎉 Booking placeholder locked!\n${recap}`;
  return {
    preview: buildPreview('Booking confirmed', `${confirmation}\n\n${contacts}`),
    payload: createTemplatePayload('pc_booking_confirmation', {
      headerText: 'Booking placeholder locked',
      bodyParams: [confirmation, contacts],
      buttons: [{ payload: 'MENU' }, { payload: 'HELP' }]
    })
  };
}

function buildGreeting(name) {
  const intro = `Hey ${name}! I’m the Yumzy Partycart concierge.`;
  const options = 'Reply MENU, EXPLORE, COUNTER, RESTAURANT, PARCEL, PLAN, BOOK or ENQUIRE to keep planning.';
  return {
    preview: buildPreview('Welcome back', `${intro}\n${options}`),
    payload: createTemplatePayload('pc_navigation_stack', {
      headerText: 'Partycart concierge',
      bodyParams: [intro, options],
      buttons: [{ payload: 'MENU' }, { payload: 'BOOK' }, { payload: 'HELP' }]
    })
  };
}

function buildFallback(name) {
  const nextSteps = 'Send MENU, EXPLORE, COUNTER, RESTAURANT, PARCEL, PLAN, BOOK or ENQUIRE.';
  const body = `Got it, ${name}. Tap a keyword so I can help.\n${nextSteps}`;
  return {
    preview: buildPreview('Need a keyword', body),
    payload: createTextPayload(body)
  };
}

module.exports = {
  buildMenuShowcase,
  buildCounterSpotlight,
  buildRestaurantSpotlight,
  buildParcelBrief,
  buildPlanPerks,
  buildExploreShowcase,
  buildBookingPrompt,
  buildBookingTemplateHint,
  buildBookingMissingFields,
  buildBookingConfirmation,
  buildEnquiryContacts,
  buildGreeting,
  buildFallback
};
