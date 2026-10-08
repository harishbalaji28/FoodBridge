import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FoodList from "./components/FoodList";
import PostFoodForm from "./components/PostFoodForm";
import Impact from "./components/Impact";
import ClaimModal from "./components/ClaimModal";
import { getPosts, createPost, getStats } from "./services/api";
import { Utensils } from "lucide-react";

const DEFAULT_STATS = {
  totalPosts: 0,
  openPosts: 0,
  closedPosts: 0,
  expiredPosts: 0,
  servingsSaved: 0,
  servingsMissed: 0,
  rescueRate: 0,
};

export default function App() {
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);
  const [activeSection, setActiveSection] = useState("home");
  const [claimingPost, setClaimingPost] = useState(null); // Selected post for claim modal

  // 1. Fetch available posts from backend (GET /api/posts?status=available)
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPosts();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load food posts from backend:", err);
      setError(
        err.message || "Could not connect to the backend server. Please verify Express is running."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Fetch platform stats from backend (GET /api/stats)
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const data = await getStats();
      setStats(data || DEFAULT_STATS);
    } catch (err) {
      console.error("Failed to load impact stats:", err);
      setStatsError(err.message || "Could not load statistics.");
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch posts and stats on mount
  useEffect(() => {
    fetchPosts();
    fetchStats();
  }, [fetchPosts, fetchStats]);

  // Handler: Scroll to section
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 3. Add new surplus post through backend (POST /api/posts)
  const handleAddPost = async (newPostPayload) => {
    const createdPost = await createPost(newPostPayload);

    // Refresh both posts and impact statistics
    await Promise.all([fetchPosts(), fetchStats()]);

    // Smoothly scroll to Available Food section
    setTimeout(() => {
      scrollToSection("available-food");
    }, 400);

    return createdPost;
  };

  // 4. Open Claim Modal for a specific post
  const handleClaimClick = (post) => {
    setClaimingPost(post);
  };

  // 5. Handle successful claim (refresh food list & impact stats immediately)
  const handleClaimSuccess = async () => {
    await Promise.all([fetchPosts(), fetchStats()]);
  };

  // 6. Handle post expiration in real-time (update local state and re-sync stats)
  const handleExpire = useCallback((expiredPostId) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === expiredPostId ? { ...p, status: "expired" } : p
      )
    );
    // Re-fetch impact stats to reflect missed servings
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="app-root">
      {/* Global Navigation */}
      <Navbar onNavigate={scrollToSection} activeSection={activeSection} />

      <main>
        {/* Hero Section */}
        <Hero
          onExploreClick={() => scrollToSection("available-food")}
          onPostClick={() => scrollToSection("post-food")}
          stats={stats}
        />

        {/* Available Food Section with Live Countdown & Expiry Handlers */}
        <FoodList
          posts={posts}
          loading={loading}
          error={error}
          onClaimClick={handleClaimClick}
          onPostClick={() => scrollToSection("post-food")}
          onRetry={fetchPosts}
          onExpire={handleExpire}
        />

        {/* Post Surplus Food Form Section */}
        <PostFoodForm onAddPost={handleAddPost} />

        {/* Real-time Sustainability Impact Section */}
        <Impact
          stats={stats}
          loading={statsLoading}
          error={statsError}
          onRetry={fetchStats}
        />
      </main>

      {/* Claim Meal Modal Dialog */}
      {claimingPost && (
        <ClaimModal
          post={claimingPost}
          onClose={() => setClaimingPost(null)}
          onClaimSuccess={handleClaimSuccess}
        />
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-container">
          <div className="footer-mission">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <div className="logo-icon-bg" style={{ width: "32px", height: "32px" }}>
                <Utensils size={16} />
              </div>
              <strong style={{ fontSize: "1.1rem" }}>FoodBridge</strong>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
              A student-led food rescue platform built to ensure no good meal goes to waste on campus.
            </p>
          </div>

          <div className="footer-copyright">
            <p>© {new Date().getFullYear()} FoodBridge • Built with React + Express for Web Competition</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
