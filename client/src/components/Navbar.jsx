import React, { useState } from "react";
import { Utensils, PlusCircle, Leaf, Menu, X } from "lucide-react";

export default function Navbar({ onNavigate, activeSection = "home" }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (onNavigate) onNavigate(sectionId);
    else document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="navbar-wrapper editorial-navbar">
      <div className="container navbar-container">
        <div className="navbar-brand" onClick={() => handleNavClick("home")} role="button" tabIndex={0}>
          <div className="logo-icon-bg"><Utensils size={21} /><span className="logo-leaf-pill"><Leaf size={9} /></span></div>
          <div className="logo-text-group"><span className="brand-name">FOOD<span className="brand-accent">BRIDGE</span></span><span className="brand-tagline">CAMPUS FOOD RESCUE</span></div>
        </div>

        <nav className="navbar-links">
          <button className={`nav-link ${activeSection === "home" ? "active" : ""}`} onClick={() => handleNavClick("home")}>Home</button>
          <button className={`nav-link ${activeSection === "available-food" ? "active" : ""}`} onClick={() => handleNavClick("available-food")}>Available Food</button>
          <button className={`nav-link ${activeSection === "post-food" ? "active" : ""}`} onClick={() => handleNavClick("post-food")}>Post Food</button>
          <button className={`nav-link ${activeSection === "impact" ? "active" : ""}`} onClick={() => handleNavClick("impact")}>Impact</button>
        </nav>

        <div className="navbar-actions">
          <button className="btn btn-primary btn-sm nav-cta-btn" onClick={() => handleNavClick("post-food")}><PlusCircle size={16} /><span>Post Surplus Food</span></button>
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle Navigation Menu">{mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>

      {mobileMenuOpen && <div className="mobile-nav-drawer editorial-mobile-drawer">
        <button className="mobile-nav-link" onClick={() => handleNavClick("home")}>Home</button>
        <button className="mobile-nav-link" onClick={() => handleNavClick("available-food")}>Available Food</button>
        <button className="mobile-nav-link" onClick={() => handleNavClick("post-food")}>Post Food</button>
        <button className="mobile-nav-link" onClick={() => handleNavClick("impact")}>Impact</button>
        <div className="mobile-cta-wrap"><button className="btn btn-primary btn-lg" style={{ width: "100%" }} onClick={() => handleNavClick("post-food")}><PlusCircle size={18} /><span>Post Surplus Food</span></button></div>
      </div>}
    </header>
  );
}
