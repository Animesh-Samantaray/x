import React from "react";

const ProgressRing = ({
  progress = 0,
  size = 60,
  strokeWidth = 6,
  ringColor = "stroke-accent-blue",
  trackColor = "stroke-glass-border",
  textColor = "text-text-title",
  showText = true,
  className = "",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Track circle */}
        <circle
          className={`${trackColor} transition-all duration-300`}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          className={`${ringColor} transition-all duration-500 ease-out`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {showText && (
        <span className={`absolute text-[11px] font-bold tracking-tight ${textColor}`}>
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
};

export default ProgressRing;
