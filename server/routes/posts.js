// ─────────────────────────────────────────────
//  FoodBridge – Posts Router
//  File: server/routes/posts.js
//
//  Endpoints:
//    GET  /api/posts?status=  → list posts (optional filter by status)
//    POST /api/posts          → create a new surplus food post
//    POST /api/posts/:id/claims → claim servings from an open food post
// ─────────────────────────────────────────────

const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { getPosts, savePosts } = require("../data/store");
const { checkAndMarkExpired } = require("../utils/expiry");

const router = express.Router();

/**
 * Helper: Refresh expiry status for all posts and persist any changes.
 */
function freshPosts() {
  const posts = checkAndMarkExpired(getPosts());
  savePosts(posts);
  return posts;
}

// ─────────────────────────────────────────────
//  1. GET /api/posts?status=open|closed|expired
// ─────────────────────────────────────────────
router.get("/", (req, res) => {
  let posts = freshPosts();

  const { status } = req.query;
  const VALID_STATUSES = ["open", "closed", "expired", "available"];

  if (status) {
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        error: `Invalid status filter. Allowed values: ${VALID_STATUSES.join(", ")}`,
      });
    }
    const targetStatus = status === "available" ? "open" : status;
    posts = posts.filter((p) => p.status === targetStatus);
  }

  res.json(posts);
});

// ─────────────────────────────────────────────
//  2. POST /api/posts
//  Create a manual surplus food listing
// ─────────────────────────────────────────────
router.post("/", (req, res) => {
  const { foodName, description, totalServings, pickupPoint, bestBefore } = req.body;

  // Validation: foodName
  if (!foodName || !String(foodName).trim()) {
    return res.status(400).json({ error: "foodName is required." });
  }

  // Validation: totalServings (positive integer)
  const servingsNum = Number(totalServings);
  if (!totalServings || isNaN(servingsNum) || servingsNum <= 0 || !Number.isInteger(servingsNum)) {
    return res.status(400).json({
      error: "totalServings is required and must be a positive whole number.",
    });
  }

  // Validation: pickupPoint
  if (!pickupPoint || !String(pickupPoint).trim()) {
    return res.status(400).json({ error: "pickupPoint is required." });
  }

  // Validation: bestBefore (valid future date)
  if (!bestBefore) {
    return res.status(400).json({ error: "bestBefore is required." });
  }

  const bestBeforeDate = new Date(bestBefore);
  if (isNaN(bestBeforeDate.getTime())) {
    return res.status(400).json({
      error: "bestBefore must be a valid date/time format.",
    });
  }

  if (bestBeforeDate <= new Date()) {
    return res.status(400).json({
      error: "bestBefore must be a future date and time.",
    });
  }

  // Construct new food post object
  const newPost = {
    id: uuidv4(),
    foodName: String(foodName).trim(),
    description: description ? String(description).trim() : "",
    totalServings: servingsNum,
    remainingServings: servingsNum, // initially all servings available
    pickupPoint: String(pickupPoint).trim(),
    bestBefore: bestBeforeDate.toISOString(),
    createdAt: new Date().toISOString(),
    status: "open",
    claims: [],
  };

  const posts = freshPosts();
  posts.unshift(newPost); // newest first
  savePosts(posts);

  res.status(201).json(newPost);
});

// ─────────────────────────────────────────────
//  3. POST /api/posts/:id/claims
//  Claim servings from an existing food post
// ─────────────────────────────────────────────
router.post("/:id/claims", (req, res) => {
  const posts = freshPosts();
  const postIndex = posts.findIndex((p) => p.id === req.params.id);

  if (postIndex === -1) {
    return res.status(404).json({ error: "Food post not found." });
  }

  const post = posts[postIndex];

  // Check post status & live timestamp against current time
  const isPastExpiry = new Date(post.bestBefore) <= new Date();
  if (post.status === "expired" || isPastExpiry) {
    if (post.status !== "expired") {
      post.status = "expired";
      posts[postIndex] = post;
      savePosts(posts);
    }
    return res.status(400).json({
      error: "This food post has expired and can no longer be claimed.",
    });
  }

  if (post.status === "closed" || post.remainingServings <= 0) {
    return res.status(400).json({
      error: "This food post is closed. No servings remaining.",
    });
  }

  // Validate claim details
  const { claimerName, registrationNumber, servings } = req.body;

  if (!claimerName || !String(claimerName).trim()) {
    return res.status(400).json({ error: "claimerName is required." });
  }

  if (!registrationNumber || !String(registrationNumber).trim()) {
    return res.status(400).json({ error: "registrationNumber is required." });
  }

  const claimServings = Number(servings);
  if (!servings || isNaN(claimServings) || claimServings <= 0 || !Number.isInteger(claimServings)) {
    return res.status(400).json({
      error: "servings must be a positive whole number.",
    });
  }

  if (claimServings > post.remainingServings) {
    return res.status(400).json({
      error: `Cannot claim ${claimServings} serving(s). Only ${post.remainingServings} remaining.`,
      remainingServings: post.remainingServings,
    });
  }

  // Record the claim
  const newClaim = {
    id: uuidv4(),
    claimerName: String(claimerName).trim(),
    registrationNumber: String(registrationNumber).trim(),
    servings: claimServings,
    claimedAt: new Date().toISOString(),
  };

  post.claims.push(newClaim);
  post.remainingServings -= claimServings;

  // Auto-close post when all servings are claimed
  if (post.remainingServings === 0) {
    post.status = "closed";
  }

  posts[postIndex] = post;
  savePosts(posts);

  res.status(201).json({
    message: "Claim successful! 🎉",
    claim: newClaim,
    post: {
      id: post.id,
      foodName: post.foodName,
      remainingServings: post.remainingServings,
      status: post.status,
    },
  });
});

module.exports = router;
