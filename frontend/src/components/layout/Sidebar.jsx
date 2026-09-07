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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ unreadCount = 0 }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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

  const roleNavigations = {
    learner: [
      { path: dashboardPath, label: "Home", icon: Home },
      { path: "/courses", label: "Explore Courses", icon: Compass },
      { path: "/my-courses", label: "My Courses", icon: BookOpen },
      { path: "/resources", label: "Resources", icon: FileText },
      { path: "/sessions", label: "Mentorship", icon: Video },
      { path: "/chat", label: "Chat & Discussions", icon: MessageSquare, badge: unreadCount },
      { path: "/bookmarks", label: "Bookmarks", icon: Bookmark },
      { path: "/my-payments", label: "Payment History", icon: CreditCard },
      { path: "/profile", label: "Profile", icon: UserIcon },
    ],
    creator: [
      { path: dashboardPath, label: "Home", icon: Home },
      { path: "/my-courses", label: "Course Studio", icon: BookOpen },
      { path: "/my-resources", label: "Resource Library", icon: FileText },
      { path: "/categories", label: "Categories", icon: Layers },
      { path: "/courses", label: "Explore Catalog", icon: Compass },
      { path: "/chat", label: "Discussions", icon: MessageSquare, badge: unreadCount },
      { path: "/bookmarks", label: "Bookmarks", icon: Bookmark },
      { path: "/my-payments", label: "Payment History", icon: CreditCard },
      { path: "/profile", label: "Profile", icon: UserIcon },
    ],
    expert: [
      { path: dashboardPath, label: "Home", icon: Home },
      { path: "/sessions", label: "Mentorship Hub", icon: Video },
      { path: "/my-courses", label: "Courses", icon: BookOpen },
      { path: "/my-resources", label: "Resources", icon: FileText },
      { path: "/categories", label: "Categories", icon: Layers },
      { path: "/chat", label: "Discussions", icon: MessageSquare, badge: unreadCount },
      { path: "/bookmarks", label: "Bookmarks", icon: Bookmark },
      { path: "/my-payments", label: "Payment History", icon: CreditCard },
      { path: "/profile", label: "Profile", icon: UserIcon },
    ],
    admin: [
      { path: dashboardPath, label: "Home", icon: Home },
      { path: "/admin/payments", label: "Payment Management", icon: CreditCard },
      { path: "/admin/dashboard?tab=users", label: "User Directory", icon: Users },
      { path: "/courses", label: "Course Directory", icon: BookOpen },
      { path: "/resources", label: "Resource Directory", icon: FileText },
      { path: "/categories", label: "Categories", icon: Layers },
      { path: "/chat", label: "Discussions", icon: MessageSquare, badge: unreadCount },
      { path: "/bookmarks", label: "Bookmarks", icon: Bookmark },
      { path: "/my-payments", label: "Payment History", icon: CreditCard },
      { path: "/profile", label: "Profile", icon: UserIcon },
    ],
  };

  const navItems = roleNavigations[user?.role || "learner"] || roleNavigations.learner;

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

      {/* Persistent SaaS Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? "80px" : "260px",
        }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1.0] }}
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 bg-[#0F0F17]/80 backdrop-blur-xl border-r border-white/10 flex flex-col transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0 w-[260px]" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Header / Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 shrink-0">
          <Link
            to={dashboardPath}
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center gap-3 font-display text-base font-bold tracking-tight text-text-title select-none overflow-hidden"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#7757F5] via-[#5C36F5] to-[#00F2FF] shadow-lg shadow-purple-950/40 shrink-0">
              <Share2 size={16} className="text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold tracking-widest text-[#F5F5FA] text-sm leading-tight">CKM</span>
                <span className="text-[10px] text-[#00F2FF] font-extrabold capitalize truncate">
                  {user?.role || "learner"} workspace
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-white/10 text-text-muted hover:text-text-title transition duration-150 cursor-pointer"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 text-text-muted hover:text-text-title"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Capsule */}
        {!isCollapsed && user && (
          <div className="px-3.5 py-3 border-b border-white/10 bg-[#181824]/60 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#7757F5] to-[#00F2FF] p-[1px] shrink-0">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt={user.name} className="h-full w-full rounded-lg object-cover" />
              ) : (
                <div className="h-full w-full rounded-lg bg-[#0F0F17] flex items-center justify-center text-xs font-bold text-[#00F2FF] uppercase">
                  {user.name ? user.name[0] : "U"}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold text-[#F5F5FA] truncate">{user.name}</p>
              <p className="text-[10px] text-[#9696A8] truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Navigation Items with Framer Motion layoutId highlight & Lottie Icons */}
        <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                title={isCollapsed ? item.label : undefined}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  active
                    ? "text-white"
                    : "text-[#9696A8] hover:text-[#F5F5FA] hover:bg-white/5"
                } ${isCollapsed ? "justify-center px-0" : ""}`}
              >
                {/* Active highlight bar using Framer Motion layoutId */}
                {active && (
                  <motion.div
                    layoutId="sidebarActiveHighlight"
                    className="absolute inset-0 rounded-xl bg-[#7757F5]/20 border border-[#7757F5]/40 shadow-[0_0_15px_rgba(119,87,245,0.2)]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                {/* Left Active Indicator Strip */}
                {active && !isCollapsed && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#00F2FF] shadow-[0_0_8px_#00F2FF]" />
                )}

                <Icon
                  size={18}
                  className={`shrink-0 z-10 transition-transform duration-200 ${
                    active ? "text-[#00F2FF] scale-105" : "group-hover:scale-105 group-hover:translate-x-0.5 group-hover:text-[#F5F5FA]"
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
        </nav>

        {/* Footer Theme Toggle & Logout */}
        <div className="p-2.5 border-t border-white/10 space-y-1 shrink-0">
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
