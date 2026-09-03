import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  Users,
  Bookmark,
  Bell,
  LogOut,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Video,
  FileText,
  Layers,
  Sun,
  Moon,
  Share2,
  Menu,
  X,
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

  const roleNavigations = {
    learner: [
      { path: "/learner/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { path: "/courses", label: "Explore Resources & Courses", icon: Compass },
      { path: "/my-courses", label: "Courses", icon: BookOpen },
      { path: "/resources", label: "Resources", icon: FileText },
      { path: "/sessions", label: "Mentors & Sessions", icon: Video },
      { path: "/chat", label: "Chat", icon: MessageSquare, badge: unreadCount },
      { path: "/bookmarks", label: "Bookmarks", icon: Bookmark },
      { path: "/profile", label: "Profile", icon: UserIcon },
    ],
    creator: [
      { path: "/creator/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { path: "/my-courses", label: "Courses", icon: BookOpen },
      { path: "/my-resources", label: "Resources", icon: FileText },
      { path: "/categories", label: "Categories", icon: Layers },
      { path: "/courses", label: "Explore Courses", icon: Compass },
      { path: "/chat", label: "Chat", icon: MessageSquare, badge: unreadCount },
      { path: "/bookmarks", label: "Bookmarks", icon: Bookmark },
      { path: "/profile", label: "Profile", icon: UserIcon },
    ],
    expert: [
      { path: "/expert/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { path: "/sessions", label: "Mentorship Sessions", icon: Video },
      { path: "/my-courses", label: "Courses", icon: BookOpen },
      { path: "/my-resources", label: "Resources", icon: FileText },
      { path: "/categories", label: "Categories", icon: Layers },
      { path: "/chat", label: "Chat", icon: MessageSquare, badge: unreadCount },
      { path: "/bookmarks", label: "Bookmarks", icon: Bookmark },
      { path: "/profile", label: "Profile", icon: UserIcon },
    ],
    admin: [
      { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { path: "/admin/dashboard?tab=users", label: "Users", icon: Users },
      { path: "/courses", label: "Course Management", icon: BookOpen },
      { path: "/resources", label: "Resource Management", icon: FileText },
      { path: "/categories", label: "Categories", icon: Layers },
      { path: "/chat", label: "Chat", icon: MessageSquare, badge: unreadCount },
      { path: "/bookmarks", label: "Bookmarks", icon: Bookmark },
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
      {/* Mobile Header / Drawer Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-bg-panel/90 backdrop-blur-md border-b border-glass-border px-4 flex items-center justify-between z-40">
        <Link to={`/${user?.role || "learner"}/dashboard`} className="flex items-center gap-2 font-display text-sm font-bold text-text-title">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-accent">
            <Share2 size={13} className="text-white" />
          </div>
          <span>CKM</span>
        </Link>

        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-lg bg-glass-card border border-glass-border text-text-main hover:text-text-title transition"
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
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-50"
          />
        )}
      </AnimatePresence>

      {/* Persistent Application Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? "80px" : "260px",
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 bg-bg-panel border-r border-glass-border flex flex-col transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0 w-[260px]" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Header / Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-glass-border/60 shrink-0">
          <Link
            to={`/${user?.role || "learner"}/dashboard`}
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center gap-2.5 font-display text-base font-bold tracking-tight text-text-title select-none overflow-hidden"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-accent-purple via-accent-indigo to-accent-blue shadow-md shadow-purple-950/20 shrink-0">
              <Share2 size={16} className="text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold tracking-widest text-text-title text-sm leading-tight">CKM</span>
                <span className="text-[10px] text-accent-purple font-semibold capitalize truncate">{user?.role || "learner"}</span>
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

        {/* User Info Capsule */}
        {!isCollapsed && user && (
          <div className="px-3 py-3 border-b border-glass-border/40 bg-bg-dark/40 flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-accent p-[1px] shrink-0">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt={user.name} className="h-full w-full rounded-lg object-cover" />
              ) : (
                <div className="h-full w-full rounded-lg bg-bg-deep flex items-center justify-center text-xs font-bold text-accent-blue uppercase">
                  {user.name ? user.name[0] : "U"}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-text-title truncate">{user.name}</p>
              <p className="text-[10px] text-text-muted truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                title={isCollapsed ? item.label : undefined}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  active
                    ? "bg-gradient-to-r from-accent-purple/20 to-accent-blue/15 text-text-title border border-accent-purple/30 shadow-xs"
                    : "text-text-muted hover:text-text-title hover:bg-glass-border/70"
                } ${isCollapsed ? "justify-center px-0" : ""}`}
              >
                <Icon size={18} className={`shrink-0 transition-transform ${active ? "text-accent-purple scale-105" : "group-hover:scale-110"}`} />
                
                {!isCollapsed && <span className="truncate flex-1">{item.label}</span>}

                {/* Badge if present */}
                {item.badge > 0 && (
                  <span className={`flex items-center justify-center bg-rose-500 text-white font-bold text-[10px] rounded-full ${
                    isCollapsed ? "absolute -top-1 -right-1 h-4 w-4" : "px-1.5 py-0.2"
                  }`}>
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-2 border-t border-glass-border/60 space-y-1 shrink-0">
          <button
            onClick={toggleTheme}
            title={isCollapsed ? "Toggle theme" : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-text-muted hover:text-text-title hover:bg-glass-border/70 transition ${
              isCollapsed ? "justify-center px-0" : ""
            }`}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            {!isCollapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
          </button>

          <button
            onClick={handleLogout}
            title={isCollapsed ? "Logout" : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition ${
              isCollapsed ? "justify-center px-0" : ""
            }`}
          >
            <LogOut size={18} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
