import React from "react";
import { Link } from "react-router-dom";
import {
  Share2,
  BookOpen,
  FolderKanban,
  UserCheck,
  LayoutDashboard,
  MessageSquare,
  Bookmark,
  CreditCard,
  Sparkles,
  ShieldAlert,
  User,
  PlusCircle,
  Grid
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-purple-950/30 bg-gradient-to-b from-[#18122B] via-[#0F0A21] to-[#080415] py-14 relative z-10 text-slate-300">
      {/* Background glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-purple-600/5 blur-3xl pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Logo & Platform Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-white select-none group w-fit">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 p-[1px] shadow-[0_0_20px_rgba(124,58,237,0.35)] group-hover:scale-105 transition-transform">
                <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#18122B]">
                  <Share2 size={16} className="text-purple-400" />
                </div>
              </div>
              <span className="font-black tracking-widest text-white text-lg bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-purple-300">
                CKM
              </span>
            </Link>

            <p className="text-xs text-purple-200/60 leading-relaxed max-w-sm">
              A collaborative marketplace for learners, content creators, and technical consultants. Discover interactive courses, access premium guides, and book 1-on-1 expert mentorship.
            </p>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-purple-300/80 font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CKM Platform • Active & Secure</span>
            </div>
          </div>

          {/* Column 1: Marketplace */}
          <div>
            <h4 className="text-[11px] font-bold tracking-wider text-purple-200 uppercase flex items-center gap-1.5 mb-4">
              <BookOpen size={13} className="text-purple-400" />
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-[12px] text-purple-200/65">
              <li>
                <Link to="/courses" className="hover:text-white transition flex items-center gap-1.5">
                  <span>Explore Courses</span>
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-white transition flex items-center gap-1.5">
                  <span>Guides & Resources</span>
                </Link>
              </li>
              <li>
                <Link to="/sessions" className="hover:text-white transition flex items-center gap-1.5">
                  <span>Mentorship Sessions</span>
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-white transition flex items-center gap-1.5">
                  <span>Browse Categories</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Workspace & Learning */}
          <div>
            <h4 className="text-[11px] font-bold tracking-wider text-purple-200 uppercase flex items-center gap-1.5 mb-4">
              <LayoutDashboard size={13} className="text-purple-400" />
              My Workspace
            </h4>
            <ul className="space-y-2.5 text-[12px] text-purple-200/65">
              <li>
                <Link to="/dashboard" className="hover:text-white transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/my-learning" className="hover:text-white transition">
                  My Learning
                </Link>
              </li>
              <li>
                <Link to="/bookmarks" className="hover:text-white transition">
                  Saved Bookmarks
                </Link>
              </li>
              <li>
                <Link to="/my-payments" className="hover:text-white transition">
                  Payment History
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Community & Creators */}
          <div>
            <h4 className="text-[11px] font-bold tracking-wider text-purple-200 uppercase flex items-center gap-1.5 mb-4">
              <Sparkles size={13} className="text-purple-400" />
              Creator & Tools
            </h4>
            <ul className="space-y-2.5 text-[12px] text-purple-200/65">
              <li>
                <Link to="/courses/new" className="hover:text-white transition">
                  Create Course
                </Link>
              </li>
              <li>
                <Link to="/resources/new" className="hover:text-white transition">
                  Share Resource
                </Link>
              </li>
              <li>
                <Link to="/chat" className="hover:text-white transition">
                  Messages & Chat
                </Link>
              </li>
              <li>
                <Link to="/reports" className="hover:text-white transition">
                  Support & Reports
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition">
                  Account Settings
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-purple-950/30 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-purple-200/60">
          <p>&copy; {new Date().getFullYear()} Collaborative Knowledge Marketplace (CKM). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/courses" className="hover:text-white transition">Courses</Link>
            <span className="text-purple-900/60">•</span>
            <Link to="/resources" className="hover:text-white transition">Resources</Link>
            <span className="text-purple-900/60">•</span>
            <Link to="/sessions" className="hover:text-white transition">Mentorship</Link>
            <span className="text-purple-900/60">•</span>
            <Link to="/dashboard" className="hover:text-white transition">Dashboard</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
