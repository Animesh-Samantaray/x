import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, Lock, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";
import { getAllAchievements, getMyAchievements } from "../../services/achievementService";
import BadgeEmblem from "./BadgeEmblem";
import AchievementModal from "./AchievementModal";

const AchievementsSection = () => {
  const [allBadges, setAllBadges] = useState([]);
  const [myAchievements, setMyAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [selectedUserAchievement, setSelectedUserAchievement] = useState(null);

  useEffect(() => {
    fetchAchievementData();
  }, []);

  const fetchAchievementData = async () => {
    try {
      setLoading(true);
      setError("");

      const myRes = await getMyAchievements().catch(() => null);

      if (myRes && myRes.success) {
        setMyAchievements(myRes.data || []);
        if (myRes.allBadges) {
          setAllBadges(myRes.allBadges);
        } else {
          // Fallback fetch all achievements if allBadges wasn't included
          const allRes = await getAllAchievements().catch(() => null);
          if (allRes && allRes.success) {
            setAllBadges(allRes.data || []);
          }
        }
      } else {
        const allRes = await getAllAchievements().catch(() => null);
        if (allRes && allRes.success) {
          setAllBadges(allRes.data || []);
        }
      }
    } catch (err) {
      console.error("Fetch achievements error:", err);
      setError("Failed to load achievements from server");
    } finally {
      setLoading(false);
    }
  };

  // Map unlocked badges for quick lookup
  // UserAchievement populated badge can be object or ID string
  const unlockedBadgeMap = new Map();
  myAchievements.forEach((ua) => {
    const bId = typeof ua.badge === "object" ? ua.badge._id : ua.badge;
    if (bId) {
      unlockedBadgeMap.set(bId.toString(), ua);
    }
  });

  const totalAvailable = allBadges.length;
  const totalUnlocked = unlockedBadgeMap.size;

  const handleBadgeClick = (badge, userAchievement) => {
    setSelectedBadge(badge);
    setSelectedUserAchievement(userAchievement || null);
  };

  if (loading) {
    return (
      <div className="p-6 sm:p-8 rounded-3xl bg-glass-card border border-glass-border shadow-md space-y-4 animate-pulse">
        <div className="flex items-center justify-between border-b border-glass-border pb-4">
          <div className="h-6 w-36 bg-glass-border/50 rounded-lg" />
          <div className="h-5 w-24 bg-glass-border/50 rounded-full" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 rounded-2xl bg-glass-border/30" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 sm:p-8 rounded-3xl bg-glass-card border border-glass-border shadow-md text-center space-y-3">
        <AlertCircle size={28} className="mx-auto text-rose-500" />
        <p className="text-xs text-text-muted font-medium">{error}</p>
        <button
          onClick={fetchAchievementData}
          className="px-4 py-2 text-xs font-bold bg-btn-primary hover:bg-btn-primary-hover text-white rounded-xl cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  if (allBadges.length === 0) {
    return (
      <div className="p-6 sm:p-8 rounded-3xl bg-glass-card border border-glass-border shadow-md text-center space-y-3">
        <Award size={32} className="mx-auto text-text-muted/60" />
        <h3 className="text-sm font-bold text-text-title font-display">Achievements</h3>
        <p className="text-xs text-text-muted font-medium">No achievements available yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-glass-card border border-glass-border shadow-md space-y-6">
      {/* Header with real count */}
      <div className="flex items-center justify-between border-b border-glass-border pb-4">
        <div className="flex items-center space-x-2.5">
          <Award size={20} className="text-purple-400" />
          <h3 className="text-sm font-extrabold text-text-title font-mono uppercase tracking-wider">
            Achievements
          </h3>
        </div>

        {/* Real Backend Counts */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono font-bold">
          <Sparkles size={12} />
          <span>
            {totalUnlocked} / {totalAvailable} Unlocked
          </span>
        </span>
      </div>

      {/* Grid of Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {allBadges.map((badge, index) => {
          const userAchievement = unlockedBadgeMap.get(badge._id.toString());
          const isUnlocked = !!userAchievement;

          const unlockedDate = userAchievement?.unlockedAt
            ? new Date(userAchievement.unlockedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : null;

          return (
            <motion.div
              key={badge._id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.25,
                delay: index * 0.04,
                ease: "easeOut",
              }}
              whileHover={{ y: isUnlocked ? -4 : -2, scale: isUnlocked ? 1.02 : 1 }}
              onClick={() => handleBadgeClick(badge, userAchievement)}
              className={`group relative p-4 rounded-2xl border flex flex-col items-center text-center cursor-pointer transition-all duration-200 ${
                isUnlocked
                  ? "bg-bg-darker/60 border-glass-border hover:border-purple-500/40 hover:shadow-lg"
                  : "bg-bg-darker/30 border-glass-border/40 hover:border-glass-border"
              }`}
            >
              {/* Hover Tooltip Overlay for Badge Requirement */}
              <div className="absolute inset-x-2 -top-12 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none flex justify-center">
                <div className="px-3 py-1.5 rounded-xl bg-bg-darker/95 border border-glass-border shadow-xl text-[11px] font-mono text-text-title whitespace-nowrap backdrop-blur-md flex items-center gap-1.5">
                  <span className="text-purple-400 font-bold">Req:</span>
                  <span>{badge.description}</span>
                </div>
              </div>

              {/* Badge Visual Emblem */}
              <div className="mb-3">
                <BadgeEmblem
                  name={badge.name}
                  requirementType={badge.requirementType}
                  rarity={badge.rarity}
                  isUnlocked={isUnlocked}
                  size="md"
                />
              </div>

              {/* Title */}
              <h4
                className={`text-xs font-bold font-display line-clamp-1 mb-1 ${
                  isUnlocked ? "text-text-title" : "text-text-muted/70"
                }`}
              >
                {badge.name}
              </h4>

              {/* Status / Requirement info */}
              {isUnlocked ? (
                <div className="flex flex-col items-center gap-0.5 text-[10px] font-mono font-medium text-emerald-400">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 size={10} />
                    <span>{unlockedDate}</span>
                  </div>
                  <span className="text-[9px] text-text-muted opacity-80 group-hover:opacity-100 transition-opacity line-clamp-1">
                    {badge.description}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[10px] font-mono text-text-muted/70 font-medium line-clamp-1">
                  <Lock size={10} className="shrink-0" />
                  <span className="line-clamp-1">{badge.description}</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Detail Modal */}
      <AchievementModal
        badge={selectedBadge}
        userAchievement={selectedUserAchievement}
        isOpen={!!selectedBadge}
        onClose={() => {
          setSelectedBadge(null);
          setSelectedUserAchievement(null);
        }}
      />
    </div>
  );
};

export default AchievementsSection;
