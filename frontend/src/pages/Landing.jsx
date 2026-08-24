import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  BookOpen,
  Users,
  MessageSquare,
  Bookmark,
  ArrowRight,
  Sparkles,
  Info,
  Calendar,
  FileText,
  Play,
  Heart,
  TrendingUp,
  Cpu,
  Terminal,
  Database,
  Layers,
  Search,
  Check,
  Award,
  BarChart,
  Lock,
  Clock,
  Video
} from "lucide-react";
import SpotlightCard from "../components/SpotlightCard";
import ProgressRing from "../components/ProgressRing";
import Button from "../components/Button";

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const [toastMessage, setToastMessage] = useState("");
  const [activeCategory, setActiveCategory] = useState(0);

  const handlePlaceholderClick = (pageName) => {
    setToastMessage(`The "${pageName}" portal is launching in the next phase!`);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const categories = [
    {
      num: "01",
      title: "AI & Machine Learning",
      count: "1,240 Resources",
      creators: "42 Creators",
      topics: ["Deep Learning", "LLM Quantization", "Neural Networks"],
      color: "from-blue-500/30 to-cyan-500/30",
      accent: "bg-accent-blue"
    },
    {
      num: "02",
      title: "Cybersecurity & Cryptography",
      count: "389 Resources",
      creators: "18 Creators",
      topics: ["Zero Trust", "SSL/TLS Audits", "Penetration Testing"],
      color: "from-purple-500/30 to-magenta-500/30",
      accent: "bg-accent-purple"
    },
    {
      num: "03",
      title: "Web Development",
      count: "892 Resources",
      creators: "65 Creators",
      topics: ["Next.js 15", "Wasm Compiler", "Tailwind v4"],
      color: "from-cyan-500/30 to-teal-500/30",
      accent: "bg-accent-cyan"
    },
    {
      num: "04",
      title: "Business & SaaS Scale",
      count: "428 Resources",
      creators: "29 Creators",
      topics: ["Revenue Ops", "Auth Architecture", "Payout APIs"],
      color: "from-orange-500/30 to-amber-500/30",
      accent: "bg-accent-orange"
    },
    {
      num: "05",
      title: "Data Science & Pipelines",
      count: "512 Resources",
      creators: "34 Creators",
      topics: ["PyTorch Data", "ETL Warehousing", "Feature Stores"],
      color: "from-emerald-500/30 to-teal-500/30",
      accent: "bg-accent-emerald"
    },
    {
      num: "06",
      title: "System Architecture",
      count: "450 Resources",
      creators: "28 Creators",
      topics: ["Raft Consensus", "Kafka Decoupling", "Redis Cache"],
      color: "from-violet-500/30 to-pink-500/30",
      accent: "bg-accent-violet"
    }
  ];

  const resources = [
    {
      type: "Course",
      title: "Production Next.js 15 App Router Masterclass",
      creator: "Alex Rivera",
      initials: "AR",
      description: "Learn server actions, routing paradigms, compilation optimizations, and advanced middleware hooks in Next.js 15.",
      category: "Web Dev",
      rating: "4.9",
      learners: "1.2K learners",
      difficulty: "Advanced",
      duration: "14 hours",
      price: "$29.00",
      pillColor: "sticker-cyan",
      badgeText: "POPULAR",
      rotation: "rotate-[-1.5deg]"
    },
    {
      type: "Guide",
      title: "High-Availability System Design Patterns Blueprint",
      creator: "Sophia Chen",
      initials: "SC",
      description: "Zero-downtime container configuration, Raft consensus pipelines, and multi-region replication architectures.",
      category: "Sys Design",
      rating: "4.8",
      learners: "892 learners",
      difficulty: "Expert",
      duration: "45 pages",
      price: "$15.00",
      pillColor: "sticker-orange",
      badgeText: "EXPERT APPROVED",
      rotation: "rotate-[1.5deg]"
    },
    {
      type: "Notes",
      title: "LLM Fine-Tuning & Weight Quantization Cheatsheet",
      creator: "Marcus Aurelius",
      initials: "MA",
      description: "Direct weights tweaking cheatsheet, PyTorch fine-tuning datasets setup, and memory optimizations blueprint.",
      category: "AI / ML",
      rating: "5.0",
      learners: "428 learners",
      difficulty: "Intermediate",
      duration: "12 pages",
      price: "$8.00",
      pillColor: "sticker-purple",
      badgeText: "NEW",
      rotation: "rotate-[-1deg]"
    }
  ];

  const experts = [
    {
      name: "Devon Webb",
      role: "Principal Infrastructure Architect",
      expertise: "Kubernetes, Cloud migrations",
      portrait: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=180&q=80",
      sessions: "148 sessions",
      rating: "5.0",
      availability: "Available Tomorrow",
      glowColor: "rgba(249, 115, 22, 0.12)",
      sticker: "TOP EXPERT"
    },
    {
      name: "Aria Thorne",
      role: "Lead Machine Learning Scientist",
      expertise: "LLMs, Pytorch models",
      portrait: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=180&q=80",
      sessions: "92 sessions",
      rating: "4.9",
      availability: "Available Tuesday",
      glowColor: "rgba(168, 85, 247, 0.12)",
      sticker: "AI VISUALLY AUDITED"
    }
  ];

  return (
    <div className="relative bg-transparent pb-24 overflow-hidden pt-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 glass-surface border-accent-blue/30 bg-bg-darker/95 px-5 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] transition-all duration-300">
          <Info className="text-accent-blue shrink-0 animate-pulse" size={18} />
          <p className="text-xs font-semibold text-text-title">{toastMessage}</p>
        </div>
      )}

      {/* Grid background */}
      <div className="absolute inset-0 dot-grid opacity-50 pointer-events-none z-0"></div>

      {/* Multiple semantic ambient light glows */}
      <div className="glow-orb w-[600px] h-[600px] bg-accent-blue/10 top-[-100px] left-[-150px]"></div>
      <div className="glow-orb w-[550px] h-[550px] bg-accent-purple/5 top-[20%] right-[-100px]"></div>
      <div className="glow-orb w-[650px] h-[650px] bg-accent-orange/5 bottom-[35%] left-[-150px]"></div>
      <div className="glow-orb w-[600px] h-[600px] bg-accent-pink/5 bottom-[10%] right-[-100px]"></div>

      {/* HERO SECTION */}
      <section className="relative mx-auto max-w-7xl px-6 pt-16 md:pt-28 pb-20 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Copywriting */}
          <div className="lg:col-span-5 text-left space-y-6">
            <div className="sticker sticker-blue rotate-[-2deg]">
              <Sparkles size={11} className="text-accent-blue" />
              <span>THE KNOWLEDGE MARKETPLACE v2.0</span>
            </div>
            
            <h1 className="hero-heading text-4xl sm:text-5xl lg:text-[54px] leading-[1.08] tracking-tight">
              Knowledge is <br />
              better when <br />
              it's <span className="text-gradient-cyan">shared.</span>
            </h1>
            
            <p className="text-sm sm:text-base text-text-main leading-relaxed font-medium">
              Discover verified resources, learn from creators, schedule video mentorship sessions, and connect with peer groups.
            </p>

            {/* Core Values Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {[
                { word: "LEARN", color: "text-accent-blue border-accent-blue/30 bg-accent-blue/5", icon: BookOpen },
                { word: "CREATE", color: "text-accent-purple border-accent-purple/30 bg-accent-purple/5", icon: Cpu },
                { word: "CONNECT", color: "text-accent-orange border-accent-orange/30 bg-accent-orange/5", icon: Users },
                { word: "SHARE", color: "text-accent-cyan border-accent-cyan/30 bg-accent-cyan/5", icon: MessageSquare }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <span key={idx} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold border ${item.color} tracking-wider`}>
                    <Icon size={10} />
                    {item.word}
                  </span>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              {isAuthenticated ? (
                <Button
                  variant="primary"
                  onClick={() => handlePlaceholderClick("Marketplace")}
                  className="group gap-2 text-xs font-bold py-3 px-6 rounded-xl"
                >
                  Explore Dashboard <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="primary" className="group gap-2 text-xs font-bold py-3.5 px-6 rounded-xl shadow-lg">
                      Explore Knowledge <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="secondary" className="text-xs font-bold py-3.5 px-6 rounded-xl border border-glass-border">
                      Become a Creator
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Interactive Node Ecosystem Visual Hero */}
          <div className="lg:col-span-7 relative h-[440px] w-full hidden sm:flex items-center justify-center">
            
            {/* SVG dash lines connecting nodes */}
            <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 600 440">
              <defs>
                <linearGradient id="gradient-blue" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="gradient-purple" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <path d="M 120 100 L 300 220" stroke="url(#gradient-blue)" strokeWidth="1.5" fill="none" strokeDasharray="6 6" className="animate-dash" />
              <path d="M 460 110 L 300 220" stroke="url(#gradient-purple)" strokeWidth="1.5" fill="none" strokeDasharray="6 6" className="animate-dash" style={{ animationDuration: "14s" }} />
              <path d="M 280 340 L 300 220" stroke="url(#gradient-blue)" strokeWidth="1.5" fill="none" strokeDasharray="6 6" className="animate-dash" style={{ animationDuration: "25s" }} />
            </svg>

            {/* AI Node (Blue) */}
            <div className="absolute top-[50px] left-[40px] animate-float relative">
              <div className="absolute -top-3 -left-3 sticker sticker-blue rotate-[-6deg] z-20 scale-90">
                <span>✦ TRENDING</span>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-2xl glass-surface border border-accent-blue/30 shadow-xl">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-accent-blue">
                  <Cpu size={16} />
                </div>
                <div className="text-left">
                  <h3 className="text-xs font-bold text-text-title">Artificial Intelligence</h3>
                  <p className="text-[9px] text-text-muted mt-0.5">1,240 resources</p>
                </div>
              </div>
            </div>

            {/* Web Dev Node (Cyan) */}
            <div className="absolute bottom-[40px] left-[80px] animate-float-reverse">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl glass-surface border border-accent-cyan/30 shadow-xl">
                <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-accent-cyan">
                  <Terminal size={16} />
                </div>
                <div className="text-left">
                  <h3 className="text-xs font-bold text-text-title">Web Development</h3>
                  <p className="text-[9px] text-text-muted mt-0.5">892 resources</p>
                </div>
              </div>
            </div>

            {/* System Design Node (Purple) */}
            <div className="absolute top-[70px] right-[40px] animate-float relative" style={{ animationDelay: "-2.5s" }}>
              <div className="absolute -top-3 -right-3 sticker sticker-purple rotate-[4deg] z-20 scale-90">
                <span>TOP CREATED</span>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-2xl glass-surface border border-accent-purple/30 shadow-xl">
                <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-accent-purple">
                  <Layers size={16} />
                </div>
                <div className="text-left">
                  <h3 className="text-xs font-bold text-text-title">System Design</h3>
                  <p className="text-[9px] text-text-muted mt-0.5">428 resources</p>
                </div>
              </div>
            </div>

            {/* Floating Resource Preview (Glass) - Cyan themed */}
            <div className="absolute top-[30px] right-[20px] animate-float-card-2 z-20 pointer-events-none select-none">
              <div className="flex flex-col gap-2 p-3.5 rounded-2xl glass-surface border border-accent-cyan/20 shadow-[0_8px_30px_rgba(80,70,120,0.06)] max-w-[170px] backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-extrabold uppercase text-accent-cyan tracking-wider">Course Player</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <h4 className="text-[10px] font-bold text-text-title leading-tight">TypeScript Generics Masterclass</h4>
                <div className="w-full bg-glass-border rounded-full h-1 mt-1 overflow-hidden">
                  <div className="bg-accent-cyan h-full w-[72%] rounded-full"></div>
                </div>
                <div className="flex items-center justify-between text-[8px] text-text-muted mt-0.5">
                  <span>Progress 72%</span>
                  <span className="font-bold text-text-title">1,240 learners</span>
                </div>
              </div>
            </div>

            {/* Floating Statistics Preview - Purple themed */}
            <div className="absolute bottom-[30px] right-[40px] animate-float-card-3 z-20 pointer-events-none select-none">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-bg-dark border border-accent-purple/20 shadow-xl max-w-[160px]">
                <div className="h-7 w-7 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-accent-purple">
                  <TrendingUp size={14} />
                </div>
                <div className="text-left">
                  <h4 className="text-[10px] font-extrabold text-text-title">$4,850.00</h4>
                  <p className="text-[8px] text-text-muted uppercase tracking-wider font-semibold">Total Revenue</p>
                </div>
              </div>
            </div>

            {/* Floating Expert Availability - Orange themed */}
            <div className="absolute bottom-[100px] left-[-20px] animate-float-card-1 z-20 pointer-events-none select-none">
              <div className="flex items-center gap-2 p-2.5 rounded-2xl glass-surface border border-accent-orange/20 shadow-lg">
                <div className="h-6 w-6 rounded-full bg-accent-orange/10 border border-accent-orange/20 flex items-center justify-center font-bold text-[8px] text-accent-orange">
                  AT
                </div>
                <div className="text-left">
                  <h4 className="text-[9px] font-bold text-text-title">Aria Thorne</h4>
                  <p className="text-[7px] text-accent-orange font-bold uppercase tracking-wider">Available Tuesday</p>
                </div>
              </div>
            </div>

            {/* Center Hub CKM */}
            <div className="absolute h-16 w-16 rounded-2xl bg-gradient-accent p-[1.5px] shadow-[0_0_40px_rgba(59,130,246,0.15)] animate-pulse flex items-center justify-center z-10">
              <div className="h-full w-full rounded-2xl bg-bg-darker flex items-center justify-center text-text-title font-extrabold text-base tracking-wider">
                CKM
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* DISCOVER SECTION */}
      <section id="explore" className="mx-auto max-w-7xl px-6 py-24 relative z-10">
        <div className="absolute top-[10%] left-[-150px] w-[500px] h-[500px] bg-accent-cyan/5 rounded-full blur-[90px] pointer-events-none"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6 text-left">
            <div className="space-y-4">
              <div className="sticker sticker-cyan rotate-[-2deg]">
                <span>01 / DISCOVER KNOWLEDGE</span>
              </div>
              <h2 className="section-heading text-3xl sm:text-4xl leading-tight">
                Find the knowledge <br />
                you need.
              </h2>
              <p className="text-sm text-text-main font-medium leading-relaxed">
                Choose your field and browse curated files, scripts, and note packages matching your build stack.
              </p>
            </div>
            
            <div className="hidden lg:block border-l-2 border-accent-cyan/40 pl-4 space-y-1 py-1">
              <h4 className="text-xs font-bold text-text-title uppercase">Dynamic Categories</h4>
              <p className="text-[10px] text-text-muted">Updated metrics in real-time</p>
            </div>
          </div>

          {/* Grid Category Showcase with gradient spheres */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat, idx) => {
              const hoverBorders = {
                "01": "hover:border-accent-blue/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.06)]",
                "02": "hover:border-accent-purple/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.06)]",
                "03": "hover:border-accent-cyan/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.06)]",
                "04": "hover:border-accent-orange/40 hover:shadow-[0_0_20px_rgba(249,115,22,0.06)]",
                "05": "hover:border-accent-emerald/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.06)]",
                "06": "hover:border-accent-magenta/40 hover:shadow-[0_0_20px_rgba(236,72,153,0.06)]"
              };
              const hoverBorder = hoverBorders[cat.num] || "hover:border-glass-border-hover";
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveCategory(idx)}
                  className={`group relative rounded-2xl border p-5 transition-all duration-300 cursor-pointer overflow-hidden hover:translate-y-[-4px] hover:scale-[1.01] ${
                    activeCategory === idx
                      ? "bg-bg-dark/60 border-accent-blue/30 shadow-2xl"
                      : "bg-glass-card/80 border-glass-border"
                  } ${hoverBorder}`}
                >
                  {/* Asymmetric color glow sphere in background */}
                  <div className={`absolute top-[-20%] right-[-20%] h-24 w-24 rounded-full bg-gradient-to-br ${cat.color} blur-xl group-hover:scale-150 transition-all duration-500`} />
                  
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <span className="text-[10px] font-extrabold text-text-muted group-hover:text-text-title transition-colors">{cat.num}</span>
                    <div className={`h-1.5 w-1.5 rounded-full ${cat.accent} transition-transform duration-300 group-hover:scale-[1.4]`} />
                  </div>
                  
                  <h3 className="text-xs font-bold text-text-title mb-2 relative z-10 transition-all text-left">{cat.title}</h3>
                  
                  <div className="space-y-1.5 mt-4 relative z-10 text-left text-[10px] text-text-muted">
                    <div className="flex justify-between"><span>Files</span><span className="text-text-main font-bold group-hover:text-text-title transition-colors duration-200">{cat.count}</span></div>
                    <div className="flex justify-between"><span>Creators</span><span className="text-text-main font-bold group-hover:text-text-title transition-colors duration-200">{cat.creators}</span></div>
                  </div>

                  <div className="mt-5 flex items-center justify-end text-[10px] text-accent-cyan opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 font-extrabold relative z-10">
                    Explore <ArrowRight size={10} className="ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* LEARNING VISUALIZATION */}
      <section className="mx-auto max-w-7xl px-6 py-20 relative z-10 border-t border-glass-border/30">
        <div className="absolute top-[20%] right-[-150px] w-[500px] h-[500px] bg-accent-blue/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left illustration panels */}
          <div className="lg:col-span-7 bg-bg-panel border border-glass-border rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center gap-6">
            <div className="absolute top-[-20px] left-[-20px] h-32 w-32 rounded-full bg-accent-cyan/5 blur-xl pointer-events-none"></div>
            
            {/* Semantic Ring indicator */}
            <div className="flex flex-col items-center shrink-0 space-y-3 bg-bg-darker/80 border border-glass-border p-5 rounded-2xl shadow-lg relative">
              <div className="absolute -top-3 -right-2 sticker sticker-cyan rotate-[4deg] scale-90">
                <span>ACTIVE STREAK</span>
              </div>
              <ProgressRing progress={72} size={85} strokeWidth={8} ringColor="stroke-accent-cyan" trackColor="stroke-glass-border" />
              <div className="text-center">
                <h4 className="text-xs font-bold text-text-title">72% Completed</h4>
                <p className="text-[9px] text-text-muted mt-0.5">TypeScript Generics</p>
              </div>
            </div>

            {/* Simulated learning statistics logs */}
            <div className="flex-grow space-y-3.5 text-left w-full">
              <div className="flex items-center justify-between text-[10px] text-text-muted font-bold border-b border-glass-border/40 pb-2">
                <span>study workspace metrics</span>
                <span className="text-accent-cyan">+5h this week</span>
              </div>
              
              <div className="space-y-2.5">
                {[
                  { text: "Section 3 - Server Actions & compilation metrics", time: "Completed yesterday", active: true },
                  { text: "Docker foundations basic routing logs", time: "Completed 3d ago", active: false }
                ].map((l, i) => (
                  <div key={i} className="flex gap-2.5 items-start text-xs p-2.5 bg-bg-darker/40 border border-glass-border rounded-xl">
                    {l.active ? (
                      <Check className="text-accent-cyan mt-0.5 shrink-0" size={12} />
                    ) : (
                      <Check className="text-text-muted mt-0.5 shrink-0" size={12} />
                    )}
                    <div>
                      <h4 className="font-bold text-text-title text-[11px] leading-tight">{l.text}</h4>
                      <p className="text-[9px] text-text-muted mt-0.5">{l.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right copywriting */}
          <div className="lg:col-span-5 text-left space-y-6">
            <div className="sticker sticker-blue rotate-[-2deg]">
              <span>02 / MODERN LEARNING</span>
            </div>
            <h2 className="section-heading text-3xl">Targeted, step-by-step progress tracking.</h2>
            <p className="text-sm text-text-main font-medium leading-relaxed">
              CKM isn't just about reading documentation. Log your progress, test configurations locally, and trace curriculum milestones inside your workspace shell.
            </p>
          </div>

        </div>
      </section>

      {/* FEATURED RESOURCES SHOWCASE SECTION */}
      <section id="resources" className="mx-auto max-w-7xl px-6 py-20 relative z-10 border-t border-glass-border/30">
        <div className="absolute top-[20%] left-[-150px] w-[500px] h-[500px] bg-accent-cyan/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="sticker sticker-cyan rotate-[-2deg] mb-3">
            <span>03 / FEATURED RESOURCES</span>
          </div>
          <h2 className="section-heading text-3xl sm:text-4xl leading-tight">
            Explore premium configurations & blueprints
          </h2>
          <p className="text-sm text-text-main font-medium leading-relaxed mt-2.5 max-w-xl mx-auto">
            Visually verified, production-ready courses, guides, and shell scripts built by technical experts.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((res, idx) => {
            let catColor = "from-accent-cyan/15 to-accent-cyan/5 border-accent-cyan/25 glow-border-cyan card-tint-cyan";
            let hoverGlow = "hover:border-accent-cyan/40 hover:shadow-[0_12px_40px_rgba(80,70,120,0.06)]";
            let Icon = Terminal;
            let themeTextColor = "text-accent-cyan";
            let themeHoverText = "group-hover:text-accent-cyan";

            if (res.category === "Sys Design") {
              catColor = "from-accent-orange/15 to-accent-orange/5 border-accent-orange/25 glow-border-orange card-tint-peach";
              hoverGlow = "hover:border-accent-orange/40 hover:shadow-[0_12px_40px_rgba(80,70,120,0.06)]";
              Icon = Layers;
              themeTextColor = "text-accent-orange";
              themeHoverText = "group-hover:text-accent-orange";
            } else if (res.category === "AI / ML") {
              catColor = "from-accent-purple/15 to-accent-purple/5 border-accent-purple/25 glow-border-purple card-tint-purple";
              hoverGlow = "hover:border-accent-purple/40 hover:shadow-[0_12px_40px_rgba(80,70,120,0.06)]";
              Icon = Cpu;
              themeTextColor = "text-accent-purple";
              themeHoverText = "group-hover:text-accent-purple";
            }

            return (
              <div
                key={idx}
                className={`group relative rounded-3xl border p-6 bg-glass-card transition-all duration-300 hover:translate-y-[-6px] hover:scale-[1.01] flex flex-col justify-between text-left ${catColor} ${hoverGlow} ${res.rotation}`}
              >
                <div className="space-y-4 w-full">
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <span className={`sticker ${res.pillColor} scale-90 origin-left`}>
                      {res.badgeText}
                    </span>
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{res.category}</span>
                  </div>

                  {/* UI-driven Graphic Course Thumbnail Composition */}
                  <div className={`h-32 w-full rounded-2xl bg-gradient-to-br ${
                    res.category === 'Web Dev' ? 'from-[#0b2447] via-[#19376d] to-[#02040a] border-accent-cyan/30' :
                    res.category === 'Sys Design' ? 'from-[#2c1100] via-[#4d2200] to-[#02040a] border-accent-orange/30' :
                    'from-[#200b3b] via-[#3d1355] to-[#02040a] border-accent-purple/30'
                  } border relative overflow-hidden flex items-center justify-center p-4 shadow-[inset_0_4px_20px_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover:scale-[1.02]`}>
                    
                    {/* Glowing Light Effect */}
                    <div className={`absolute h-28 w-28 rounded-full bg-gradient-to-br ${
                      res.category === 'Web Dev' ? 'from-cyan-400 to-blue-500' :
                      res.category === 'Sys Design' ? 'from-orange-400 to-amber-500' :
                      'from-purple-400 to-pink-500'
                    } opacity-20 blur-xl pointer-events-none`} />

                    {/* Dot grid decoration for futuristic coding vibe */}
                    <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
                    
                    <div className="w-full h-full flex flex-col justify-between relative z-10 text-[9px] font-mono text-text-muted leading-normal">
                      <div className="flex items-center justify-between border-b border-glass-border/40 pb-1.5 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <Icon size={12} className={themeTextColor} />
                          <span className="text-text-title font-bold transition-colors">{res.type} config</span>
                        </div>
                        <span className="text-[8px]">v2.1.0</span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="h-1.5 bg-glass-border rounded-sm w-[85%]"></div>
                        <div className="h-1.5 bg-glass-border rounded-sm w-[60%]"></div>
                        <div className="h-1.5 bg-glass-border rounded-sm w-[75%]"></div>
                      </div>

                      <div className="flex justify-between items-end border-t border-glass-border/30 pt-1.5 mt-1.5">
                        <span className="text-[8px] uppercase tracking-wider">{res.difficulty}</span>
                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-bg-dark text-[8px] font-bold text-text-title uppercase">
                          {res.initials}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className={`text-sm font-bold text-text-title leading-snug transition-colors duration-200 ${themeHoverText}`}>
                      {res.title}
                    </h3>
                    <p className="text-xs text-text-main font-medium leading-relaxed line-clamp-3">
                      {res.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-glass-border/40 space-y-4 w-full">
                  {/* Creator & Stats Row */}
                  <div className="flex items-center justify-between text-[10px] text-text-muted">
                    <div className="flex items-center gap-2">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center font-extrabold text-[8px] text-text-title uppercase bg-gradient-to-br ${
                        res.category === 'Web Dev' ? 'from-cyan-500/30' : res.category === 'Sys Design' ? 'from-orange-500/30' : 'from-purple-500/30'
                      } to-transparent border border-glass-border transition-transform duration-300 group-hover:scale-105`}>
                        {res.initials}
                      </div>
                      <span className="font-semibold text-text-main">{res.creator}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-0.5 font-bold"><span className="text-amber-500 transition-transform group-hover:scale-110 duration-200">★</span> {res.rating}</span>
                      <span className="font-medium">{res.learners}</span>
                    </div>
                  </div>

                  {/* Duration & Difficulty Row */}
                  <div className="flex items-center justify-between text-[10px] text-text-muted">
                    <div className="flex items-center gap-1.5">
                      <Clock size={11} className="text-text-muted" />
                      <span>{res.duration}</span>
                    </div>
                    <span className="font-bold text-[9px] uppercase tracking-wider">{res.difficulty}</span>
                  </div>

                  {/* Price & CTA Button */}
                  <div className="flex items-center justify-between gap-4 pt-1.5">
                    <div className="text-left">
                      <span className="text-[9px] text-text-muted uppercase tracking-widest block leading-none">Price</span>
                      <span className="text-sm font-extrabold text-text-title mt-1.5 block">{res.price}</span>
                    </div>
                    <Button
                      variant="primary"
                      onClick={() => handlePlaceholderClick(res.title)}
                      className="text-[10px] font-bold py-2 px-4 rounded-xl"
                    >
                      Unlock Now
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* EXPERT DISCOVERY SECTION */}
      <section id="experts" className="mx-auto max-w-7xl px-6 py-24 relative z-10 border-t border-glass-border/30">
        <div className="absolute top-[10%] left-[-150px] w-[500px] h-[500px] bg-accent-orange/5 rounded-full blur-[90px] pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4 text-left">
            <div className="sticker sticker-orange rotate-[-2deg]">
              <span>04 / MASTER CONSULTING</span>
            </div>
            <h2 className="section-heading text-3xl sm:text-4xl leading-tight">
              Sometimes you don't need another tutorial.
            </h2>
          </div>
          <p className="text-xs text-text-main font-semibold max-w-xs leading-relaxed text-left">
            "You need an architect who has already deployed it at scale." Connect live with verified developers.
          </p>
        </div>

        {/* Experts Directory grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experts.map((exp, idx) => (
            <SpotlightCard
              key={idx}
              className="group p-6 bg-glass-card border border-glass-border rounded-2xl relative overflow-hidden text-left hover:translate-y-[-4px] hover:scale-[1.01] hover:border-glass-border-hover transition-all duration-300 ease-out"
              glowColor={exp.glowColor}
            >
              {/* Radial gradient background light */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-accent-orange/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="flex flex-col sm:flex-row gap-5 relative z-10">
                {/* Expert portrait */}
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.2)] relative border font-extrabold text-lg text-white uppercase bg-gradient-to-br transition-all duration-300 ${
                  idx === 0
                    ? "from-orange-500 to-amber-500 border-orange-400/30 glow-border-orange group-hover:shadow-[0_0_15px_rgba(249,115,22,0.25)] group-hover:border-orange-400"
                    : "from-purple-500 to-pink-500 border-purple-400/30 glow-border-purple group-hover:shadow-[0_0_15px_rgba(168,85,247,0.25)] group-hover:border-purple-400"
                }`}>
                  {exp.portrait && !exp.portrait.includes("unsplash.com") ? (
                    <img src={exp.portrait} alt={exp.name} className="h-full w-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    exp.name.split(' ').map(n => n[0]).join('')
                  )}
                  <div className="absolute -bottom-2 -right-2 bg-bg-darker p-1 rounded-tl-xl border-t border-l border-glass-border">
                    <span className="text-[8px] text-amber-400">★</span>
                  </div>
                  {/* Status Indicator */}
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 transition-transform duration-300 group-hover:scale-110">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                </div>

                <div className="space-y-3.5 flex-grow w-full">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-glass-border/40 pb-2">
                    <div>
                      <h3 className={`text-sm font-bold text-text-title mb-0.5 transition-colors ${
                        idx === 0 ? "group-hover:text-accent-orange" : "group-hover:text-accent-purple"
                      }`}>{exp.name}</h3>
                      <p className="text-[10px] text-text-muted font-bold">{exp.role}</p>
                    </div>
                    
                    <span className="text-[9px] text-accent-orange bg-accent-orange/15 border border-accent-orange/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider transition-all duration-300 group-hover:bg-accent-orange/25 group-hover:border-accent-orange/40 group-hover:shadow-[0_0_8px_rgba(249,115,22,0.2)]">
                      {exp.availability}
                    </span>
                  </div>

                  <p className="text-xs text-text-main leading-relaxed font-medium transition-colors group-hover:text-text-title">
                    Former developer specialized in high-scale infrastructure audits, multi-region database replications, and zero-downtime container configuration.
                  </p>

                  <div className="pt-2 flex items-center justify-between text-[10px] text-text-muted font-bold uppercase tracking-wider">
                    <span className="transition-colors group-hover:text-text-main">{exp.expertise}</span>
                    <div className="flex items-center gap-3 font-semibold text-text-muted normal-case">
                      <span className="transition-colors group-hover:text-text-title">{exp.sessions}</span>
                      <span className="flex items-center gap-0.5"><span className="text-amber-500 transition-transform duration-200 group-hover:scale-110">★</span> {exp.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* CREATORS SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-20 relative z-10 border-t border-glass-border/30">
        <div className="absolute top-[20%] right-[-150px] w-[500px] h-[500px] bg-accent-purple/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left content description */}
          <div className="lg:col-span-5 text-left space-y-6">
            <div className="sticker sticker-purple rotate-[-2deg]">
              <span>05 / MONETIZE EXPERIENCE</span>
            </div>
            <h2 className="section-heading text-3xl sm:text-4xl leading-tight">
              Compile notes & sell configurations.
            </h2>
            <p className="text-sm text-text-main font-medium leading-relaxed">
              Compile your schema templates, config scripts, and blueprints. Set your pricing model and distribute files securely to builders on CKM.
            </p>

            <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
              {[
                { title: "Boilerplates", text: "Package codebase ZIPs." },
                { title: "Checklists", text: "Upload audit references." },
                { title: "Consulting", text: "Open mentorship call times." },
                { title: "Payouts", text: "Get paid direct to account." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <Check size={13} className="text-accent-purple mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-text-title font-bold">{item.title}</h4>
                    <p className="text-[9px] text-text-muted mt-0.5">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right visual dashboard preview */}
          <div className="lg:col-span-7 bg-bg-panel border border-glass-border rounded-2xl p-6 shadow-2xl relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-accent-purple/5 blur-2xl pointer-events-none"></div>
            
            {/* Header with Creator Identity */}
            <div className="flex items-center justify-between border-b border-glass-border/40 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center font-extrabold text-sm text-accent-purple bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-accent-purple/20 glow-border-purple">
                  AR
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-text-title leading-none">Alex Rivera</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                  <span className="text-[9px] text-text-muted font-bold uppercase tracking-widest mt-0.5 block">CKM Verified Creator</span>
                </div>
              </div>
              <span className="text-[10px] text-text-muted font-bold">Standard Account</span>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-4 gap-3 mb-5">
              <div className="bg-bg-darker/60 border border-glass-border/60 rounded-xl p-2.5 text-center">
                <div className="text-[8px] font-bold text-text-muted uppercase tracking-wider">Earnings</div>
                <div className="text-[11px] font-extrabold text-emerald-400 mt-1">$4,850.00</div>
              </div>
              <div className="bg-bg-darker/60 border border-glass-border/60 rounded-xl p-2.5 text-center">
                <div className="text-[8px] font-bold text-text-muted uppercase tracking-wider">Resources</div>
                <div className="text-[11px] font-extrabold text-text-title mt-1">18 Items</div>
              </div>
              <div className="bg-bg-darker/60 border border-glass-border/60 rounded-xl p-2.5 text-center">
                <div className="text-[8px] font-bold text-text-muted uppercase tracking-wider">Learners</div>
                <div className="text-[11px] font-extrabold text-accent-blue mt-1">1,420</div>
              </div>
              <div className="bg-bg-darker/60 border border-glass-border/60 rounded-xl p-2.5 text-center">
                <div className="text-[8px] font-bold text-text-muted uppercase tracking-wider">Rating</div>
                <div className="text-[11px] font-extrabold text-amber-400 mt-1">4.9 ★</div>
              </div>
            </div>

            {/* Miniature Resource Catalog Preview */}
            <div className="space-y-2 mb-5">
              <div className="text-[9px] font-extrabold text-text-muted uppercase tracking-widest mb-1.5">Published Resources</div>
              {[
                { title: "Production Next.js 15 Masterclass", type: "Course", price: "$29.00", category: "Web Dev", color: "border-accent-cyan/20 bg-accent-cyan/5 card-tint-cyan", text: "text-accent-cyan" },
                { title: "Raft Consensus Blueprint & Scripts", type: "Guide", price: "$15.00", category: "Sys Design", color: "border-accent-orange/20 bg-accent-orange/5 card-tint-peach", text: "text-accent-orange" }
              ].map((res, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-bg-darker/40 border border-glass-border rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-extrabold border ${res.color} ${res.text}`}>
                      {res.type}
                    </span>
                    <span className="text-[10px] font-bold text-text-title">{res.title}</span>
                  </div>
                  <span className="text-[10px] font-bold text-text-title">{res.price}</span>
                </div>
              ))}
            </div>

            {/* Analytical Graph mockup */}
            <div className="bg-bg-darker/40 border border-glass-border/40 rounded-xl p-4">
              <div className="flex items-center justify-between text-[9px] text-text-muted mb-4">
                <span>Revenue Metrics</span>
                <span className="text-accent-purple font-bold">+18.5% growth</span>
              </div>
              <div className="flex items-end justify-between h-20 px-2 gap-2 pt-2">
                {[30, 45, 35, 60, 50, 75, 90, 85].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gradient-to-t from-accent-purple/20 to-accent-purple rounded-t-sm transition-all duration-500 hover:to-text-title" style={{ height: `${h}%` }}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* COMMUNITY DISCUSSIONS */}
      <section id="community" className="mx-auto max-w-7xl px-6 py-24 relative z-10 border-t border-glass-border/30">
        <div className="absolute top-[10%] left-[-150px] w-[500px] h-[500px] bg-accent-pink/5 rounded-full blur-[90px] pointer-events-none"></div>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="sticker sticker-pink rotate-[-2deg] mb-3">
            <span>06 / PEER COMMONS</span>
          </div>
          <h2 className="section-heading text-3xl">Active Developer Threads</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: "What is the best way to structure Redis caching inside Next.js API endpoints?", author: "Nikola T.", replies: 18, likes: 42, topic: "Web Dev" },
            { title: "Decoupling microservices: should we use Kafka event streaming or simple RabbitMQ exchanges?", author: "Sarah L.", replies: 24, likes: 56, topic: "System Design" }
          ].map((d, idx) => (
            <SpotlightCard
              key={idx}
              className="p-6 bg-glass-card border border-glass-border rounded-2xl flex flex-col justify-between text-left"
              glowColor="rgba(236, 72, 153, 0.12)"
            >
              <div className="space-y-4 w-full">
                <div className="flex items-center justify-between text-[10px] font-bold text-text-muted">
                  <span className="uppercase tracking-wider">{d.topic}</span>
                  <span>Started by {d.author}</span>
                </div>
                <h3 className="text-xs font-bold text-text-title hover:text-accent-blue transition-all cursor-pointer leading-relaxed">
                  "{d.title}"
                </h3>
              </div>

              <div className="mt-8 pt-4 border-t border-glass-border/30 flex items-center justify-between text-[10px] text-text-muted font-semibold w-full">
                <div className="flex gap-4">
                  <span>{d.replies} replies</span>
                  <span>{d.likes} likes</span>
                </div>
                <button
                  onClick={() => handlePlaceholderClick("Community Forum")}
                  className="text-accent-pink hover:text-text-title flex items-center gap-1 transition cursor-pointer"
                >
                  Join discussion <ArrowRight size={10} />
                </button>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* PLATFORM STATISTICS SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-20 relative z-10 border-t border-glass-border/30">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { num: "10K+", label: "Active Learners", color: "text-accent-blue", bgGlow: "rgba(59, 130, 246, 0.08)" },
            { num: "2.5K+", label: "Verified Resources", color: "text-accent-cyan", bgGlow: "rgba(6, 182, 212, 0.08)" },
            { num: "800+", label: "Specialist Creators", color: "text-accent-purple", bgGlow: "rgba(168, 85, 247, 0.08)" },
            { num: "320+", label: "Consultant Experts", color: "text-accent-orange", bgGlow: "rgba(249, 115, 22, 0.08)" }
          ].map((stat, idx) => (
            <SpotlightCard
              key={idx}
              className="group p-6 bg-glass-card border border-glass-border rounded-2xl text-center flex flex-col items-center justify-center hover:translate-y-[-4px] hover:scale-[1.01] hover:border-glass-border-hover transition-all duration-300 ease-out"
              glowColor={stat.bgGlow}
            >
              <div className={`text-2xl sm:text-3xl font-extrabold ${stat.color} tracking-tight transition-transform duration-300 group-hover:scale-105`}>{stat.num}</div>
              <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider mt-1.5 transition-colors group-hover:text-text-title">{stat.label}</div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="mx-auto max-w-5xl px-6 py-12 relative z-10">
        
        <div className="relative rounded-3xl overflow-hidden bg-bg-panel border border-glass-border p-12 md:p-18 text-center shadow-2xl">
          <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none"></div>
          
          <div className="relative z-10 max-w-xl mx-auto space-y-6">
            <h2 className="hero-heading text-3xl sm:text-4xl leading-tight">
              Your next breakthrough could start here.
            </h2>
            <p className="text-xs sm:text-sm text-text-main leading-relaxed font-medium">
              Join a modern repository built to connect resources, course modules, and direct mentorship lines.
            </p>
            <div className="pt-4 flex justify-center">
              {isAuthenticated ? (
                <Button
                  variant="primary"
                  className="font-bold px-8 py-3.5 rounded-xl text-xs"
                  onClick={() => handlePlaceholderClick("Marketplace Dashboard")}
                >
                  Explore Dashboard
                </Button>
              ) : (
                <Link to="/signup">
                  <Button
                    variant="primary"
                    className="font-bold px-8 py-3.5 rounded-xl text-xs"
                  >
                    Get Started with CKM
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;
