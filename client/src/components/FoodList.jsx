import React, { useState, useMemo } from "react";
import { Search, ArrowUpDown, Flame } from "lucide-react";
import FoodCard from "./FoodCard";
import { LoadingSkeleton, EmptyState, ErrorState } from "./StateStates";

export default function FoodList({
  posts = [],
  loading = false,
  error = null,
  onClaimClick,
  onPostClick,
  onRetry,
  onExpire,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "open", "expiring_soon", "closed", "expired"
  const [sortBy, setSortBy] = useState("soonest_expiry");  // "soonest_expiry", "most_servings", "newest"

  // Filter & Sort computation
  const filteredPosts = useMemo(() => {
    let result = [...posts];
    const now = new Date();

    // 1. Search Query (matches foodName or pickupPoint)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          (p.foodName && p.foodName.toLowerCase().includes(q)) ||
          (p.pickupPoint && p.pickupPoint.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // 2. Status & Expiry Filters
    if (statusFilter === "open") {
      // Only show actively open listings whose bestBefore hasn't passed
      result = result.filter(
        (p) => p.status === "open" && new Date(p.bestBefore) > now
      );
    } else if (statusFilter === "expiring_soon") {
      // Less than 1 hour remaining (< 3600000ms)
      result = result.filter((p) => {
        if (p.status !== "open") return false;
        const diff = new Date(p.bestBefore) - now;
        return diff > 0 && diff <= 3600000;
      });
    } else if (statusFilter === "closed") {
      result = result.filter((p) => p.status === "closed");
    } else if (statusFilter === "expired") {
      result = result.filter(
        (p) => p.status === "expired" || (p.status === "open" && new Date(p.bestBefore) <= now)
      );
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortBy === "soonest_expiry") {
        return new Date(a.bestBefore) - new Date(b.bestBefore);
      }
      if (sortBy === "most_servings") {
        return (b.remainingServings || 0) - (a.remainingServings || 0);
      }
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

    return result;
  }, [posts, searchQuery, statusFilter, sortBy]);

  // Counts for quick badges
  const now = new Date();
  const openCount = posts.filter(
    (p) => p.status === "open" && new Date(p.bestBefore) > now
  ).length;

  const expiringSoonCount = posts.filter((p) => {
    if (p.status !== "open") return false;
    const diff = new Date(p.bestBefore) - now;
    return diff > 0 && diff <= 3600000; // less than 1 hour
  }).length;

  return (
    <section id="available-food" className="section available-food-section">
      <div className="food-ambient food-ambient-one" aria-hidden="true"></div>
      <div className="food-ambient food-ambient-two" aria-hidden="true"></div>
      <div className="food-ambient-line" aria-hidden="true"></div>
      <div className="container food-section-content">
        {/* Section Header */}
        <div className="section-header-wrap">
          <div>
            <div className="section-eyebrow">
              <span>🍽️ Live Community Board</span>
            </div>
            <h2 className="section-title editorial-section-title">GOOD FOOD<br /><span>WAITING FOR A PLATE.</span></h2>
            <p className="section-subtitle">
              Freshly posted campus meals with live expiry countdowns. Find your next plate before time runs out.
            </p>
          </div>

          <div className="section-stats-pill">
            <span className="pill-dot"></span>
            <strong>{openCount}</strong> active meals ready for pickup
          </div>
        </div>

        {/* Controls Bar: Search + Filter Tabs + Sort */}
        <div className="controls-bar card">
          {/* Search Input */}
          <div className="search-input-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by food name, cuisine, or campus location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            <button
              className={`filter-tab ${statusFilter === "all" ? "active" : ""}`}
              onClick={() => setStatusFilter("all")}
            >
              All ({posts.length})
            </button>
            <button
              className={`filter-tab ${statusFilter === "open" ? "active" : ""}`}
              onClick={() => setStatusFilter("open")}
            >
              Available Now ({openCount})
            </button>
            <button
              className={`filter-tab filter-tab-urgent ${statusFilter === "expiring_soon" ? "active" : ""}`}
              onClick={() => setStatusFilter("expiring_soon")}
            >
              <Flame size={13} />
              <span>Expiring Soon &lt;1h ({expiringSoonCount})</span>
            </button>
            <button
              className={`filter-tab ${statusFilter === "closed" ? "active" : ""}`}
              onClick={() => setStatusFilter("closed")}
            >
              Claimed
            </button>
            <button
              className={`filter-tab ${statusFilter === "expired" ? "active" : ""}`}
              onClick={() => setStatusFilter("expired")}
            >
              Expired
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="sort-wrap">
            <ArrowUpDown size={15} className="sort-icon" />
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort listings by"
            >
              <option value="soonest_expiry">Sort: Soonest Expiry</option>
              <option value="most_servings">Sort: Most Servings</option>
              <option value="newest">Sort: Newly Listed</option>
            </select>
          </div>
        </div>

        {/* Content Area */}
        {loading && <LoadingSkeleton count={3} />}

        {error && !loading && (
          <ErrorState
            error={error}
            onRetry={onRetry}
          />
        )}

        {!loading && !error && filteredPosts.length === 0 && (
          <EmptyState
            message={
              searchQuery
                ? `No meals found matching "${searchQuery}". Try a different keyword.`
                : statusFilter === "expiring_soon"
                ? "Awesome! There are currently no meals with less than 1 hour remaining."
                : statusFilter === "open"
                ? "No surplus food is currently available. Check back soon or post extra food!"
                : "No food listings found for this filter."
            }
            onReset={() => {
              setSearchQuery("");
              setStatusFilter("all");
            }}
            onPostClick={onPostClick}
          />
        )}

        {!loading && !error && filteredPosts.length > 0 && (
          <div className="food-grid">
            {filteredPosts.map((post) => (
              <FoodCard
                key={post.id}
                post={post}
                onClaimClick={onClaimClick}
                onExpire={onExpire}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
