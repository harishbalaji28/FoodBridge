// ─────────────────────────────────────────────
//  FoodBridge – Expiry Utility
//  File: server/utils/expiry.js
//
//  A post becomes "expired" when the current time
//  passes its bestBefore date.
//  Any remaining servings at that point become
//  "missed servings" (tracked in /api/stats).
// ─────────────────────────────────────────────

/**
 * Scan all posts and automatically mark any open post
 * whose bestBefore date has passed as "expired".
 *
 * @param {Array} posts - full list of posts from the store
 * @returns {Array} updated list with expired statuses applied
 */
function checkAndMarkExpired(posts) {
  const now = new Date();

  return posts.map((post) => {
    // Only open posts can expire — closed/already-expired ones stay as-is
    if (post.status === "open" && new Date(post.bestBefore) <= now) {
      return { ...post, status: "expired" };
    }
    return post;
  });
}

module.exports = { checkAndMarkExpired };
