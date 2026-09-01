import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Compass,
  BookOpen,
  Users,
  Bookmark,
  Bell,
  LogOut,
  User as UserIcon,
  ChevronDown,
  TrendingUp,
  Layers,
  Video,
  Share2,
  Settings,
  Sun,
  Moon,
  Info,
  PlusCircle,
  FileText,
  Shield,
  BarChart3
} from "lucide-react";

const AppShell = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  // Redirect root '/' to role dashboard
  useEffect(() => {
    if (location.pathname === "/") {
      const targetPath = `/${user?.role || "learner"}/dashboard`;
      navigate(targetPath, { replace: true });
    }
  }, [location.pathname, user?.role, navigate]);

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

  const getRoleColors = (roleName) => {
    switch (roleName) {
      case "admin":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:bg-accent-purple/10 dark:text-accent-purple dark:border-accent-purple/20";
      case "expert":
        return "bg-pink-500/10 text-pink-600 border-pink-500/20 dark:bg-accent-pink/10 dark:text-accent-pink dark:border-accent-pink/20";
      case "creator":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-accent-emerald/10 dark:text-accent-emerald dark:border-accent-emerald/20";
      default:
        return "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-accent-blue/10 dark:text-accent-blue dark:border-accent-blue/20";
    }
  };

  const roleNavigations = {
    learner: [
      { path: "/learner/dashboard", label: "Dashboard", icon: Layers },
      { path: "/courses", label: "Explore Courses", icon: BookOpen },
      { path: "/my-courses", label: "My Courses", icon: BookOpen },
      { path: "/resources", label: "Resources", icon: Compass },
      { path: "/bookmarks", label: "Bookmarks", icon: Bookmark },
      { path: "/sessions", label: "Mentorship", icon: Video },
    ],
    creator: [
      { path: "/creator/dashboard", label: "Dashboard", icon: Layers },
      { path: "/my-courses", label: "My Courses", icon: BookOpen },
      { path: "/my-resources", label: "My Resources", icon: FileText },
      { path: "/categories", label: "Categories", icon: Layers },
      { path: "/courses", label: "Explore Courses", icon: Compass },
    ],
    expert: [
      { path: "/expert/dashboard", label: "Dashboard", icon: Layers },
      { path: "/sessions", label: "Mentorship Sessions", icon: Video },
      { path: "/my-courses", label: "My Courses", icon: BookOpen },
      { path: "/my-resources", label: "My Resources", icon: FileText },
      { path: "/categories", label: "Categories", icon: Layers },
    ],
    admin: [
      { path: "/admin/dashboard", label: "Dashboard", icon: Layers },
      { path: "/admin/dashboard?tab=users", label: "Users", icon: Users },
      { path: "/courses", label: "Course Management", icon: BookOpen },
      { path: "/resources", label: "Resource Management", icon: FileText },
      { path: "/categories", label: "Categories", icon: Layers },
    ],
  };

  const navItems = roleNavigations[user?.role || "learner"] || roleNavigations.learner;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eee9ff] via-[#e7edff] to-[#f1eaff] dark:from-[#070817] dark:via-[#070817] dark:to-[#0B0B1F] text-text-main flex flex-col font-sans select-none relative pt-16">
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none z-0"></div>
      <div className="glow-orb w-[500px] h-[500px] bg-accent-blue/5 top-[-100px] left-[-100px]"></div>
      <div className="glow-orb w-[500px] h-[500px] bg-accent-purple/5 bottom-[-100px] right-[-100px]"></div>

      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 glass-surface border-accent-blue/30 bg-bg-darker/95 px-5 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-300">
          <Info className="text-accent-blue shrink-0 animate-pulse" size={18} />
          <p className="text-xs font-semibold text-text-title">{toastMessage}</p>
        </div>
      )}

      {/* FIXED TOP HEADER */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-glass-border bg-bg-deep/80 backdrop-blur-xl z-40 flex items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link
          to={`/${user?.role || "learner"}/dashboard`}
          className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-text-title select-none shrink-0"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-accent p-[1px] shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-bg-deep">
              <Share2 size={14} className="text-accent-blue" />
            </div>
          </div>
          <span className="font-extrabold tracking-widest text-text-title text-sm">CKM</span>
          <span className={`text-[9px] border rounded px-1.5 py-0.2 uppercase font-bold tracking-widest ${getRoleColors(user?.role)}`}>
            {user?.role || "learner"}
          </span>
        </Link>

        {/* Top Navbar items */}
        <nav className="hidden md:flex items-center bg-bg-darker border border-glass-border rounded-xl p-1 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path.includes("dashboard") && location.pathname.endsWith("/dashboard"));

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`group/tab flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                  isActive
                    ? "bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-md shadow-purple-950/10"
                    : "text-text-muted hover:text-text-title hover:bg-glass-border"
                }`}
              >
                <Icon size={13} className="transition-transform group-hover/tab:scale-110 duration-200" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-3 shrink-0">
          <button onClick={toggleTheme} className="p-2.5 rounded-xl border border-glass-border hover:bg-glass-border hover:text-text-title text-text-muted transition duration-200 cursor-pointer active:scale-95 flex items-center justify-center">
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="group h-9 w-9 rounded-xl border border-glass-border bg-glass-card flex items-center justify-center text-text-muted hover:text-text-title transition duration-200 active:scale-95 cursor-pointer">
              <Bell size={15} className="text-accent-purple transition-transform group-hover:scale-110" />
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 mt-3.5 w-72 rounded-2xl border border-glass-border bg-bg-panel p-4 shadow-2xl z-50 flex flex-col space-y-3">
                <div className="flex items-center justify-between border-b border-glass-border/40 pb-2">
                  <h4 className="text-xs font-bold text-text-title uppercase tracking-wider">Notifications</h4>
                </div>
                <div className="py-4 text-center text-xs text-text-muted">
                  No new notifications.
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="flex items-center gap-2 rounded-xl border border-glass-border bg-glass-card hover:bg-glass-border py-1.5 px-2.5 transition duration-200 active:scale-95 cursor-pointer">
              <div className="h-6 w-6 rounded-lg bg-gradient-accent p-[1px] shrink-0">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} className="h-full w-full rounded-lg object-cover" />
                ) : (
                  <div className="h-full w-full rounded-lg flex items-center justify-center font-extrabold text-white text-[10px] uppercase bg-gradient-to-br from-accent-blue to-accent-indigo">
                    {user?.name ? user.name[0] : <UserIcon size={10} />}
                  </div>
                )}
              </div>
              <ChevronDown size={12} className="text-text-muted" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-3.5 w-48 rounded-2xl border border-glass-border bg-bg-panel p-2.5 shadow-2xl z-50 flex flex-col">
                <div className="px-3.5 py-2 border-b border-glass-border/30 mb-2">
                  <h4 className="text-xs font-bold text-text-title truncate">{user?.name || "Member"}</h4>
                  <p className="text-[9px] text-text-muted capitalize mt-0.5">{user?.role || "learner"}</p>
                </div>
                
                <Link to="/profile" onClick={() => setProfileDropdownOpen(false)} className="group flex items-center gap-2 px-3.5 py-2 text-xs text-text-main hover:text-text-title hover:bg-glass-border rounded-lg border border-transparent transition duration-150">
                  <UserIcon size={12} />
                  My Profile
                </Link>
                
                <button onClick={handleLogout} className="group flex items-center gap-2 px-3.5 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 rounded-lg border border-transparent transition duration-150 text-left w-full cursor-pointer">
                  <LogOut size={12} />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* WORKSPACE CONTENT AREA (FULL-SCREEN RESPONSIVE CONTAINER) */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 z-10 relative">
        <Outlet />
      </main>
    </div>
  );
};

export default AppShell;
