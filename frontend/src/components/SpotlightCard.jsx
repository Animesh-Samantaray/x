import React, { useRef } from "react";

const SpotlightCard = ({
  children,
  className = "",
  glowColor = "rgba(59, 130, 246, 0.15)",
  glowSize = 350,
  ...props
}) => {
  const divRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    divRef.current.style.setProperty("--mouse-x", `${x}px`);
    divRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden rounded-2xl border border-glass-border bg-[#030712]/50 backdrop-blur-md transition-all duration-300 group ${className}`}
      {...props}
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(${glowSize}px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${glowColor}, transparent 80%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default SpotlightCard;
