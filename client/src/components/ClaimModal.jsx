import React, { useState } from "react";
import { X, CheckCircle2, AlertOctagon, HeartHandshake } from "lucide-react";
import { claimPost } from "../services/api";

export default function ClaimModal({ post, onClose, onClaimSuccess }) {
  const [formData, setFormData] = useState({
    claimerName: "",
    registrationNumber: "",
    servings: 1,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!post) return null;

  const maxServings = post.remainingServings || 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    // Frontend validation
    if (!formData.claimerName.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    if (!formData.registrationNumber.trim()) {
      setErrorMsg("Please enter your student / staff registration number.");
      return;
    }

    const requestedServings = Number(formData.servings);
    if (!formData.servings || isNaN(requestedServings) || requestedServings <= 0 || !Number.isInteger(requestedServings)) {
      setErrorMsg("Servings must be a positive whole number (at least 1).");
      return;
    }

    if (requestedServings > maxServings) {
      setErrorMsg(`Cannot claim ${requestedServings} servings. Only ${maxServings} remaining.`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Send claim to backend API: POST /api/posts/:id/claims
      const result = await claimPost(post.id, {
        claimerName: formData.claimerName.trim(),
        registrationNumber: formData.registrationNumber.trim(),
        servings: requestedServings,
      });

      // Show success feedback
      setSuccessMsg(
        result.message ||
        `Successfully claimed ${requestedServings} serving(s) of ${post.foodName}! 🎉`
      );

      // Notify parent to refresh list immediately
      if (onClaimSuccess) {
        await onClaimSuccess(result);
      }

      // Auto-close modal after brief delay so user sees confirmation
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error("Claim failed:", err);
      // Backend error is source of truth
      setErrorMsg(err.message || "Failed to submit claim. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div className="logo-icon-bg" style={{ width: "32px", height: "32px", borderRadius: "8px" }}>
              <HeartHandshake size={18} />
            </div>
            <h3 className="modal-title">Claim Food Portion</h3>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Food Post Summary Details */}
        <div className="modal-food-summary">
          <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "4px" }}>
            {post.foodName}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.82rem", color: "var(--text-muted)", flexWrap: "wrap" }}>
            <span>
              📍 <strong>{post.pickupPoint}</strong>
            </span>
            <span>
              👥 <strong>{post.remainingServings}</strong> of {post.totalServings} portions left
            </span>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="success-banner" style={{ margin: "14px 0" }}>
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="field-error-text" style={{ padding: "10px 14px", backgroundColor: "#fef2f2", borderRadius: "8px", margin: "14px 0", display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertOctagon size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        {!successMsg && (
          <form onSubmit={handleSubmit} noValidate>
            {/* 1. Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="claimerName">
                <span>Your Full Name <span className="required">*</span></span>
              </label>
              <input
                id="claimerName"
                name="claimerName"
                type="text"
                required
                className="form-input"
                placeholder="e.g. Harish Kumar"
                value={formData.claimerName}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            {/* 2. Registration Number */}
            <div className="form-group">
              <label className="form-label" htmlFor="registrationNumber">
                <span>Student / Staff Reg Number <span className="required">*</span></span>
              </label>
              <input
                id="registrationNumber"
                name="registrationNumber"
                type="text"
                required
                className="form-input"
                placeholder="e.g. RA2311003 / EMP-4091"
                value={formData.registrationNumber}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            {/* 3. Servings to Claim */}
            <div className="form-group">
              <label className="form-label" htmlFor="servings">
                <span>Servings to Claim <span className="required">*</span></span>
                <span className="helper">Max available: {maxServings}</span>
              </label>
              <div className="servings-stepper">
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      servings: Math.max(1, Number(prev.servings) - 1),
                    }))
                  }
                  disabled={isSubmitting || formData.servings <= 1}
                  aria-label="Decrease claim servings"
                >
                  -
                </button>
                <input
                  id="servings"
                  name="servings"
                  type="number"
                  min="1"
                  max={maxServings}
                  step="1"
                  required
                  className="form-input text-center"
                  value={formData.servings}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      servings: Math.min(maxServings, Number(prev.servings) + 1),
                    }))
                  }
                  disabled={isSubmitting || formData.servings >= maxServings}
                  aria-label="Increase claim servings"
                >
                  +
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || maxServings <= 0}
              >
                {isSubmitting ? "Processing Claim..." : "Confirm Meal Claim"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
