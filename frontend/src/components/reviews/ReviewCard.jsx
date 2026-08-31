import React from "react";
import { Star, User, Edit2, Trash2, Calendar } from "lucide-react";
import SpotlightCard from "../SpotlightCard";


const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (err) {
    return "";
  }
};

const ReviewCard = ({
  review,
  isOwnReview = false,
  isAdmin = false,
  onEdit,
  onDelete,
  deleting = false,
}) => {
  if (!review) return null;

  const { _id, rating, comment, user, createdAt, updatedAt } = review;
  const userName = typeof user === "object" ? user?.name || "Learner" : "Learner";
  const canModify = isOwnReview || isAdmin;
  const isEdited = updatedAt && createdAt && new Date(updatedAt) - new Date(createdAt) > 60000;

  return (
    <SpotlightCard
      className="p-5 bg-glass-card border border-glass-border rounded-2xl space-y-3 text-left"
      glowColor="rgba(168, 85, 247, 0.06)"
    >
      {/* Top Bar: User Info & Stars & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-glass-border/30 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-accent-purple/15 border border-accent-purple/30 flex items-center justify-center text-accent-purple font-extrabold text-xs shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-text-title">
                {userName}
              </span>
              {isOwnReview && (
                <span className="text-[9px] font-bold uppercase tracking-wider bg-accent-purple/10 text-accent-purple border border-accent-purple/20 px-1.5 py-0.2 rounded">
                  Your Review
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5 text-[10px] text-text-muted">
              <Calendar size={10} />
              <span>{formatDate(createdAt)}</span>
              {isEdited && <span className="text-text-muted/60">(edited)</span>}
            </div>
          </div>
        </div>

        {/* Rating Stars & Action buttons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5 bg-bg-dark border border-glass-border/60 px-2 py-1 rounded-lg">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={12}
                className={
                  star <= rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-text-muted/30"
                }
              />
            ))}
            <span className="text-xs font-bold text-text-title ml-1">
              {rating}.0
            </span>
          </div>

          {canModify && (
            <div className="flex items-center gap-1 border-l border-glass-border/30 pl-2">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(review)}
                  className="p-1.5 text-text-muted hover:text-accent-purple hover:bg-accent-purple/10 rounded-lg transition cursor-pointer"
                  title="Edit Review"
                >
                  <Edit2 size={13} />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(_id)}
                  disabled={deleting}
                  className="p-1.5 text-text-muted hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                  title="Delete Review"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Comment Content */}
      <p className="text-xs text-text-main leading-relaxed whitespace-pre-wrap">
        {comment}
      </p>
    </SpotlightCard>
  );
};

export default ReviewCard;
