import React from "react";
import { Sparkles, Flame, Rocket, Zap, Trophy, ThumbsUp, Star, ShieldCheck } from "lucide-react";

const stickerVariants = {
  trending: {
    label: "Trending",
    icon: Flame,
    colorClass: "sticker-orange",
  },
  popular: {
    label: "Popular",
    icon: Rocket,
    colorClass: "sticker-purple",
  },
  new: {
    label: "New",
    icon: Sparkles,
    colorClass: "sticker-cyan",
  },
  fast: {
    label: "Fast Track",
    icon: Zap,
    colorClass: "sticker-blue",
  },
  top: {
    label: "Top Rated",
    icon: Trophy,
    colorClass: "sticker-amber",
  },
  recommended: {
    label: "Recommended",
    icon: ThumbsUp,
    colorClass: "sticker-pink",
  },
  verified: {
    label: "Verified",
    icon: ShieldCheck,
    colorClass: "sticker-emerald",
  },
};

const Sticker = ({ type = "new", text, className = "" }) => {
  const config = stickerVariants[type] || stickerVariants.new;
  const Icon = config.icon;
  const label = text || config.label;

  return (
    <span className={`sticker ${config.colorClass} ${className}`}>
      <Icon size={11} className="shrink-0" />
      <span>{label}</span>
    </span>
  );
};

export default Sticker;
