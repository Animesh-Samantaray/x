import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Compass,
  BookOpen,
  Users,
  MessageSquare,
  Bookmark,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Info,
  Calendar,
  FileText,
  CheckCircle,
  Play,
  Share2
} from "lucide-react";
import GlassCard from "../components/GlassCard";
import Button from "../components/Button";

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const [toastMessage, setToastMessage] = useState("");

  const handlePlaceholderClick = (pageName) => {
    setToastMessage(`The "${pageName}" feature is coming soon in the next development phase!`);
    setTimeout(() => setToastMessage(""), 4000);
  };

  return (
    <div className="relative pb-24 overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 glass-panel border-accent-indigo bg-bg-darker/90 px-5 py-4 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] transition-all duration-300 animate-slide-in">
          <Info className="text-accent-indigo shrink-0" size={18} />
          <p className="text-xs font-semibold text-slate-200">{toastMessage}</p>
        </div>
      )}

      {/* Grid overlay for ambient feel */}
      <div className="absolute inset-0 dot-grid pointer-events-none z-0"></div>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-16 md:pt-24 pb-20 sm:px-6 lg:px-8 z-10">
        {/* Glow behind hero */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 h-[450px] w-[80%] rounded-full ambient-glow-indigo opacity-80 pointer-events-none z-0"></div>
        <div className="absolute top-[25%] left-1/4 h-[350px] w-[50%] rounded-full ambient-glow-purple opacity-40 pointer-events-none z-0"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column: Copywriting */}
          <div className="lg:col-span-7 text-left flex flex-col items-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-glass-border bg-slate-900/40 px-3.5 py-1 text-[11px] font-bold text-slate-400 mb-6 uppercase tracking-widest select-none">
              <Sparkles size={11} className="text-accent-indigo" />
              <span>Knowledge • Community • Growth</span>
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1] mb-6">
              Knowledge Becomes More Valuable <span className="text-gradient-accent">When It's Shared.</span>
            </h1>
            
            <p className="max-w-xl text-[15px] sm:text-base text-slate-400 leading-relaxed mb-8">
              Discover practical knowledge, learn from creators and industry experts, and share what you know with a growing global network of builders.
            </p>

            <div className="flex flex-wrap items-center gap-3.5">
              {isAuthenticated ? (
                <>
                  <Button
                    variant="primary"
                    onClick={() => handlePlaceholderClick("Marketplace / Explore")}
                    className="gap-1.5"
                  >
                    Start Learning <ArrowRight size={14} />
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handlePlaceholderClick("Creator Hub")}
                  >
                    Share Knowledge
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="primary" className="gap-1.5">
                      Start Learning <ArrowRight size={14} />
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="secondary">
                      Share Knowledge
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Premium Layered UI Representation */}
          <div className="lg:col-span-5 relative h-[450px] w-full hidden md:block select-none pointer-events-none">
            {/* Widget 1: Creator Card (Floating Top-Left) */}
            <div className="absolute top-[5%] left-[2%] w-[230px] rounded-2xl glass-panel border border-glass-border p-4 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.6)] transform -rotate-2 hover:rotate-0 transition duration-300 z-20">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-gradient-accent p-[1px]">
                  <div className="flex h-full w-full items-center justify-center rounded-lg bg-bg-deep font-bold text-slate-200 text-xs">
                    JD
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Jane Doe</h4>
                  <p className="text-[10px] text-slate-400">Staff Backend Engineer</p>
                </div>
              </div>
              <div className="mt-4 border-t border-glass-border pt-3 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Creator Sales</span>
                <span className="font-bold text-emerald-400">$12,480</span>
              </div>
            </div>

            {/* Widget 2: Resource Preview (Center-Right) */}
            <div className="absolute top-[15%] right-[2%] w-[270px] rounded-2xl bg-bg-darker border border-glass-border/80 p-5 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] transform rotate-3 hover:rotate-0 transition duration-300 z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] bg-accent-blue/15 text-accent-blue border border-accent-blue/20 rounded px-1.5 py-0.5 font-bold uppercase tracking-wider">
                  PDF Guide
                </span>
                <span className="text-[10px] text-slate-500">2.4MB</span>
              </div>
              <h4 className="text-xs font-bold text-slate-200 mb-1 leading-snug">
                Production-Ready System Design Patterns
              </h4>
              <p className="text-[10px] text-slate-500 mb-4">Scalability, caching, and rate limiting</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-400 text-xs">★</span>
                  <span className="text-[11px] font-bold text-slate-300">4.9</span>
                  <span className="text-[10px] text-slate-500">(142 sales)</span>
                </div>
                <span className="text-xs font-extrabold text-white">$19.00</span>
              </div>
            </div>

            {/* Widget 3: Learning Progress Card (Floating Bottom-Left) */}
            <div className="absolute bottom-[10%] left-[8%] w-[240px] rounded-2xl glass-panel border border-glass-border p-4 shadow-[0_15px_30px_rgba(0,0,0,0.6)] transform -rotate-1 hover:rotate-0 transition duration-300 z-20">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                <span className="font-medium">My Progress</span>
                <span className="text-accent-indigo font-bold">82%</span>
              </div>
              <h4 className="text-xs font-bold text-slate-200 mb-2.5 truncate">
                Next.js 15 App Router Architecture
              </h4>
              
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-gradient-accent rounded-full" style={{ width: "82%" }}></div>
              </div>
              
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>Lesson 14 of 17</span>
                <span className="flex items-center gap-1 text-accent-indigo font-medium">
                  Resume <Play size={8} fill="currentColor" />
                </span>
              </div>
            </div>

            {/* Widget 4: Mentorship Call Block (Bottom-Right) */}
            <div className="absolute bottom-[5%] right-[5%] w-[210px] rounded-2xl glass-panel border border-glass-border p-4 shadow-[0_15px_35px_rgba(0,0,0,0.7)] transform rotate-2 hover:rotate-0 transition duration-300 z-30">
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={12} className="text-accent-purple" />
                <span className="text-[10px] font-bold text-slate-300">Live Mentorship</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Alex Rivera</h4>
                  <p className="text-[9px] text-slate-500">Staff Security Architect</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-slate-900 border border-glass-border flex items-center justify-center font-bold text-slate-400 text-xs">
                  AR
                </div>
              </div>
              <div className="text-[10px] text-slate-400 bg-slate-950/50 rounded-lg py-1.5 px-2.5 border border-glass-border/60 text-center">
                Tomorrow, 4:00 PM EST
              </div>
            </div>

            {/* Widget 5: Small Activity Feed Block */}
            <div className="absolute top-[48%] left-[45%] rounded-full bg-slate-900/90 border border-accent-indigo/25 shadow-lg py-1.5 px-3 flex items-center gap-2 z-40 transform hover:scale-105 transition">
              <span className="h-2 w-2 rounded-full bg-accent-indigo animate-ping"></span>
              <span className="text-[10px] font-bold text-slate-200">124 consultants online</span>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Bento Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 relative z-10">
        <div className="absolute top-[10%] right-[-10%] h-[300px] w-[500px] rounded-full ambient-glow-blue opacity-30 pointer-events-none z-0"></div>

        <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
          <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            A Complete Hub for Exchanging Expertise
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-slate-400 leading-relaxed">
            Stop relying on generic course platforms. Leverage clean structural layouts built for learners, creators, and expert consultants.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {/* Card 1: Large Spanning Card (Learn from Creators) */}
          <GlassCard className="md:col-span-2 flex flex-col md:flex-row gap-6 p-8 items-center border border-glass-border">
            <div className="flex-grow space-y-4 md:max-w-[60%]">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950/60 border border-glass-border text-accent-indigo">
                <BookOpen size={16} />
              </div>
              <h3 className="text-xl font-bold text-white">Learn From People Who Know</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Discover targeted tutorials, custom guide books, and educational kits prepared by developers, designers, and specialists who write code every day.
              </p>
              <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-500">
                <CheckCircle size={12} className="text-accent-indigo" />
                <span>Verified Authors</span>
                <span className="text-glass-border">•</span>
                <CheckCircle size={12} className="text-accent-indigo" />
                <span>One-time purchases</span>
              </div>
            </div>
            
            {/* Visual inside the large bento */}
            <div className="w-full md:w-[40%] bg-slate-950/50 border border-glass-border/60 rounded-xl p-4 space-y-3">
              <div className="h-1.5 w-1/3 bg-slate-800 rounded"></div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-glass-border/40 pb-2">
                  <span>Vite Configs</span>
                  <span className="font-bold text-white">$12.00</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-glass-border/40 pb-2">
                  <span>NestJS Patterns</span>
                  <span className="font-bold text-white">$15.00</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Tailwind Presets</span>
                  <span className="font-bold text-white">Free</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Card 2: Expert Mentorship */}
          <GlassCard className="flex flex-col justify-between border border-glass-border">
            <div className="space-y-4">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950/60 border border-glass-border text-accent-purple">
                <Users size={16} />
              </div>
              <h3 className="text-lg font-bold text-white">Expert Mentorship</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Book live consulting sessions. Request technical code audits, architecture design reviews, or career planning calls.
              </p>
            </div>
            <div className="mt-6 text-xs text-accent-purple font-bold tracking-wider uppercase flex items-center gap-1">
              Book a call <ArrowRight size={12} />
            </div>
          </GlassCard>

          {/* Card 3: Knowledge Resources */}
          <GlassCard className="flex flex-col justify-between border border-glass-border">
            <div className="space-y-4">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950/60 border border-glass-border text-accent-blue">
                <FileText size={16} />
              </div>
              <h3 className="text-lg font-bold text-white">Resource Files</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Download verified source files, database scripts, configurations, and technical cheat-sheets.
              </p>
            </div>
            <div className="mt-6 text-xs text-accent-blue font-bold tracking-wider uppercase flex items-center gap-1">
              Browse files <ArrowRight size={12} />
            </div>
          </GlassCard>

          {/* Card 4: Large Spanning Card (Learning Progress) */}
          <GlassCard className="md:col-span-2 flex flex-col md:flex-row gap-6 p-8 items-center border border-glass-border">
            {/* Visual element */}
            <div className="w-full md:w-[40%] bg-slate-950/50 border border-glass-border/60 rounded-xl p-4 space-y-3 shrink-0">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">My Dashboard</span>
                <span className="text-emerald-400 font-bold">2 Completed</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-accent rounded-full" style={{ width: "65%" }}></div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-indigo"></span>
                  TypeScript Generics (80%)
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Docker Foundations (Done)
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950/60 border border-glass-border text-emerald-400">
                <TrendingUp size={16} />
              </div>
              <h3 className="text-xl font-bold text-white">Track Learning Progress</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Organize your studies. Measure completion rates, review saved milestones, and download achievement tags directly to showcase in your portfolio.
              </p>
            </div>
          </GlassCard>

          {/* Card 5: Community Discussions */}
          <GlassCard className="flex flex-col justify-between border border-glass-border">
            <div className="space-y-4">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950/60 border border-glass-border text-amber-400">
                <MessageSquare size={16} />
              </div>
              <h3 className="text-lg font-bold text-white">Community</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect in peer groups. Ask advice, discuss releases, and debug errors alongside active coders.
              </p>
            </div>
            <div className="mt-6 text-xs text-amber-400 font-bold tracking-wider uppercase flex items-center gap-1">
              Join forum <ArrowRight size={12} />
            </div>
          </GlassCard>

          {/* Card 6: Save & Organize */}
          <GlassCard className="flex flex-col justify-between border border-glass-border">
            <div className="space-y-4">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950/60 border border-glass-border text-rose-400">
                <Bookmark size={16} />
              </div>
              <h3 className="text-lg font-bold text-white">Organize Library</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Create folders and save resource cards to curate your custom educational bookshelf.
              </p>
            </div>
            <div className="mt-6 text-xs text-rose-400 font-bold tracking-wider uppercase flex items-center gap-1">
              My bookmarks <ArrowRight size={12} />
            </div>
          </GlassCard>
        </div>
      </section>

      {/* How It Works Timeline */}
      <section className="border-y border-glass-border bg-bg-darker/20 py-20 backdrop-blur-sm relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">How It Works</h2>
            <p className="mt-3.5 text-sm text-slate-400">
              A refined educational cycle engineered to build knowledge and support community growth.
            </p>
          </div>

          {/* Desktop Horizontal / Mobile Vertical Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
            
            {/* Desktop timeline connecting line */}
            <div className="absolute top-[28px] left-[15%] right-[15%] h-[1px] bg-glass-border hidden md:block z-0"></div>

            {/* Step 1 */}
            <div className="text-center relative z-10 flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-950 border border-glass-border text-sm font-bold text-accent-indigo shadow-md mb-5">
                01
              </div>
              <h3 className="text-[15px] font-bold text-slate-100 mb-2 uppercase tracking-wide">Discover</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                Search high-quality guides, code snippets, and vetted consultants in your engineering or design domains.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center relative z-10 flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-950 border border-glass-border text-sm font-bold text-accent-purple shadow-md mb-5">
                02
              </div>
              <h3 className="text-[15px] font-bold text-slate-100 mb-2 uppercase tracking-wide">Learn</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                Read guidebooks, attend mentoring consultations, and track lesson metrics inside your user dashboard.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center relative z-10 flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-950 border border-glass-border text-sm font-bold text-accent-blue shadow-md mb-5">
                03
              </div>
              <h3 className="text-[15px] font-bold text-slate-100 mb-2 uppercase tracking-wide">Share</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                Compile your personal notes and source templates into guides to support other learners and generate revenue.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Platform Personas */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            One Platform. Different Ways to Grow.
          </h2>
          <p className="mt-3.5 text-sm text-slate-400">
            Tailor-made structural layouts built to encourage learning and immediate contribution.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <GlassCard className="flex flex-col justify-between border border-glass-border/60" hoverEffect={true}>
            <div>
              <div className="text-accent-indigo text-[10px] font-extrabold uppercase tracking-widest mb-3">Learner Mode</div>
              <h3 className="text-lg font-bold text-white mb-3">LEARNER</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gain direct access to creator assets, purchase source code resources, and book consultation sessions to fast-track your tech career.
              </p>
            </div>
            <div className="mt-6 border-t border-glass-border/40 pt-4 text-slate-500 text-[11px]">
              Access code, PDFs, and consultations
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col justify-between border border-glass-border/60" hoverEffect={true}>
            <div>
              <div className="text-accent-purple text-[10px] font-extrabold uppercase tracking-widest mb-3">Author Mode</div>
              <h3 className="text-lg font-bold text-white mb-3">CREATOR</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Package your files, lessons, and configuration guides. Set prices and distribute documents to developers searching for pre-vetted systems.
              </p>
            </div>
            <div className="mt-6 border-t border-glass-border/40 pt-4 text-slate-500 text-[11px]">
              Set prices, upload files, and audit payouts
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col justify-between border border-glass-border/60" hoverEffect={true}>
            <div>
              <div className="text-accent-blue text-[10px] font-extrabold uppercase tracking-widest mb-3">Mentor Mode</div>
              <h3 className="text-lg font-bold text-white mb-3">EXPERT</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Offer 1-on-1 career mapping sessions, live debugging consultations, or code reviews. Help other developers scale.
              </p>
            </div>
            <div className="mt-6 border-t border-glass-border/40 pt-4 text-slate-500 text-[11px]">
              Schedule video links and consult live
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        <div className="absolute inset-0 h-[250px] w-full rounded-full ambient-glow-indigo opacity-35 blur-[120px] pointer-events-none z-0"></div>
        
        <div className="relative rounded-2xl overflow-hidden solid-panel border border-glass-border p-10 md:p-14 text-center shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Your Knowledge Can Change Someone's Next Step.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Sign up today to share resources, list consulting slots, or Master your software engineering craft.
            </p>
            <div className="pt-4 flex justify-center">
              {isAuthenticated ? (
                <Button
                  variant="primary"
                  className="font-bold px-8 py-3"
                  onClick={() => handlePlaceholderClick("Marketplace / Dashboard")}
                >
                  Join the Marketplace
                </Button>
              ) : (
                <Link to="/signup">
                  <Button
                    variant="primary"
                    className="font-bold px-8 py-3"
                  >
                    Join the Marketplace
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
