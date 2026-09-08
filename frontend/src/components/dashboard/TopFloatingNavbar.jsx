import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Home,
  Compass,
  FileText,
  Video,
  MessageSquare,
  BookOpen,
  Bookmark,
  CreditCard,
  Flag,
  User as UserIcon,
  Layers,
  ShieldAlert,
  Users,
  LogOut,
  Sun,
  Moon,
  Share2,
  Sparkles,
  Search,
  Bell,
  Menu,
  X,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TopFloatingNavbar = ({ unreadCount = 0 }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const dashboardPath = `/${user?.role || "learner"}/dashboard`;

  const roleNavItems = {
    learner: [
      { path: dashboardPath, label: "Workspace Home", icon: Home },
      { path: "/courses", label: "Explore Catalog", icon: Compass },
      { path: "/my-courses", label: "Enrolled Courses", icon: BookOpen },
      { path: "/resources", label: "Knowledge Library", icon: FileText },
      { path: "/sessions", label: "1-on-1 Mentorship", icon: Video },
      { path: "/chat", label: "Discussions", icon: MessageSquare, badge: unreadCount },
    ],
    creator: [
      { path: dashboardPath, label: "Creator Studio", icon: Home },
      { path: "/courses", label: "Explore Catalog", icon: Compass },
      { path: "/my-courses", label: "Course Authoring", icon: BookOpen },
      { path: "/my-resources", label: "Resource Library", icon: FileText },
      { path: "/categories", label: "Categories", icon: Layers },
      { path: "/chat", label: "Discussions", icon: MessageSquare, badge: unreadCount },
    ],
    expert: [
      { path: dashboardPath, label: "Expert Hub", icon: Home },
      { path: "/sessions", label: "Mentorship Hub", icon: Video },
      { path: "/my-courses", label: "Courses", icon: BookOpen },
      { path: "/my-resources", label: "Resources", icon: FileText },
      { path: "/categories", label: "Categories", icon: Layers },
      { path: "/chat", label: "Discussions", icon: MessageSquare, badge: unreadCount },
    ],
    admin: [
      { path: dashboardPath, label: "Operations Hub", icon: Home },
      { path: "/admin/reports", label: "Moderation Queue", icon: ShieldAlert },
      { path: "/admin/payments", label: "Payment Platform", icon: CreditCard },
      { path: "/courses", label: "Course Catalog", icon: Compass },
      { path: "/categories", label: "Categories", icon: Layers },
      { path: "/chat", label: "Discussions", icon: MessageSquare, badge: unreadCount },
    ],
  };

  const navItems = roleNavItems[user?.role || "learner"] || roleNavItems.learner;

  const isActive = (path) => {
    if (path.endsWith("/dashboard")) {
      return location.pathname.endsWith("/dashboard");
    }
    return location.pathname === path || (path !== "/" && location.pathname.startsWith(path));
  };

  return (
    <header className="sticky top-3 z-50 px-3 sm:px-6 mb-6">
      <nav className="max-w-7xl mx-auto rounded-2xl glass-panel-futuristic border border-white/10 dark:border-white/10 bg-slate-900/60 dark:bg-slate-950/50 backdrop-blur-2xl shadow-[0_12px_40px_-10px_rgba(0,0,0,0.5)] px-4 py-2.5 flex items-center justify-between transition-all duration-300 relative">
        
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3 shrink-0">
          <Link to={dashboardPath} className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-purple-600 to-pink-500 p-[1px] shadow-[0_0_20px_rgba(168,85,247,0.35)] group-hover:scale-105 transition-transform duration-300">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-slate-950/90">
                <Share2 size={16} className="text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-cyan-300 text-sm font-display leading-tight">
                CKM
              </span>
              <span className="text-[10px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 tracking-wider uppercase">
                {user?.role || "learner"} OS
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links (Center Floating Dock) */}
        <div className="hidden lg:flex items-center space-x-1 px-3 py-1 rounded-xl bg-slate-900/40 border border-white/5 backdrop-blur-md">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={idx}
                to={item.path}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all duration-200 ${
                  active
                    ? "text-white bg-gradient-to-r from-purple-600/30 via-cyan-500/20 to-pink-500/20 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.25)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={14} className={active ? "text-cyan-400" : "text-slate-400"} />
                <span>{item.label}</span>

                {item.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}

                {active && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="absolute inset-0 rounded-lg bg-cyan-400/5 pointer-events-none"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right CTA Utilities & Profile */}
        <div className="flex items-center space-x-3 shrink-0">
          
          {/* Quick Search Trigger */}
          <button
            onClick={() => navigate("/courses")}
            className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-800/40 border border-white/10 hover:border-cyan-500/40 text-slate-400 hover:text-white text-xs transition duration-200"
          >
            <Search size={13} className="text-cyan-400" />
            <span className="text-[11px]">Search...</span>
            <kbd className="hidden md:inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-white/10 text-slate-400">⌘K</kbd>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-white/10 bg-slate-900/50 text-slate-300 hover:text-white hover:bg-white/10 transition duration-200 cursor-pointer active:scale-95 flex items-center justify-center shadow-inner"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-cyan-400" />}
          </button>

          {/* User Profile Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-2.5 p-1 rounded-xl bg-slate-900/60 border border-white/10 hover:border-purple-500/40 transition duration-200 active:scale-95 cursor-pointer"
            >
              <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 p-[1px] shadow-sm">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="h-full w-full rounded-[7px] object-cover" />
                ) : (
                  <div className="h-full w-full rounded-[7px] bg-slate-950 flex items-center justify-center text-[10px] font-black text-cyan-400">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </div>
              <span className="hidden sm:inline-block text-xs font-semibold text-slate-200 truncate max-w-[90px]">
                {user?.name?.split(" ")[0] || "User"}
              </span>
              <ChevronDown size={12} className={`text-slate-400 transition-transform duration-200 ${profileDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Profile Popup */}
            <AnimatePresence>
              {profileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-56 rounded-2xl glass-panel-futuristic border border-white/15 bg-slate-950/90 backdrop-blur-2xl p-2 shadow-2xl z-50"
                >
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                    <p className="text-[10px] text-cyan-400 truncate">{user?.email}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition"
                  >
                    <UserIcon size={14} className="text-purple-400" />
                    <span>Profile & Settings</span>
                  </Link>

                  <Link
                    to="/bookmarks"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition"
                  >
                    <Bookmark size={14} className="text-cyan-400" />
                    <span>Bookmarks</span>
                  </Link>

                  <Link
                    to="/my-payments"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition"
                  >
                    <CreditCard size={14} className="text-emerald-400" />
                    <span>Payment History</span>
                  </Link>

                  <Link
                    to="/reports"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition"
                  >
                    <Flag size={14} className="text-amber-400" />
                    <span>My Reports</span>
                  </Link>

                  <div className="h-[1px] bg-white/10 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-white/10 bg-slate-900/50 text-slate-300 hover:text-white transition"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-2 max-w-7xl mx-auto rounded-2xl glass-panel-futuristic border border-white/10 bg-slate-950/90 backdrop-blur-2xl p-4 shadow-2xl overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item, idx) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={idx}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 p-2.5 rounded-xl text-xs font-medium ${
                      active
                        ? "bg-purple-600/30 border border-purple-500/40 text-cyan-300 font-bold"
                        : "text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    <Icon size={14} className={active ? "text-cyan-400" : "text-slate-400"} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default TopFloatingNavbar;
