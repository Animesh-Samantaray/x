import React from "react";
import { Star } from "lucide-react";


const CourseRatingDisplay = ({
  averageRating,
  reviewCount,
  showCount = true,
  size = "sm", // 'xs' | 'sm' | 'md' | 'lg'
  className = "",
}) => {
  const ratingNum = Number(averageRating) || 0;
  const countNum = Number(reviewCount) || 0;

  if (countNum === 0 || ratingNum === 0) {
    return (
      <div className={`flex items-center gap-1 text-text-muted text-[10px] font-semibold ${className}`}>
        <Star size={size === "xs" ? 10 : size === "sm" ? 12 : 14} className="text-text-muted/40 shrink-0" />
        <span>No reviews yet</span>
      </div>
    );
  }

  const iconSizes = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 18,
  };

  const textSizes = {
    xs: "text-[9px]",
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
  };

  return (
    <div className={`flex items-center gap-1 font-bold ${textSizes[size] || "text-[10px]"} ${className}`}>
      <Star
        size={iconSizes[size] || 12}
        className="fill-amber-400 text-amber-400 shrink-0"
      />
      <span className="text-text-title font-extrabold">
        {ratingNum.toFixed(1)}
      </span>
      {showCount && (
        <span className="text-text-muted font-normal">
          ({countNum} {countNum === 1 ? "review" : "reviews"})
        </span>
      )}
    </div>
  );
};

export default CourseRatingDisplay;
