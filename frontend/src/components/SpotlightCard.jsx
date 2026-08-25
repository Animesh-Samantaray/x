import React from "react";

const SpotlightCard = ({
  children,
  className = "",
  glowColor = "rgba(139, 92, 246, 0.12)",
  glowSize,
  ...props
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-glass-border bg-glass-card hover:border-glass-border-hover hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_8px_25px_rgba(139,92,246,0.04)] transition-all duration-200 group ${className}`}
      {...props}
    >
      {/* Premium GPU-accelerated static radial glow overlay on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(350px circle at 50% 50%, ${glowColor}, transparent 80%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default SpotlightCard;