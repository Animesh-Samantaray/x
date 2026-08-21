import React from "react";
import { useAuth } from "../context/AuthContext";
import { Calendar, Mail, Shield, User as UserIcon, BookOpen, Heart, Activity } from "lucide-react";
import GlassCard from "../components/GlassCard";

const Profile = () => {
  const { user } = useAuth();

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently Joined";

  const defaultSkills = user?.skills?.length > 0 ? user.skills : ["React", "JavaScript", "CSS Grid", "Full Stack Development"];
  const defaultInterests = user?.interests?.length > 0 ? user.interests : ["Software Engineering", "UI/UX Design", "Peer Learning", "Open Source"];
  const defaultBio = user?.bio || "This member has not written a biography yet. Learning and sharing knowledge everyday on Collaborative Knowledge Marketplace.";

  return (
    <div className="relative min-h-[85vh] px-4 sm:px-6 lg:px-8 py-10 sm:py-14 z-10">
      
      {/* Background ambient glows */}
      <div className="absolute top-[15%] left-[5%] h-[300px] w-[300px] rounded-full ambient-glow-indigo opacity-30 pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] right-[10%] h-[300px] w-[300px] rounded-full ambient-glow-purple opacity-20 pointer-events-none z-0"></div>

      <div className="mx-auto max-w-5xl relative z-10 space-y-8">
        
        {/* Profile Header Dashboard Widget */}
        <GlassCard hoverEffect={false} className="border border-glass-border p-6 sm:p-8 bg-slate-950/20 shadow-2xl relative overflow-hidden">
          {/* Subtle decoration inside header */}
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-accent-indigo/5 blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
            {/* Avatar block */}
            <div className="h-20 w-20 rounded-2xl bg-gradient-accent p-[1.5px] shadow-[0_4px_25px_rgba(99,102,241,0.2)] overflow-hidden">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt={user.name} className="h-full w-full rounded-2xl object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-bg-deep text-2xl font-bold text-white uppercase">
                  {user?.name ? user.name[0] : <UserIcon size={24} />}
                </div>
              )}
            </div>

            {/* Profile Core info */}
            <div className="text-center sm:text-left space-y-2 flex-grow">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h1 className="text-2xl font-extrabold text-white leading-none">{user?.name}</h1>
                <span className="inline-flex items-center gap-1 rounded-md bg-accent-indigo/10 border border-accent-indigo/25 px-2 py-0.5 text-[9px] font-bold text-accent-indigo uppercase tracking-wider">
                  <Shield size={10} />
                  {user?.role || "Learner"}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Mail size={13} className="text-slate-500" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-slate-500" />
                  <span>Joined {formattedDate}</span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Dashboard Panels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Metadata & Metrics (md:span 4) */}
          <div className="md:col-span-4 space-y-6">
            <GlassCard hoverEffect={false} className="border border-glass-border bg-slate-950/20 shadow-2xl p-6">
              <div className="flex items-center gap-2 border-b border-glass-border/60 pb-3 mb-4">
                <Activity size={14} className="text-accent-indigo" />
                <h3 className="text-xs font-bold tracking-wider text-slate-300 uppercase">
                  Platform Activity
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-slate-950/60 rounded-xl p-3 border border-glass-border/60">
                  <div className="text-2xl font-extrabold text-white">0</div>
                  <div className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mt-1">Resources</div>
                </div>
                <div className="bg-slate-950/60 rounded-xl p-3 border border-glass-border/60">
                  <div className="text-2xl font-extrabold text-white">0</div>
                  <div className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mt-1">Mentorships</div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Right Column: About, Skills, Interests (md:span 8) */}
          <div className="md:col-span-8 space-y-6">
            {/* Biography */}
            <GlassCard hoverEffect={false} className="border border-glass-border bg-slate-950/20 shadow-2xl p-6">
              <div className="flex items-center gap-2 border-b border-glass-border/60 pb-3 mb-4">
                <BookOpen size={14} className="text-accent-indigo" />
                <h3 className="text-xs font-bold tracking-wider text-slate-300 uppercase">
                  Biography
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {defaultBio}
              </p>
            </GlassCard>

            {/* Skills & Specializations */}
            <GlassCard hoverEffect={false} className="border border-glass-border bg-slate-950/20 shadow-2xl p-6">
              <div className="flex items-center gap-2 border-b border-glass-border/60 pb-3 mb-4">
                <Heart size={14} className="text-accent-purple" />
                <h3 className="text-xs font-bold tracking-wider text-slate-300 uppercase">
                  Skills & Focus Areas
                </h3>
              </div>
              
              <div className="space-y-5">
                {/* Core Expertise Tags */}
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">
                    Core Specialities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {defaultSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="text-[11px] bg-slate-950/50 text-slate-300 border border-glass-border rounded-lg px-2.5 py-1.5 hover:border-slate-500 hover:text-white transition duration-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Topics of Interest Tags */}
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">
                    Interests & Topics
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {defaultInterests.map((interest, index) => (
                      <span
                        key={index}
                        className="text-[11px] bg-slate-900/40 text-purple-300 border border-accent-purple/20 rounded-lg px-2.5 py-1.5 hover:border-accent-purple/40 hover:text-white transition duration-200"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
