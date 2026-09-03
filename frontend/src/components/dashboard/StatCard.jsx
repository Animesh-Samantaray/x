import React from "react";
import SpotlightCard from "../SpotlightCard";

const StatCard = ({ title, value, subtext, icon: Icon, color = "blue", glowColor, trend }) => {
  const colorMap = {
    blue: "card-tint-blue border-accent-blue/10 text-accent-blue",
    purple: "card-tint-purple border-accent-purple/10 text-accent-purple",
    emerald: "card-tint-mint border-accent-emerald/10 text-accent-emerald",
    pink: "card-tint-pink border-accent-pink/10 text-accent-pink",
    orange: "card-tint-peach border-accent-orange/10 text-accent-orange",
    cyan: "card-tint-cyan border-accent-cyan/10 text-accent-cyan",
  };

  const defaultGlows = {
    blue: "rgba(59, 130, 246, 0.12)",
    purple: "rgba(168, 85, 247, 0.12)",
    emerald: "rgba(16, 185, 129, 0.12)",
    pink: "rgba(236, 72, 153, 0.12)",
    orange: "rgba(249, 115, 22, 0.12)",
    cyan: "rgba(6, 182, 212, 0.12)",
  };

  const activeColor = colorMap[color] || colorMap.blue;
  const activeGlow = glowColor || defaultGlows[color] || defaultGlows.blue;

  return (
    <SpotlightCard className={`p-3.5 sm:p-4 text-left border rounded-xl transition-all duration-200 ${activeColor}`} glowColor={activeGlow}>
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 min-w-0">
          {Icon && <Icon size={14} className="shrink-0" />}
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-text-muted truncate">
            {title}
          </span>
        </div>
        {trend && (
          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-white/10 text-text-title shrink-0">
            {trend}
          </span>
        )}
      </div>

      <div className="text-xl sm:text-2xl font-extrabold mt-1.5 text-text-title tracking-tight">
        {value}
      </div>

      {subtext && (
        <p className="text-[9px] text-text-muted mt-0.5 font-semibold truncate">
          {subtext}
        </p>
      )}
    </SpotlightCard>
  );
};

export default StatCard;
