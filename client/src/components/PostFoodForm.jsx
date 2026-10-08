import React, { useState } from "react";
import { PlusCircle, Sparkles, CheckCircle, Info, AlertOctagon } from "lucide-react";

/**
 * Format a Date object into 'YYYY-MM-DDTHH:MM' string for datetime-local input
 */
function toDateTimeLocalString(date) {
  const pad = (n) => String(n).padStart(2, "0");
  const yr = date.getFullYear();
  const mo = pad(date.getMonth() + 1);
  const da = pad(date.getDate());
  const hr = pad(date.getHours());
  const mi = pad(date.getMinutes());
  return `${yr}-${mo}-${da}T${hr}:${mi}`;
}

export default function PostFoodForm({ onAddPost }) {
  // Initial default best-before time: 2 hours from current time
  const defaultFutureTime = () => {
    const d = new Date();
    d.setHours(d.getHours() + 2);
    return toDateTimeLocalString(d);
  };

  const [formData, setFormData] = useState({
    foodName: "",
    totalServings: 4,
    pickupPoint: "",
    bestBefore: defaultFutureTime(),
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Quick preset helper to add hours to best-before
  const setQuickExpiry = (hours) => {
    const d = new Date();
    d.setHours(d.getHours() + hours);
    setFormData((prev) => ({ ...prev, bestBefore: toDateTimeLocalString(d) }));
    if (errors.bestBefore) {
      setErrors((prev) => ({ ...prev, bestBefore: null }));
    }
  };

  // Form Field Change Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (apiError) {
      setApiError(null);
    }
  };

  // Validate form before sending
  const validate = () => {
    const newErrors = {};

    if (!formData.foodName.trim()) {
      newErrors.foodName = "Please enter the name of the food item.";
    }

    const servings = Number(formData.totalServings);
    if (!formData.totalServings || isNaN(servings) || servings <= 0 || !Number.isInteger(servings)) {
      newErrors.totalServings = "Servings must be a positive whole number (at least 1).";
    }

    if (!formData.pickupPoint.trim()) {
      newErrors.pickupPoint = "Please provide the pickup location (room, counter, hall).";
    }

    if (!formData.bestBefore) {
      newErrors.bestBefore = "Please set a best-before date and time.";
    } else {
      const chosenDate = new Date(formData.bestBefore);
      if (isNaN(chosenDate.getTime()) || chosenDate <= new Date()) {
        newErrors.bestBefore = "Best-before time must be a date & time in the future.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError(null);

    // Build payload for backend POST /api/posts
    const postPayload = {
      foodName: formData.foodName.trim(),
      description: formData.description.trim(),
      totalServings: Number(formData.totalServings),
      pickupPoint: formData.pickupPoint.trim(),
      bestBefore: new Date(formData.bestBefore).toISOString(),
    };

    try {
      if (onAddPost) {
        await onAddPost(postPayload);
      }

      // Show success feedback
      setSuccessMessage(true);

      // Clear the form fields
      setFormData({
        foodName: "",
        totalServings: 4,
        pickupPoint: "",
        bestBefore: defaultFutureTime(),
        description: "",
      });

      // Auto-hide success notification after 4 seconds
      setTimeout(() => setSuccessMessage(false), 4000);
    } catch (err) {
      console.error("Submission failed:", err);
      setApiError(err.message || "Failed to publish food listing. Please check backend connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="post-food" className="section post-food-section">
      <div className="container">
        <div className="post-food-layout">
          {/* Form Card */}
          <div className="post-food-card card">
            <div className="form-header">
              <div className="section-eyebrow">
                <span>🌱 Share Extra Food</span>
              </div>
              <h2 className="form-title">Post Surplus Food</h2>
              <p className="form-subtitle">
                Prevent food waste by listing extra meals from campus dining, events, or student clubs.
              </p>
            </div>

            {/* Success Feedback */}
            {successMessage && (
              <div className="success-banner">
                <CheckCircle size={18} />
                <span>
                  <strong>Success!</strong> Your food post has been published and added to Available Food.
                </span>
              </div>
            )}

            {/* API Error Feedback */}
            {apiError && (
              <div className="field-error-text" style={{ padding: "10px 14px", backgroundColor: "#fef2f2", borderRadius: "8px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <AlertOctagon size={16} />
                <span>{apiError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* 1. Food Name (Manual Text Input) */}
              <div className="form-group">
                <label className="form-label" htmlFor="foodName">
                  <span>Food Item Name <span className="required">*</span></span>
                  <span className="helper">Enter whatever food you have</span>
                </label>
                <div className="input-with-icon">
                  <input
                    id="foodName"
                    name="foodName"
                    type="text"
                    className={`form-input ${errors.foodName ? "input-error" : ""}`}
                    placeholder="e.g. Samosas, Pasta Salad, Veggie Rice Bowls..."
                    value={formData.foodName}
                    onChange={handleChange}
                  />
                </div>
                {errors.foodName && <p className="field-error-text">{errors.foodName}</p>}
              </div>

              {/* 2. Number of Servings & Pickup Location in Grid */}
              <div className="form-row-2col">
                {/* Servings */}
                <div className="form-group">
                  <label className="form-label" htmlFor="totalServings">
                    <span>Number of Servings <span className="required">*</span></span>
                  </label>
                  <div className="servings-stepper">
                    <button
                      type="button"
                      className="stepper-btn"
                      onClick={() =>
                        setFormData((p) => ({
                          ...p,
                          totalServings: Math.max(1, Number(p.totalServings) - 1),
                        }))
                      }
                      aria-label="Decrease servings"
                    >
                      -
                    </button>
                    <input
                      id="totalServings"
                      name="totalServings"
                      type="number"
                      min="1"
                      step="1"
                      className={`form-input text-center ${errors.totalServings ? "input-error" : ""}`}
                      value={formData.totalServings}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="stepper-btn"
                      onClick={() =>
                        setFormData((p) => ({
                          ...p,
                          totalServings: Number(p.totalServings) + 1,
                        }))
                      }
                      aria-label="Increase servings"
                    >
                      +
                    </button>
                  </div>
                  {errors.totalServings && (
                    <p className="field-error-text">{errors.totalServings}</p>
                  )}
                </div>

                {/* Pickup Point */}
                <div className="form-group">
                  <label className="form-label" htmlFor="pickupPoint">
                    <span>Pickup Location <span className="required">*</span></span>
                  </label>
                  <div className="input-with-icon">
                    <input
                      id="pickupPoint"
                      name="pickupPoint"
                      type="text"
                      className={`form-input ${errors.pickupPoint ? "input-error" : ""}`}
                      placeholder="e.g. Hostel 3 Mess / Admin Hall 102"
                      value={formData.pickupPoint}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.pickupPoint && (
                    <p className="field-error-text">{errors.pickupPoint}</p>
                  )}
                </div>
              </div>

              {/* 3. Best-Before Date/Time */}
              <div className="form-group">
                <label className="form-label" htmlFor="bestBefore">
                  <span>Best-Before Time <span className="required">*</span></span>
                  <span className="helper">When should this food be consumed by?</span>
                </label>
                <input
                  id="bestBefore"
                  name="bestBefore"
                  type="datetime-local"
                  className={`form-input ${errors.bestBefore ? "input-error" : ""}`}
                  value={formData.bestBefore}
                  onChange={handleChange}
                />

                {/* Quick Expiry Shortcuts */}
                <div className="quick-presets">
                  <span className="presets-label">Quick Set:</span>
                  <button type="button" className="preset-btn" onClick={() => setQuickExpiry(1)}>
                    +1 Hour
                  </button>
                  <button type="button" className="preset-btn" onClick={() => setQuickExpiry(2)}>
                    +2 Hours
                  </button>
                  <button type="button" className="preset-btn" onClick={() => setQuickExpiry(4)}>
                    +4 Hours
                  </button>
                  <button type="button" className="preset-btn" onClick={() => setQuickExpiry(8)}>
                    +8 Hours
                  </button>
                </div>
                {errors.bestBefore && (
                  <p className="field-error-text">{errors.bestBefore}</p>
                )}
              </div>

              {/* 4. Optional Description */}
              <div className="form-group">
                <label className="form-label" htmlFor="description">
                  <span>Description / Dietary Notes</span>
                  <span className="helper">Optional</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  className="form-textarea"
                  placeholder="e.g. Vegetarian, contains dairy. Kept sealed in hot casseroles. Bring your own container if possible!"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary btn-lg submit-post-btn"
                disabled={isSubmitting}
              >
                <PlusCircle size={18} />
                <span>{isSubmitting ? "Publishing Listing..." : "Publish Surplus Food Post"}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Posting Guidelines & Sustainability Notice */}
          <div className="posting-tips-card card">
            <h3 className="tips-title">
              <Sparkles size={18} className="tips-icon" />
              <span>Campus Sharing Tips</span>
            </h3>

            <div className="tips-list">
              <div className="tip-item">
                <div className="tip-bullet">1</div>
                <div>
                  <strong>Any Food is Welcome</strong>
                  <p>Buffet leftovers, sealed cafeteria boxes, snack platters, or packaged bakery goods.</p>
                </div>
              </div>

              <div className="tip-item">
                <div className="tip-bullet">2</div>
                <div>
                  <strong>Clear Pickup Instructions</strong>
                  <p>Specify exact room numbers, counters, or desks so students can easily find the food.</p>
                </div>
              </div>

              <div className="tip-item">
                <div className="tip-bullet">3</div>
                <div>
                  <strong>Set Realistic Expiry</strong>
                  <p>Keep food safety first. Prepared hot food is best claimed within 2–4 hours.</p>
                </div>
              </div>
            </div>

            <div className="tips-eco-banner">
              <Info size={16} className="eco-banner-icon" />
              <p>
                Each meal shared prevents ~<strong>0.8 kg of CO₂</strong> emissions and directly supports student well-being.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
