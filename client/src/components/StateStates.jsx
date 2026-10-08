import React from "react";
import { UtensilsCrossed, AlertOctagon, RotateCw, PlusCircle } from "lucide-react";

/**
 * Loading Skeleton Grid
 */
export function LoadingSkeleton({ count = 3 }) {
  return (
    <div className="food-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="card skeleton-card">
          <div className="skeleton skeleton-header"></div>
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-desc"></div>
          <div className="skeleton skeleton-bar"></div>
          <div className="skeleton skeleton-footer"></div>
        </div>
      ))}
    </div>
  );
}

/**
 * Empty State Component
 */
export function EmptyState({ message, onReset, onPostClick }) {
  return (
    <div className="state-box card">
      <div className="state-icon-wrap">
        <UtensilsCrossed size={36} className="state-icon" />
      </div>
      <h3 className="state-title">No Surplus Food Found</h3>
      <p className="state-desc">
        {message || "There are no active food listings matching your criteria right now. Check back soon or be the first to share extra food!"}
      </p>
      <div className="state-actions">
        {onReset && (
          <button className="btn btn-secondary" onClick={onReset}>
            Clear All Filters
          </button>
        )}
        {onPostClick && (
          <button className="btn btn-primary" onClick={onPostClick}>
            <PlusCircle size={16} />
            <span>Post Extra Food</span>
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Error State Component
 */
export function ErrorState({ error, onRetry }) {
  return (
    <div className="state-box card state-box-error">
      <div className="state-icon-wrap error-icon-wrap">
        <AlertOctagon size={36} className="state-icon" />
      </div>
      <h3 className="state-title">Unable to Load Food Listings</h3>
      <p className="state-desc">
        {error || "An unexpected error occurred while fetching surplus meals. Please try again."}
      </p>
      {onRetry && (
        <div className="state-actions">
          <button className="btn btn-secondary" onClick={onRetry}>
            <RotateCw size={16} />
            <span>Retry Connection</span>
          </button>
        </div>
      )}
    </div>
  );
}
