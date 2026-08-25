import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Compass,
  BookOpen,
  Users,
  MessageSquare,
  Bookmark,
  Bell,
  Search,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Calendar,
  Layers,
  ArrowRight,
  Clock,
  Play,
  Download,
  CheckCircle,
  Video,
  Share2,
  Settings,
  Sun,
  Moon,
  Info,
  Activity,
  PlusCircle,
  FileText,
  Lock,
  UserCheck,
  AlertCircle,
  X,
  Shield,
  FileSpreadsheet,
  BarChart3,
  Sliders,
  CheckSquare,
  Briefcase
} from "lucide-react";
import SpotlightCard from "./SpotlightCard";
import ProgressRing from "./ProgressRing";
import Button from "./Button";
import UserManagement from "./UserManagement";
import CreateResource from "../pages/CreateResource";
import Resources from "../pages/Resources";
import MyResources from "../pages/MyResources";
import { getAllUsers } from "../services/adminApi";
import { getAllResourcesAdmin, deleteResource, publishResource, archiveResource } from "../services/resourceService";

const AppShell = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [tabLoading, setTabLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [apiError, setApiError] = useState(null);

  const [roleFilter, setRoleFilter] = useState("all");
  const [verifiedFilter, setVerifiedFilter] = useState("all");

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const [adminResources, setAdminResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [resourceSearchQuery, setResourceSearchQuery] = useState("");
  const [resourceStatusFilter, setResourceStatusFilter] = useState("all");

  const fetchAdminResources = async () => {
    try {
      setLoadingResources(true);
      const res = await getAllResourcesAdmin();
      if (res && res.success) {
        setAdminResources(res.resources || []);
      }
    } catch (err) {
      console.error("Fetch admin resources failed:", err);
      setToastMessage("Failed to retrieve platform resources.");
    } finally {
      setLoadingResources(false);
    }
  };

  const handleAdminDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this resource? This cannot be undone.")) {
      try {
        const res = await deleteResource(id);
        if (res && res.success) {
          setToastMessage("Resource deleted successfully.");
          fetchAdminResources();
        }
      } catch (err) {
        setToastMessage(err.response?.data?.message || "Failed to delete resource.");
      }
    }
  };

  const handleAdminPublish = async (id) => {
    try {
      const res = await publishResource(id);
      if (res && res.success) {
        setToastMessage("Resource published successfully.");
        fetchAdminResources();
      }
    } catch (err) {
      setToastMessage(err.response?.data?.message || "Failed to publish resource.");
    }
  };

  const handleAdminArchive = async (id) => {
    try {
      const res = await archiveResource(id);
      if (res && res.success) {
        setToastMessage("Resource archived successfully.");
        fetchAdminResources();
      }
    } catch (err) {
      setToastMessage(err.response?.data?.message || "Failed to archive resource.");
    }
  };

  const filteredAdminResources = adminResources.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(resourceSearchQuery.toLowerCase()) ||
      (r.createdBy?.name || "").toLowerCase().includes(resourceSearchQuery.toLowerCase());
    const matchesStatus = resourceStatusFilter === "all" || r.status === resourceStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await getAllUsers();
      if (res && res.success) {
        setUsers(res.users);
      }
    } catch (err) {
      console.error("Fetch users failed:", err);
      setApiError("Failed to fetch platform users.");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      if (activeTab === "users") {
        fetchUsers();
      } else if (activeTab === "content") {
        fetchAdminResources();
      }
    }
  }, [user, activeTab]);

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

  const handleTabChange = (tab) => {
    setTabLoading(true);
    setActiveTab(tab);
    setApiError(null);
    setTimeout(() => {
      setTabLoading(false);
    }, 350);
    if (location.pathname !== "/") {
      navigate("/");
    }
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
      { id: "dashboard", label: "Dashboard", icon: Layers, activeColor: "bg-accent-blue" },
      { id: "explore", label: "Explore Courses", icon: BookOpen, activeColor: "bg-accent-purple" },
      { id: "resources", label: "Explore Resources", icon: Compass, activeColor: "bg-accent-cyan" },
      { id: "my-learning", label: "My Learning", icon: BookOpen, activeColor: "bg-accent-purple" }
    ],
    creator: [
      { id: "dashboard", label: "Dashboard", icon: Layers, activeColor: "bg-accent-blue" },
      { id: "create-content", label: "Create Content", icon: PlusCircle, activeColor: "bg-accent-purple" },
      { id: "resources", label: "Explore Resources", icon: Compass, activeColor: "bg-accent-cyan" },
      { id: "my-resources", label: "My Resources", icon: FileText, activeColor: "bg-accent-purple" },
      { id: "analytics", label: "Creator Analytics", icon: TrendingUp, activeColor: "bg-accent-magenta" }
    ],
    expert: [
      { id: "dashboard", label: "Dashboard", icon: Layers, activeColor: "bg-accent-blue" },
      { id: "resources", label: "Explore Resources", icon: Compass, activeColor: "bg-accent-cyan" },
      { id: "my-resources", label: "My Resources", icon: FileText, activeColor: "bg-accent-purple" },
      { id: "availability", label: "Availability Scheduler", icon: Clock, activeColor: "bg-accent-orange" },
      { id: "consultations", label: "Consultations", icon: Calendar, activeColor: "bg-accent-amber" }
    ],
    admin: [
      { id: "dashboard", label: "Dashboard", icon: Layers, activeColor: "bg-accent-blue" },
      { id: "users", label: "Users", icon: Users, activeColor: "bg-accent-emerald" },
      { id: "courses", label: "Courses", icon: BookOpen, activeColor: "bg-accent-purple" },
      { id: "content", label: "Content Management", icon: FileText, activeColor: "bg-accent-cyan" },
      { id: "analytics", label: "Reports / Analytics", icon: BarChart3, activeColor: "bg-accent-magenta" },
      { id: "moderation", label: "Activity / Moderation", icon: Shield, activeColor: "bg-accent-orange" },
      { id: "settings", label: "Settings", icon: Settings, activeColor: "bg-accent-teal" }
    ]
  };

  const navItems = roleNavigations[user?.role || "learner"] || [];

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesVerified =
      verifiedFilter === "all" ||
      (verifiedFilter === "verified" && u.isVerified) ||
      (verifiedFilter === "unverified" && !u.isVerified);
    return matchesSearch && matchesRole && matchesVerified;
  });

  const statLearners = users.filter((u) => u.role === "learner").length;
  const statCreators = users.filter((u) => u.role === "creator").length;
  const statExperts = users.filter((u) => u.role === "expert").length;
  const statAdmins = users.filter((u) => u.role === "admin").length;
  const statVerified = users.filter((u) => u.isVerified).length;
  const verificationRate = users.length ? Math.round((statVerified / users.length) * 100) : 0;

  const SkeletonLoader = () => (
    <div className="space-y-6 animate-pulse text-left">
      <div className="border-b border-glass-border/40 pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-glass-border rounded-lg"></div>
          <div className="h-4.5 w-64 bg-glass-border rounded-lg"></div>
        </div>
        <div className="h-10 w-44 bg-glass-border rounded-xl"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="h-44 bg-glass-border rounded-2xl"></div>
          <div className="h-32 bg-glass-border rounded-2xl"></div>
        </div>
        <div className="lg:col-span-4 space-y-6">
          <div className="h-40 bg-glass-border rounded-2xl"></div>
          <div className="h-36 bg-glass-border rounded-2xl"></div>
        </div>
      </div>
    </div>
  );

  if (user?.role === "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#eee9ff] via-[#e7edff] to-[#f1eaff] dark:from-[#070817] dark:via-[#070817] dark:to-[#0B0B1F] text-text-main flex flex-col font-sans select-none relative pt-16">
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none z-0"></div>
        <div className="glow-orb w-[600px] h-[600px] bg-accent-emerald/5 top-[-100px] left-[-100px]"></div>
        <div className="glow-orb w-[500px] h-[500px] bg-accent-cyan/5 bottom-[-100px] right-[-100px]"></div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 glass-surface border-accent-emerald/30 bg-bg-darker/95 px-5 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-300">
            <Info className="text-accent-emerald shrink-0 animate-pulse" size={18} />
            <p className="text-xs font-semibold text-text-title">{toastMessage}</p>
          </div>
        )}

        {/* HEADER BAR */}
        <header className="fixed top-0 left-0 right-0 h-16 border-b border-glass-border bg-bg-deep/75 backdrop-blur-xl z-40 flex items-center justify-between px-6">
          <Link to="/" onClick={() => handleTabChange("dashboard")} className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-text-title select-none shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-accent p-[1px] shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <div className="flex h-full w-full items-center justify-center rounded-xl bg-bg-deep">
                <Shield size={14} className="text-accent-emerald" />
              </div>
            </div>
            <span className="font-extrabold tracking-widest text-text-title text-sm">CKM ADMIN</span>
            <span className="text-[9px] border rounded px-1.5 py-0.2 uppercase font-bold tracking-widest bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20">
              Control Panel
            </span>
          </Link>

          <div className="flex items-center space-x-3 shrink-0">
            <button onClick={toggleTheme} className="p-2.5 rounded-xl border border-glass-border hover:bg-glass-border hover:text-text-title text-text-muted transition duration-200 cursor-pointer active:scale-95 flex items-center justify-center">
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="flex items-center gap-2 rounded-xl border border-glass-border bg-glass-card hover:bg-glass-border py-1.5 px-2.5 transition duration-200 active:scale-95 cursor-pointer">
                <div className="h-6 w-6 rounded-lg bg-gradient-accent p-[1px] shrink-0">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} className="h-full w-full rounded-lg object-cover" />
                  ) : (
                    <div className="h-full w-full rounded-lg flex items-center justify-center font-extrabold text-white text-[10px] uppercase bg-gradient-to-br from-accent-emerald to-accent-cyan">
                      {user?.name ? user.name[0] : <UserIcon size={10} />}
                    </div>
                  )}
                </div>
                <ChevronDown size={12} className="text-text-muted" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-3.5 w-48 rounded-2xl border border-glass-border bg-bg-panel p-2.5 shadow-2xl z-50 flex flex-col">
                  <div className="px-3.5 py-2 border-b border-glass-border/30 mb-2">
                    <h4 className="text-xs font-bold text-text-title truncate">{user?.name || "Admin"}</h4>
                    <p className="text-[9px] text-text-muted uppercase mt-0.5">{user?.role || "admin"}</p>
                  </div>
                  
                  <Link to="/profile" onClick={() => setProfileDropdownOpen(false)} className="group flex items-center gap-2 px-3.5 py-2 text-xs text-text-main hover:text-text-title hover:bg-glass-border rounded-lg border border-transparent transition duration-150">
                    <UserIcon size={12} />
                    My Admin Profile
                  </Link>
                  
                  <Link to="/resources/new" onClick={() => setProfileDropdownOpen(false)} className="group flex items-center gap-2 px-3.5 py-2 text-xs text-text-main hover:text-text-title hover:bg-glass-border rounded-lg border border-transparent transition duration-150">
                    <PlusCircle size={12} className="text-accent-purple" />
                    Create Resource
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

        {/* SIDEBAR CONTAINER LAYOUT */}
        <div className="flex-grow flex z-10 relative min-h-[calc(100vh-4rem)]">
          {/* Sidebar */}
          <aside className="w-64 border-r border-violet-950/20 bg-gradient-to-b from-[#1E114A] to-[#0F072D] text-purple-200/90 hidden md:flex flex-col p-4 space-y-2 shrink-0">
            <div className="px-3 py-2 text-[10px] font-extrabold text-purple-300/40 uppercase tracking-widest border-b border-purple-950/40 mb-2">
              Navigation
            </div>
            <nav className="flex-col space-y-1.5 flex-grow">
              {roleNavigations.admin.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id && location.pathname === "/";
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`flex w-full items-center gap-3 px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer active:scale-95 text-left ${
                      isActive
                        ? "bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-lg shadow-purple-900/30"
                        : "text-purple-200/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon size={14} className="shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-purple-950/40">
              <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4.5 py-2.5 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition duration-150 cursor-pointer">
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>

          {/* Main Panel Content Area */}
          <main className="flex-grow p-6 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
            {location.pathname !== "/" ? (
              <Outlet />
            ) : tabLoading ? (
              <SkeletonLoader />
            ) : (
              <>
                {/* ADMIN: DASHBOARD TAB */}
                {activeTab === "dashboard" && (
                  <div className="space-y-6 text-left">
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-glass-border/40 pb-5 gap-4">
                      <div>
                        <h1 className="hero-heading text-2xl sm:text-3xl font-extrabold text-text-title">
                          System Administration
                        </h1>
                        <p className="text-xs text-text-muted font-semibold mt-1">
                          Welcome, Admin. All micro-services and server databases are currently online.
                        </p>
                      </div>
                      <Button onClick={fetchUsers} className="text-xs py-2 px-4 bg-accent-emerald hover:bg-accent-teal">
                        Refresh Diagnostics
                      </Button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                      {/* Total Users (purple) */}
                      <SpotlightCard className="p-5 card-tint-purple text-left border border-accent-purple/10" glowColor="rgba(168, 85, 247, 0.12)">
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-accent-purple animate-pulse" />
                          <div className="text-[9px] font-extrabold text-text-muted uppercase tracking-wider">Total Users</div>
                        </div>
                        <div className="text-2xl font-extrabold text-accent-purple mt-1.5">{users.length}</div>
                        <p className="text-[9px] text-text-muted mt-1 font-semibold">Database accounts</p>
                      </SpotlightCard>
                      
                      {/* Learners (blue) */}
                      <SpotlightCard className="p-5 card-tint-blue text-left border border-accent-blue/10" glowColor="rgba(59, 130, 246, 0.12)">
                        <div className="flex items-center gap-2">
                          <BookOpen size={14} className="text-accent-blue" />
                          <div className="text-[9px] font-extrabold text-text-muted uppercase tracking-wider">Learners</div>
                        </div>
                        <div className="text-2xl font-extrabold text-accent-blue mt-1.5">{statLearners}</div>
                        <p className="text-[9px] text-text-muted mt-1 font-semibold">Active students</p>
                      </SpotlightCard>

                      {/* Creators (green) */}
                      <SpotlightCard className="p-5 card-tint-mint text-left border border-accent-emerald/10" glowColor="rgba(16, 185, 129, 0.12)">
                        <div className="flex items-center gap-2">
                          <TrendingUp size={14} className="text-accent-emerald" />
                          <div className="text-[9px] font-extrabold text-text-muted uppercase tracking-wider">Creators</div>
                        </div>
                        <div className="text-2xl font-extrabold text-accent-emerald mt-1.5">{statCreators}</div>
                        <p className="text-[9px] text-text-muted mt-1 font-semibold">Publishing guides</p>
                      </SpotlightCard>

                      {/* Experts (pink) */}
                      <SpotlightCard className="p-5 card-tint-pink text-left border border-accent-pink/10" glowColor="rgba(236, 72, 153, 0.12)">
                        <div className="flex items-center gap-2">
                          <Briefcase size={14} className="text-accent-pink" />
                          <div className="text-[9px] font-extrabold text-text-muted uppercase tracking-wider">Experts</div>
                        </div>
                        <div className="text-2xl font-extrabold text-accent-pink mt-1.5">{statExperts}</div>
                        <p className="text-[9px] text-text-muted mt-1 font-semibold">Vetted specialists</p>
                      </SpotlightCard>

                      {/* Verification Rate (amber) */}
                      <SpotlightCard className="p-5 card-tint-peach text-left border border-accent-orange/10" glowColor="rgba(249, 115, 22, 0.12)">
                        <div className="flex items-center gap-2">
                          <UserCheck size={14} className="text-accent-orange" />
                          <div className="text-[9px] font-extrabold text-text-muted uppercase tracking-wider">Verification</div>
                        </div>
                        <div className="text-2xl font-extrabold text-accent-orange mt-1.5">{verificationRate}%</div>
                        <p className="text-[9px] text-text-muted mt-1 font-semibold">{statVerified} verified profiles</p>
                      </SpotlightCard>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left: Quick Actions & Log Diagnostics */}
                      <div className="lg:col-span-8 space-y-6">
                        <SpotlightCard className="p-6 bg-glass-card border border-glass-border rounded-2xl" glowColor="rgba(16, 185, 129, 0.06)">
                          <h3 className="text-[10px] font-bold text-text-title uppercase tracking-widest border-b border-glass-border/30 pb-3 mb-4">
                            Platform Diagnostics Log
                          </h3>
                          <div className="font-mono text-[10px] text-text-muted space-y-2 max-h-60 overflow-y-auto">
                            <p className="text-accent-emerald">[2026-08-24 16:15:38] INFO: Database authentication checks completed. MongoDB Atlas connected successfully.</p>
                            <p className="text-accent-cyan">[2026-08-24 16:16:01] SUCCESS: API server listening on PORT 5000 in development mode.</p>
                            <p>[2026-08-24 16:16:30] SYSTEM: CORS headers injected for trusted origin VITE_API_URL client.</p>
                            <p>[2026-08-24 16:17:15] CRON: Auto-backup databases executed successfully. Output file uploaded to AWS S3 storage.</p>
                            <p className="text-accent-orange">[2026-08-24 16:18:02] WARN: Memory usage peaking at 74% during full database user records fetch.</p>
                          </div>
                        </SpotlightCard>
                      </div>

                      {/* Right: Server details */}
                      <div className="lg:col-span-4 space-y-6">
                        <SpotlightCard className="p-6 bg-glass-card border border-glass-border rounded-2xl" glowColor="rgba(16, 185, 129, 0.04)">
                          <h3 className="text-[10px] font-bold text-text-title uppercase tracking-widest border-b border-glass-border/30 pb-3 mb-4">
                            Server Health
                          </h3>
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px]">
                                <span className="font-bold text-text-muted uppercase">CPU Usage</span>
                                <span className="text-accent-emerald font-bold">12%</span>
                              </div>
                              <div className="h-1.5 bg-bg-dark rounded-full overflow-hidden">
                                <div className="h-full bg-accent-emerald rounded-full" style={{ width: "12%" }}></div>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px]">
                                <span className="font-bold text-text-muted uppercase">RAM Utilization</span>
                                <span className="text-accent-cyan font-bold">74%</span>
                              </div>
                              <div className="h-1.5 bg-bg-dark rounded-full overflow-hidden">
                                <div className="h-full bg-accent-cyan rounded-full" style={{ width: "74%" }}></div>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px]">
                                <span className="font-bold text-text-muted uppercase">Storage Capacity</span>
                                <span className="text-accent-purple font-bold">4.2 GB / 20 GB</span>
                              </div>
                              <div className="h-1.5 bg-bg-dark rounded-full overflow-hidden">
                                <div className="h-full bg-accent-purple rounded-full" style={{ width: "21%" }}></div>
                              </div>
                            </div>
                          </div>
                        </SpotlightCard>
                      </div>
                    </div>
                  </div>
                )}

                {/* ADMIN: USERS TAB */}
                {activeTab === "users" && (
                  <UserManagement
                    users={users}
                    loadingUsers={loadingUsers}
                    fetchUsers={fetchUsers}
                  />
                )}

                {/* ADMIN: COURSES TAB */}
                {activeTab === "courses" && (
                  <div className="space-y-6 text-left">
                    <div className="border-b border-glass-border/40 pb-5">
                      <h1 className="text-2xl font-extrabold text-text-title">Platform Course Catalog</h1>
                      <p className="text-xs text-text-muted font-semibold mt-1">Review active courses, handle flags, and track enrollment metrics.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SpotlightCard className="p-6 bg-glass-card border border-glass-border" glowColor="rgba(168, 85, 247, 0.06)">
                        <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Active Curriculum Modules</div>
                        <div className="text-2xl font-extrabold text-text-title mt-2">0 Courses</div>
                      </SpotlightCard>
                      <SpotlightCard className="p-6 bg-glass-card border border-glass-border" glowColor="rgba(168, 85, 247, 0.06)">
                        <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Total Enrolled Learners</div>
                        <div className="text-2xl font-extrabold text-text-title mt-2">0 students</div>
                      </SpotlightCard>
                    </div>

                    <SpotlightCard className="p-12 bg-glass-card border border-glass-border text-center rounded-2xl" glowColor="rgba(168, 85, 247, 0.08)">
                      <BookOpen size={28} className="text-text-muted mx-auto mb-3" />
                      <h3 className="text-md font-bold text-text-title">No courses created yet</h3>
                      <p className="text-xs text-text-muted max-w-sm mx-auto mt-1">
                        Once creators publish interactive modules or developer kits, they will be listed here for approval and global catalog listing.
                      </p>
                    </SpotlightCard>
                  </div>
                )}

                {/* ADMIN: CONTENT TAB */}
                {activeTab === "content" && (
                  <div className="space-y-6 text-left">
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-glass-border/40 pb-5 gap-4">
                      <div>
                        <h1 className="text-2xl font-extrabold text-text-title flex items-center gap-2">
                          <FileText className="text-accent-cyan" size={24} /> Content & Guide Management
                        </h1>
                        <p className="text-xs text-text-muted font-semibold mt-1">
                          Review, publish, archive, or moderate all resource configurations uploaded across the platform.
                        </p>
                      </div>
                      <Button onClick={() => navigate("/resources/new")} className="text-xs py-2 px-4 shadow-lg flex items-center gap-2">
                        <PlusCircle size={14} /> Create Resource
                      </Button>
                    </div>

                    {/* Filter and Search controls */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-bg-darker border border-glass-border p-4 rounded-2xl">
                      <div className="md:col-span-8 relative">
                        <input
                          type="text"
                          placeholder="Search resources by title, creator..."
                          value={resourceSearchQuery}
                          onChange={(e) => setResourceSearchQuery(e.target.value)}
                          className="w-full form-input text-xs rounded-xl pl-9 pr-4 py-2.5"
                        />
                        <Search size={14} className="absolute left-3 top-3.5 text-text-muted" />
                      </div>
                      <div className="md:col-span-4 text-xs">
                        <select
                          value={resourceStatusFilter}
                          onChange={(e) => setResourceStatusFilter(e.target.value)}
                          className="w-full form-input rounded-xl p-2.5 bg-bg-dark cursor-pointer text-text-title border-glass-border"
                        >
                          <option value="all">All Statuses</option>
                          <option value="draft">Drafts</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                    </div>

                    {/* Resources list table */}
                    <SpotlightCard className="p-0 bg-glass-card border border-glass-border rounded-2xl overflow-hidden" glowColor="rgba(6, 182, 212, 0.05)">
                      {loadingResources ? (
                        <div className="text-center py-20 text-xs text-text-muted flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-accent-cyan"></div>
                          Loading resource catalog...
                        </div>
                      ) : filteredAdminResources.length === 0 ? (
                        <div className="text-center py-20 text-xs text-text-muted">
                          No resource packages found matching criteria.
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse text-xs text-left">
                            <thead>
                              <tr className="border-b border-glass-border bg-bg-darker/60 font-bold uppercase text-[10px] tracking-wider text-text-muted">
                                <th className="px-6 py-4">Resource</th>
                                <th className="px-6 py-4">Creator</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Contents</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-glass-border/30">
                              {filteredAdminResources.map((item) => (
                                <tr key={item._id} className="hover:bg-accent-cyan/5 dark:hover:bg-glass-border/20 transition duration-150">
                                  <td className="px-6 py-4">
                                    <h4 className="font-bold text-text-title leading-tight">{item.title}</h4>
                                    <p className="text-[10px] text-accent-cyan mt-1 font-semibold">{item.category?.name || "Uncategorized"}</p>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className="font-semibold text-text-main">{item.createdBy?.name || "System"}</span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className={`text-[9px] border px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                                      item.status === "published" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                      item.status === "archived" ? "bg-slate-500/10 text-slate-400 border-slate-500/20" :
                                      "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                    }`}>
                                      {item.status}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-text-muted space-y-0.5">
                                    <div>📄 {item.documents?.length || 0} Docs</div>
                                    <div>🔗 {item.links?.length || 0} Links</div>
                                  </td>
                                  <td className="px-6 py-4 text-right space-x-2 shrink-0">
                                    <button onClick={() => navigate(`/resources/${item._id}`)} className="text-[10px] border border-glass-border hover:bg-glass-border hover:text-text-title px-2.5 py-1 rounded-md font-bold uppercase tracking-wider transition cursor-pointer active:scale-95">
                                      View
                                    </button>
                                    <button onClick={() => navigate(`/resources/edit/${item._id}`)} className="text-[10px] border border-accent-blue/20 bg-accent-blue/5 text-accent-blue hover:bg-accent-blue hover:text-white px-2.5 py-1 rounded-md font-bold uppercase tracking-wider transition cursor-pointer active:scale-95">
                                      Edit
                                    </button>
                                    {item.status !== "published" && (
                                      <button onClick={() => handleAdminPublish(item._id)} className="text-[10px] border border-emerald-500/25 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500 hover:text-white px-2.5 py-1 rounded-md font-bold uppercase tracking-wider transition cursor-pointer active:scale-95">
                                        Publish
                                      </button>
                                    )}
                                    {item.status !== "archived" && (
                                      <button onClick={() => handleAdminArchive(item._id)} className="text-[10px] border border-amber-500/25 bg-amber-500/5 text-amber-400 hover:bg-amber-500 hover:text-white px-2.5 py-1 rounded-md font-bold uppercase tracking-wider transition cursor-pointer active:scale-95">
                                        Archive
                                      </button>
                                    )}
                                    <button onClick={() => handleAdminDelete(item._id)} className="text-[10px] border border-rose-500/25 bg-rose-500/5 text-rose-400 hover:bg-rose-500 hover:text-white px-2.5 py-1 rounded-md font-bold uppercase tracking-wider transition cursor-pointer active:scale-95">
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </SpotlightCard>
                  </div>
                )}

                {/* ADMIN: ANALYTICS TAB */}
                {activeTab === "analytics" && (
                  <div className="space-y-6 text-left">
                    <div className="border-b border-glass-border/40 pb-5">
                      <h1 className="text-2xl font-extrabold text-text-title">Analytics and Reports</h1>
                      <p className="text-xs text-text-muted font-semibold mt-1">Analyze system visits, registration trends, and transaction history.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <SpotlightCard className="p-5 bg-glass-card border border-glass-border text-center" glowColor="rgba(217, 70, 239, 0.06)">
                        <div className="text-[10px] font-bold text-text-muted uppercase">Monthly Active Users</div>
                        <div className="text-xl font-extrabold text-text-title mt-1">0 MAU</div>
                      </SpotlightCard>
                      <SpotlightCard className="p-5 bg-glass-card border border-glass-border text-center" glowColor="rgba(217, 70, 239, 0.06)">
                        <div className="text-[10px] font-bold text-text-muted uppercase">Platform Pageviews</div>
                        <div className="text-xl font-extrabold text-text-title mt-1">0 views</div>
                      </SpotlightCard>
                      <SpotlightCard className="p-5 bg-glass-card border border-glass-border text-center" glowColor="rgba(217, 70, 239, 0.06)">
                        <div className="text-[10px] font-bold text-text-muted uppercase">API Call Volume</div>
                        <div className="text-xl font-extrabold text-accent-cyan mt-1">0 requests</div>
                      </SpotlightCard>
                    </div>

                    <SpotlightCard className="p-12 bg-glass-card border border-glass-border text-center rounded-2xl" glowColor="rgba(217, 70, 239, 0.08)">
                      <BarChart3 size={28} className="text-text-muted mx-auto mb-3" />
                      <h3 className="text-md font-bold text-text-title">Data modeling in progress</h3>
                      <p className="text-xs text-text-muted max-w-sm mx-auto mt-1">
                        System analytics pipelines are mapping database statistics. Real-time trend visual graphs will update in the next database synchronization.
                      </p>
                    </SpotlightCard>
                  </div>
                )}

                {/* ADMIN: MODERATION TAB */}
                {activeTab === "moderation" && (
                  <div className="space-y-6 text-left">
                    <div className="border-b border-glass-border/40 pb-5">
                      <h1 className="text-2xl font-extrabold text-text-title">Moderation Queue</h1>
                      <p className="text-xs text-text-muted font-semibold mt-1">Review flagged comments, course reviews, and user dispute requests.</p>
                    </div>

                    <SpotlightCard className="p-12 bg-glass-card border border-glass-border text-center rounded-2xl" glowColor="rgba(249, 115, 22, 0.08)">
                      <Shield size={28} className="text-text-muted mx-auto mb-3" />
                      <h3 className="text-md font-bold text-text-title">Moderation queue is clean</h3>
                      <p className="text-xs text-text-muted max-w-sm mx-auto mt-1">
                        Congratulations! There are no flagged user comments, reports, or content moderation files awaiting admin response.
                      </p>
                    </SpotlightCard>
                  </div>
                )}

                {/* ADMIN: SETTINGS TAB */}
                {activeTab === "settings" && (
                  <div className="space-y-6 text-left">
                    <div className="border-b border-glass-border/40 pb-5">
                      <h1 className="text-2xl font-extrabold text-text-title">System Settings</h1>
                      <p className="text-xs text-text-muted font-semibold mt-1">Adjust platform features, toggle authentication gates, and review environment configs.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <SpotlightCard className="p-6 bg-glass-card border border-glass-border rounded-2xl" glowColor="rgba(20, 184, 166, 0.05)">
                        <h3 className="text-xs font-bold text-text-title uppercase tracking-widest border-b border-glass-border/30 pb-3 mb-4">
                          Security Gateways
                        </h3>
                        <div className="space-y-3 text-xs text-text-muted">
                          <label className="flex items-center justify-between cursor-pointer">
                            <span>Require Email Verification</span>
                            <input type="checkbox" defaultChecked className="h-4 w-4 bg-bg-dark border-glass-border rounded accent-accent-emerald" />
                          </label>
                          <label className="flex items-center justify-between cursor-pointer">
                            <span>Strict Route Authentication</span>
                            <input type="checkbox" defaultChecked className="h-4 w-4 bg-bg-dark border-glass-border rounded accent-accent-emerald" />
                          </label>
                          <label className="flex items-center justify-between cursor-pointer">
                            <span>Enable CORS Security Filters</span>
                            <input type="checkbox" defaultChecked className="h-4 w-4 bg-bg-dark border-glass-border rounded accent-accent-emerald" />
                          </label>
                        </div>
                      </SpotlightCard>

                      <SpotlightCard className="p-6 bg-glass-card border border-glass-border rounded-2xl" glowColor="rgba(20, 184, 166, 0.05)">
                        <h3 className="text-xs font-bold text-text-title uppercase tracking-widest border-b border-glass-border/30 pb-3 mb-4">
                          Application Context
                        </h3>
                        <div className="space-y-2.5 text-[10px] font-mono text-text-muted">
                          <div>
                            <span className="text-text-title uppercase">Environment:</span> DEVELOPMENT
                          </div>
                          <div>
                            <span className="text-text-title uppercase">API Base:</span> http://localhost:5000/api
                          </div>
                          <div>
                            <span className="text-text-title uppercase">Socket WS:</span> ws://localhost:5000
                          </div>
                          <div>
                            <span className="text-text-title uppercase">Server Time:</span> {new Date().toLocaleTimeString()}
                          </div>
                        </div>
                      </SpotlightCard>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eee9ff] via-[#e7edff] to-[#f1eaff] dark:from-[#070817] dark:via-[#070817] dark:to-[#0B0B1F] text-text-main flex flex-col font-sans select-none relative pt-16">
      <div className="absolute inset-0 dot-grid opacity-35 pointer-events-none z-0"></div>
      <div className="glow-orb w-[500px] h-[500px] bg-accent-blue/5 top-[-100px] left-[-100px]"></div>
      <div className="glow-orb w-[500px] h-[500px] bg-accent-purple/5 bottom-[-100px] right-[-100px]"></div>

      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 glass-surface border-accent-blue/30 bg-bg-darker/95 px-5 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-300">
          <Info className="text-accent-blue shrink-0 animate-pulse" size={18} />
          <p className="text-xs font-semibold text-text-title">{toastMessage}</p>
        </div>
      )}

      {/* HEADER BAR */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-glass-border bg-bg-deep/75 backdrop-blur-xl z-40 flex items-center justify-between px-6">
        
        {/* Brand */}
        <Link to="/" onClick={() => handleTabChange("dashboard")} className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-text-title select-none shrink-0">
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

        {/* Global Tab Navigation (Role-specific) */}
        <nav className="hidden md:flex items-center bg-bg-darker border border-glass-border rounded-xl p-1 gap-1">
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id && location.pathname === "/";
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`group/tab flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer active:scale-95 ${
                  isActive
                    ? "bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-md shadow-purple-950/10"
                    : "text-text-muted hover:text-text-title hover:bg-glass-border"
                }`}
              >
                <Icon size={13} className="transition-transform group-hover/tab:scale-110 duration-200" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-3 shrink-0">
          {/* Theme switcher */}
          <button onClick={toggleTheme} className="p-2.5 rounded-xl border border-glass-border hover:bg-glass-border hover:text-text-title text-text-muted transition duration-200 cursor-pointer active:scale-95 flex items-center justify-center">
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* Notifications Panel */}
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
                  <div className={`h-full w-full rounded-lg flex items-center justify-center font-extrabold text-white text-[10px] uppercase bg-gradient-to-br ${
                    user?.role === "creator" ? "from-accent-purple to-accent-magenta" :
                    user?.role === "expert" ? "from-accent-orange to-accent-amber" :
                    "from-accent-blue to-accent-indigo"
                  }`}>
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

      {/* WORKSPACE CONTENT CONTAINER */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-6 z-10 relative">
        {apiError && (
          <div className="mb-6 flex flex-col items-center justify-center p-6 border border-rose-500/20 bg-rose-500/5 rounded-2xl text-center max-w-md mx-auto">
            <AlertCircle className="text-rose-400 mb-2" size={24} />
            <h4 className="text-sm font-bold text-text-title">Unable to load your dashboard</h4>
            <p className="text-xs text-text-muted mt-1 mb-4">{apiError}</p>
            <Button onClick={() => handleTabChange(activeTab)} className="text-xs py-2 px-4">
              Try Again
            </Button>
          </div>
        )}

        {!apiError && (location.pathname !== "/" ? (
          <Outlet />
        ) : tabLoading ? (
          <SkeletonLoader />
        ) : (
          <>
            {/* WORKSPACE: DASHBOARD TAB */}
            {activeTab === "dashboard" && (
              <div className="space-y-6 text-left">
                {/* Greeting banner */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-glass-border/40 pb-5">
                  <div>
                    <h1 className="hero-heading text-2xl sm:text-3xl font-extrabold text-text-title">
                      Good day, {user?.name || "Member"}
                    </h1>
                    <p className="text-xs text-text-muted font-semibold mt-1">
                      Welcome to your personalized CKM workspace.
                    </p>
                  </div>
                </div>

                {/* ROLE-AWARE DASHBOARD VIEWS */}
                {user?.role === "learner" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-8 space-y-6">
                      <SpotlightCard className="p-6 card-tint-blue rounded-2xl" glowColor="rgba(59, 130, 246, 0.12)">
                        <div className="flex flex-col sm:flex-row items-center gap-6 justify-between text-center sm:text-left">
                          <div className="space-y-2 flex-grow">
                            <div className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-600 border border-blue-500/20 px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                              Learning
                            </div>
                            <h3 className="text-sm font-extrabold text-text-title leading-snug">
                              No active courses yet
                            </h3>
                            <p className="text-xs text-text-muted">
                              Your learning journey starts here. Enroll in developer masterclasses to acquire verified skills.
                            </p>
                          </div>
                          <div className="shrink-0 border-t sm:border-t-0 sm:border-l border-glass-border/30 pt-4 sm:pt-0 sm:pl-6 w-full sm:w-auto flex justify-center">
                            <Button onClick={() => handleTabChange("explore")} className="text-xs py-2.5 px-5">
                              Explore Courses
                            </Button>
                          </div>
                        </div>
                      </SpotlightCard>

                      <SpotlightCard className="p-6 card-tint-purple rounded-2xl" glowColor="rgba(124, 58, 237, 0.12)">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between pb-3 border-b border-glass-border/30">
                            <h3 className="text-[10px] font-bold text-text-title uppercase tracking-widest">Saved Resources</h3>
                            <span className="text-[10px] text-text-muted">0 items</span>
                          </div>
                          <div className="py-8 text-center space-y-3">
                            <Bookmark size={20} className="text-accent-purple mx-auto animate-pulse" />
                            <p className="text-xs text-text-muted max-w-xs mx-auto">
                              Save deployment checklists, configuration files, and references you want to revisit later.
                            </p>
                          </div>
                        </div>
                      </SpotlightCard>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                      <SpotlightCard className="p-5 card-tint-peach rounded-2xl" glowColor="rgba(249, 115, 22, 0.12)">
                        <div className="flex items-center justify-between pb-3 border-b border-glass-border/40 mb-4">
                          <h3 className="text-[10px] font-bold text-text-title uppercase tracking-widest">Mentorship Calls</h3>
                        </div>
                        <div className="py-6 text-center space-y-3">
                          <Calendar size={18} className="text-accent-orange mx-auto" />
                          <p className="text-xs text-text-muted">
                            No upcoming mentorship sessions. Reach out to expert schedulers for technical advice.
                          </p>
                        </div>
                      </SpotlightCard>
                    </div>
                  </div>
                )}

                {user?.role === "creator" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <SpotlightCard className="p-5 card-tint-mint text-center" glowColor="rgba(16, 185, 129, 0.12)">
                        <div className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Total Revenue</div>
                        <div className="text-lg font-extrabold text-accent-emerald mt-1">$0.00</div>
                      </SpotlightCard>
                      <SpotlightCard className="p-5 card-tint-blue text-center" glowColor="rgba(59, 130, 246, 0.12)">
                        <div className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Sales volume</div>
                        <div className="text-lg font-extrabold text-accent-blue mt-1">0 units</div>
                      </SpotlightCard>
                      <SpotlightCard className="p-5 card-tint-pink text-center" glowColor="rgba(236, 72, 153, 0.12)">
                        <div className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Ratings</div>
                        <div className="text-lg font-extrabold text-accent-pink mt-1">No ratings yet</div>
                      </SpotlightCard>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <div className="lg:col-span-8">
                        <SpotlightCard className="p-6 card-tint-purple rounded-2xl" glowColor="rgba(124, 58, 237, 0.12)">
                          <div className="flex items-center justify-between pb-3 border-b border-glass-border/30 mb-4">
                            <h3 className="text-[10px] font-bold text-text-title uppercase tracking-widest">Published Resources</h3>
                            <button onClick={() => handleTabChange("create-content")} className="text-[10px] font-bold text-accent-purple flex items-center gap-1 cursor-pointer">
                              Upload Guide <PlusCircle size={12} />
                            </button>
                          </div>
                          <div className="py-12 text-center space-y-2">
                            <FileText size={20} className="text-accent-purple mx-auto" />
                            <p className="text-xs text-text-muted">You haven't uploaded or published any guides or scripts yet.</p>
                          </div>
                        </SpotlightCard>
                      </div>
                      
                      <div className="lg:col-span-4">
                        <SpotlightCard className="p-6 card-tint-peach rounded-2xl" glowColor="rgba(249, 115, 22, 0.12)">
                          <div className="flex items-center justify-between pb-3 border-b border-glass-border/30 mb-4">
                            <h3 className="text-[10px] font-bold text-text-title uppercase tracking-widest">Draft templates</h3>
                          </div>
                          <p className="text-xs text-text-muted text-center py-6">No drafts saved.</p>
                        </SpotlightCard>
                      </div>
                    </div>
                  </div>
                )}

                {user?.role === "expert" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <SpotlightCard className="p-5 card-tint-blue text-center" glowColor="rgba(59, 130, 246, 0.12)">
                        <div className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Completed sessions</div>
                        <div className="text-lg font-extrabold text-accent-blue mt-1">0 calls</div>
                      </SpotlightCard>
                      <SpotlightCard className="p-5 card-tint-mint text-center" glowColor="rgba(16, 185, 129, 0.12)">
                        <div className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Mentorship Revenue</div>
                        <div className="text-lg font-extrabold text-accent-emerald mt-1">$0.00</div>
                      </SpotlightCard>
                      <SpotlightCard className="p-5 card-tint-pink text-center" glowColor="rgba(236, 72, 153, 0.12)">
                        <div className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Expert score</div>
                        <div className="text-lg font-extrabold text-accent-pink mt-1">No reviews yet</div>
                      </SpotlightCard>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <div className="lg:col-span-8">
                        <SpotlightCard className="p-6 card-tint-purple rounded-2xl" glowColor="rgba(124, 58, 237, 0.12)">
                          <div className="flex items-center justify-between pb-3 border-b border-glass-border/30 mb-4">
                            <h3 className="text-[10px] font-bold text-text-title uppercase tracking-widest">Availability scheduler</h3>
                            <button onClick={() => setToastMessage("Availability configuration setting is launching in the next phase!")} className="text-[10px] font-bold text-accent-orange flex items-center gap-1 cursor-pointer">
                              Add Hour Slot <PlusCircle size={12} />
                            </button>
                          </div>
                          <div className="py-12 text-center space-y-2">
                            <Clock size={20} className="text-accent-orange mx-auto" />
                            <p className="text-xs text-text-muted">You haven't configured any available video consultation windows yet.</p>
                          </div>
                        </SpotlightCard>
                      </div>
                      
                      <div className="lg:col-span-4">
                        <SpotlightCard className="p-6 card-tint-peach rounded-2xl" glowColor="rgba(249, 115, 22, 0.12)">
                          <div className="flex items-center justify-between pb-3 border-b border-glass-border/30 mb-4">
                            <h3 className="text-[10px] font-bold text-text-title uppercase tracking-widest">Upcoming Calls</h3>
                          </div>
                          <p className="text-xs text-text-muted text-center py-6">No sessions scheduled.</p>
                        </SpotlightCard>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* WORKSPACE: EXPLORE COURSES TAB */}
            {activeTab === "explore" && (
              <div className="space-y-6 text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-glass-border/40 pb-5">
                  <div className="space-y-1">
                    <h1 className="text-2xl font-extrabold text-text-title">Explore Courses</h1>
                    <p className="text-xs text-text-muted font-semibold">Search and enroll in verified developer courses</p>
                  </div>
                  
                  <div className="relative max-w-sm w-full">
                    <input
                      type="text"
                      placeholder="Search courses, skills, masterclasses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full form-input text-xs rounded-xl pl-9 pr-4 py-2.5"
                    />
                    <Search size={14} className="absolute left-3 top-3.5 text-text-muted" />
                  </div>
                </div>

                <SpotlightCard className="p-12 bg-glass-card border border-glass-border text-center rounded-2xl" glowColor="rgba(6, 182, 212, 0.08)">
                  <Compass size={28} className="text-text-muted mx-auto mb-3" />
                  <h3 className="text-md font-bold text-text-title">No courses listed</h3>
                  <p className="text-xs text-text-muted max-w-md mx-auto mt-1">
                    Currently, no technical course pathways are published. Creators will upload complete educational curricula in the next phase.
                  </p>
                </SpotlightCard>
              </div>
            )}

            {/* WORKSPACE: MY LEARNING TAB */}
            {activeTab === "my-learning" && (
              <div className="space-y-6 text-left">
                <div className="border-b border-glass-border/40 pb-5">
                  <h1 className="text-2xl font-extrabold text-text-title">My Learning Portal</h1>
                  <p className="text-xs text-text-muted font-semibold mt-1">Track course completion, certificates, and metrics.</p>
                </div>

                <SpotlightCard className="p-12 bg-glass-card border border-glass-border text-center rounded-2xl" glowColor="rgba(168, 85, 247, 0.08)">
                  <BookOpen size={28} className="text-text-muted mx-auto mb-3" />
                  <h3 className="text-md font-bold text-text-title">Your learning catalog is empty</h3>
                  <p className="text-xs text-text-muted max-w-md mx-auto mt-1">
                    Once you enroll in masterclasses or study modules, they will appear here along with your interactive progress dials.
                  </p>
                </SpotlightCard>
              </div>
            )}

            {/* WORKSPACE: EXPLORE RESOURCES TAB */}
            {activeTab === "resources" && (
              <Resources />
            )}

            {/* WORKSPACE: MY RESOURCES TAB */}
            {activeTab === "my-resources" && (
              <MyResources />
            )}

            {/* WORKSPACE: CREATOR - CREATE CONTENT TAB */}
            {activeTab === "create-content" && (
              <CreateResource />
            )}

            {/* WORKSPACE: CREATOR - ANALYTICS TAB */}
            {activeTab === "analytics" && (
              <div className="space-y-6 text-left">
                <div className="border-b border-glass-border/40 pb-5">
                  <h1 className="text-2xl font-extrabold text-text-title">Creator Sales Analytics</h1>
                  <p className="text-xs text-text-muted font-semibold mt-1">Review payouts, purchase statistics, and rating metrics.</p>
                </div>

                <SpotlightCard className="p-12 bg-glass-card border border-glass-border text-center rounded-2xl" glowColor="rgba(219, 39, 119, 0.08)">
                  <TrendingUp size={28} className="text-text-muted mx-auto mb-3" />
                  <h3 className="text-md font-bold text-text-title">No analytics records</h3>
                  <p className="text-xs text-text-muted max-w-sm mx-auto mt-1">
                    Once users start purchase transactions for your guides, your metrics will render real-time interactive charts here.
                  </p>
                </SpotlightCard>
              </div>
            )}

            {/* WORKSPACE: EXPERT - SCHEDULER TAB */}
            {activeTab === "availability" && (
              <div className="space-y-6 text-left">
                <div className="border-b border-glass-border/40 pb-5">
                  <h1 className="text-2xl font-extrabold text-text-title">Consultation Availability</h1>
                  <p className="text-xs text-text-muted font-semibold mt-1">Set available weekday windows and review hourly pricing policies.</p>
                </div>

                <SpotlightCard className="p-6 bg-glass-card border border-glass-border rounded-2xl" glowColor="rgba(249, 115, 22, 0.05)">
                  <h3 className="text-xs font-bold text-text-title uppercase tracking-widest border-b border-glass-border/30 pb-3 mb-4">
                    Active Weekly Windows
                  </h3>
                  <div className="space-y-4 text-xs text-text-muted">
                    <div className="flex justify-between items-center py-2 border-b border-glass-border/30">
                      <span>Mondays - Fridays (09:00 AM - 05:00 PM EST)</span>
                      <span className="text-accent-emerald font-bold">ACTIVE</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-glass-border/30">
                      <span>Saturdays - Sundays (Unavailable)</span>
                      <span>INACTIVE</span>
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            )}

            {/* WORKSPACE: EXPERT - CONSULTATIONS TAB */}
            {activeTab === "consultations" && (
              <div className="space-y-6 text-left">
                <div className="border-b border-glass-border/40 pb-5">
                  <h1 className="text-2xl font-extrabold text-text-title">Mentorship Consultations</h1>
                  <p className="text-xs text-text-muted font-semibold mt-1">Track scheduled sessions, client details, and call links.</p>
                </div>

                <SpotlightCard className="p-12 bg-glass-card border border-glass-border text-center rounded-2xl" glowColor="rgba(245, 158, 11, 0.08)">
                  <Calendar size={28} className="text-text-muted mx-auto mb-3" />
                  <h3 className="text-md font-bold text-text-title">No sessions scheduled</h3>
                  <p className="text-xs text-text-muted max-w-sm mx-auto mt-1">
                    No active call sessions or booking requests have been received. Your profile listing is available for learner schedulers.
                  </p>
                </SpotlightCard>
              </div>
            )}
          </>
        ))}
      </main>

    </div>
  );
};

export default AppShell;
