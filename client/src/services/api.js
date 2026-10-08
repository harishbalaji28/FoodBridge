// ─────────────────────────────────────────────────────────────
//  FoodBridge – API Client Service
//  File: client/src/services/api.js
//
//  Centralizes all HTTP requests to the Express backend.
//  Uses the VITE_API_URL environment variable (never hardcodes URLs).
// ─────────────────────────────────────────────────────────────

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

/**
 * Helper to handle fetch responses and extract meaningful error messages
 */
async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // response wasn't json, use default statusText
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

/**
 * Fetch food posts from the backend.
 * @param {string} [status] - Optional filter e.g. "available", "open", "closed", "expired"
 * @returns {Promise<Array>} List of food posts
 */
export async function getPosts(status) {
  const queryParam = status ? `?status=${encodeURIComponent(status)}` : "";
  const url = `${API_BASE_URL}/posts${queryParam}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleResponse(response);
}

/**
 * Create a new surplus food post.
 * @param {Object} postData - { foodName, description, totalServings, pickupPoint, bestBefore }
 * @returns {Promise<Object>} The created food post object from backend
 */
export async function createPost(postData) {
  const url = `${API_BASE_URL}/posts`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });

  return handleResponse(response);
}

/**
 * Claim servings from an existing food post.
 * @param {string} postId - ID of the food post
 * @param {Object} claimData - { claimerName, registrationNumber, servings }
 * @returns {Promise<Object>} Response object { message, claim, post }
 */
export async function claimPost(postId, claimData) {
  const url = `${API_BASE_URL}/posts/${encodeURIComponent(postId)}/claims`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(claimData),
  });

  return handleResponse(response);
}

/**
 * Fetch platform impact statistics from the backend (GET /api/stats).
 * @returns {Promise<Object>} { totalPosts, openPosts, closedPosts, expiredPosts, servingsSaved, servingsMissed, rescueRate }
 */
export async function getStats() {
  const url = `${API_BASE_URL}/stats`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleResponse(response);
}
