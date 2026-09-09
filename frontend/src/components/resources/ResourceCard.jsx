import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  User,
  Download,
  Eye,
  Tag,
  CheckCircle2,
  Calendar,
  Folder,
  ArrowRight,
  Bookmark,
  Share2
} from "lucide-react";

const ResourceCard = ({ resource, onInspect }) => {
  const navigate = useNavigate();
  if (!resource) return null;

  const categoryName = resource.category?.name || (typeof resource.category === "string" ? resource.category : "Resource");
  const authorName = resource.createdBy?.name || "Verified Author";
  const dateFormatted = resource.createdAt ? new Date(resource.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "N/A";
  const fileUrl = resource.fileUrl || resource.url || "";
  const topics = resource.topics || [];

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="h-full flex flex-col"
    >
      {/* Reference UI/UX Container: rounded-[28px], light white or dark space violet background */}
      <div className="h-full p-4 sm:p-5 rounded-[28px] bg-white dark:bg-[#14121f] border-2 border-gray-200 dark:border-[#2b243d] hover:border-purple-500/50 shadow-md dark:shadow-2xl transition-all duration-300 flex flex-col justify-between text-left group">
        
        <div>
          {/* Top Banner Graphics (Liquid wave gradient header matching reference picture) */}
          <div className="h-36 sm:h-40 w-full rounded-[20px] overflow-hidden relative mb-4 bg-gradient-to-r from-slate-900 via-purple-900 to-cyan-900 flex items-center justify-center p-4">
            {/* SVG Liquid Wave Backdrop */}
            <svg className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 0 100 Q 100 40 200 100 T 400 100 L 400 200 L 0 200 Z" fill="url(#waveGrad)" />
              <defs>
                <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Visual Icon Badge */}
            <div className="relative z-10 h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition duration-300">
              <FileText size={28} className="text-cyan-300" />
            </div>

            {/* Category Tag Badge */}
            <span className="absolute top-3 left-3 text-[9px] font-extrabold uppercase tracking-wider bg-slate-950/80 text-cyan-300 border border-cyan-500/30 px-2.5 py-1 rounded-full backdrop-blur-md z-10">
              {categoryName}
            </span>

            {/* Date Tag Badge */}
            <span className="absolute top-3 right-3 text-[9px] font-extrabold uppercase tracking-wider bg-slate-950/80 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-full backdrop-blur-md z-10 flex items-center gap-1">
              <Calendar size={10} /> {dateFormatted}
            </span>
          </div>

          {/* Card Body */}
          <div className="space-y-3">
            <h3 className="text-lg font-black tracking-tight text-gray-900 dark:text-white line-clamp-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition duration-200">
              {resource.title}
            </h3>

            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-wide uppercase">
              Resource Specifications:
            </p>

            {/* Feature Bullet Points (3 circular icon rows matching reference UI/UX) */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-3 text-xs text-gray-700 dark:text-gray-300 font-medium">
                <div className="w-7 h-7 rounded-full bg-cyan-50 dark:bg-[#272138] border border-cyan-100 dark:border-[#3b3254] text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                  <User size={13} />
                </div>
                <span className="truncate">Author: <strong className="text-gray-900 dark:text-white font-bold">{authorName}</strong></span>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-700 dark:text-gray-300 font-medium">
                <div className="w-7 h-7 rounded-full bg-purple-50 dark:bg-[#272138] border border-purple-100 dark:border-[#3b3254] text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <Folder size={13} />
                </div>
                <span className="truncate">Format: <strong className="text-gray-900 dark:text-white font-bold">{resource.fileType || "PDF / Blueprint"}</strong></span>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-700 dark:text-gray-300 font-medium">
                <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-[#272138] border border-emerald-100 dark:border-[#3b3254] text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Tag size={13} />
                </div>
                <span className="truncate">
                  {topics.length > 0 ? `#${topics.slice(0, 2).join(" #")}` : "Vetted Code & Assets"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Pill Bar (Signature input/pill bar from reference picture) */}
        <div className="mt-5 p-1.5 rounded-full bg-gray-100 dark:bg-[#1c182b] border border-gray-200 dark:border-[#332a4a] flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2 pl-3 text-xs text-gray-700 dark:text-gray-300 font-bold truncate max-w-[150px]">
            <Bookmark size={13} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span className="truncate">{categoryName}</span>
          </div>

          <button
            onClick={() => onInspect ? onInspect(resource._id) : navigate(`/resources/${resource._id}`)}
            className="px-5 py-2 rounded-full bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-950 font-black text-xs shadow-md transition cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-95"
          >
            Inspect <ArrowRight size={13} />
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default ResourceCard;
