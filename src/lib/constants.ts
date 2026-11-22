export const SALON_NAME = "SalonBook";
export const COPYRIGHT_YEAR = 2026;

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const CATEGORIES = [
  "Haircut & Styling",
  "Hair Coloring",
  "Hair Treatment",
  "Facial & Skincare",
  "Makeup",
  "Manicure & Pedicure",
  "Spa & Massage",
] as const;

// Must match the server's src/constants/timeSlots.js
export const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
] as const;

export const SALON_INFO = {
  email: "hello@salonbook.com",
  phone: "+880 1700 000000",
  address: "Zindabazar, Sylhet 3100, Bangladesh",
  hours: [
    { days: "Saturday to Thursday", time: "9:00 AM to 7:00 PM" },
    { days: "Friday", time: "Closed" },
  ],
};