import React from "react";

const GlassCard = ({
  children,
  className = "",
  variant = "glass", // "glass" | "solid"
  hoverEffect = true,
  ...props
}) => {
  const baseStyle = "rounded-2xl p-6";
  
  const styleClasses = variant === "glass" 
    ? `glass-panel ${hoverEffect ? "glass-panel-interactive" : ""}`
    : `solid-panel ${hoverEffect ? "solid-panel-interactive" : ""}`;

  return (
    <div
      className={`${baseStyle} ${styleClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
