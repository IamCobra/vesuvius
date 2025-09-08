// Restaurant constants and configuration
export const RESTAURANT_INFO = {
  name: "Vesuvius",
  address: {
    street: "Vejnavn 12",
    city: "5000 Odense C",
  },
  contact: {
    phone: "+45 65 12 34 56",
    email: "hej@vesuvius.dk",
  },
  social: {
    facebook: "#",
    instagram: "#",
    twitter: "#",
  },
};

export const OPENING_HOURS = [
  { day: "Mandag", hours: "LUKKET" },
  { day: "Tirsdag", hours: "11:00 - 22:00" },
  { day: "Onsdag", hours: "11:00 - 22:00" },
  { day: "Torsdag", hours: "11:00 - 22:00" },
  { day: "Fredag", hours: "11:00 - 22:00" },
  { day: "Lørdag", hours: "11:00 - 22:00" },
  { day: "Søndag", hours: "11:00 - 22:00" },
];

export const QUICK_LINKS = [
  { name: "Menu", href: "/menu" },
  { name: "Reserver", href: "/reservation" },
  { name: "Kontakt", href: "/contact" },
  { name: "Om Os", href: "/about" },
];

export const TIME_SLOTS = [
  "11:00",
  "11:15",
  "11:30",
  "11:45",
  "12:00",
  "12:15",
  "12:30",
  "12:45",
  "13:00",
  "13:15",
  "13:30",
  "13:45",
  "14:00",
  "14:15",
  "14:30",
  "14:45",
  "15:00",
  "15:15",
  "15:30",
  "15:45",
  "16:00",
  "16:15",
  "16:30",
  "16:45",
  "17:00",
  "17:15",
  "17:30",
  "17:45",
  "18:00",
  "18:15",
  "18:30",
  "18:45",
  "19:00",
  "19:15",
  "19:30",
  "19:45",
  "20:00",
  "20:15",
  "20:30",
  "20:45",
  "21:00",
];

// Time slots that are close to closing (show warning)
export const LATE_TIME_SLOTS = ["20:30", "20:45", "21:00"];

export const CONTACT_DETAILS = [
  {
    title: "Adresse",
    content: [RESTAURANT_INFO.address.street, RESTAURANT_INFO.address.city],
    icon: "location",
  },
  {
    title: "Telefon",
    content: [RESTAURANT_INFO.contact.phone],
    icon: "phone",
  },
  {
    title: "E-mail",
    content: [RESTAURANT_INFO.contact.email],
    icon: "email",
  },
  {
    title: "Åbningstider",
    content: ["Man: Lukket", "Tir-Lør: 11:00-22:00", "Søn: 11:00-22:00"],
    icon: "clock",
  },
];

export const FEATURES = [
  {
    key: "fresh-ingredients",
    title: "Fresh Ingredients",
    description: "We source the freshest local ingredients for every dish",
  },
  {
    key: "fast-service",
    title: "Fast Service",
    description: "Quick and reliable service for the best dining experience",
  },
  {
    key: "made-with-love",
    title: "Made with Love",
    description: "Every dish is prepared with care and passion",
  },
];
