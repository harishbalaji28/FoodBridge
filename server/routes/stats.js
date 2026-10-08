// ─────────────────────────────────────────────
//  FoodBridge – Stats Router
//  File: server/routes/stats.js
//  Endpoint: GET /api/stats
// ─────────────────────────────────────────────

const express = require("express");
const { getPosts, savePosts } = require("../data/store");
const { checkAndMarkExpired } = require("../utils/expiry");

const router = express.Router();

/**
 * GET /api/stats
 * Platform-wide sustainability impact numbers:
 * - totalPosts: count of all posts created
 * - openPosts: currently active & available posts
 * - closedPosts: posts where 100% of servings were claimed
 * - expiredPosts: posts that reached bestBefore time with unclaimed servings
 * - servingsSaved: total servings claimed across all posts
 * - servingsMissed: total servings wasted from expired posts
 * - rescueRate: percentage of servings saved vs total (saved + missed)
 */
router.get("/", (req, res) => {
  // Always refresh expiry status before calculating statistics
  const posts = checkAndMarkExpired(getPosts());
  savePosts(posts);

  // Servings saved = sum of all servings across every claim made
  const servingsSaved = posts.reduce((total, post) => {
    const claimedInPost = (post.claims || []).reduce(
      (sum, claim) => sum + claim.servings,
      0
    );
    return total + claimedInPost;
  }, 0);

  // Servings missed = leftover unclaimed servings from expired posts
  const servingsMissed = posts
    .filter((p) => p.status === "expired")
    .reduce((total, post) => total + post.remainingServings, 0);

  // Rescue rate calculation: servingsSaved / (servingsSaved + servingsMissed) * 100
  const totalHandled = servingsSaved + servingsMissed;
  const rescueRate = totalHandled > 0 ? Math.round((servingsSaved / totalHandled) * 100) : 0;

  res.json({
    totalPosts: posts.length,
    openPosts: posts.filter((p) => p.status === "open").length,
    closedPosts: posts.filter((p) => p.status === "closed").length,
    expiredPosts: posts.filter((p) => p.status === "expired").length,
    servingsSaved,
    servingsMissed,
    rescueRate,
  });
});

module.exports = router;
