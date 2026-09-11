import React from "react";
import {
  Brain,
  Sparkles,
  BookOpen,
  GraduationCap,
  Sparkle,
  Compass,
  Zap,
  TrendingUp,
  Layers,
  DollarSign,
  Users,
  Award,
  Star,
  ShieldCheck,
  Crown,
  Lock,
} from "lucide-react";

/**
 * Returns an appropriate Lucide icon component based on badge name or requirementType
 */
const getBadgeIcon = (name = "", reqType = "") => {
  const lowerName = name.toLowerCase();

  if (lowerName.includes("ai explorer") || lowerName.includes("ai")) return Compass;
  if (lowerName.includes("ai specialist")) return Sparkle;
  if (lowerName.includes("knowledge seeker")) return BookOpen;
  if (lowerName.includes("learning master")) return GraduationCap;
  if (lowerName.includes("rising creator")) return TrendingUp;
  if (lowerName.includes("resource builder")) return Layers;
  if (lowerName.includes("premium creator")) return Crown;
  if (lowerName.includes("mentor pro")) return Users;
  if (lowerName.includes("premium expert")) return Star;

  if (reqType.includes("course")) return BookOpen;
  if (reqType.includes("resource")) return Layers;
  if (reqType.includes("earning")) return DollarSign;
  if (reqType.includes("session")) return Users;
  if (reqType.includes("rating")) return Star;

  return Award;
};

/**
 * CSS Gradient & Styling configurations based on rarity
 */
const rarityStyles = {
  common: {
    border: "border-cyan-500/30",
    bgGradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    glow: "shadow-[0_0_20px_rgba(6,182,212,0.15)]",
    ring: "border-cyan-500/40",
    iconColor: "text-cyan-400",
    badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    label: "COMMON",
  },
  rare: {
    border: "border-purple-500/40",
    bgGradient: "from-purple-500/25 via-pink-500/15 to-transparent",
    glow: "shadow-[0_0_25px_rgba(168,85,247,0.2)]",
    ring: "border-purple-500/50",
    iconColor: "text-purple-400",
    badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    label: "RARE",
  },
  epic: {
    border: "border-amber-500/50",
    bgGradient: "from-amber-500/30 via-orange-500/20 to-transparent",
    glow: "shadow-[0_0_30px_rgba(245,158,11,0.25)]",
    ring: "border-amber-500/60",
    iconColor: "text-amber-400",
    badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    label: "EPIC",
  },
  legendary: {
    border: "border-emerald-400/60",
    bgGradient: "from-emerald-500/35 via-teal-500/20 to-transparent",
    glow: "shadow-[0_0_35px_rgba(52,211,153,0.3)]",
    ring: "border-emerald-400/70",
    iconColor: "text-emerald-400",
    badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-400/40",
    label: "LEGENDARY",
  },
};

/**
 * Pure CSS/SVG Emblem Component
 */
export const BadgeEmblem = ({
  name = "",
  requirementType = "",
  rarity = "common",
  isUnlocked = false,
  size = "md", // "sm", "md", "lg"
}) => {
  const style = rarityStyles[rarity?.toLowerCase()] || rarityStyles.common;
  const IconComponent = getBadgeIcon(name, requirementType);

  const dimensionMap = {
    sm: "w-12 h-12",
    md: "w-20 h-20 sm:w-24 sm:h-24",
    lg: "w-28 h-28 sm:w-32 sm:h-32",
  };

  const iconSizeMap = {
    sm: 20,
    md: 32,
    lg: 44,
  };

  const currentDimension = dimensionMap[size] || dimensionMap.md;
  const currentIconSize = iconSizeMap[size] || iconSizeMap.md;

  if (!isUnlocked) {
    return (
      <div
        className={`relative ${currentDimension} rounded-full flex items-center justify-center bg-bg-darker/80 border border-glass-border/60 grayscale contrast-75 opacity-60 shadow-inner group-hover:opacity-80 transition-all duration-300`}
      >
        <div className="absolute inset-2 rounded-full border border-dashed border-white/10 flex items-center justify-center">
          <Lock size={currentIconSize * 0.7} className="text-text-muted/80" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative ${currentDimension} rounded-full flex items-center justify-center bg-gradient-to-b ${style.bgGradient} border-2 ${style.border} ${style.glow} transition-all duration-300 group-hover:scale-105`}
    >
      {/* Outer Decorative Ring */}
      <div className={`absolute inset-1.5 rounded-full border ${style.ring} opacity-60`} />

      {/* Subtle Inner Glass Layer */}
      <div className="absolute inset-3 rounded-full bg-glass-card/40 backdrop-blur-xs border border-white/10 flex items-center justify-center shadow-inner" />

      {/* Emblem Icon */}
      <div className="relative z-10 drop-shadow-md">
        <IconComponent size={currentIconSize} className={style.iconColor} />
      </div>

      {/* Decorative Sparkle for Legendary/Epic */}
      {(rarity === "legendary" || rarity === "epic") && (
        <div className="absolute -top-1 -right-1 z-20">
          <Sparkle size={16} className={`${style.iconColor} animate-pulse`} />
        </div>
      )}
    </div>
  );
};

export default BadgeEmblem;
