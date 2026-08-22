import React, { useState } from "react";
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
  Settings
} from "lucide-react";
import SpotlightCard from "./SpotlightCard";
import ProgressRing from "./ProgressRing";
import Button from "./Button";

const AppShell = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Active workspace page states
  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" | "explore" | "courses" | "experts"
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [bookingStep, setBookingStep] = useState("calendar"); // "calendar" | "success"
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Mock Notifications
  const notifications = [
    { id: 1, text: "Devon Webb confirmed your mentorship call for Tomorrow at 10:00 AM.", time: "10m ago" },
    { id: 2, text: "New resource published: 'Raft Consensus' in System Design.", time: "1h ago" },
    { id: 3, text: "Your course progress milestone 'Server Actions' is 100% complete.", time: "1d ago" }
  ];

  // Mock Resource Items
  const resourcesList = [
    { id: 1, title: "Production Next.js 15 Architecture Guide", creator: "Alex Rivera", rating: 4.9, difficulty: "Advanced", price: "$29.00", format: "PDF Guide", downloads: "2.4MB", category: "Web Dev", pillColor: "sticker-blue" },
    { id: 2, title: "Distributed Consensus & Raft Patterns", creator: "Sophia Chen", rating: 4.8, difficulty: "Expert", price: "$15.00", format: "ZIP Kit", downloads: "1.8MB", category: "Sys Design", pillColor: "sticker-purple" },
    { id: 3, title: "TypeScript Utility Types Production Reference", creator: "Marcus Aurelius", rating: 5.0, difficulty: "Intermediate", price: "Free", format: "PDF Notes", downloads: "800KB", category: "Web Dev", pillColor: "sticker-cyan" },
    { id: 4, title: "Kafka Event Decoupling & Queue Setup", creator: "Aria Thorne", rating: 4.7, difficulty: "Advanced", price: "$12.00", format: "SQL Script", downloads: "40KB", category: "Sys Design", pillColor: "sticker-orange" }
  ];

  // Mock Experts
  const expertsList = [
    { id: 1, name: "Devon Webb", role: "Principal Cloud Engineer", rate: "$80/hr", sessions: "148 sessions", rating: "5.0", initials: "DW", portrait: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80", color: "rgba(249, 115, 22, 0.12)" },
    { id: 2, name: "Aria Thorne", role: "Lead Machine Learning Scientist", rate: "$95/hr", sessions: "92 sessions", rating: "4.9", initials: "AT", portrait: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80", color: "rgba(168, 85, 247, 0.12)" },
    { id: 3, name: "Sophia Chen", role: "Staff Infrastructure Architect", rate: "$110/hr", sessions: "204 sessions", rating: "4.8", initials: "SC", portrait: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80", color: "rgba(6, 182, 212, 0.12)" }
  ];

  const greeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good morning";
    if (hr < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (location.pathname !== "/") {
      navigate("/");
    }
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

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-100 flex flex-col font-sans select-none relative pt-16">
      
      {/* Background overlay */}
      <div className="absolute inset-0 dot-grid opacity-35 pointer-events-none z-0"></div>
      <div className="glow-orb w-[500px] h-[500px] bg-accent-blue/5 top-[-100px] left-[-100px] animate-glow"></div>
      <div className="glow-orb w-[500px] h-[500px] bg-accent-purple/5 bottom-[-100px] right-[-100px] animate-glow" style={{ animationDelay: "-4s" }}></div>

      {/* HEADER BAR */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-glass-border bg-[#03050c]/75 backdrop-blur-xl z-40 flex items-center justify-between px-6">
        
        {/* Brand */}
        <Link to="/" onClick={() => handleTabChange("dashboard")} className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-white select-none shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-accent p-[1px] shadow-[0_0_15px_rgba(59,130,246,0.25)]">
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-bg-deep">
              <Share2 size={14} className="text-accent-blue" />
            </div>
          </div>
          <span className="font-extrabold tracking-widest text-slate-100 text-sm">CKM</span>
          <span className={`text-[9px] border rounded px-1.5 py-0.2 uppercase font-bold tracking-widest ${getRoleColors(user?.role)}`}>
            {user?.role || "learner"}
          </span>
        </Link>

        {/* Global Tab Navigation */}
        <nav className="hidden md:flex items-center bg-slate-950/60 border border-glass-border rounded-xl p-1 gap-1">
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
                className={`group/tab flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 active:scale-[0.97] hover:translate-y-[-1px] ${
                  isActive
                    ? `${tab.activeColor} text-white shadow-md shadow-slate-950/30`
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#03050c]/80"
                }`}
              >
                <Icon size={13} className="transition-transform group-hover/tab:scale-110 duration-200" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4 shrink-0">
          
          {/* Notifications Panel */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="group h-9 w-9 rounded-xl border border-glass-border bg-slate-950/40 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Bell size={15} className="text-accent-violet transition-transform group-hover:scale-110 group-hover:rotate-[8deg]" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-accent-violet rounded-full"></span>
            </button>
            
            {notificationsOpen && (
              <div className="absolute right-0 mt-3.5 w-80 rounded-2xl border border-glass-border bg-[#03050c] p-4 shadow-2xl z-50 flex flex-col space-y-3">
                <div className="flex items-center justify-between border-b border-glass-border/40 pb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Notifications</h4>
                  <span className="text-[10px] text-accent-violet hover:underline cursor-pointer">Mark all read</span>
                </div>
                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div key={n.id} className="text-left space-y-1 hover:bg-slate-950/30 p-1.5 rounded-lg transition">
                      <p className="text-xs text-slate-300 leading-normal">{n.text}</p>
                      <span className="text-[9px] text-slate-500">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 rounded-xl border border-glass-border bg-slate-950/40 hover:bg-slate-900/50 py-1 px-2.5 transition duration-200 hover:scale-[1.01] hover:border-slate-700 active:scale-[0.98]"
            >
              <div className="h-6 w-6 rounded-lg bg-gradient-accent p-[1px]">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} className="h-full w-full rounded-lg object-cover" />
                ) : (
                  <div className={`h-full w-full rounded-lg flex items-center justify-center font-extrabold text-white text-[10px] uppercase bg-gradient-to-br ${
                    user?.role === "admin" ? "from-accent-emerald to-accent-cyan" :
                    user?.role === "creator" ? "from-accent-purple to-accent-magenta" :
                    user?.role === "expert" ? "from-accent-orange to-accent-amber" :
                    "from-accent-blue to-accent-indigo"
                  } shadow-[0_0_10px_rgba(59,130,246,0.25)]`}>
                    {user?.name ? user.name[0] : <UserIcon size={10} />}
                  </div>
                )}
              </div>
              <ChevronDown size={12} className="text-slate-400" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-3.5 w-48 rounded-2xl border border-glass-border bg-[#03050c] p-2.5 shadow-2xl z-50 flex flex-col">
                <div className="px-3.5 py-2 border-b border-glass-border/30 mb-2">
                  <h4 className="text-xs font-bold text-white truncate">{user?.name}</h4>
                  <p className="text-[9px] text-slate-500 capitalize mt-0.5">{user?.role}</p>
                </div>
                
                <Link
                  to="/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="group flex items-center gap-2 px-3.5 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-950/60 rounded-lg border border-transparent hover:border-slate-800 transition-all duration-150"
                >
                  <UserIcon size={12} className="transition-transform group-hover:scale-110" />
                  My Profile
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="group flex items-center gap-2 px-3.5 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 rounded-lg border border-transparent hover:border-rose-950/20 transition-all duration-150 text-left w-full"
                >
                  <LogOut size={12} className="transition-transform group-hover:translate-x-0.5" />
                  Log out
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* WORKSPACE CONTENT CONTAINER */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-6 z-10 relative">
        
        {location.pathname === "/profile" ? (
          <Outlet />
        ) : (
          <>
            {/* WORKSPACE: DASHBOARD TAB */}
            {activeTab === "dashboard" && (
              <div className="space-y-8 text-left animate-fade-in">
                
                {/* Greeting banner */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-glass-border/40 pb-6">
                  <div>
                    <h1 className="hero-heading text-2xl sm:text-3xl font-extrabold text-white">
                      {greeting()}, {user?.name || "Member"}
                    </h1>
                    <p className="text-xs text-slate-400 font-semibold mt-1">
                      Welcome to your multi-colored CKM version 2.0 workspace.
                    </p>
                  </div>
                  
                  {/* Mentorship alert (Orange theme) */}
                  <div className="flex items-center gap-3 bg-accent-orange/10 border border-accent-orange/20 rounded-xl p-3.5 max-w-sm">
                    <Calendar size={16} className="text-accent-orange" />
                    <div className="text-xs">
                      <h4 className="font-bold text-white">Mentorship Call Scheduled</h4>
                      <p className="text-slate-400 text-[10px] mt-0.5">Tomorrow, 10:00 AM with Devon Webb</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column (lg:8) */}
                  <div className="lg:col-span-8 space-y-6">
                    
                    {/* Course card (Blue/Cyan theme) */}
                    <SpotlightCard className="p-6 bg-[#03050c]/30 border border-accent-blue/30 rounded-2xl flex flex-col sm:flex-row items-center gap-6 justify-between animate-fade-in" glowColor="rgba(59, 130, 246, 0.12)">
                      <div className="space-y-3 flex-grow text-left">
                        <div className="inline-flex items-center gap-1 bg-blue-500/10 text-accent-blue border border-blue-500/20 px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                          Learning
                        </div>
                        <h3 className="text-md font-extrabold text-white leading-snug">
                          Next.js 15 App Router Architecture Masterclass
                        </h3>
                        <p className="text-xs text-slate-500">
                          Current Lesson: Section 3 - Optimizing Server Actions
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                          <Button
                            onClick={() => setActiveTab("courses")}
                            className="text-[11px] font-bold py-2 px-4 rounded-lg flex items-center gap-1.5 shimmer-btn"
                          >
                            Resume Lesson <Play size={10} fill="currentColor" />
                          </Button>
                        </div>
                      </div>

                      {/* Progress ring widget */}
                      <div className="flex items-center gap-4 border-l border-glass-border/30 pl-6 shrink-0">
                        <ProgressRing progress={68} size={65} strokeWidth={6} ringColor="stroke-accent-cyan" />
                        <div className="text-left text-xs">
                          <h4 className="font-bold text-white">68% Done</h4>
                          <p className="text-[10px] text-slate-500">Lesson 14 of 17</p>
                        </div>
                      </div>
                    </SpotlightCard>

                    {/* Creator analytics widget (Purple theme) */}
                    {(user?.role === "creator" || user?.role === "admin") && (
                      <SpotlightCard className="p-6 bg-[#03050c]/30 border border-accent-purple/30 rounded-2xl animate-fade-in" glowColor="rgba(168, 85, 247, 0.12)">
                        <div className="flex items-center justify-between border-b border-glass-border/30 pb-3 mb-4">
                          <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent-purple animate-pulse"></span>
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Creator Earnings Summary</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-bold">Standard Account</span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-[#02040a] border border-glass-border rounded-xl p-3.5 text-center">
                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Revenue</div>
                            <div className="text-sm font-extrabold text-emerald-400 mt-1">$4,850.00</div>
                          </div>
                          <div className="bg-[#02040a] border border-glass-border rounded-xl p-3.5 text-center">
                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Sales</div>
                            <div className="text-sm font-extrabold text-white mt-1">294 units</div>
                          </div>
                          <div className="bg-[#02040a] border border-glass-border rounded-xl p-3.5 text-center">
                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Rating</div>
                            <div className="text-sm font-extrabold text-amber-400 mt-1">4.9 ★</div>
                          </div>
                        </div>
                      </SpotlightCard>
                    )}

                  </div>

                  {/* Right Column (lg:4) */}
                  <div className="lg:col-span-4 space-y-6">
                    
                    {/* Recent Activity Log (Amber/Violet) */}
                    <SpotlightCard className="p-5 bg-[#03050c]/30 border border-glass-border/70 rounded-2xl text-left" glowColor="rgba(245, 158, 11, 0.1)">
                      <div className="flex items-center justify-between pb-3 border-b border-glass-border/40 mb-4">
                        <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Important Activity</h3>
                        <span className="text-[9px] text-slate-500 uppercase font-bold">Metrics logs</span>
                      </div>
                      
                      <div className="space-y-3.5">
                        {[
                          { text: "Raft Consensus document downloaded.", time: "2h ago", color: "bg-accent-cyan" },
                          { text: "Admin Access token registration completed.", time: "1d ago", color: "bg-accent-emerald" },
                          { text: "Purchased Next.js 15 Masterclass.", time: "3d ago", color: "bg-accent-blue" }
                        ].map((act, i) => (
                          <div key={i} className="flex gap-2.5">
                            <span className={`h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 ${act.color}`}></span>
                            <div className="text-[11px] leading-tight">
                              <p className="text-slate-300 font-medium">{act.text}</p>
                              <span className="text-[9px] text-slate-500">{act.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </SpotlightCard>

                    {/* Mentorship Directory Bookings (Orange theme) */}
                    <SpotlightCard className="p-5 bg-[#03050c]/30 border border-glass-border/70 rounded-2xl text-left" glowColor="rgba(249, 115, 22, 0.1)">
                      <div className="flex items-center justify-between pb-3 border-b border-glass-border/40 mb-4">
                        <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Quick Book Mentors</h3>
                        <span className="text-[10px] text-accent-orange font-bold cursor-pointer" onClick={() => handleTabChange("experts")}>View all</span>
                      </div>
                      <div className="space-y-3.5">
                        {expertsList.slice(0, 2).map((exp) => (
                          <div key={exp.id} className="flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2">
                              <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 border font-extrabold text-[10px] text-white uppercase bg-gradient-to-br ${
                                exp.id === 1 ? "from-orange-500 to-amber-500 border-orange-400/30 glow-border-orange" :
                                exp.id === 2 ? "from-purple-500 to-pink-500 border-purple-400/30 glow-border-purple" :
                                "from-cyan-500 to-blue-500 border-cyan-400/30 glow-border-cyan"
                              } relative shadow-[0_2px_8px_rgba(0,0,0,0.4)]`}>
                                {exp.portrait && !exp.portrait.includes("unsplash.com") ? (
                                  <img src={exp.portrait} alt={exp.name} className="h-full w-full object-cover rounded-lg" />
                                ) : (
                                  exp.initials
                                )}
                                <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                </span>
                              </div>
                              <div className="text-left leading-tight">
                                <h4 className="font-bold text-white text-[11px]">{exp.name}</h4>
                                <p className="text-[9px] text-slate-500">{exp.role}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedExpert(exp);
                                handleTabChange("experts");
                              }}
                              className="text-[9px] font-bold text-white bg-[#02040a] border border-glass-border hover:border-slate-600 rounded px-2.5 py-1 transition"
                            >
                              Book
                            </button>
                          </div>
                        ))}
                      </div>
                    </SpotlightCard>

                  </div>

                </div>

              </div>
            )}

            {/* WORKSPACE: EXPLORE RESOURCES TAB (Cyan/Blue theme) */}
            {activeTab === "explore" && (
              <div className="space-y-6 text-left animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-glass-border/40 pb-5">
                  <div className="space-y-1">
                    <h1 className="text-2xl font-extrabold text-white">Explore Resources</h1>
                    <p className="text-xs text-slate-400 font-semibold">Search, filter, and download configurations</p>
                  </div>
                  
                  {/* Search bar */}
                  <div className="relative max-w-sm w-full">
                    <input
                      type="text"
                      placeholder="Search files, scripts, checklists..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#03050c] border border-glass-border text-xs rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/30 transition"
                    />
                    <Search size={14} className="absolute left-3 top-3.5 text-slate-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Grid list (lg:7) */}
                  <div className={`${selectedResource ? "lg:col-span-7" : "lg:col-span-12"} grid grid-cols-1 md:grid-cols-2 gap-4`}>
                    {resourcesList
                      .filter((r) => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((res) => (
                        <SpotlightCard
                          key={res.id}
                          onClick={() => setSelectedResource(res)}
                          className={`p-5 bg-[#03050c]/30 border cursor-pointer hover:border-slate-700 transition ${
                            selectedResource?.id === res.id ? "border-accent-cyan" : "border-glass-border"
                          }`}
                          glowColor="rgba(6, 182, 212, 0.1)"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="sticker sticker-blue scale-[0.8] origin-left">
                                {res.format}
                              </span>
                              <span className="text-[10px] text-slate-500 font-bold">{res.category}</span>
                            </div>
                            
                            <h3 className="text-xs font-bold text-slate-200 leading-snug line-clamp-2">{res.title}</h3>
                            
                            <div className="flex items-center justify-between text-[10px] border-t border-glass-border/30 pt-3 text-slate-500">
                              <span>By {res.creator}</span>
                              <span className="font-bold text-white">{res.price}</span>
                            </div>
                          </div>
                        </SpotlightCard>
                      ))}
                  </div>

                  {/* Resource details sidebar */}
                  {selectedResource && (
                    <SpotlightCard className="lg:col-span-5 p-6 bg-bg-panel/40 border border-glass-border rounded-2xl flex flex-col justify-between" glowColor="rgba(6, 182, 212, 0.15)">
                      <div className="space-y-5">
                        <div className="flex items-center justify-between border-b border-glass-border/40 pb-3">
                          <span className="sticker sticker-blue">
                            {selectedResource.format}
                          </span>
                          <button onClick={() => setSelectedResource(null)} className="text-xs text-slate-500 hover:text-white">
                            Close
                          </button>
                        </div>

                        <h2 className="text-sm font-extrabold text-white leading-snug">{selectedResource.title}</h2>
                        
                        <div className="text-xs space-y-2 border-t border-glass-border/30 pt-3">
                          <div className="flex justify-between"><span className="text-slate-500">Creator</span><span className="text-slate-300 font-bold">{selectedResource.creator}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Difficulty</span><span className="text-slate-300 font-bold">{selectedResource.difficulty}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">File Size</span><span className="text-slate-300 font-bold">{selectedResource.downloads}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Rating</span><span className="text-amber-400 font-bold">★ {selectedResource.rating}</span></div>
                        </div>
                      </div>

                      <div className="mt-8 pt-4 border-t border-glass-border/30 flex items-center justify-between gap-4">
                        <div className="text-left">
                          <span className="text-[10px] text-slate-500 block uppercase">Price</span>
                          <span className="text-base font-extrabold text-white">{selectedResource.price}</span>
                        </div>
                        <Button
                          onClick={() => handlePlaceholderClick(`Unlock: ${selectedResource.title}`)}
                          className="text-xs font-bold py-2.5 px-6 rounded-xl flex items-center gap-1.5 shimmer-btn"
                        >
                          Unlock Guide <Download size={12} />
                        </Button>
                      </div>
                    </SpotlightCard>
                  )}

                </div>
              </div>
            )}

            {/* WORKSPACE: COURSE LEARNING TAB (Purple/Magenta theme) */}
            {activeTab === "courses" && (
              <div className="space-y-6 text-left animate-fade-in">
                <div className="border-b border-glass-border/40 pb-5">
                  <h1 className="text-2xl font-extrabold text-white">Course Player</h1>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Immersive study space & notes reference</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column (Video Player) (lg:8) */}
                  <div className="lg:col-span-8 space-y-6">
                    <div className="relative aspect-video w-full rounded-2xl border border-accent-purple/30 bg-slate-950 flex items-center justify-center overflow-hidden shadow-2xl">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-10"></div>
                      <div className="z-20 text-center space-y-3">
                        <div className="h-14 w-14 rounded-full bg-accent-purple text-white flex items-center justify-center mx-auto shadow-lg cursor-pointer hover:scale-105 transition">
                          <Play size={20} fill="currentColor" className="ml-1" />
                        </div>
                        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Section 3: Optimizing Server Actions</h3>
                        <p className="text-[10px] text-slate-500">24 minutes • Click play to mock</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (Curriculum Modules) (lg:4) */}
                  <div className="lg:col-span-4 space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Curriculum Modules</h3>
                    <div className="bg-[#03050c]/60 border border-glass-border rounded-xl p-4 flex items-center justify-between">
                      <ProgressRing progress={68} size={48} strokeWidth={4} ringColor="stroke-accent-purple" />
                      <div className="text-right text-[10px]">
                        <h4 className="font-bold text-white">Module 3 of 5 Active</h4>
                        <p className="text-slate-500">68% complete</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {[
                        { title: "Module 1: Router Foundations", done: true },
                        { title: "Module 2: Rendering Paradigms", done: true },
                        { title: "Module 3: Server Actions", done: false }
                      ].map((mod, i) => (
                        <div key={i} className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                          mod.done ? "bg-[#03050c]/30 border-glass-border" : "bg-[#071120]/60 border-accent-purple/30"
                        }`}>
                          <h4 className="font-bold text-white">{mod.title}</h4>
                          {mod.done ? <CheckCircle size={14} className="text-emerald-500" /> : <span className="h-2 w-2 rounded-full bg-accent-purple animate-pulse" />}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* WORKSPACE: EXPERT BOOKING TAB (Orange theme) */}
            {activeTab === "experts" && (
              <div className="space-y-6 text-left animate-fade-in">
                <div className="border-b border-glass-border/40 pb-5">
                  <h1 className="text-2xl font-extrabold text-white">Book Expert Schedulers</h1>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Select dates and schedule secure browser video slots</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Expert list (lg:7) */}
                  <div className="lg:col-span-7 space-y-4">
                    {expertsList.map((exp) => (
                      <SpotlightCard
                        key={exp.id}
                        onClick={() => {
                          setSelectedExpert(exp);
                          setBookingStep("calendar");
                        }}
                        className={`p-5 bg-[#03050c]/30 border cursor-pointer hover:border-slate-700 transition ${
                          selectedExpert?.id === exp.id ? "border-accent-orange" : "border-glass-border"
                        }`}
                        glowColor={exp.color}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border font-extrabold text-xs text-white uppercase bg-gradient-to-br ${
                              exp.id === 1 ? "from-orange-500 to-amber-500 border-orange-400/30 glow-border-orange" :
                              exp.id === 2 ? "from-purple-500 to-pink-500 border-purple-400/30 glow-border-purple" :
                              "from-cyan-500 to-blue-500 border-cyan-400/30 glow-border-cyan"
                            } relative shadow-[0_4px_12px_rgba(0,0,0,0.4)]`}>
                              {exp.portrait && !exp.portrait.includes("unsplash.com") ? (
                                <img src={exp.portrait} alt={exp.name} className="h-full w-full object-cover rounded-xl" />
                              ) : (
                                exp.initials
                              )}
                              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                              </span>
                            </div>
                            <div className="text-left leading-tight">
                              <h3 className="text-xs font-bold text-white">{exp.name}</h3>
                              <p className="text-[10px] text-slate-500 mt-0.5">{exp.role}</p>
                            </div>
                          </div>
                          <div className="text-right text-[10px]">
                            <span className="font-extrabold text-slate-200 block">{exp.rate}</span>
                            <span className="text-slate-500 block mt-0.5">{exp.sessions}</span>
                          </div>
                        </div>
                      </SpotlightCard>
                    ))}
                  </div>

                  {/* Booking form calendar (lg:5) */}
                  {selectedExpert && (
                    <SpotlightCard className="lg:col-span-5 p-6 bg-bg-panel/40 border border-glass-border rounded-2xl flex flex-col justify-between" glowColor="rgba(249, 115, 22, 0.15)">
                      {bookingStep === "calendar" ? (
                        <div className="space-y-5">
                          <div className="flex items-center justify-between border-b border-glass-border/40 pb-3">
                            <span className="text-[10px] font-bold text-accent-orange uppercase tracking-wider">Configure Booking call</span>
                            <button onClick={() => setSelectedExpert(null)} className="text-xs text-slate-500 hover:text-white">
                              Cancel
                            </button>
                          </div>
                          
                          <div className="text-xs leading-relaxed">
                            <span className="text-slate-500 block mb-0.5">Booking session with</span>
                            <span className="text-slate-200 font-extrabold">{selectedExpert.name}</span>
                          </div>

                          <div className="space-y-1.5 text-xs text-left">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Date</label>
                            <input
                              type="date"
                              required
                              value={selectedDate}
                              onChange={(e) => setSelectedDate(e.target.value)}
                              className="w-full bg-[#02040a] border border-glass-border text-slate-200 text-xs rounded-xl p-3 outline-none focus:border-accent-orange/50 focus:ring-1 focus:ring-accent-orange/30 transition"
                            />
                          </div>

                          <div className="space-y-1.5 text-xs text-left">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Available Slots</label>
                            <div className="grid grid-cols-3 gap-2">
                              {["10:00 AM", "2:00 PM", "4:00 PM"].map((t) => (
                                <div
                                  key={t}
                                  onClick={() => setSelectedTime(t)}
                                  className={`p-2.5 rounded-lg border text-center cursor-pointer transition ${
                                    selectedTime === t
                                      ? "bg-accent-orange/15 border-accent-orange font-bold text-white animate-pulse"
                                      : "bg-[#02040a] border-glass-border hover:border-slate-600 text-slate-400"
                                  }`}
                                >
                                  {t}
                                </div>
                              ))}
                            </div>
                          </div>

                          <Button
                            onClick={() => {
                              if (!selectedDate || !selectedTime) return;
                              setBookingStep("success");
                            }}
                            disabled={!selectedDate || !selectedTime}
                            className="w-full py-3 text-xs font-bold rounded-xl mt-3 shimmer-btn"
                          >
                            Schedule slot ({selectedExpert.rate})
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center space-y-5 py-4 animate-fade-in">
                          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-md">
                            <Video size={20} />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-md font-bold text-white">Mentorship Call Booked</h3>
                            <p className="text-[11px] text-slate-400">
                              Your video session with <span className="font-bold text-white">{selectedExpert.name}</span> is confirmed for {selectedDate} at {selectedTime}.
                            </p>
                          </div>
                          <Button
                            onClick={() => {
                              setBookingStep("calendar");
                              setSelectedExpert(null);
                              setSelectedDate("");
                              setSelectedTime("");
                            }}
                            className="w-full py-2.5 text-xs font-bold rounded-xl"
                          >
                            Return to Directory
                          </Button>
                        </div>
                      )}
                    </SpotlightCard>
                  )}

                </div>
              </div>
            )}
          </>
        )}

      </main>

    </div>
  );
};

export default AppShell;
