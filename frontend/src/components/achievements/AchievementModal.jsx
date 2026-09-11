import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, CheckCircle2, Lock, ShieldCheck, Award } from "lucide-react";
import BadgeEmblem from "./BadgeEmblem";

const AchievementModal = ({ badge, userAchievement, isOpen, onClose }) => {
  if (!isOpen || !badge) return null;

  const isUnlocked = !!userAchievement;
  const unlockedDate = userAchievement?.unlockedAt
    ? new Date(userAchievement.unlockedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-md rounded-3xl bg-glass-card border border-glass-border p-6 sm:p-8 shadow-2xl overflow-hidden"
        >
          {/* Top Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-text-muted hover:text-text-title hover:bg-glass-border/30 transition cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="flex flex-col items-center text-center space-y-5">
            {/* Large Emblem Display */}
            <div className="pt-2">
              <BadgeEmblem
                name={badge.name}
                requirementType={badge.requirementType}
                rarity={badge.rarity}
                isUnlocked={isUnlocked}
                size="lg"
              />
            </div>

            {/* Rarity & Unlock Status Badge */}
            <div className="flex items-center gap-2">
              {badge.rarity && (
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-white/5 border border-glass-border text-text-muted">
                  {badge.rarity}
                </span>
              )}

              {isUnlocked ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <CheckCircle2 size={12} />
                  <span>Unlocked</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-white/5 border border-glass-border text-text-muted">
                  <Lock size={12} />
                  <span>Locked</span>
                </span>
              )}
            </div>

            {/* Title & Description */}
            <div className="space-y-1.5">
              <h3 className="text-xl font-extrabold text-text-title font-display">
                {badge.name}
              </h3>
              <p className="text-xs text-text-muted font-medium max-w-xs leading-relaxed">
                {badge.description}
              </p>
            </div>

            {/* Unlock Date / Requirement Info */}
            <div className="w-full pt-3 border-t border-glass-border">
              {isUnlocked ? (
                <div className="flex items-center justify-center gap-2 text-xs font-mono text-emerald-400/90 font-medium">
                  <Calendar size={14} />
                  <span>Unlocked on {unlockedDate}</span>
                </div>
              ) : (
                <div className="text-center space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted font-bold block">
                    Requirement
                  </span>
                  <p className="text-xs text-text-title font-medium">
                    {badge.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AchievementModal;
