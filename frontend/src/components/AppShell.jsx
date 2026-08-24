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
  AlertCircle
} from "lucide-react";
import SpotlightCard from "./SpotlightCard";
import ProgressRing from "./ProgressRing";
import Button from "./Button";

const AppShell = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Active workspace states
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [tabLoading, setTabLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [apiError, setApiError] = useState(null);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
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

  const greeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good morning";
    if (hr < 18) return "Good afternoon";
    return "Good evening";
  };

  const getRoleColors = (role) => {
    switch (role) {
      case "admin":
        return "bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20";
      case "expert":
        return "bg-accent-orange/10 text-accent-orange border-accent-orange/20";
      case "creator":
        return "bg-accent-purple/10 text-accent-purple border-accent-purple/20";
      default:
        return "bg-accent-blue/10 text-accent-blue border-accent-blue/20";
    }
  };

  // Skeletons matching actual component shapes
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

  return (
    <div className="min-h-screen bg-transparent text-text-main flex flex-col font-sans select-none relative pt-16">
      
      {/* Background static details */}
      <div className="absolute inset-0 dot-grid opacity-35 pointer-events-none z-0"></div>
      <div className="glow-orb w-[500px] h-[500px] bg-accent-blue/5 top-[-100px] left-[-100px]"></div>
      <div className="glow-orb w-[500px] h-[500px] bg-accent-purple/5 bottom-[-100px] right-[-100px]"></div>

      {/* Toast Notification */}
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

        {/* Global Tab Navigation */}
        <nav className="hidden md:flex items-center bg-bg-darker border border-glass-border rounded-xl p-1 gap-1">
          {[
            { id: "dashboard", label: "Dashboard", icon: Layers, activeColor: "bg-accent-blue" },
            { id: "explore", label: "Explore", icon: Compass, activeColor: "bg-accent-cyan" },
            { id: "courses", label: "Courses", icon: BookOpen, activeColor: "bg-accent-purple" },
            { id: "experts", label: "Experts", icon: Users, activeColor: "bg-accent-orange" }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id && location.pathname === "/";
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`group/tab flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer active:scale-95 ${
                  isActive
                    ? `${tab.activeColor} text-white shadow-md`
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
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-glass-border hover:bg-glass-border hover:text-text-title text-text-muted transition duration-200 cursor-pointer active:scale-95 flex items-center justify-center"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* Notifications Panel (Empty state oriented) */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="group h-9 w-9 rounded-xl border border-glass-border bg-glass-card flex items-center justify-center text-text-muted hover:text-text-title transition duration-200 active:scale-95 cursor-pointer"
            >
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
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 rounded-xl border border-glass-border bg-glass-card hover:bg-glass-border py-1.5 px-2.5 transition duration-200 active:scale-95 cursor-pointer"
            >
              <div className="h-6 w-6 rounded-lg bg-gradient-accent p-[1px] shrink-0">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} className="h-full w-full rounded-lg object-cover" />
                ) : (
                  <div className={`h-full w-full rounded-lg flex items-center justify-center font-extrabold text-white text-[10px] uppercase bg-gradient-to-br ${
                    user?.role === "admin" ? "from-accent-emerald to-accent-cyan" :
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
                
                <Link
                  to="/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="group flex items-center gap-2 px-3.5 py-2 text-xs text-text-main hover:text-text-title hover:bg-glass-border rounded-lg border border-transparent transition duration-150"
                >
                  <UserIcon size={12} />
                  My Profile
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="group flex items-center gap-2 px-3.5 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 rounded-lg border border-transparent transition duration-150 text-left w-full cursor-pointer"
                >
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

        {!apiError && (location.pathname === "/profile" ? (
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
                      {greeting()}, {user?.name || "Member"}
                    </h1>
                    <p className="text-xs text-text-muted font-semibold mt-1">
                      Welcome to your personalized CKM workspace.
                    </p>
                  </div>
                </div>

                {/* ROLE-AWARE DASHBOARD VIEWS */}
                {user?.role === "learner" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Column (Courses & Resources empty states) */}
                    <div className="lg:col-span-8 space-y-6">
                      
                      {/* Course progress empty state */}
                      <SpotlightCard className="p-6 bg-glass-card border border-glass-border rounded-2xl" glowColor="rgba(59, 130, 246, 0.08)">
                        <div className="flex flex-col sm:flex-row items-center gap-6 justify-between text-center sm:text-left">
                          <div className="space-y-2 flex-grow">
                            <div className="inline-flex items-center gap-1 bg-accent-blue/10 text-accent-blue border border-accent-blue/20 px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
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
                            <Button onClick={() => handleTabChange("courses")} className="text-xs py-2.5 px-5">
                              Explore Courses
                            </Button>
                          </div>
                        </div>
                      </SpotlightCard>

                      {/* Saved resources empty state */}
                      <SpotlightCard className="p-6 bg-glass-card border border-glass-border rounded-2xl" glowColor="rgba(6, 182, 212, 0.08)">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between pb-3 border-b border-glass-border/30">
                            <h3 className="text-[10px] font-bold text-text-title uppercase tracking-widest">Saved Resources</h3>
                            <span className="text-[10px] text-text-muted">0 items</span>
                          </div>
                          <div className="py-8 text-center space-y-3">
                            <Bookmark size={20} className="text-text-muted mx-auto" />
                            <p className="text-xs text-text-muted max-w-xs mx-auto">
                              Save deployment checklists, configuration files, and references you want to revisit later.
                            </p>
                            <Button onClick={() => handleTabChange("explore")} className="text-xs py-2 px-4 bg-transparent border border-glass-border text-text-main hover:text-text-title">
                              Explore Resources
                            </Button>
                          </div>
                        </div>
                      </SpotlightCard>

                    </div>

                    {/* Right Column (Mentorship Schedulers empty states) */}
                    <div className="lg:col-span-4 space-y-6">
                      
                      {/* Upcoming mentorship sessions */}
                      <SpotlightCard className="p-5 bg-glass-card border border-glass-border rounded-2xl" glowColor="rgba(249, 115, 22, 0.06)">
                        <div className="flex items-center justify-between pb-3 border-b border-glass-border/40 mb-4">
                          <h3 className="text-[10px] font-bold text-text-title uppercase tracking-widest">Mentorship Calls</h3>
                        </div>
                        <div className="py-6 text-center space-y-3">
                          <Calendar size={18} className="text-text-muted mx-auto" />
                          <p className="text-xs text-text-muted">
                            No upcoming mentorship sessions. Reach out to expert schedulers for technical advice.
                          </p>
                          <Button onClick={() => handleTabChange("experts")} className="text-[10px] py-1.5 px-3">
                            Book Session
                          </Button>
                        </div>
                      </SpotlightCard>

                    </div>
                  </div>
                )}

                {user?.role === "creator" && (
                  <div className="space-y-6">
                    {/* Metrics grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <SpotlightCard className="p-5 bg-glass-card border border-glass-border text-center" glowColor="rgba(168, 85, 247, 0.06)">
                        <div className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Total Revenue</div>
                        <div className="text-lg font-extrabold text-accent-emerald mt-1">$0.00</div>
                      </SpotlightCard>
                      <SpotlightCard className="p-5 bg-glass-card border border-glass-border text-center" glowColor="rgba(168, 85, 247, 0.06)">
                        <div className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Sales volume</div>
                        <div className="text-lg font-extrabold text-text-title mt-1">0 units</div>
                      </SpotlightCard>
                      <SpotlightCard className="p-5 bg-glass-card border border-glass-border text-center" glowColor="rgba(168, 85, 247, 0.06)">
                        <div className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Ratings</div>
                        <div className="text-lg font-extrabold text-text-title mt-1">No ratings yet</div>
                      </SpotlightCard>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <div className="lg:col-span-8">
                        <SpotlightCard className="p-6 bg-glass-card border border-glass-border rounded-2xl" glowColor="rgba(168, 85, 247, 0.08)">
                          <div className="flex items-center justify-between pb-3 border-b border-glass-border/30 mb-4">
                            <h3 className="text-[10px] font-bold text-text-title uppercase tracking-widest">Published Resources</h3>
                            <button onClick={() => setToastMessage("Resource upload portal is launching in the next phase!")} className="text-[10px] font-bold text-accent-purple flex items-center gap-1 cursor-pointer">
                              Upload Guide <PlusCircle size={12} />
                            </button>
                          </div>
                          <div className="py-12 text-center space-y-2">
                            <FileText size={20} className="text-text-muted mx-auto" />
                            <p className="text-xs text-text-muted">You haven't uploaded or published any guides or scripts yet.</p>
                          </div>
                        </SpotlightCard>
                      </div>
                      
                      <div className="lg:col-span-4">
                        <SpotlightCard className="p-6 bg-glass-card border border-glass-border rounded-2xl" glowColor="rgba(168, 85, 247, 0.06)">
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
                    {/* Metrics grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <SpotlightCard className="p-5 bg-glass-card border border-glass-border text-center" glowColor="rgba(249, 115, 22, 0.06)">
                        <div className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Completed sessions</div>
                        <div className="text-lg font-extrabold text-text-title mt-1">0 calls</div>
                      </SpotlightCard>
                      <SpotlightCard className="p-5 bg-glass-card border border-glass-border text-center" glowColor="rgba(249, 115, 22, 0.06)">
                        <div className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Mentorship Revenue</div>
                        <div className="text-lg font-extrabold text-accent-emerald mt-1">$0.00</div>
                      </SpotlightCard>
                      <SpotlightCard className="p-5 bg-glass-card border border-glass-border text-center" glowColor="rgba(249, 115, 22, 0.06)">
                        <div className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Expert score</div>
                        <div className="text-lg font-extrabold text-text-title mt-1">No reviews yet</div>
                      </SpotlightCard>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <div className="lg:col-span-8">
                        <SpotlightCard className="p-6 bg-glass-card border border-glass-border rounded-2xl" glowColor="rgba(249, 115, 22, 0.08)">
                          <div className="flex items-center justify-between pb-3 border-b border-glass-border/30 mb-4">
                            <h3 className="text-[10px] font-bold text-text-title uppercase tracking-widest">Availability scheduler</h3>
                            <button onClick={() => setToastMessage("Availability configuration setting is launching in the next phase!")} className="text-[10px] font-bold text-accent-orange flex items-center gap-1 cursor-pointer">
                              Add Hour Slot <PlusCircle size={12} />
                            </button>
                          </div>
                          <div className="py-12 text-center space-y-2">
                            <Clock size={20} className="text-text-muted mx-auto" />
                            <p className="text-xs text-text-muted">You haven't configured any available video consultation windows yet.</p>
                          </div>
                        </SpotlightCard>
                      </div>
                      
                      <div className="lg:col-span-4">
                        <SpotlightCard className="p-6 bg-glass-card border border-glass-border rounded-2xl" glowColor="rgba(249, 115, 22, 0.06)">
                          <div className="flex items-center justify-between pb-3 border-b border-glass-border/30 mb-4">
                            <h3 className="text-[10px] font-bold text-text-title uppercase tracking-widest">Upcoming Calls</h3>
                          </div>
                          <p className="text-xs text-text-muted text-center py-6">No sessions scheduled.</p>
                        </SpotlightCard>
                      </div>
                    </div>
                  </div>
                )}

                {user?.role === "admin" && (
                  <div className="space-y-6">
                    {/* Metrics grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <SpotlightCard className="p-5 bg-glass-card border border-glass-border text-center" glowColor="rgba(16, 185, 129, 0.06)">
                        <div className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Registered users</div>
                        <div className="text-lg font-extrabold text-text-title mt-1">1 active user</div>
                      </SpotlightCard>
                      <SpotlightCard className="p-5 bg-glass-card border border-glass-border text-center" glowColor="rgba(16, 185, 129, 0.06)">
                        <div className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Moderation queue</div>
                        <div className="text-lg font-extrabold text-text-title mt-1">0 reports</div>
                      </SpotlightCard>
                      <SpotlightCard className="p-5 bg-glass-card border border-glass-border text-center" glowColor="rgba(16, 185, 129, 0.06)">
                        <div className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Resource listings</div>
                        <div className="text-lg font-extrabold text-text-title mt-1">0 active</div>
                      </SpotlightCard>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <div className="lg:col-span-8">
                        <SpotlightCard className="p-6 bg-glass-card border border-glass-border rounded-2xl" glowColor="rgba(16, 185, 129, 0.08)">
                          <div className="flex items-center justify-between pb-3 border-b border-glass-border/30 mb-4">
                            <h3 className="text-[10px] font-bold text-text-title uppercase tracking-widest">Report logs</h3>
                          </div>
                          <div className="py-12 text-center text-xs text-text-muted">
                            <CheckCircle size={20} className="text-accent-emerald mx-auto mb-2" />
                            All clear. No user disputes or resource reports found.
                          </div>
                        </SpotlightCard>
                      </div>
                      
                      <div className="lg:col-span-4">
                        <SpotlightCard className="p-6 bg-glass-card border border-glass-border rounded-2xl" glowColor="rgba(16, 185, 129, 0.06)">
                          <div className="flex items-center justify-between pb-3 border-b border-glass-border/30 mb-4">
                            <h3 className="text-[10px] font-bold text-text-title uppercase tracking-widest">Platform settings</h3>
                          </div>
                          <p className="text-xs text-text-muted text-center py-6">All systems nominal.</p>
                        </SpotlightCard>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* WORKSPACE: EXPLORE RESOURCES TAB */}
            {activeTab === "explore" && (
              <div className="space-y-6 text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-glass-border/40 pb-5">
                  <div className="space-y-1">
                    <h1 className="text-2xl font-extrabold text-text-title">Explore Resources</h1>
                    <p className="text-xs text-text-muted font-semibold">Search and download configuration resources</p>
                  </div>
                  
                  {/* Search bar */}
                  <div className="relative max-w-sm w-full">
                    <input
                      type="text"
                      placeholder="Search files, scripts, checklists..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full form-input text-xs rounded-xl pl-9 pr-4 py-2.5"
                    />
                    <Search size={14} className="absolute left-3 top-3.5 text-text-muted" />
                  </div>
                </div>

                {/* Empty State */}
                <SpotlightCard className="p-12 bg-glass-card border border-glass-border text-center rounded-2xl" glowColor="rgba(6, 182, 212, 0.08)">
                  <div className="max-w-md mx-auto space-y-4">
                    <Compass size={28} className="text-text-muted mx-auto" />
                    <h3 className="text-md font-bold text-text-title">No resources available</h3>
                    <p className="text-xs text-text-muted">
                      Save resources you want to revisit later. Once creators publish developer kits, script files, and reference documentation, they will appear here.
                    </p>
                  </div>
                </SpotlightCard>
              </div>
            )}

            {/* WORKSPACE: COURSE LEARNING TAB */}
            {activeTab === "courses" && (
              <div className="space-y-6 text-left">
                <div className="border-b border-glass-border/40 pb-5">
                  <h1 className="text-2xl font-extrabold text-text-title">Course Catalog</h1>
                  <p className="text-xs text-text-muted font-semibold mt-1">Study curriculum and interactive play modules</p>
                </div>

                {/* Empty State */}
                <SpotlightCard className="p-12 bg-glass-card border border-glass-border text-center rounded-2xl" glowColor="rgba(168, 85, 247, 0.08)">
                  <div className="max-w-md mx-auto space-y-4">
                    <BookOpen size={28} className="text-text-muted mx-auto" />
                    <h3 className="text-md font-bold text-text-title">Your learning space is empty</h3>
                    <p className="text-xs text-text-muted">
                      Your learning journey starts here. Currently there are no courses enrolled on your account. Check back later as modules get published.
                    </p>
                  </div>
                </SpotlightCard>
              </div>
            )}

            {/* WORKSPACE: EXPERT BOOKING TAB */}
            {activeTab === "experts" && (
              <div className="space-y-6 text-left">
                <div className="border-b border-glass-border/40 pb-5">
                  <h1 className="text-2xl font-extrabold text-text-title">Book Experts</h1>
                  <p className="text-xs text-text-muted font-semibold mt-1">Schedule mentorship calls and review verified directory specialists</p>
                </div>

                {/* Empty State */}
                <SpotlightCard className="p-12 bg-glass-card border border-glass-border text-center rounded-2xl" glowColor="rgba(249, 115, 22, 0.08)">
                  <div className="max-w-md mx-auto space-y-4">
                    <UserCheck size={28} className="text-text-muted mx-auto" />
                    <h3 className="text-md font-bold text-text-title">No experts listed</h3>
                    <p className="text-xs text-text-muted">
                      Mentorship slots are currently empty. We are onboarding verified industry specialists. Please check back later.
                    </p>
                  </div>
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
