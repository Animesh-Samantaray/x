import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  BookOpen,
  Users,
  Bookmark,
  Bell,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Layers,
  Video,
  Share2,
  Sun,
  Moon,
  FileText,
  MessageSquare,
  X,
  BellRing,
  Search,
  ShieldCheck,
  ShieldAlert,
  CreditCard,
  Flag,
  Home,
  Menu,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { update2FA } from "../../services/authService";
import chatService from "../../services/chatService";
import { initSocket, getSocket, extractId } from "../../services/socket";
import {
  getNotificationPermission,
  requestNotificationPermission,
  sendDesktopNotification,
} from "../../services/notification";

const playChime = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch (err) {
    // Ignore audio policy errors
  }
};

const WorkspaceShell = () => {
  const { user, logout, getCurrentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifPermission, setNotifPermission] = useState(getNotificationPermission());

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(!!user?.twoFactorEnabled);
  const [updating2FA, setUpdating2FA] = useState(false);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const currentUserId = extractId(user?.id || user?._id);

  useEffect(() => {
    if (user) {
      setTwoFactorEnabled(!!user.twoFactorEnabled);
    }
  }, [user]);

  // Handle theme toggling
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

  // Handle 2FA update
  const handleToggle2FA = async () => {
    try {
      setUpdating2FA(true);
      const newVal = !twoFactorEnabled;
      const res = await update2FA(newVal);
      if (res && res.success) {
        setTwoFactorEnabled(res.twoFactorEnabled);
        await getCurrentUser();
        toast.success(`2FA Security ${res.twoFactorEnabled ? "Enabled" : "Disabled"}`);
      }
    } catch (err) {
      toast.error("Failed to update 2FA setting.");
    } finally {
      setUpdating2FA(false);
    }
  };

  // Request browser notification permission
  const handleRequestPermission = async () => {
    const perm = await requestNotificationPermission();
    setNotifPermission(perm);
  };

  // Load initial notifications
  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      try {
        const res = await chatService.getNotifications();
        if (res && res.success) {
          const mapped = (res.notifications || []).map((n) => ({
            id: n._id || Date.now() + Math.random(),
            title: n.title || "Notification",
            message: n.message || "",
            type: n.type,
            reaction: n.reaction,
            conversationId: extractId(n.conversation),
            targetMessageId: extractId(n.targetMessage),
            senderName: n.sender?.name || "User",
            senderPic: n.sender?.profilePicture,
            createdAt: n.createdAt || new Date().toISOString(),
            read: n.isRead,
          }));
          setNotifications(mapped);
          setUnreadCount(res.unreadCount || 0);
        }
      } catch (err) {
        console.error("Notifications fetch error:", err);
      }
    };
    fetchNotifications();
  }, [user]);

  // Global Socket.IO listener
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    initSocket(token);
    const socket = getSocket();

    if (socket) {
      const handleNewNotif = (data) => {
        const senderId = extractId(data.sender?._id || data.sender);
        if (senderId && senderId === currentUserId) return;

        playChime();

        const convId = extractId(data.conversation || data.conversationId);
        const targetMsgId = extractId(data.targetMessage || data.targetMessageId);

        const notifObj = {
          id: data._id || Date.now() + Math.random(),
          title: data.title || "New Notification",
          message: data.message || "",
          type: data.type || "message",
          reaction: data.reaction,
          conversationId: convId,
          targetMessageId: targetMsgId,
          senderName: data.sender?.name || "Participant",
          senderPic: data.sender?.profilePicture,
          createdAt: data.createdAt || new Date().toISOString(),
          read: false,
        };

        setNotifications((prev) => [notifObj, ...prev.slice(0, 29)]);
        setUnreadCount((prev) => prev + 1);

        const navTarget = convId
          ? `/chat?conversation=${convId}${targetMsgId ? `&message=${targetMsgId}` : ""}`
          : "/chat";

        toast(
          (t) => (
            <div
              className="flex items-center gap-3 cursor-pointer select-none"
              onClick={() => {
                toast.dismiss(t.id);
                navigate(navTarget);
              }}
            >
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden relative border border-cyan-500/30">
                {notifObj.senderPic ? (
                  <img src={notifObj.senderPic} alt="" className="w-full h-full object-cover" />
                ) : (
                  notifObj.senderName?.[0] || "💬"
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-bold text-text-title truncate">{notifObj.senderName}</h5>
                <p className="text-[11px] text-text-muted truncate">{notifObj.message}</p>
              </div>
            </div>
          ),
          { duration: 4000 }
        );

        sendDesktopNotification({
          title: `${notifObj.senderName} • ${notifObj.title}`,
          body: notifObj.message,
          icon: notifObj.senderPic || "/favicon.ico",
          tag: notifObj.conversationId || "general",
          onClick: () => navigate(navTarget),
        });
      };

      socket.on("new_notification", handleNewNotif);
      return () => socket.off("new_notification", handleNewNotif);
    }
  }, [currentUserId, navigate]);

  const markAllRead = async () => {
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await chatService.markNotificationsAsRead();
    } catch (err) {
      console.error("Error marking notifications read:", err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const dashboardPath = `/${user?.role || "learner"}/dashboard`;

  // Dynamic Navigation Items for 4 Roles
  const roleNavItems = {
    learner: [
      { path: dashboardPath, label: "WORKSPACE", icon: Home },
      { path: "/courses", label: "EXPLORE CATALOG", icon: Compass },
      { path: "/resources", label: "KNOWLEDGE LIBRARY", icon: FileText },
      { path: "/sessions", label: "1-ON-1 MENTORSHIP", icon: Video },
      { path: "/chat", label: "DISCUSSIONS", icon: MessageSquare, badge: unreadCount },
      { path: "/bookmarks", label: "SAVED BLUEPRINTS", icon: Bookmark },
      { path: "/my-payments", label: "PAYMENT HISTORY", icon: CreditCard },
      { path: "/profile", label: "SETTINGS", icon: UserIcon },
    ],
    creator: [
      { path: dashboardPath, label: "STUDIO DASHBOARD", icon: Home },
      { path: "/my-courses", label: "COURSE AUTHORING", icon: BookOpen },
      { path: "/my-resources", label: "RESOURCE LIBRARY", icon: FileText },
      { path: "/categories", label: "CATEGORIES", icon: Layers },
      { path: "/chat", label: "DISCUSSIONS", icon: MessageSquare, badge: unreadCount },
      { path: "/bookmarks", label: "BOOKMARKS", icon: Bookmark },
      { path: "/my-payments", label: "EARNINGS & PAYOUTS", icon: CreditCard },
      { path: "/profile", label: "SETTINGS", icon: UserIcon },
    ],
    expert: [
      { path: dashboardPath, label: "EXPERT HUB", icon: Home },
      { path: "/sessions", label: "MENTORSHIP SESSIONS", icon: Video },
      { path: "/chat", label: "DISCUSSIONS", icon: MessageSquare, badge: unreadCount },
      { path: "/my-courses", label: "MY COURSES", icon: BookOpen },
      { path: "/my-resources", label: "MY RESOURCES", icon: FileText },
      { path: "/my-payments", label: "PAYOUT LOGS", icon: CreditCard },
      { path: "/bookmarks", label: "BOOKMARKS", icon: Bookmark },
      { path: "/profile", label: "SETTINGS", icon: UserIcon },
    ],
    admin: [
      { path: dashboardPath, label: "OPERATIONS HOME", icon: Home },
      { path: "/admin/reports", label: "MODERATION QUEUE", icon: ShieldAlert },
      { path: "/admin/payments", label: "PAYMENT PLATFORM", icon: CreditCard },
      { path: "/admin/dashboard?tab=users", label: "USER DIRECTORY", icon: Users },
      { path: "/courses", label: "COURSE CATALOG", icon: BookOpen },
      { path: "/resources", label: "RESOURCE LIBRARY", icon: FileText },
      { path: "/categories", label: "CATEGORIES TAXONOMY", icon: Layers },
      { path: "/profile", label: "SETTINGS", icon: UserIcon },
    ],
  };

  const navItems = roleNavItems[user?.role || "learner"] || roleNavItems.learner;

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

  // Keyboard shortcut for Command/Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchModalOpen(false);
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-bg-deep text-text-main flex flex-col font-sans relative selection:bg-purple-500/30">
      
      {/* TOP WORKSPACE HEADER BAR */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-bg-panel/90 backdrop-blur-2xl border-b border-glass-border z-40 flex items-center justify-between px-4 sm:px-6 transition-all duration-300">
        
        {/* Left Brand Identity & Breadcrumb */}
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-glass-card border border-glass-border text-text-muted hover:text-text-title transition cursor-pointer"
            aria-label="Open navigation drawer"
          >
            <Menu size={18} />
          </button>

          <Link
            to={dashboardPath}
            className="flex items-center gap-2.5 group/logo select-none shrink-0"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 shadow-md group-hover/logo:scale-105 transition duration-300">
              <Share2 size={16} className="text-white" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-extrabold tracking-widest text-text-title text-sm leading-tight font-display">
                CKM
              </span>
              <span className="text-[10px] text-text-muted font-medium leading-none">
                Workspace
              </span>
            </div>
          </Link>
        </div>

        {/* Right Actions & Utilities */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          <button
            onClick={() => setSearchModalOpen(true)}
            className="md:hidden p-2.5 rounded-xl border border-glass-border bg-glass-card hover:bg-glass-border text-text-muted hover:text-text-title transition cursor-pointer"
            title="Search"
          >
            <Search size={16} />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-glass-border bg-glass-card hover:bg-glass-border text-text-muted hover:text-text-title transition duration-200 cursor-pointer active:scale-95 flex items-center justify-center"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-indigo-600" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                if (!notificationsOpen) markAllRead();
              }}
              className="p-2.5 rounded-xl border border-glass-border bg-glass-card hover:bg-glass-border text-text-muted hover:text-text-title transition duration-200 cursor-pointer active:scale-95 relative"
              title="Notifications"
            >
              <Bell size={15} className="text-indigo-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-black text-[9px] flex items-center justify-center shadow-md animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  className="absolute right-0 mt-3 w-80 sm:w-88 rounded-2xl border border-glass-border bg-bg-panel p-3.5 shadow-2xl z-50 flex flex-col space-y-2.5"
                >
                  <div className="flex items-center justify-between border-b border-glass-border/40 pb-2.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-text-title uppercase tracking-wider font-display">Notifications</h4>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-1.5 pr-0.5">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-text-muted">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            setNotificationsOpen(false);
                            if (n.conversationId) {
                              navigate(`/chat?conversation=${n.conversationId}${n.targetMessageId ? `&message=${n.targetMessageId}` : ""}`);
                            } else {
                              navigate("/chat");
                            }
                          }}
                          className="p-2.5 rounded-xl hover:bg-glass-border/60 cursor-pointer transition flex items-start gap-3 border border-transparent hover:border-glass-border"
                        >
                          <div className="w-8 h-8 rounded-full bg-indigo-500/15 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 relative overflow-hidden border border-indigo-500/20">
                            {n.senderPic ? (
                              <img src={n.senderPic} alt="" className="w-full h-full object-cover" />
                            ) : (
                              n.senderName?.[0] || "💬"
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold text-text-title truncate">{n.senderName}</p>
                              <span className="text-[9px] text-text-muted">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[11px] text-text-muted truncate mt-0.5">{n.message}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Avatar Button */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 rounded-xl border border-glass-border bg-glass-card hover:bg-glass-border py-1.5 px-2.5 transition duration-200 active:scale-95 cursor-pointer"
            >
              <div className="h-7 w-7 rounded-full bg-indigo-600 p-[1px] shrink-0 relative">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} className="h-full w-full rounded-full object-cover" />
                ) : (
                  <div className="h-full w-full rounded-full bg-indigo-600 flex items-center justify-center font-extrabold text-white text-[10px] uppercase">
                    {user?.name ? user.name[0] : <UserIcon size={12} />}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-bg-panel" />
              </div>
              <ChevronDown size={13} className="text-text-muted" />
            </button>

            <AnimatePresence>
              {profileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  className="absolute right-0 mt-3 w-52 rounded-2xl border border-glass-border bg-bg-panel p-2.5 shadow-2xl z-50 flex flex-col space-y-1"
                >
                  <div className="px-3 py-2 border-b border-glass-border/40 mb-1">
                    <h4 className="text-xs font-bold text-text-title truncate">{user?.name || "User"}</h4>
                    <p className="text-[10px] text-text-muted truncate mt-0.5">{user?.email}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-text-main hover:text-text-title hover:bg-glass-border rounded-lg transition"
                  >
                    <UserIcon size={14} className="text-indigo-400" />
                    My Profile & Settings
                  </Link>

                  <button
                    disabled={updating2FA}
                    onClick={handleToggle2FA}
                    className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-text-main hover:text-text-title hover:bg-glass-border rounded-lg transition cursor-pointer w-full text-left"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className={twoFactorEnabled ? "text-emerald-400" : "text-text-muted"} />
                      <span>2FA Security</span>
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                      twoFactorEnabled ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-glass-border text-text-muted"
                    }`}>
                      {updating2FA ? "..." : twoFactorEnabled ? "ON" : "OFF"}
                    </span>
                  </button>

                  <div className="border-t border-glass-border/40 pt-1 mt-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition w-full text-left cursor-pointer"
                    >
                      <LogOut size={14} />
                      Log Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* PERSISTENT WORKSPACE SIDEBAR (EXACT MATCH FOR REFERENCE IMAGE) */}
      {/* ========================================================================= */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? "80px" : "240px" }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1.0] }}
        className="hidden lg:flex fixed top-16 left-0 bottom-0 z-30 bg-bg-panel border-r border-glass-border flex-col shadow-2xl justify-between select-none"
      >
        {/* TOP SECTION: USER PROFILE HEADER & SEARCH BAR */}
        <div className="p-4 space-y-4 border-b border-glass-border/40">
          
          {/* User Profile Header */}
          <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
            <div className="relative shrink-0">
              <div className="h-10 w-10 rounded-full bg-indigo-600 overflow-hidden border border-glass-border flex items-center justify-center font-bold text-white text-xs">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.[0]?.toUpperCase() || "U"
                )}
              </div>
              {/* Online Badge Dot */}
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-blue-500 border-2 border-bg-panel shadow-sm" />
            </div>

            {!isCollapsed && (
              <div className="min-w-0 text-left">
                <h3 className="text-xs font-black text-text-title uppercase tracking-wide truncate">
                  {user?.name || "JOHN DOE"}
                </h3>
                <p className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-wider truncate">
                  {user?.role ? `${user.role.toUpperCase()} WORKSPACE` : "D. IN MEDICINE"}
                </p>
              </div>
            )}
          </div>

          {/* Search Bar Input */}
          {!isCollapsed ? (
            <button
              onClick={() => setSearchModalOpen(true)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-bg-darker/80 border border-glass-border text-text-muted hover:text-text-title transition cursor-pointer text-xs font-mono font-semibold"
            >
              <Search size={14} className="text-indigo-400 shrink-0" />
              <span className="uppercase text-[10px] tracking-wider font-bold">Search...</span>
            </button>
          ) : (
            <button
              onClick={() => setSearchModalOpen(true)}
              className="w-full h-10 rounded-xl bg-bg-darker/80 border border-glass-border flex items-center justify-center text-indigo-400 hover:bg-glass-border transition cursor-pointer"
              title="Search"
            >
              <Search size={16} />
            </button>
          )}

        </div>

        {/* MIDDLE SECTION: MAIN NAVIGATION LINKS WITH SOLID ACTIVE PILL */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 text-left">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.label}
                to={item.path}
                title={isCollapsed ? item.label : undefined}
                className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-black"
                    : "text-text-muted hover:text-text-title hover:bg-glass-border/40"
                } ${isCollapsed ? "justify-center px-0" : ""}`}
              >
                <Icon
                  size={18}
                  className={`shrink-0 transition-transform duration-200 ${
                    active ? "text-white scale-105" : "text-text-muted group-hover:text-text-title group-hover:scale-105"
                  }`}
                />

                {!isCollapsed && <span className="truncate flex-1">{item.label}</span>}

                {item.badge > 0 && (
                  <span
                    className={`flex items-center justify-center bg-rose-500 text-white font-extrabold text-[9px] rounded-full ${
                      isCollapsed ? "absolute -top-1 -right-1 h-4 w-4" : "px-1.5 py-0.2"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* BOTTOM SECTION: HELP CENTER, LOG OUT & NIGHTMODE TOGGLE */}
        <div className="p-3 border-t border-glass-border/40 space-y-1.5 text-left shrink-0">
          
          {/* Help Center */}
          <Link
            to="/help"
            title={isCollapsed ? "HELP CENTER" : undefined}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-text-muted hover:text-text-title hover:bg-glass-border/40 transition uppercase tracking-wider ${
              isCollapsed ? "justify-center px-0" : ""
            }`}
          >
            <HelpCircle size={18} className="shrink-0 text-text-muted" />
            {!isCollapsed && <span>HELP CENTER</span>}
          </Link>

          {/* Log Out */}
          <button
            onClick={handleLogout}
            title={isCollapsed ? "LOG OUT" : undefined}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition uppercase tracking-wider cursor-pointer ${
              isCollapsed ? "justify-center px-0" : ""
            }`}
          >
            <LogOut size={18} className="shrink-0 text-text-muted group-hover:text-rose-400" />
            {!isCollapsed && <span>LOG OUT</span>}
          </button>

          {/* NIGHTMODE TOGGLE SWITCH */}
          <div
            onClick={toggleTheme}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-text-muted hover:text-text-title cursor-pointer transition uppercase tracking-wider ${
              isCollapsed ? "justify-center px-0" : ""
            }`}
            title={isCollapsed ? `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode` : undefined}
          >
            <div className="flex items-center gap-3">
              {theme === "dark" ? <Moon size={18} className="text-indigo-400 shrink-0" /> : <Sun size={18} className="text-amber-400 shrink-0" />}
              {!isCollapsed && <span>NIGHTMODE</span>}
            </div>

            {/* Toggle Pill Switch Button */}
            {!isCollapsed && (
              <div className={`w-9 h-5 rounded-full p-0.5 transition duration-300 ${
                theme === "dark" ? "bg-indigo-600" : "bg-slate-300"
              }`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition duration-300 ${
                  theme === "dark" ? "translate-x-4" : "translate-x-0"
                }`} />
              </div>
            )}
          </div>

          {/* Collapse Toggle Arrow Bar */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-1.5 mt-1 rounded-xl text-text-muted hover:text-text-title hover:bg-glass-border/40 transition cursor-pointer"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

        </div>
      </motion.aside>

      {/* MOBILE DRAWER OVERLAY */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-xs z-50"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-bg-panel border-r border-glass-border z-50 flex flex-col p-4 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-glass-border/40 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold">
                    <Share2 size={15} />
                  </div>
                  <span className="font-extrabold text-text-title font-display text-sm tracking-wider">CKM Workspace</span>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-glass-border text-text-muted hover:text-text-title"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 text-left">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                        active
                          ? "bg-indigo-600 text-white shadow-md"
                          : "text-text-muted hover:text-text-title hover:bg-glass-border"
                      }`}
                    >
                      <Icon size={16} className={active ? "text-white" : ""} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge > 0 && (
                        <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              <div className="border-t border-glass-border/40 pt-3 space-y-2">
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-between w-full p-2.5 rounded-xl bg-bg-darker border border-glass-border text-xs font-bold text-text-title uppercase tracking-wider"
                >
                  <span>NIGHTMODE</span>
                  <span className="text-[10px] text-indigo-400 capitalize">{theme}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold uppercase tracking-wider"
                >
                  <LogOut size={14} />
                  LOG OUT
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* COMMAND SEARCH MODAL (⌘K) */}
      <AnimatePresence>
        {searchModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchModalOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-lg bg-bg-panel border border-glass-border rounded-2xl p-4 shadow-2xl z-50 space-y-3"
            >
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 border-b border-glass-border/50 pb-3">
                <Search size={18} className="text-indigo-400 shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search masterclasses, resources, authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm font-semibold text-text-title outline-none placeholder:text-text-muted"
                />
                <button
                  type="button"
                  onClick={() => setSearchModalOpen(false)}
                  className="p-1 text-text-muted hover:text-text-title text-xs font-mono border border-glass-border rounded"
                >
                  ESC
                </button>
              </form>

              <div className="space-y-1 text-xs text-left">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted px-2 py-1 font-display">
                  Quick Navigation Shortcuts
                </p>
                <div
                  onClick={() => { setSearchModalOpen(false); navigate("/courses"); }}
                  className="p-2 rounded-xl hover:bg-glass-border cursor-pointer flex items-center justify-between font-medium text-text-main"
                >
                  <span className="flex items-center gap-2"><Compass size={14} className="text-indigo-400" /> Explore Courses Catalog</span>
                  <span className="text-[10px] text-text-muted">↵ Jump</span>
                </div>
                <div
                  onClick={() => { setSearchModalOpen(false); navigate("/resources"); }}
                  className="p-2 rounded-xl hover:bg-glass-border cursor-pointer flex items-center justify-between font-medium text-text-main"
                >
                  <span className="flex items-center gap-2"><FileText size={14} className="text-purple-400" /> Knowledge Library</span>
                  <span className="text-[10px] text-text-muted">↵ Jump</span>
                </div>
                <div
                  onClick={() => { setSearchModalOpen(false); navigate("/sessions"); }}
                  className="p-2 rounded-xl hover:bg-glass-border cursor-pointer flex items-center justify-between font-medium text-text-main"
                >
                  <span className="flex items-center gap-2"><Video size={14} className="text-emerald-400" /> Mentorship Calls</span>
                  <span className="text-[10px] text-text-muted">↵ Jump</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MAIN WORKSPACE CANVAS AREA WITH DYNAMIC RAIL OFFSETS */}
      <main
        className={`flex-1 flex flex-col min-h-screen pt-16 transition-all duration-300 ${
          isCollapsed ? "lg:ml-[80px]" : "lg:ml-[240px]"
        }`}
      >
        {location.pathname === "/chat" ? (
          <Outlet />
        ) : (
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex-1">
            <Outlet />
          </div>
        )}
      </main>

    </div>
  );
};

export default WorkspaceShell;
