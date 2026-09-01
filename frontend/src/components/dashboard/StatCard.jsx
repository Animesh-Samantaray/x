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
    <SpotlightCard className={`p-5 text-left border rounded-2xl ${activeColor}`} glowColor={activeGlow}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={16} className="shrink-0" />}
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-muted">
            {title}
          </span>
        </div>
        {trend && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-text-title">
            {trend}
          </span>
        )}
      </div>

      <div className="text-2xl font-extrabold mt-2 text-text-title tracking-tight">
        {value}
      </div>

      {subtext && (
        <p className="text-[10px] text-text-muted mt-1 font-semibold truncate">
          {subtext}
        </p>
      )}
    </SpotlightCard>
  );
};

export default StatCard;
