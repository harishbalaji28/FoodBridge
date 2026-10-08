import React from "react";
import { Leaf, HeartHandshake, AlertCircle, TrendingUp, Droplets, Wind, RotateCw } from "lucide-react";

export default function Impact({ stats = {}, loading = false, error = null, onRetry }) {
  const {
    totalPosts = 0,
    servingsSaved = 0,
    servingsMissed = 0,
  } = stats;

  const totalServingsHandled = servingsSaved + servingsMissed;

  // Backend rescue rate (or fallback formula: saved / (saved + missed) * 100)
  const rescueRate =
    typeof stats.rescueRate === "number"
      ? stats.rescueRate
      : totalServingsHandled > 0
      ? Math.round((servingsSaved / totalServingsHandled) * 100)
      : 0;

  // Environmental equivalencies
  const co2PreventedKg = (servingsSaved * 0.85).toFixed(1);
  const waterConservedLiters = Math.round(servingsSaved * 120);

  return (
    <section id="impact" className="section impact-section">
      <div className="container">
        {/* Header */}
        <div className="section-header-wrap text-center">
          <div className="section-eyebrow" style={{ margin: "0 auto 8px" }}>
            <span>🌱 Measurable Sustainability</span>
          </div>
          <h2 className="section-title">Community Food Impact</h2>
          <p className="section-subtitle" style={{ margin: "0 auto", maxWidth: "600px" }}>
            Transparent real-time tracking of food saved from landfills and shared across our campus community.
          </p>
        </div>

        {/* Loading State for Stats */}
        {loading && (
          <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text-muted)" }}>
            <span className="pulse-dot" style={{ color: "var(--color-primary)", marginRight: "8px" }}></span>
            <span>Refreshing impact statistics...</span>
          </div>
        )}

        {/* Error State for Stats */}
        {error && !loading && (
          <div className="card" style={{ padding: "20px", textAlign: "center", marginBottom: "24px", borderColor: "#fecaca", backgroundColor: "#fef2f2" }}>
            <p style={{ color: "#991b1b", marginBottom: "12px", fontSize: "0.9rem" }}>
              Unable to load impact metrics: {error}
            </p>
            {onRetry && (
              <button className="btn btn-secondary btn-sm" onClick={onRetry}>
                <RotateCw size={14} />
                <span>Retry Loading Stats</span>
              </button>
            )}
          </div>
        )}

        {/* Primary Metrics Grid */}
        <div className="impact-metrics-grid">
          {/* 1. Servings Saved */}
          <div className="impact-card card impact-card-saved">
            <div className="impact-card-top">
              <span className="impact-icon-wrap icon-saved">
                <Leaf size={24} />
              </span>
              <span className="impact-badge badge-eco">Primary Metric</span>
            </div>
            <div className="impact-num">{servingsSaved}</div>
            <h3 className="impact-title">Servings Rescued</h3>
            <p className="impact-desc">Meals claimed and consumed by campus peers instead of being discarded.</p>
          </div>

          {/* 2. Servings Missed */}
          <div className="impact-card card impact-card-missed">
            <div className="impact-card-top">
              <span className="impact-icon-wrap icon-missed">
                <AlertCircle size={24} />
              </span>
              <span className="impact-badge badge-warning">Zero Waste Goal</span>
            </div>
            <div className="impact-num">{servingsMissed}</div>
            <h3 className="impact-title">Servings Missed</h3>
            <p className="impact-desc">Portions that reached their best-before deadline before being claimed.</p>
          </div>

          {/* 3. Total Posts */}
          <div className="impact-card card impact-card-posts">
            <div className="impact-card-top">
              <span className="impact-icon-wrap icon-posts">
                <HeartHandshake size={24} />
              </span>
              <span className="impact-badge">Community Activity</span>
            </div>
            <div className="impact-num">{totalPosts}</div>
            <h3 className="impact-title">Total Food Listings</h3>
            <p className="impact-desc">Individual surplus food batches created by campus food providers.</p>
          </div>
        </div>

        {/* Rescue Rate Progress Bar */}
        <div className="rescue-progress-card card">
          <div className="rescue-progress-header">
            <div>
              <h3 className="rescue-title">
                <TrendingUp size={20} className="rescue-icon" />
                <span>Overall Food Rescue Success Rate</span>
              </h3>
              <p className="rescue-sub">Percentage of surplus portions successfully eaten vs. missed.</p>
            </div>
            <div className="rescue-rate-num">{rescueRate}%</div>
          </div>

          <div className="rescue-bar-track">
            <div
              className="rescue-bar-fill"
              style={{
                width: `${rescueRate}%`,
                background: rescueRate === 0 && totalServingsHandled === 0
                  ? "#d1d5db"
                  : "linear-gradient(90deg, #10b981 0%, #059669 100%)",
              }}
            ></div>
          </div>

          <div className="rescue-legend">
            <div className="legend-item">
              <span className="legend-swatch swatch-saved"></span>
              <span><strong>{servingsSaved}</strong> Servings Saved ({rescueRate}%)</span>
            </div>
            <div className="legend-item">
              <span className="legend-swatch swatch-missed"></span>
              <span><strong>{servingsMissed}</strong> Servings Expired ({totalServingsHandled > 0 ? 100 - rescueRate : 0}%)</span>
            </div>
          </div>
        </div>

        {/* Environmental Equivalence Cards */}
        <div className="eco-equivalents-grid">
          <div className="eco-item card">
            <Wind size={22} className="eco-icon-wind" />
            <div>
              <strong>~{co2PreventedKg} kg CO₂ Prevented</strong>
              <p>Greenhouse gases avoided by preventing organic decomposition.</p>
            </div>
          </div>

          <div className="eco-item card">
            <Droplets size={22} className="eco-icon-water" />
            <div>
              <strong>~{waterConservedLiters.toLocaleString()} Liters Conserved</strong>
              <p>Embedded water footprint saved across meal production cycles.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
