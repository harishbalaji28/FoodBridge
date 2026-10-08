// ─────────────────────────────────────────────────────────────
//  FoodBridge – Initial Preview Mock Data
//  File: client/src/data/mockData.js
//  Realistic community posts showing various states & manual entries
// ─────────────────────────────────────────────────────────────

export const INITIAL_POSTS = [
  {
    id: "post-1",
    foodName: "Steamed Vegetable Dumplings & Chilli Dip",
    description: "Extra fresh batches prepared for the evening campus summit. 4 dumplings per portion, kept warm in thermal containers.",
    totalServings: 8,
    remainingServings: 5,
    pickupPoint: "Engineering Block C — Ground Floor Pantry",
    bestBefore: new Date(Date.now() + 45 * 60 * 1000).toISOString(), // 45 mins from now (Expiring Soon!)
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: "open",
    claims: [
      { id: "c1", claimerName: "Pooja K", servings: 2, claimedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
      { id: "c2", claimerName: "Aditya S", servings: 1, claimedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: "post-2",
    foodName: "Assorted Bakery Croissants & Fruit Tarts",
    description: "Freshly boxed pastries from this morning's department seminar. All vegetarian, individually wrapped with napkins.",
    totalServings: 12,
    remainingServings: 9,
    pickupPoint: "Library Cafe Annex — Counter 1",
    bestBefore: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    status: "open",
    claims: [
      { id: "c3", claimerName: "Farhan M", servings: 3, claimedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: "post-3",
    foodName: "Curd Rice with Pomegranate & Tempering",
    description: "Comfort meal packed in clean food-grade foil trays with pickle. Ideal quick lunch for hostellers.",
    totalServings: 6,
    remainingServings: 2,
    pickupPoint: "Hostel 4 — Dining Hall Service Window",
    bestBefore: new Date(Date.now() + 90 * 60 * 1000).toISOString(), // 1.5 hours
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    status: "open",
    claims: [
      { id: "c4", claimerName: "Kavya R", servings: 4, claimedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: "post-4",
    foodName: "Paneer Butter Masala with Jeera Rice",
    description: "Prepared for the faculty luncheon. High quality, piping hot container portions.",
    totalServings: 10,
    remainingServings: 0,
    pickupPoint: "Faculty Club Dining Room",
    bestBefore: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    status: "closed",
    claims: [
      { id: "c5", claimerName: "Rohan D", servings: 5, claimedAt: new Date(Date.now() - 100 * 60 * 1000).toISOString() },
      { id: "c6", claimerName: "Neha V", servings: 5, claimedAt: new Date(Date.now() - 80 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: "post-5",
    foodName: "Morning Breakfast Idli with Sambar & Chutney",
    description: "Surplus from morning hostel breakfast service.",
    totalServings: 15,
    remainingServings: 3,
    pickupPoint: "Central Mess — Gate 2",
    bestBefore: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // Expired 1h ago
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    status: "expired",
    claims: [
      { id: "c7", claimerName: "Vikram T", servings: 12, claimedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
    ],
  }
];

export const INITIAL_STATS = {
  totalPosts: 5,
  openPosts: 3,
  closedPosts: 1,
  expiredPosts: 1,
  servingsSaved: 27,
  servingsMissed: 3,
};
