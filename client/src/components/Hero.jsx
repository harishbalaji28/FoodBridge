import React from "react";
import { ArrowDown, PlusCircle, HeartHandshake, ShieldCheck, Clock, MapPin, ArrowUpRight } from "lucide-react";

const heroFoodImage = "https://images.unsplash.com/photo-1691171047403-0abfd83f0ea7?auto=format&fit=crop&w=1200&q=88";

export default function Hero({ onExploreClick, onPostClick, stats = {} }) {
  return (
    <section id="home" className="hero-section editorial-hero">
      <div className="hero-noise" aria-hidden="true"></div>
      <div className="hero-marquee" aria-hidden="true">
        <div className="hero-marquee-track">
          <span>RESCUE GOOD FOOD</span><b>✦</b><span>SHARE MORE</span><b>✦</b><span>WASTE LESS</span><b>✦</b><span>RESCUE GOOD FOOD</span><b>✦</b><span>SHARE MORE</span><b>✦</b>
        </div>
      </div>

      <div className="container hero-container editorial-hero-container">
        <div className="hero-content editorial-hero-content">
          <div className="hero-badge editorial-hero-badge">
            <span className="hero-badge-pill">● ZERO WASTE CAMPUS</span>
            <span className="hero-badge-text">LIVE SURPLUS FOOD NETWORK</span>
          </div>

          <h1 className="hero-title editorial-hero-title">
            GOOD FOOD
            <br />
            <span>DESERVES</span>
            <br />
            ANOTHER PLATE<span className="hero-title-dot">.</span>
          </h1>

          <p className="hero-description editorial-hero-description">
            Fresh campus meals, rescued before they become waste. Find a plate, claim it,
            and keep good food moving through the community.
          </p>

          <div className="hero-cta-group editorial-hero-cta">
            <button className="btn btn-primary btn-lg hero-black-button" onClick={onExploreClick}>
              <ArrowDown size={18} />
              <span>Explore Available Food</span>
            </button>
            <button className="btn btn-secondary btn-lg hero-cream-button" onClick={onPostClick}>
              <PlusCircle size={18} />
              <span>Post Surplus Food</span>
            </button>
          </div>

          <div className="hero-trust-bar editorial-trust-bar">
            <div className="trust-item"><ShieldCheck size={16} /><span>Verified Fresh</span></div>
            <div className="trust-item"><Clock size={16} /><span>Live Timers</span></div>
            <div className="trust-item"><HeartHandshake size={16} /><span>Community Sharing</span></div>
          </div>
        </div>

        <div className="hero-visual editorial-hero-visual">
          <div className="hero-yellow-panel"></div>
          <div className="hero-food-orbit orbit-one"></div>
          <div className="hero-food-orbit orbit-two"></div>
          <div className="hero-food-photo-wrap">
            <img src={heroFoodImage} alt="Indian biryani" className="hero-food-photo" />
            <div className="hero-food-photo-caption">FRESHLY RESCUED<br /><strong>VEG BIRYANI</strong></div>
          </div>

          <div className="hero-interactive-card editorial-hero-card">
            <div className="hero-card-header">
              <div className="hero-card-tag"><span className="pulse-dot"></span><span>Freshly Listed</span></div>
              <span className="hero-card-time">LIVE</span>
            </div>
            <div className="hero-card-body">
              <div className="hero-food-icon-wrap">🍛</div>
              <div>
                <h3 className="hero-card-food-title">Vegetable Biryani</h3>
                <p className="hero-card-food-sub">Main Campus Canteen · 6 portions left</p>
              </div>
            </div>
            <div className="hero-card-meta">
              <div className="meta-pill"><MapPin size={13} /><span>Main Campus Canteen</span></div>
              <div className="meta-pill meta-pill-time"><Clock size={13} /><span>01:45:00</span></div>
            </div>
            <div className="hero-card-progress">
              <div className="progress-labels"><span>AVAILABLE</span><strong>6 / 10</strong></div>
              <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: "60%" }}></div></div>
            </div>
          </div>

          <div className="hero-floating-stat editorial-floating-stat">
            <div className="stat-icon-wrap">✦</div>
            <div><div className="stat-num">{stats.servingsSaved || 27}+</div><div className="stat-label">MEALS RESCUED THIS WEEK</div></div>
          </div>

          <div className="hero-side-label">FOOD<br />BRIDGE <ArrowUpRight size={20} /></div>
        </div>
      </div>
    </section>
  );
}
