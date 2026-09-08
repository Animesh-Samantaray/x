import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Home,
  MessageSquare,
  Compass,
  BookOpen,
  Users,
  Bookmark,
  LogOut,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
  Video,
  FileText,
  Layers,
  Sun,
  Moon,
  Share2,
  Menu,
  X,
  CreditCard,
  Flag,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { update2FA } from "../../services/authService";

const Sidebar = ({ unreadCount = 0 }) => {
  const { user, logout, getCurrentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(!!user?.twoFactorEnabled);
  const [updating2FA, setUpdating2FA] = useState(false);

  React.useEffect(() => {
    if (user) {
      setTwoFactorEnabled(!!user.twoFactorEnabled);
    }
  }, [user]);

  const handleToggle2FA = async () => {
    try {
      setUpdating2FA(true);
      const newVal = !twoFactorEnabled;
      const res = await update2FA(newVal);
      if (res && res.success) {
        setTwoFactorEnabled(res.twoFactorEnabled);
        await getCurrentUser();
      }
    } catch (err) {
      console.error("Sidebar 2FA update error:", err);
    } finally {
      setUpdating2FA(false);
    }
  };

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

  const roleNavGroups = {
    learner: [
      {
        section: "MAIN",
        items: [
          { path: dashboardPath, label: "Workspace Home", icon: Home },
          { path: "/courses", label: "Explore Catalog", icon: Compass },
          { path: "/resources", label: "Knowledge Library", icon: FileText },
          { path: "/sessions", label: "1-on-1 Mentorship", icon: Video },
          { path: "/chat", label: "Discussions", icon: MessageSquare, badge: unreadCount },
        ],
      },
      {
        section: "MY WORKSPACE",
        items: [
          { path: "/my-courses", label: "Enrolled Courses", icon: BookOpen },
          { path: "/bookmarks", label: "Saved Resources", icon: Bookmark },
        ],
      },
      {
        section: "ACCOUNT",
        items: [
          { path: "/my-payments", label: "Payment History", icon: CreditCard },
          { path: "/reports", label: "My Reports", icon: Flag },
          { path: "/profile", label: "Profile & Settings", icon: UserIcon },
        ],
      },
    ],
    creator: [
      {
        section: "MAIN",
        items: [
          { path: dashboardPath, label: "Creator Studio", icon: Home },
          { path: "/courses", label: "Explore Catalog", icon: Compass },
          { path: "/chat", label: "Discussions", icon: MessageSquare, badge: unreadCount },
        ],
      },
      {
        section: "CREATOR WORKSPACE",
        items: [
          { path: "/my-courses", label: "Course Authoring", icon: BookOpen },
          { path: "/my-resources", label: "Resource Library", icon: FileText },
          { path: "/categories", label: "Categories", icon: Layers },
        ],
      },
      {
        section: "ACCOUNT",
        items: [
          { path: "/bookmarks", label: "Bookmarks", icon: Bookmark },
          { path: "/my-payments", label: "Payment History", icon: CreditCard },
          { path: "/reports", label: "My Reports", icon: Flag },
          { path: "/profile", label: "Profile & Settings", icon: UserIcon },
        ],
      },
    ],
    expert: [
      {
        section: "MAIN",
        items: [
          { path: dashboardPath, label: "Expert Hub", icon: Home },
          { path: "/sessions", label: "Mentorship Hub", icon: Video },
          { path: "/chat", label: "Discussions", icon: MessageSquare, badge: unreadCount },
        ],
      },
      {
        section: "KNOWLEDGE WORKSPACE",
        items: [
          { path: "/my-courses", label: "Courses", icon: BookOpen },
          { path: "/my-resources", label: "Resources", icon: FileText },
          { path: "/categories", label: "Categories", icon: Layers },
        ],
      },
      {
        section: "ACCOUNT",
        items: [
          { path: "/bookmarks", label: "Bookmarks", icon: Bookmark },
          { path: "/my-payments", label: "Payment History", icon: CreditCard },
          { path: "/reports", label: "My Reports", icon: Flag },
          { path: "/profile", label: "Profile & Settings", icon: UserIcon },
        ],
      },
    ],
    admin: [
      {
        section: "OPERATIONS",
        items: [
          { path: dashboardPath, label: "Admin Operations", icon: Home },
          { path: "/admin/reports", label: "Moderation Queue", icon: ShieldAlert },
          { path: "/admin/payments", label: "Payment Platform", icon: CreditCard },
          { path: "/admin/dashboard?tab=users", label: "User Directory", icon: Users },
        ],
      },
      {
        section: "PLATFORM DIRECTORY",
        items: [
          { path: "/courses", label: "Course Catalog", icon: BookOpen },
          { path: "/resources", label: "Resource Library", icon: FileText },
          { path: "/categories", label: "Categories", icon: Layers },
          { path: "/chat", label: "Discussions", icon: MessageSquare, badge: unreadCount },
        ],
      },
      {
        section: "ACCOUNT",
        items: [
          { path: "/bookmarks", label: "Bookmarks", icon: Bookmark },
          { path: "/my-payments", label: "Payment History", icon: CreditCard },
          { path: "/reports", label: "My Reports", icon: Flag },
          { path: "/profile", label: "Profile & Settings", icon: UserIcon },
        ],
      },
    ],
  };

  const navGroups = roleNavGroups[user?.role || "learner"] || roleNavGroups.learner;

  const isActive = (path) => {
    if (path.includes("?")) {
      const [basePath] = path.split("?");
      return location.pathname === basePath && location.search.includes("tab=users");
    }
    if (path.endsWith("/dashboard")) {
      return location.pathname.endsWith("/dashboard");
    }
    return location.pathname === path || (path !== "/" && location.pathname.startsWith(path));
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-bg-panel/90 backdrop-blur-md border-b border-glass-border px-4 flex items-center justify-between z-40">
        <Link to={dashboardPath} className="flex items-center gap-2 font-display text-sm font-bold text-text-title">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-accent-purple to-accent-cyan shadow-md shadow-purple-950/20">
            <Share2 size={13} className="text-white" />
          </div>
          <span className="font-extrabold tracking-widest text-text-title">CKM</span>
        </Link>

        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-xl bg-glass-card border border-glass-border text-text-main hover:text-text-title transition cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-xs z-50"
          />
        )}
      </AnimatePresence>

      {/* Persistent Fixed SaaS Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? "80px" : "260px",
        }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1.0] }}
        className={`fixed top-0 left-0 h-screen z-50 bg-slate-950/80 backdrop-blur-2xl border-r border-white/10 flex flex-col transition-transform duration-300 shadow-2xl ${
          isMobileOpen ? "translate-x-0 w-[260px]" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Header / Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-glass-border shrink-0">
          <Link
            to={dashboardPath}
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center gap-3 font-display text-base font-bold tracking-tight text-text-title select-none overflow-hidden"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-accent-purple via-accent-indigo to-accent-cyan shadow-lg shadow-purple-950/30 shrink-0">
              <Share2 size={16} className="text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold tracking-widest text-text-title text-sm leading-tight">CKM</span>
                <span className="text-[10px] text-accent-cyan font-extrabold uppercase tracking-wider truncate">
                  {user?.role || "learner"} platform
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-glass-border text-text-muted hover:text-text-title transition duration-150 cursor-pointer"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-glass-border text-text-muted hover:text-text-title"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Capsule */}
        {!isCollapsed && user && (
          <div className="px-3.5 py-3 border-b border-glass-border bg-glass-card/50 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-accent-purple to-accent-cyan p-[1px] shrink-0">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt={user.name} className="h-full w-full rounded-lg object-cover" />
              ) : (
                <div className="h-full w-full rounded-lg bg-bg-dark flex items-center justify-center text-xs font-bold text-accent-cyan uppercase">
                  {user.name ? user.name[0] : "U"}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold text-text-title truncate">{user.name}</p>
              <p className="text-[10px] text-text-muted truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Navigation Items grouped in sections */}
        <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-4">
          {navGroups.map((group) => (
            <div key={group.section} className="space-y-1">
              {!isCollapsed && (
                <h4 className="px-3 text-[9px] font-extrabold uppercase tracking-widest text-text-muted/70 mb-1">
                  {group.section}
                </h4>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    title={isCollapsed ? item.label : undefined}
                    className={`group relative flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      active
                        ? "text-text-title font-extrabold bg-accent-purple/10 border border-accent-purple/25"
                        : "text-text-muted hover:text-text-title hover:bg-glass-border/40"
                    } ${isCollapsed ? "justify-center px-0" : ""}`}
                  >
                    {/* Left Active Rail */}
                    {active && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-accent-cyan shadow-[0_0_8px_#06b6d4]" />
                    )}

                    <Icon
                      size={17}
                      className={`shrink-0 z-10 transition-transform duration-200 ${
                        active ? "text-accent-cyan scale-105" : "group-hover:scale-105 group-hover:text-text-title"
                      }`}
                    />

                    {!isCollapsed && <span className="truncate flex-1 z-10">{item.label}</span>}

                    {/* Notification Badge */}
                    {item.badge > 0 && (
                      <span
                        className={`z-10 flex items-center justify-center bg-rose-500 text-white font-extrabold text-[10px] rounded-full shadow-md ${
                          isCollapsed ? "absolute -top-1 -right-1 h-4 w-4" : "px-1.5 py-0.2"
                        }`}
                      >
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer Theme Toggle, 2FA & Logout */}
        <div className="p-2.5 border-t border-white/10 space-y-1 shrink-0">
          
          {/* 2FA Toggle Button */}
          <button
            disabled={updating2FA}
            onClick={handleToggle2FA}
            title={isCollapsed ? (twoFactorEnabled ? "2FA Enabled" : "2FA Disabled") : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer border ${
              twoFactorEnabled
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
                : "bg-slate-900/60 border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
            } ${isCollapsed ? "justify-center px-0" : ""}`}
          >
            <ShieldCheck size={18} className={twoFactorEnabled ? "text-emerald-400" : "text-slate-400"} />
            {!isCollapsed && (
              <div className="flex items-center justify-between flex-1">
                <span>2FA Security</span>
                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                  twoFactorEnabled ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" : "bg-white/5 text-slate-400 border-white/10"
                }`}>
                  {updating2FA ? "..." : twoFactorEnabled ? "ON" : "OFF"}
                </span>
              </div>
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={isCollapsed ? "Toggle theme" : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#9696A8] hover:text-[#F5F5FA] hover:bg-white/5 transition cursor-pointer ${
              isCollapsed ? "justify-center px-0" : ""
            }`}
          >
            {theme === "dark" ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-400" />}
            {!isCollapsed && (
              <div className="flex items-center justify-between flex-1">
                <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white/10 text-white">
                  {theme}
                </span>
              </div>
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title={isCollapsed ? "Logout" : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition cursor-pointer ${
              isCollapsed ? "justify-center px-0" : ""
            }`}
          >
            <LogOut size={18} />
            {!isCollapsed && <span>Log out</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
