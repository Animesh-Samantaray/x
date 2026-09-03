import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  getNotificationPermission,
  requestNotificationPermission,
  sendDesktopNotification,
} from "../services/notification";
import { initSocket, getSocket, extractId } from "../services/socket";
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
  Info,
  FileText,
  MessageSquare,
  X,
  BellRing,
} from "lucide-react";

const playNotificationChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch (err) {
    // Ignore audio autoplay policies
  }
};

const AppShell = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifPermission, setNotifPermission] = useState(
    getNotificationPermission()
  );

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const currentUserId = extractId(user?.id || user?._id);

  // Request browser desktop notification permission on user interaction
  const handleRequestPermission = async () => {
    const perm = await requestNotificationPermission();
    setNotifPermission(perm);
  };

  // Redirect root '/' to role dashboard
  useEffect(() => {
    if (location.pathname === "/") {
      const targetPath = `/${user?.role || "learner"}/dashboard`;
      navigate(targetPath, { replace: true });
    }
  }, [location.pathname, user?.role, navigate]);

  // Global Socket.IO Notification Listener
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    initSocket(token);
    const socket = getSocket();

    if (socket) {
      const handleNewNotification = (data) => {
        const senderId = extractId(data.sender?._id || data.sender);
        if (senderId && senderId === currentUserId) return;

        playNotificationChime();

        const notifObj = {
          id: Date.now() + Math.random(),
          title: data.title || "New Notification",
          message: data.message || "",
          conversationId: extractId(data.conversationId),
          senderName: data.sender?.name || "Participant",
          senderPic: data.sender?.profilePicture,
          createdAt: data.createdAt || new Date().toISOString(),
          read: false,
        };

        setNotifications((prev) => [notifObj, ...prev.slice(0, 19)]);
        setUnreadCount((prev) => prev + 1);

        // Show compact in-app toast using react-hot-toast
        toast(
          (t) => (
            <div
              className="flex items-center gap-3 cursor-pointer select-none"
              onClick={() => {
                toast.dismiss(t.id);
                if (notifObj.conversationId) {
                  navigate(`/chat?conversation=${notifObj.conversationId}`);
                } else {
                  navigate("/chat");
                }
              }}
            >
              <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                {notifObj.senderPic ? (
                  <img src={notifObj.senderPic} alt="" className="w-full h-full object-cover" />
                ) : (
                  notifObj.senderName?.[0] || "💬"
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-bold text-slate-100 truncate">{notifObj.senderName}</h5>
                <p className="text-[11px] text-slate-400 truncate">{notifObj.message}</p>
              </div>
            </div>
          ),
          {
            duration: 4000,
            style: {
              background: "#0f172a",
              color: "#f8fafc",
              border: "1px solid #1e293b",
              borderRadius: "0.85rem",
              padding: "0.5rem 0.75rem",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
            },
          }
        );

        // Browser desktop system notification
        sendDesktopNotification({
          title: `${notifObj.senderName} • ${notifObj.title}`,
          body: notifObj.message,
          icon: notifObj.senderPic || "/favicon.ico",
          tag: notifObj.conversationId || "general",
          onClick: () => {
            if (notifObj.conversationId) {
              navigate(`/chat?conversation=${notifObj.conversationId}`);
            } else {
              navigate("/chat");
            }
          },
        });
      };

      socket.on("new_notification", handleNewNotification);

      return () => {
        socket.off("new_notification", handleNewNotification);
      };
    }
  }, [currentUserId, navigate]);

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

  const markAllAsRead = () => {
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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
      { path: "/chat", label: "Discussions", icon: MessageSquare },
      { path: "/resources", label: "Resources", icon: Compass },
      { path: "/bookmarks", label: "Bookmarks", icon: Bookmark },
      { path: "/sessions", label: "Mentorship", icon: Video },
    ],
    creator: [
      { path: "/creator/dashboard", label: "Dashboard", icon: Layers },
      { path: "/my-courses", label: "My Courses", icon: BookOpen },
      { path: "/chat", label: "Discussions", icon: MessageSquare },
      { path: "/my-resources", label: "My Resources", icon: FileText },
      { path: "/categories", label: "Categories", icon: Layers },
      { path: "/courses", label: "Explore Courses", icon: Compass },
    ],
    expert: [
      { path: "/expert/dashboard", label: "Dashboard", icon: Layers },
      { path: "/sessions", label: "Mentorship Sessions", icon: Video },
      { path: "/chat", label: "Discussions", icon: MessageSquare },
      { path: "/my-courses", label: "My Courses", icon: BookOpen },
      { path: "/my-resources", label: "My Resources", icon: FileText },
      { path: "/categories", label: "Categories", icon: Layers },
    ],
    admin: [
      { path: "/admin/dashboard", label: "Dashboard", icon: Layers },
      { path: "/admin/dashboard?tab=users", label: "Users", icon: Users },
      { path: "/chat", label: "Discussions", icon: MessageSquare },
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
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                if (!notificationsOpen) markAllAsRead();
              }}
              className="group h-9 w-9 rounded-xl border border-glass-border bg-glass-card flex items-center justify-center text-text-muted hover:text-text-title transition duration-200 active:scale-95 cursor-pointer relative"
            >
              <Bell size={15} className="text-accent-purple transition-transform group-hover:scale-110" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-extrabold text-[9px] flex items-center justify-center shadow-md animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 mt-3.5 w-80 rounded-2xl border border-glass-border bg-bg-panel p-3 shadow-2xl z-50 flex flex-col space-y-2">
                <div className="flex items-center justify-between border-b border-glass-border/40 pb-2">
                  <h4 className="text-xs font-bold text-text-title uppercase tracking-wider">Notifications</h4>
                  {notifPermission !== "granted" && (
                    <button
                      onClick={handleRequestPermission}
                      className="text-[10px] text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <BellRing size={10} /> Enable Desktop
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto space-y-1">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-text-muted">
                      No new notifications.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          setNotificationsOpen(false);
                          if (n.conversationId) {
                            navigate(`/chat?conversation=${n.conversationId}`);
                          } else {
                            navigate("/chat");
                          }
                        }}
                        className="p-2 rounded-xl hover:bg-glass-border cursor-pointer transition flex items-start gap-2.5 border border-transparent hover:border-glass-border"
                      >
                        <div className="w-7 h-7 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {n.senderPic ? (
                            <img src={n.senderPic} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            n.senderName?.[0] || "💬"
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-text-title truncate">{n.senderName}</p>
                          <p className="text-[11px] text-text-muted truncate">{n.message}</p>
                        </div>
                      </div>
                    ))
                  )}
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
