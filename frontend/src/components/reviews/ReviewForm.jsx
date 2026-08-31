import React, { useState, useEffect } from "react";
import { Star, Send, AlertCircle, CheckCircle2, Edit3, X } from "lucide-react";
import Button from "../Button";
import SpotlightCard from "../SpotlightCard";

const ReviewForm = ({
  initialReview = null,
  onSubmit,
  onCancel,
  submitting = false,
  errorMessage = "",
}) => {
  const isEdit = Boolean(initialReview);

  const [rating, setRating] = useState(initialReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(initialReview?.comment || "");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (initialReview) {
      setRating(initialReview.rating || 0);
      setComment(initialReview.comment || "");
    }
  }, [initialReview]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (!rating || rating < 1 || rating > 5) {
      setFormError("Please select a rating between 1 and 5 stars.");
      return;
    }

    if (!comment.trim()) {
      setFormError("Please write a comment for your review.");
      return;
    }

    onSubmit({
      rating,
      comment: comment.trim(),
    });
  };

  const activeStarRating = hoverRating || rating;

  return (
    <SpotlightCard
      className="p-5 md:p-6 bg-glass-card border border-glass-border rounded-2xl space-y-4 text-left"
      glowColor="rgba(168, 85, 247, 0.12)"
    >
      <div className="flex items-center justify-between border-b border-glass-border/30 pb-3">
        <h3 className="text-sm font-extrabold text-text-title flex items-center gap-2">
          <Edit3 size={16} className="text-accent-purple" />
          {isEdit ? "Edit Your Review" : "Write a Course Review"}
        </h3>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-text-muted hover:text-rose-400 transition cursor-pointer p-1"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {(formError || errorMessage) && (
        <div className="p-3 border border-rose-500/20 bg-rose-500/5 rounded-xl text-xs text-rose-400 flex items-center gap-2 font-semibold">
          <AlertCircle size={14} className="shrink-0" />
          <span>{formError || errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Interactive Star Rating Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider block">
            Your Rating <span className="text-rose-400">*</span>
          </label>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setRating(star);
                    setFormError("");
                  }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-amber-400 focus:outline-none transition-transform active:scale-95 cursor-pointer"
                  title={`${star} star${star > 1 ? "s" : ""}`}
                >
                  <Star
                    size={22}
                    className={`transition-colors ${
                      star <= activeStarRating
                        ? "fill-amber-400 text-amber-400"
                        : "text-text-muted/40 hover:text-amber-400/60"
                    }`}
                  />
                </button>
              ))}
            </div>

            {rating > 0 && (
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded ml-1">
                {rating === 5
                  ? "5 - Excellent"
                  : rating === 4
                  ? "4 - Very Good"
                  : rating === 3
                  ? "3 - Good"
                  : rating === 2
                  ? "2 - Fair"
                  : "1 - Poor"}
              </span>
            )}
          </div>
        </div>

        {/* Comment Textarea */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider block">
            Your Review <span className="text-rose-400">*</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this course, what you learned, and how it helped you..."
            rows={4}
            maxLength={1000}
            className="w-full form-input rounded-xl p-3 bg-bg-dark text-xs text-text-title border-glass-border focus:border-accent-purple/50 focus:outline-none resize-y"
          />
          <div className="text-[10px] text-text-muted text-right font-semibold">
            {comment.length} / 1000 characters
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-1">
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={submitting}
              className="text-xs py-2 px-4"
            >
              Cancel
            </Button>
          )}

          <Button
            type="submit"
            loading={submitting}
            disabled={submitting}
            className="text-xs py-2.5 px-5 flex items-center gap-2 bg-gradient-to-r from-accent-purple to-accent-indigo"
          >
            <Send size={14} />
            {submitting
              ? isEdit
                ? "Updating..."
                : "Submitting..."
              : isEdit
              ? "Update Review"
              : "Submit Review"}
          </Button>
        </div>
      </form>
    </SpotlightCard>
  );
};

export default ReviewForm;
