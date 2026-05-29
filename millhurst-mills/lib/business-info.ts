export const BUSINESS = {
  name: "Millhurst Mills",
  tagline: "Family-owned since 1925",
  description:
    "Manalapan's local source for lumber, hardware, paint, decking & remodeling supplies. Authorized Ace Hardware dealer and Benjamin Moore paint retailer serving Monmouth County since 1925.",
  phone: "(732) 446-4848",
  phoneHref: "tel:+17324464848",
  email: "info@millhurstmills.com",
  address: {
    street: "Route 9 North",
    city: "Manalapan",
    state: "NJ",
    zip: "07726",
    county: "Monmouth County",
    full: "Route 9 North, Manalapan, NJ 07726",
  },
  hours: {
    weekdays: "Monday – Friday: 7:00 AM – 5:30 PM",
    saturday: "Saturday: 7:00 AM – 4:00 PM",
    sunday: "Sunday: 8:00 AM – 1:00 PM",
    holiday: "Holiday hours may vary",
  },
  geo: {
    lat: 40.2816,
    lng: -74.3571,
  },
  social: {
    google: "https://g.page/millhurst-mills",
    facebook: "https://www.facebook.com/millhurstmills",
  },
  established: 1925,
  serviceArea: [
    "Manalapan",
    "Marlboro",
    "Freehold",
    "Englishtown",
    "Tennent",
    "Old Bridge",
    "Howell",
    "Colts Neck",
    "Monmouth County",
    "Central New Jersey",
  ],
} as const;

export const SITE_URL = "https://www.millhurstmills.com";
