import React from "react";
import {
  Database,
  Cpu,
  Code2,
  ShieldAlert,
  BarChart3,
  Globe,
  Sparkles,
  BookOpen,
  Layers,
  Terminal,
  Server,
  Cloud,
} from "lucide-react";

export const CourseIsometricGraphic = ({ category = "General", title = "", className = "" }) => {
  const catLower = (category?.name || category || title || "").toLowerCase();

  let graphicType = "code";
  if (catLower.includes("database") || catLower.includes("sql") || catLower.includes("dbms") || catLower.includes("mongo")) {
    graphicType = "database";
  } else if (catLower.includes("system") || catLower.includes("architecture") || catLower.includes("cloud") || catLower.includes("devops")) {
    graphicType = "system";
  } else if (catLower.includes("ai") || catLower.includes("machine") || catLower.includes("intelligence") || catLower.includes("data science")) {
    graphicType = "ai";
  } else if (catLower.includes("cyber") || catLower.includes("security") || catLower.includes("hack")) {
    graphicType = "security";
  } else if (catLower.includes("web") || catLower.includes("react") || catLower.includes("frontend") || catLower.includes("fullstack")) {
    graphicType = "web";
  }

  return (
    <div className={`relative w-full h-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#12132D] via-[#0E0F26] to-[#070817] ${className}`}>
      {/* Background ambient lighting */}
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
      <div className="absolute top-[-30%] left-[-20%] w-48 h-48 bg-accent-purple/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-30%] right-[-20%] w-48 h-48 bg-accent-cyan/20 rounded-full blur-3xl pointer-events-none" />

      {/* Render 3D Isometric SVG Illustrations */}
      {graphicType === "database" && (
        <div className="relative flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_10px_25px_rgba(0,242,255,0.25)]">
            <path d="M60 20C82.0914 20 100 25.3726 100 32C100 38.6274 82.0914 44 60 44C37.9086 44 20 38.6274 20 32C20 25.3726 37.9086 20 60 20Z" fill="url(#db_grad_1)" stroke="#00F2FF" strokeWidth="1.5" />
            <path d="M20 32V60C20 66.6274 37.9086 72 60 72C82.0914 72 100 66.6274 100 60V32" stroke="#7757F5" strokeWidth="1.5" fill="url(#db_grad_2)" opacity="0.8" />
            <path d="M20 60V88C20 94.6274 37.9086 100 60 100C82.0914 100 100 94.6274 100 88V60" stroke="#00F2FF" strokeWidth="1.5" fill="url(#db_grad_3)" opacity="0.9" />
            <defs>
              <linearGradient id="db_grad_1" x1="20" y1="20" x2="100" y2="44" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00F2FF" stopOpacity="0.4" />
                <stop offset="1" stopColor="#7757F5" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="db_grad_2" x1="20" y1="32" x2="100" y2="72" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7757F5" stopOpacity="0.3" />
                <stop offset="1" stopColor="#181824" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="db_grad_3" x1="20" y1="60" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00F2FF" stopOpacity="0.2" />
                <stop offset="1" stopColor="#7757F5" stopOpacity="0.6" />
              </linearGradient>
            </defs>
          </svg>
          <Database size={24} className="absolute text-cyan-300 animate-pulse" />
        </div>
      )}

      {graphicType === "system" && (
        <div className="relative flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_10px_25px_rgba(119,87,245,0.3)]">
            <rect x="25" y="30" width="70" height="24" rx="6" fill="url(#sys_1)" stroke="#7757F5" strokeWidth="1.5" />
            <rect x="25" y="65" width="70" height="24" rx="6" fill="url(#sys_2)" stroke="#00F2FF" strokeWidth="1.5" />
            <circle cx="40" cy="42" r="3" fill="#00F2FF" />
            <circle cx="50" cy="42" r="3" fill="#7757F5" />
            <circle cx="40" cy="77" r="3" fill="#00F2FF" />
            <circle cx="50" cy="77" r="3" fill="#7757F5" />
            <defs>
              <linearGradient id="sys_1" x1="25" y1="30" x2="95" y2="54" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7757F5" stopOpacity="0.5" />
                <stop offset="1" stopColor="#181824" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="sys_2" x1="25" y1="65" x2="95" y2="89" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00F2FF" stopOpacity="0.4" />
                <stop offset="1" stopColor="#7757F5" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>
          <Server size={22} className="absolute text-purple-300" />
        </div>
      )}

      {graphicType === "ai" && (
        <div className="relative flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-accent-purple/30 via-accent-indigo/20 to-accent-cyan/30 border border-accent-cyan/40 p-[1px] shadow-[0_0_30px_rgba(0,242,255,0.2)] flex items-center justify-center">
            <div className="w-full h-full rounded-2xl bg-bg-panel/90 backdrop-blur-md flex items-center justify-center relative">
              <Cpu size={36} className="text-cyan-400" />
              <Sparkles size={16} className="absolute top-2 right-2 text-purple-400 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {graphicType === "security" && (
        <div className="relative flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500/30 via-cyan-500/20 to-purple-500/30 border border-emerald-500/40 p-[1px] shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-center justify-center">
            <div className="w-full h-full rounded-2xl bg-bg-panel/90 backdrop-blur-md flex items-center justify-center">
              <ShieldAlert size={36} className="text-emerald-400" />
            </div>
          </div>
        </div>
      )}

      {graphicType === "web" && (
        <div className="relative flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
          <div className="w-24 h-16 rounded-xl bg-bg-panel border border-accent-purple/40 shadow-[0_10px_25px_rgba(119,87,245,0.25)] p-2 flex flex-col space-y-1.5">
            <div className="flex items-center gap-1 border-b border-glass-border/60 pb-1">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="flex items-center justify-between">
              <Code2 size={24} className="text-purple-400" />
              <Terminal size={18} className="text-cyan-400" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseIsometricGraphic;
