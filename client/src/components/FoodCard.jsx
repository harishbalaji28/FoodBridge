import React, { useState, useEffect } from "react";
import { MapPin, Clock, Users, ArrowRight, CheckCircle2, XCircle, Flame, Sparkles } from "lucide-react";

function formatBestBefore(isoString) {
  if (!isoString) return "N/A";
  try {
    const date = new Date(isoString);
    return (
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
      ", " +
      date.toLocaleDateString([], { month: "short", day: "numeric" })
    );
  } catch {
    return isoString;
  }
}

function calculateTimeLeft(bestBefore) {
  if (!bestBefore) {
    return { totalMs: 0, formatted: "00:00:00", isExpired: true, isUrgent: false };
  }

  const diff = new Date(bestBefore).getTime() - Date.now();
  if (diff <= 0) {
    return { totalMs: 0, formatted: "00:00:00", isExpired: true, isUrgent: false };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (num) => String(num).padStart(2, "0");
  const formatted = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  const isUrgent = diff < 3600000;

  return { totalMs: diff, formatted, isExpired: false, isUrgent };
}

const foodVisuals = [
  { keys: ["biryani", "biriyani"], image: "https://images.unsplash.com/photo-1691171047403-0abfd83f0ea7?auto=format&fit=crop&w=1100&q=88", tone: "red", emoji: "🍛", label: "INDIAN FAVOURITE" },
  { keys: ["pasta", "spaghetti", "noodle", "macaroni"], image: "https://images.unsplash.com/photo-1567608285969-48e4bbe0d399?auto=format&fit=crop&w=1100&q=88", tone: "cream", emoji: "🍝", label: "COMFORT PLATE" },
  { keys: ["pizza"], image: "https://images.unsplash.com/photo-1563297782-f4cba03a3fb9?auto=format&fit=crop&w=1100&q=88", tone: "yellow", emoji: "🍕", label: "CAMPUS FAVOURITE" },
  { keys: ["dumpling", "momo"], image: "https://images.unsplash.com/photo-1777113310227-db99e3431b3f?auto=format&fit=crop&w=1100&q=88", tone: "green", emoji: "🥟", label: "FRESHLY STEAMED" },
  { keys: ["croissant", "pastry", "tart", "bakery"], image: "https://images.unsplash.com/photo-1572451480598-fb65b95a6ea0?auto=format&fit=crop&w=1100&q=88", tone: "gold", emoji: "🥐", label: "BAKERY RESCUE" },
  { keys: ["idli", "sambar", "chutney"], image: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=1100&q=88", tone: "green", emoji: "🥣", label: "SOUTH INDIAN" },
  { keys: ["curd rice", "yogurt rice"], image: "https://images.unsplash.com/photo-1633383718081-22ac93e3db65?auto=format&fit=crop&w=1100&q=88", tone: "cream", emoji: "🍚", label: "COMFORT FOOD" },
  { keys: ["paneer", "butter masala", "curry"], image: "https://images.unsplash.com/photo-1690401767645-595de0e0e5f8?auto=format&fit=crop&w=1100&q=88", tone: "red", emoji: "🍲", label: "HOT & FRESH" },
  { keys: ["burger", "sandwich", "wrap"], image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1100&q=88", tone: "yellow", emoji: "🍔", label: "QUICK BITE" },
  { keys: ["rice", "thali", "meal"], image: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=1100&q=88", tone: "green", emoji: "🍚", label: "CAMPUS MEAL" },
];

function getFoodVisual(foodName = "") {
  const name = foodName.toLowerCase();
  return foodVisuals.find((visual) => visual.keys.some((key) => name.includes(key))) || {
    image: "https://images.unsplash.com/photo-1691171047403-0abfd83f0ea7?auto=format&fit=crop&w=1100&q=88",
    tone: "red",
    emoji: "🍽️",
    label: "FOOD RESCUE",
  };
}

export default function FoodCard({ post, onClaimClick, onExpire }) {
  const {
    id,
    foodName,
    description,
    totalServings = 1,
    remainingServings = 0,
    pickupPoint,
    bestBefore,
    status = "open",
  } = post;

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(bestBefore));

  useEffect(() => {
    if (status === "closed" || status === "expired") return;

    const interval = setInterval(() => {
      const current = calculateTimeLeft(bestBefore);
      setTimeLeft(current);
      if (current.isExpired && status === "open") {
        clearInterval(interval);
        if (onExpire) onExpire(id);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [bestBefore, status, id, onExpire]);

  const isEffectivelyExpired = status === "expired" || timeLeft.isExpired;
  const isEffectivelyOpen = status === "open" && !timeLeft.isExpired;
  const isUrgent = isEffectivelyOpen && timeLeft.isUrgent;
  const percentRemaining = Math.max(0, Math.min(100, Math.round((remainingServings / totalServings) * 100)));
  const visual = getFoodVisual(foodName);

  return (
    <article className={`food-card editorial-food-card ${!isEffectivelyOpen ? "food-card-inactive" : ""} ${isUrgent ? "food-card-urgent" : ""}`}>
      <div className={`food-card-visual food-card-visual-${visual.tone}`}>
        <img src={visual.image} alt={foodName} className="food-card-image" loading="lazy" />
        <div className="food-card-image-shade"></div>
        <span className="food-card-kicker"><Sparkles size={12} /> {visual.label}</span>
        <span className="food-card-visual-icon">{visual.emoji}</span>
        <div className="food-card-visual-title">
          <span>FoodBridge</span>
          <strong>{foodName}</strong>
        </div>
      </div>

      <div className="food-card-content">
        <div className="food-card-top">
          <div className="status-wrap">
            {isEffectivelyOpen && !isUrgent && (
              <span className="badge badge-open"><span className="pulse-dot"></span> Open for Claim</span>
            )}
            {isUrgent && (
              <span className="badge badge-warning badge-urgent-pulse"><Flame size={12} /> Expiring Soon &lt;1h</span>
            )}
            {status === "closed" && (
              <span className="badge badge-closed"><CheckCircle2 size={12} /> Claimed Out</span>
            )}
            {isEffectivelyExpired && status !== "closed" && (
              <span className="badge badge-expired"><XCircle size={12} /> Expired</span>
            )}
          </div>

          <span className={`countdown-chip ${isUrgent ? "countdown-urgent" : isEffectivelyExpired ? "countdown-expired" : ""}`}>
            {isEffectivelyExpired ? "00:00:00" : status === "closed" ? "All Claimed" : timeLeft.formatted}
          </span>
        </div>

        <div className="food-card-body">
          <div className="food-card-mini-label">SURPLUS FOOD</div>
          <h3 className="food-card-title">{foodName}</h3>
          <p className="food-card-desc">{description || "No additional notes provided by donor."}</p>
        </div>

        <div className="food-card-location">
          <MapPin size={15} className="location-icon" />
          <span className="location-text">{pickupPoint}</span>
        </div>

        <div className="food-card-servings-block">
          <div className="servings-header">
            <span className="servings-label"><Users size={14} /> Available Servings</span>
            <span className="servings-ratio"><strong>{remainingServings}</strong> of {totalServings} left</span>
          </div>
          <div className="servings-bar-track">
            <div className={`servings-bar-value ${remainingServings === 0 || isEffectivelyExpired ? "bar-empty" : percentRemaining < 30 || isUrgent ? "bar-low" : "bar-good"}`} style={{ width: `${isEffectivelyExpired ? 0 : percentRemaining}%` }}></div>
          </div>
        </div>

        <div className="food-card-footer">
          <div className="best-before-group">
            <span className="meta-label">Best before</span>
            <span className="meta-value"><Clock size={13} /> {formatBestBefore(bestBefore)}</span>
          </div>
          <button className={`btn ${isEffectivelyOpen ? "btn-primary" : "btn-secondary btn-disabled"}`} onClick={() => isEffectivelyOpen && onClaimClick && onClaimClick(post)} disabled={!isEffectivelyOpen}>
            <span>{isEffectivelyOpen ? "Claim Meal" : status === "closed" ? "Claimed" : "Expired"}</span>
            {isEffectivelyOpen && <ArrowRight size={14} />}
          </button>
        </div>
      </div>
    </article>
  );
}
