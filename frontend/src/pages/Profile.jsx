import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Calendar, Mail, Shield, User as UserIcon, BookOpen, Heart, Activity, DollarSign, Download, Users, PlusCircle, CheckCircle, Video, Star, Settings } from "lucide-react";
import SpotlightCard from "../components/SpotlightCard";
import ProgressRing from "../components/ProgressRing";
import Button from "../components/Button";

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently Joined";

  const defaultSkills = user?.skills?.length > 0 ? user.skills : ["React", "JavaScript", "System Architecture", "TypeScript"];
  const defaultInterests = user?.interests?.length > 0 ? user.interests : ["Full Stack Dev", "AI & ML", "Software Design", "SaaS Analytics"];
  const defaultBio = user?.bio || "Active technical specialist exchanging knowledge and compiling guides on Collaborative Knowledge Marketplace.";

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

  return (
    <div className="relative z-10 space-y-6 text-left animate-fade-in">
      
      {/* Profile Header Widget */}
      <SpotlightCard hoverEffect={true} className="border border-glass-border p-6 sm:p-8 bg-[#050811]/30 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-slate-700" glowColor="rgba(59, 130, 246, 0.12)">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-accent-blue/5 blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          {/* Avatar */}
          <div className="group/avatar h-20 w-20 rounded-2xl bg-gradient-accent p-[1.5px] shadow-lg overflow-hidden shrink-0 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            {user?.profilePicture ? (
               <img src={user.profilePicture} alt={user.name} className="h-full w-full rounded-2xl object-cover transition-transform duration-300 group-hover/avatar:scale-105" />
            ) : (
              <div className={`flex h-full w-full items-center justify-center rounded-2xl text-2xl font-extrabold text-white uppercase bg-gradient-to-br transition-all duration-300 group-hover/avatar:scale-105 ${
                role === "admin" ? "from-accent-emerald to-accent-cyan" :
                role === "creator" ? "from-accent-purple to-accent-magenta" :
                role === "expert" ? "from-accent-orange to-accent-amber" :
                "from-accent-blue to-accent-indigo"
              } shadow-[0_0_20px_rgba(59,130,246,0.25)]`}>
                {user?.name ? user.name[0] : <UserIcon size={24} />}
              </div>
            )}
          </div>

          {/* Core info */}
          <div className="text-center sm:text-left space-y-3 flex-grow">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h1 className="text-2xl font-extrabold text-white leading-none">{user?.name || "Animesh Samantaray"}</h1>
              <span className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${getRoleColors(role)}`}>
                {getRoleIcon(role)}
                {role}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 font-semibold">
              <div className="flex items-center gap-1.5">
                <Mail size={13} className="text-slate-500" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-slate-500" />
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
          <SpotlightCard className="p-6 bg-[#03050c]/40 border border-glass-border rounded-2xl text-left" glowColor="rgba(6, 182, 212, 0.08)">
            <div className="flex items-center gap-2 border-b border-glass-border/30 pb-3 mb-4">
              <BookOpen size={14} className="text-accent-cyan" />
              <h3 className="text-[10px] font-bold tracking-wider text-slate-300 uppercase">Biography</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              {defaultBio}
            </p>
          </SpotlightCard>

          {/* Skills & Focus */}
          <SpotlightCard className="p-6 bg-[#03050c]/40 border border-glass-border rounded-2xl text-left" glowColor="rgba(99, 102, 241, 0.08)">
            <div className="flex items-center gap-2 border-b border-glass-border/30 pb-3 mb-4">
              <Heart size={14} className="text-accent-indigo" />
              <h3 className="text-[10px] font-bold tracking-wider text-slate-300 uppercase">Skills & Focus</h3>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Expertise</h4>
                <div className="flex flex-wrap gap-1.5">
                  {defaultSkills.map((s, idx) => (
                    <span key={idx} className="bg-[#02040a] border border-glass-border hover:border-slate-600 hover:text-white px-2.5 py-1 rounded-lg text-slate-300 transition-all duration-150 hover:translate-y-[-1px] hover:shadow-[0_2px_8px_rgba(0,0,0,0.3)] cursor-default">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Focus Interests</h4>
                <div className="flex flex-wrap gap-1.5">
                  {defaultInterests.map((int, idx) => (
                    <span key={idx} className="bg-slate-900/60 border border-accent-indigo/10 hover:border-accent-indigo/40 hover:text-slate-200 px-2.5 py-1 rounded-lg text-slate-400 transition-all duration-150 hover:translate-y-[-1px] hover:shadow-[0_2px_8px_rgba(99,102,241,0.1)] cursor-default">
                      {int}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </SpotlightCard>

        </div>

        {/* Right Column (lg:8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. LEARNER STATE (Blue/Cyan) */}
          {role === "learner" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SpotlightCard className="p-5 bg-slate-950/20 border border-accent-blue/30 rounded-xl flex items-center justify-between" glowColor="rgba(59, 130, 246, 0.1)">
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Course Progress</h4>
                    <p className="text-sm font-extrabold text-white">Next.js 15 Masterclass</p>
                    <span className="text-[10px] text-slate-400 block mt-1">Lesson 14 of 17</span>
                  </div>
                  <ProgressRing progress={68} size={50} strokeWidth={4} ringColor="stroke-accent-cyan" />
                </SpotlightCard>
                
                <SpotlightCard className="p-5 bg-slate-950/20 border border-glass-border rounded-xl flex items-center justify-between" glowColor="rgba(16, 185, 129, 0.1)">
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Docker foundations</h4>
                    <p className="text-sm font-extrabold text-emerald-400">Complete</p>
                    <span className="text-[10px] text-slate-400 block mt-1">10 lessons done</span>
                  </div>
                  <ProgressRing progress={100} size={50} strokeWidth={4} ringColor="stroke-accent-emerald" />
                </SpotlightCard>
              </div>

              <SpotlightCard className="p-6 bg-[#03050c]/30 border border-glass-border rounded-2xl animate-fade-in" glowColor="rgba(59, 130, 246, 0.08)">
                <div className="flex items-center justify-between pb-3 border-b border-glass-border/30 mb-4">
                  <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Saved Resources</h3>
                  <span className="text-[10px] text-slate-500">2 files</span>
                </div>
                
                <div className="space-y-3">
                  {[
                    { title: "Kafka decoupling events config sheet", size: "40KB", format: "SQL Script" },
                    { title: "Distributed Consensus patterns blueprint", size: "1.8MB", format: "ZIP Kit" }
                  ].map((res, i) => (
                    <div key={i} className="group flex items-center justify-between bg-slate-950/50 border border-glass-border/40 hover:border-slate-700 hover:bg-slate-950/80 p-3.5 rounded-xl text-xs font-semibold hover:translate-y-[-2px] transition-all duration-200">
                      <div>
                        <h4 className="font-bold text-white mb-1 leading-none transition-colors group-hover:text-accent-blue">{res.title}</h4>
                        <p className="text-[9px] text-slate-500">{res.format} • {res.size}</p>
                      </div>
                      <button className="group-hover:scale-105 transition-transform duration-150 text-[10px] font-bold text-accent-blue hover:text-white flex items-center gap-1">
                        Download <Download size={10} className="transition-transform group-hover:translate-y-0.5 duration-200" />
                      </button>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </div>
          )}

          {/* 2. CREATOR STATE (Purple/Magenta) */}
          {role === "creator" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SpotlightCard className="p-5 bg-slate-950/20 border border-accent-purple/30 rounded-xl text-center" glowColor="rgba(168, 85, 247, 0.1)">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sales Revenue</h4>
                  <p className="text-xl font-extrabold text-emerald-400 mt-2">$4,850.00</p>
                </SpotlightCard>
                <SpotlightCard className="p-5 bg-slate-950/20 border border-glass-border rounded-xl text-center" glowColor="rgba(59, 130, 246, 0.1)">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Guides Sold</h4>
                  <p className="text-xl font-extrabold text-white mt-2">294 units</p>
                </SpotlightCard>
                <SpotlightCard className="p-5 bg-slate-950/20 border border-glass-border rounded-xl text-center" glowColor="rgba(236, 72, 153, 0.1)">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Subscribers</h4>
                  <p className="text-xl font-extrabold text-white mt-2">1,048 users</p>
                </SpotlightCard>
              </div>

              <SpotlightCard className="p-6 bg-[#03050c]/30 border border-glass-border rounded-2xl" glowColor="rgba(168, 85, 247, 0.08)">
                <div className="flex items-center justify-between pb-3 border-b border-glass-border/30 mb-4">
                  <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Published Resources</h3>
                  <button className="text-[10px] font-bold text-accent-purple flex items-center gap-1">
                    Upload Guide <PlusCircle size={12} />
                  </button>
                </div>
                
                <div className="space-y-3 text-xs font-semibold">
                  {[
                    { title: "Next.js 15 production configurations checklist", sales: "148 sales", price: "$29.00" },
                    { title: "Distributed Consensus patterns blueprint", sales: "92 sales", price: "$15.00" }
                  ].map((guide, i) => (
                    <div key={i} className="group flex items-center justify-between bg-[#02040a] border border-glass-border hover:border-slate-700 hover:bg-slate-950/80 p-3.5 rounded-xl hover:translate-y-[-2px] transition-all duration-200">
                      <div>
                        <h4 className="font-bold text-white mb-1 leading-none transition-colors group-hover:text-accent-purple">{guide.title}</h4>
                        <p className="text-[9px] text-slate-500">{guide.sales}</p>
                      </div>
                      <span className="font-extrabold text-white group-hover:text-accent-purple transition-colors">{guide.price}</span>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </div>
          )}

          {/* 3. EXPERT STATE (Orange/Amber) */}
          {role === "expert" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SpotlightCard className="p-5 bg-slate-950/20 border border-accent-orange/30 rounded-xl text-center" glowColor="rgba(249, 115, 22, 0.1)">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Completed Sessions</h4>
                  <p className="text-xl font-extrabold text-white mt-2">148 calls</p>
                </SpotlightCard>
                <SpotlightCard className="p-5 bg-slate-950/20 border border-glass-border rounded-xl text-center" glowColor="rgba(16, 185, 129, 0.1)">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mentorship Earnings</h4>
                  <p className="text-xl font-extrabold text-emerald-400 mt-2">$12,480.00</p>
                </SpotlightCard>
                <SpotlightCard className="p-5 bg-slate-950/20 border border-glass-border rounded-xl text-center" glowColor="rgba(245, 158, 11, 0.1)">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Expert Rating</h4>
                  <p className="text-xl font-extrabold text-white mt-2">5.0 ★ (48 reviews)</p>
                </SpotlightCard>
              </div>

              <SpotlightCard className="p-6 bg-[#03050c]/30 border border-glass-border rounded-2xl" glowColor="rgba(249, 115, 22, 0.08)">
                <div className="flex items-center justify-between pb-3 border-b border-glass-border/30 mb-4">
                  <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Available Hours</h3>
                  <button className="text-[10px] font-bold text-accent-orange flex items-center gap-1">
                    Add Time Slot <PlusCircle size={12} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-left">
                  {[
                    { day: "Mondays", time: "10:00 AM - 1:00 PM EST", active: true },
                    { day: "Tuesdays", time: "2:00 PM - 5:00 PM EST", active: true },
                    { day: "Thursdays", time: "4:00 PM - 7:00 PM EST", active: true },
                    { day: "Fridays", time: "Unavailable", active: false }
                  ].map((slot, i) => (
                    <div key={i} className="group bg-slate-950/50 border border-glass-border/40 hover:border-slate-700 hover:bg-slate-950/80 p-3.5 rounded-xl flex items-center justify-between hover:translate-y-[-2px] transition-all duration-200">
                      <div>
                        <h4 className="font-bold text-white mb-0.5 group-hover:text-accent-orange transition-colors">{slot.day}</h4>
                        <p className="text-[9px] text-slate-500">{slot.time}</p>
                      </div>
                      <span className={`h-1.5 w-1.5 rounded-full transition-all duration-300 group-hover:scale-125 ${slot.active ? "bg-accent-orange shadow-[0_0_8px_rgba(249,115,22,0.5)]" : "bg-slate-700"}`} />
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </div>
          )}

          {/* 4. ADMIN STATE (Emerald/Violet) */}
          {role === "admin" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SpotlightCard className="p-5 bg-slate-950/20 border border-accent-emerald/30 rounded-xl text-center" glowColor="rgba(16, 185, 129, 0.1)">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">System Users</h4>
                  <p className="text-xl font-extrabold text-white mt-2">10,482 users</p>
                </SpotlightCard>
                <SpotlightCard className="p-5 bg-slate-950/20 border border-glass-border rounded-xl text-center" glowColor="rgba(139, 92, 246, 0.1)">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Server Status</h4>
                  <p className="text-xl font-extrabold text-emerald-400 mt-2">99.98% OK</p>
                </SpotlightCard>
                <SpotlightCard className="p-5 bg-slate-950/20 border border-glass-border rounded-xl text-center" glowColor="rgba(59, 130, 246, 0.1)">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Api Requests</h4>
                  <p className="text-xl font-extrabold text-white mt-2">240K / day</p>
                </SpotlightCard>
              </div>

              <SpotlightCard className="p-6 bg-[#03050c]/30 border border-glass-border rounded-2xl" glowColor="rgba(16, 185, 129, 0.08)">
                <div className="flex items-center justify-between pb-3 border-b border-glass-border/30 mb-4">
                  <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Platform Administrators</h3>
                </div>
                
                <div className="space-y-3 text-xs font-semibold">
                  {[
                    { name: "System Admin (You)", email: user?.email, status: "Owner" },
                    { name: "Backup Controller", email: "backup@ckm.com", status: "Read-only" }
                  ].map((adm, i) => (
                    <div key={i} className="group flex items-center justify-between bg-slate-950/50 border border-glass-border/40 hover:border-slate-700 hover:bg-slate-950/80 p-3.5 rounded-xl hover:translate-y-[-2px] transition-all duration-200">
                      <div>
                        <h4 className="font-bold text-white mb-0.5 leading-none transition-colors group-hover:text-accent-emerald">{adm.name}</h4>
                        <p className="text-[9px] text-slate-500">{adm.email}</p>
                      </div>
                      <span className="text-[9px] bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider transition-all duration-300 group-hover:bg-accent-emerald/20 group-hover:shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                        {adm.status}
                      </span>
                    </div>
                  ))}
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
