module.exports = {
  menus: [
    {
      id: 'sapphire-soiree',
      title: 'Sapphire Soiree',
      focus: 'Modern Indian tapas paired with signature beverages',
      perfectFor: 'Cocktail parties for 20-60 guests',
      serves: 'Serves 20-60 guests',
      pricePerGuest: '₹899',
      highlights: ['Smoked Paneer Canapés', 'Andhra Chili Chicken Pops', 'Mini Gongura Biryani Cups', 'Cold-pressed sugarcane coolers']
    },
    {
      id: 'royal-dawat',
      title: 'Royal Dawat',
      focus: 'Heritage Hyderabadi feast slow-cooked in copper deghs',
      perfectFor: 'Family celebrations with 40-120 guests',
      serves: 'Serves 40-120 guests',
      pricePerGuest: '₹1099',
      highlights: ['Dum ka Murgh', 'Sofiyani Biryani', 'Bagara Baingan Boats', 'Ulavacharu shots']
    },
    {
      id: 'global-grove',
      title: 'Global Grove',
      focus: 'World-cuisine inspired live bowl meals and salads',
      perfectFor: 'Corporate offsites & celebrations',
      serves: 'Serves 25-80 guests',
      pricePerGuest: '₹799',
      highlights: ['Thai Basil Lotus Stem', 'Korean BBQ Sliders', 'Moroccan Couscous Bowls', 'Nitro Cold Brew station']
    }
  ],
  liveCounters: [
    {
      id: 'tawa-tales',
      title: 'Tawa Tales',
      description: 'Chefs flipping rumali rotis, stuffed parathas, and sizzling kebabs right at your venue.',
      addOns: ['Choose 3 kebabs', 'Keto-friendly rotis', 'Vegan galouti']
    },
    {
      id: 'coastal-crush',
      title: 'Coastal Crush',
      description: 'Banana-leaf plated seafood grills with live coconut-chili chutneys.',
      addOns: ['Upgrade to tiger prawns', 'Mocktail pairing bar', 'Firewood smoking ritual']
    },
    {
      id: 'sweet-symphony',
      title: 'Sweet Symphony',
      description: 'Live jalebi, Belgian waffle, and artisanal ice-cream tacos for the grand finale.',
      addOns: ['Nitro kulfi pops', 'Chocolate fountain', 'Custom monogram toppings']
    }
  ],
  restaurantPartners: [
    {
      name: 'Behrouz Biryani Signature Cloud Kitchen',
      bestFor: 'Royal biryanis delivered in under 35 minutes',
      signatureDishes: ['Sikandari Paneer Biryani', 'Royal Nizami Murgh', 'Kesar Firni']
    },
    {
      name: 'Bombay Brunch Club',
      bestFor: 'Elevated Bombay comfort food brunches & chai hi-teas',
      signatureDishes: ['Bohri Keema Sliders', 'Soft-shell Vada Pav', 'Irani Brun Maska']
    },
    {
      name: 'Seoulmate Kitchen',
      bestFor: 'Fun, fiery Korean bowls and party platters',
      signatureDishes: ['Cheesy Tteokbokki', 'Gochujang Chicken Tray', 'Kimchi Mushroom Skillets']
    }
  ],
  parcelService: {
    timeSlots: ['Within 60 minutes (express riders)', '2-3 hour relaxed slot', 'Late-night secure drop'],
    packageSafety: ['Tamper-evident thermal bags', 'Live rider tracking', 'OTP-based handover'],
    maxWeightKg: 15
  },
  conciergePerks: [
    'Dedicated menu stylists who balance vegetarian/non-vegetarian spreads',
    'Live tasting sessions at partner cloud kitchens before you book',
    'Integrated décor, sound, and rental partners for one-tap upgrades'
  ],
  explorePacks: [
    {
      id: 'mini-party-cart',
      title: 'Mini Party Cart',
      serves: '10-pax drop-off',
      price: '₹4,999',
      menu: ['Malai Paneer Roulades', 'Smoked Chicken Reshmi Rolls', 'Awadhi Dum Biryani (Veg/Chicken)', 'Saffron Shahi Tukda'],
      vibe: 'Perfect for intimate house parties & kitty brunches'
    },
    {
      id: 'signature-party-cart',
      title: 'Signature Party Cart',
      serves: '20-pax chef assisted',
      price: '₹9,999',
      menu: ['Sheermal & Galouti Sliders', 'Dum ka Murgh handi', 'Subz Navratan Qorma', 'Jeera Rice & Burhani Raita', 'Double ka Meetha jar desserts'],
      vibe: 'Go-to for milestone lunches and terrace sundowners'
    },
    {
      id: 'grand-feast-cart',
      title: 'Grand Feast Party Cart',
      serves: '30-pax catering crew',
      price: '₹14,999',
      menu: ['Hyderabadi Patthar ka Gosht', 'Lasooni Fish Tikka', 'Dum Biryani duo', 'Live Roomali + Salan station', 'Jauzi Halwa cups'],
      vibe: 'Designed for sangeet after-parties & office galas'
    }
  ],
  menuCollections: [
    {
      id: 'mughlai-party-cart',
      title: 'Mughlai Party Cart',
      serves: 'Serves 30 guests',
      basePrice: '₹16,499 all-inclusive',
      courses: [
        { course: 'Starters', items: ['Galouti sliders with saffron sheermal', 'Lasooni paneer tikka skewers', 'Hyderabadi haleem cups'] },
        { course: 'Mains', items: ['Dum ka Murgh', 'Paneer khurchan kadai', 'Nizami chicken biryani & bagara rice', 'Mirch ka salan + burhani raita'] },
        { course: 'Finishers', items: ['Shahi tukda with rose malai', 'Kesar phirni jars'] }
      ],
      service: 'Chef brigade + brass chafers, includes menu curation & plating props',
      upgrades: ['Add live Roomali counter (+₹4,500)', 'Extend to 50 guests at ₹399/guest', 'Pair with Nawabi mocktail bar']
    },
    {
      id: 'global-bowl-studio',
      title: 'Global Bowl Studio',
      serves: 'Serves 25 guests',
      basePrice: '₹13,999',
      courses: [
        { course: 'Salad Lab', items: ['Watermelon feta crunch', 'Avocado edamame poke', 'Smoked beet carpaccio'] },
        { course: 'Hot Bowls', items: ['Thai basil lotus stem with jasmine rice', 'Peri-peri chicken over herbed quinoa', 'Korean BBQ mushroom bibimbap'] },
        { course: 'Sweet Bites', items: ['Mini banoffee stacks', 'Nitro cold brew affogato'] }
      ],
      service: 'Live bowl assembly line with garnish bar + compostable serveware',
      upgrades: ['Fresh pasta wheel (+₹5,500)', 'Bubbly mimosa brunch kit']
    }
  ],
  bookingTemplate: {
    headline: 'Copy & send the below so I can block the kitchen instantly:',
    fields: [
      { label: 'Guests', placeholder: 'e.g., 30 pax' },
      { label: 'Menu / cart', placeholder: 'Mughlai Party Cart + live counter' },
      { label: 'Date', placeholder: '24 Feb 2024' },
      { label: 'Service window', placeholder: '7:00 – 10:30 PM' },
      { label: 'Venue', placeholder: 'Jubilee Hills rooftop, Hyderabad' },
      { label: 'Notes', placeholder: 'Veg/Jain alternates, mocktail bar, etc.' }
    ]
  },
  contacts: {
    bookingDesk: '+91 98765 00456',
    cateringDesk: '+91 91234 77889',
    email: 'partycart@yumzy.com'
  }
};
