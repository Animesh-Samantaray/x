import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Calendar,
  Mail,
  Shield,
  User as UserIcon,
  BookOpen,
  Heart,
  Activity,
  DollarSign,
  Download,
  Users,
  PlusCircle,
  CheckCircle,
  Video,
  Star,
  Settings,
  Info,
  Clock,
  FileText
} from "lucide-react";
import SpotlightCard from "../components/SpotlightCard";
import ProgressRing from "../components/ProgressRing";
import Button from "../components/Button";

const Profile = () => {
  const { user } = useAuth();
  const [toastMessage, setToastMessage] = useState("");

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently Joined";

  const role = user?.role || "learner";

  const getRoleColors = (roleName) => {
    switch (roleName) {
      case "admin":
        return "bg-accent-emerald/10 text-accent-emerald border-accent-emerald/25";
      case "expert":
        return "bg-accent-orange/10 text-accent-orange border-accent-orange/25";
      case "creator":
        return "bg-accent-purple/10 text-accent-purple border-accent-purple/25";
      default:
        return "bg-accent-blue/10 text-accent-blue border-accent-blue/25";
    }
  };

  const getRoleIcon = (roleName) => {
    switch (roleName) {
      case "admin":
        return <Settings size={10} />;
      case "expert":
        return <UserIcon size={10} />;
      case "creator":
        return <Users size={10} />;
      default:
        return <Shield size={10} />;
    }
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  return (
    <div className="relative z-10 space-y-6 text-left">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 glass-surface border-accent-blue/30 bg-bg-darker/95 px-5 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-300">
          <Info className="text-accent-blue shrink-0 animate-pulse" size={18} />
          <p className="text-xs font-semibold text-text-title">{toastMessage}</p>
        </div>
      )}

      {/* Profile Header Widget */}
      <SpotlightCard className="border border-glass-border p-6 sm:p-8 bg-glass-card shadow-2xl relative overflow-hidden" glowColor="rgba(59, 130, 246, 0.08)">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          
          {/* Avatar */}
          <div className="group/avatar h-20 w-20 rounded-2xl bg-gradient-accent p-[1.5px] shadow-lg overflow-hidden shrink-0 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            {user?.profilePicture ? (
               <img src={user.profilePicture} alt={user.name} className="h-full w-full rounded-2xl object-cover transition-transform duration-300 group-hover/avatar:scale-105" />
            ) : (
              <div className={`flex h-full w-full items-center justify-center rounded-2xl text-2xl font-extrabold text-white uppercase bg-gradient-to-br transition-all duration-300 group-hover/avatar:scale-105 ${
                role === "admin" ? "from-accent-emerald to-accent-cyan" :
                role === "creator" ? "from-accent-purple to-accent-magenta" :
                role === "expert" ? "from-accent-orange to-accent-amber" :
                "from-accent-blue to-accent-indigo"
              }`}>
                {user?.name ? user.name[0] : <UserIcon size={24} />}
              </div>
            )}
          </div>

          {/* Core info */}
          <div className="text-center sm:text-left space-y-3 flex-grow">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h1 className="text-2xl font-extrabold text-text-title leading-none">{user?.name || "Member"}</h1>
              <span className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${getRoleColors(role)}`}>
                {getRoleIcon(role)}
                {role}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-text-muted font-semibold">
              <div className="flex items-center gap-1.5">
                <Mail size={13} className="text-text-muted" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-text-muted" />
                <span>Member since {formattedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </SpotlightCard>

      {/* Grid workspace splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (Bio, Skills) (lg:4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Biography */}
          <SpotlightCard className="p-6 bg-glass-card border border-glass-border rounded-2xl text-left" glowColor="rgba(6, 182, 212, 0.06)">
            <div className="flex items-center gap-2 border-b border-glass-border/30 pb-3 mb-4">
              <BookOpen size={14} className="text-accent-cyan" />
              <h3 className="text-[10px] font-bold tracking-wider text-text-title uppercase">Biography</h3>
            </div>
            {user?.bio ? (
              <p className="text-xs text-text-main leading-relaxed font-medium">
                {user.bio}
              </p>
            ) : (
              <div className="text-center py-4 space-y-3">
                <p className="text-xs text-text-muted italic">No biography added yet.</p>
                <Button onClick={() => triggerToast("Bio settings are launching in the next phase!")} className="text-[10px] py-1.5 px-3">
                  Add Bio
                </Button>
              </div>
            )}
          </SpotlightCard>

          {/* Skills & Focus */}
          <SpotlightCard className="p-6 bg-glass-card border border-glass-border rounded-2xl text-left" glowColor="rgba(99, 102, 241, 0.06)">
            <div className="flex items-center gap-2 border-b border-glass-border/30 pb-3 mb-4">
              <Heart size={14} className="text-accent-indigo" />
              <h3 className="text-[10px] font-bold tracking-wider text-text-title uppercase">Skills & Focus</h3>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Expertise</h4>
                {user?.skills && user.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {user.skills.map((s, idx) => (
                      <span key={idx} className="bg-bg-dark border border-glass-border px-2.5 py-1 rounded-lg text-text-main transition duration-150 cursor-default">
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-text-muted italic">No skills listed.</p>
                )}
              </div>
              
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Focus Interests</h4>
                {user?.interests && user.interests.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {user.interests.map((int, idx) => (
                      <span key={idx} className="bg-bg-darker border border-glass-border px-2.5 py-1 rounded-lg text-text-muted transition duration-150 cursor-default">
                        {int}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-text-muted italic">No focus interests listed.</p>
                )}
              </div>
            </div>
          </SpotlightCard>

        </div>

        {/* Right Column (lg:8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. LEARNER VIEW */}
          {role === "learner" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SpotlightCard className="p-5 bg-glass-card border border-glass-border rounded-xl text-center py-8" glowColor="rgba(59, 130, 246, 0.05)">
                  <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Enrolled Courses</h4>
                  <p className="text-sm text-text-main mt-2 font-medium">No courses active</p>
                </SpotlightCard>
                
                <SpotlightCard className="p-5 bg-glass-card border border-glass-border rounded-xl text-center py-8" glowColor="rgba(16, 185, 129, 0.05)">
                  <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Completed Tracks</h4>
                  <p className="text-sm text-text-main mt-2 font-medium">0 completed</p>
                </SpotlightCard>
              </div>

              <SpotlightCard className="p-6 bg-glass-card border border-glass-border rounded-2xl" glowColor="rgba(59, 130, 246, 0.06)">
                <div className="flex items-center justify-between pb-3 border-b border-glass-border/30 mb-4">
                  <h3 className="text-[10px] font-bold text-text-title uppercase tracking-widest">Saved Resources</h3>
                  <span className="text-[10px] text-text-muted">0 files</span>
                </div>
                <div className="py-8 text-center text-xs text-text-muted">
                  No saved files found. Discover guides in the directory.
                </div>
              </SpotlightCard>
            </div>
          )}

          {/* 2. CREATOR VIEW */}
          {role === "creator" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SpotlightCard className="p-5 bg-glass-card border border-glass-border text-center" glowColor="rgba(168, 85, 247, 0.05)">
                  <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Revenue</h4>
                  <p className="text-lg font-extrabold text-accent-emerald mt-1">$0.00</p>
                </SpotlightCard>
                <SpotlightCard className="p-5 bg-glass-card border border-glass-border text-center" glowColor="rgba(59, 130, 246, 0.05)">
                  <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Sales</h4>
                  <p className="text-lg font-extrabold text-text-title mt-1">0 units</p>
                </SpotlightCard>
                <SpotlightCard className="p-5 bg-glass-card border border-glass-border text-center" glowColor="rgba(236, 72, 153, 0.05)">
                  <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Subscribers</h4>
                  <p className="text-lg font-extrabold text-text-title mt-1">0 users</p>
                </SpotlightCard>
              </div>

              <SpotlightCard className="p-6 bg-glass-card border border-glass-border rounded-2xl" glowColor="rgba(168, 85, 247, 0.06)">
                <div className="flex items-center justify-between pb-3 border-b border-glass-border/30 mb-4">
                  <h3 className="text-[10px] font-bold text-text-title uppercase tracking-widest">Published Resources</h3>
                </div>
                <div className="py-8 text-center text-xs text-text-muted">
                  No published configurations. Upload guides to share.
                </div>
              </SpotlightCard>
            </div>
          )}

          {/* 3. EXPERT VIEW */}
          {role === "expert" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SpotlightCard className="p-5 bg-glass-card border border-glass-border text-center" glowColor="rgba(249, 115, 22, 0.05)">
                  <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Mentorship Sessions</h4>
                  <p className="text-lg font-extrabold text-text-title mt-1">0 calls</p>
                </SpotlightCard>
                <SpotlightCard className="p-5 bg-glass-card border border-glass-border text-center" glowColor="rgba(16, 185, 129, 0.05)">
                  <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Mentorship Earnings</h4>
                  <p className="text-lg font-extrabold text-accent-emerald mt-1">$0.00</p>
                </SpotlightCard>
                <SpotlightCard className="p-5 bg-glass-card border border-glass-border text-center" glowColor="rgba(245, 158, 11, 0.05)">
                  <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Expert Rating</h4>
                  <p className="text-lg font-extrabold text-text-title mt-1">No reviews yet</p>
                </SpotlightCard>
              </div>

              <SpotlightCard className="p-6 bg-glass-card border border-glass-border rounded-2xl" glowColor="rgba(249, 115, 22, 0.06)">
                <div className="flex items-center justify-between pb-3 border-b border-glass-border/30 mb-4">
                  <h3 className="text-[10px] font-bold text-text-title uppercase tracking-widest">Available Hours</h3>
                </div>
                <div className="py-8 text-center text-xs text-text-muted">
                  No availability slots configured on your directory profile.
                </div>
              </SpotlightCard>
            </div>
          )}

          {/* 4. ADMIN VIEW */}
          {role === "admin" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SpotlightCard className="p-5 bg-glass-card border border-glass-border text-center" glowColor="rgba(16, 185, 129, 0.05)">
                  <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">System Users</h4>
                  <p className="text-lg font-extrabold text-text-title mt-1">1 active user</p>
                </SpotlightCard>
                <SpotlightCard className="p-5 bg-glass-card border border-glass-border text-center" glowColor="rgba(139, 92, 246, 0.05)">
                  <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Server Status</h4>
                  <p className="text-lg font-extrabold text-accent-emerald mt-1">Nominal</p>
                </SpotlightCard>
                <SpotlightCard className="p-5 bg-glass-card border border-glass-border text-center" glowColor="rgba(59, 130, 246, 0.05)">
                  <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Moderation queue</h4>
                  <p className="text-lg font-extrabold text-text-title mt-1">0 pending</p>
                </SpotlightCard>
              </div>

              <SpotlightCard className="p-6 bg-glass-card border border-glass-border rounded-2xl" glowColor="rgba(16, 185, 129, 0.06)">
                <div className="flex items-center justify-between pb-3 border-b border-glass-border/30 mb-4">
                  <h3 className="text-[10px] font-bold text-text-title uppercase tracking-widest">Platform Administrators</h3>
                </div>
                
                <div className="space-y-3 text-xs font-semibold">
                  <div className="flex items-center justify-between bg-bg-dark/50 border border-glass-border p-3.5 rounded-xl">
                    <div>
                      <h4 className="font-bold text-text-title mb-0.5 leading-none">{user?.name || "System Admin"} (You)</h4>
                      <p className="text-[9px] text-text-muted">{user?.email}</p>
                    </div>
                    <span className="text-[9px] bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      Owner
                    </span>
                  </div>
                </div>
              </SpotlightCard>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default Profile;
