import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllCourses } from "../services/courseService";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Users,
  MessageSquare,
  ArrowRight,
  Sparkles,
  FileText,
  Play,
  BarChart,
  Cpu,
  Layers,
  Video,
  CheckCircle,
  ShieldCheck,
  Star,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Quote,
  Send,
  User,
  Check,
  Calendar,
  Lock,
} from "lucide-react";
import Button from "../components/Button";

const Landing = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const facilities = [
    { title: "1-on-1 Live Video Consultations", icon: Video, color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
    { title: "Real-Time Socket Discussion Channels", icon: MessageSquare, color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
    { title: "Downloadable Code & Blueprint Resources", icon: FileText, color: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
    { title: "Real Database Telemetry & Progress Analytics", icon: BarChart, color: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
    { title: "2FA & Role-Based Access Control", icon: ShieldCheck, color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
    { title: "Interactive Video Unit Player", icon: Play, color: "text-pink-400 border-pink-500/30 bg-pink-500/10" },
    { title: "Direct Creator-Student Messaging", icon: Users, color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10" },
    { title: "Admin Moderation Queue & Audit Logs", icon: Layers, color: "text-rose-400 border-rose-500/30 bg-rose-500/10" },
  ];

  const testimonials = [
    {
      name: "Marcus Aurelius",
      role: "Senior AI Software Engineer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      rating: 5,
      quote: "CKM's system design blueprints helped me pass my principal engineer interviews. The 1-on-1 expert mentorship session cleared my doubts on distributed consensus algorithms in minutes.",
    },
    {
      name: "Sofia Rodriguez",
      role: "Lead Fullstack Architect",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
      rating: 5,
      quote: "As a course creator, the authoring studio allowed me to package my Next.js architecture knowledge into interactive units and earn direct revenue while building a community.",
    },
    {
      name: "Dr. David Vance",
      role: "Principal Cryptography Lead",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      rating: 5,
      quote: "The 1-on-1 mentorship scheduling system connects me directly with ambitious software leads. I can set custom slot availability and conduct code reviews seamlessly.",
    }
  ];

  const mentors = [
    {
      name: "Mentor Thomas Winsley",
      title: "Director AI Lead",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
      bio: "Forefront of shaping distributed systems and AI neural infrastructure.",
      specialty: "Distributed Systems & RAG",
    },
    {
      name: "Mentor Kate Green",
      title: "VP Engineering",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
      bio: "High-availability system design and modern web architecture.",
      specialty: "Next.js 15 & Microservices",
    },
    {
      name: "Mentor Alex Rivera",
      title: "Cloud Infrastructure Architect",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
      bio: "Kubernetes operators, Raft consensus, and zero-downtime deployments.",
      specialty: "Cloud Native & DevOps",
    },
  ];

  const faqs = [
    {
      q: "What is Collaborative Knowledge Marketplace (CKM)?",
      a: "CKM is a commercial EdTech platform designed for developers, creators, expert mentors, and admins. It provides interactive course units, downloadable code blueprints, and direct 1-on-1 video mentorship calls.",
    },
    {
      q: "How does 1-on-1 Expert Mentorship work?",
      a: "Expert mentors publish open session slots with dates and topics. Learners request bookings, and once accepted by the expert, both parties receive instant calendar notifications and video meeting room access.",
    },
    {
      q: "Can I author courses and monetize my technical knowledge?",
      a: "Yes! Switch to the Creator role to access the Content Authoring Studio. You can draft course units, attach PDF/code resource blueprints, set your custom pricing, and track student enrollments.",
    },
    {
      q: "Are course blueprints and downloadable resources verified?",
      a: "All uploaded blueprints and resources undergo platform moderation before being published to guarantee high technical quality and security compliance.",
    },
    {
      q: "What user roles are supported on CKM?",
      a: "CKM supports 4 specialized roles: Learner (study & track skills), Creator (author & monetize courses), Expert (host 1-on-1 mentorship calls), and Admin (platform operations & moderation).",
    },
  ];

  useEffect(() => {
    const fetchTopCourses = async () => {
      try {
        setCoursesLoading(true);
        const res = await getAllCourses();
        if (res && res.success) {
          setFeaturedCourses((res.courses || []).slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to fetch featured courses:", err);
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchTopCourses();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput("");
    }
  };

  const handleEnrollClick = (courseId) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/courses/${courseId}`);
    }
  };

  const handleBookCallClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/sessions");
    }
  };

  return (
    <div className="min-h-screen bg-bg-deep text-text-main relative overflow-hidden font-sans transition-colors duration-200">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 md:pt-20 pb-20 border-b border-glass-border overflow-hidden bg-gradient-to-b from-bg-dark via-bg-deep to-bg-deep">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-cyan-500/15 via-purple-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[11px]">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={12} /> AI & Tech Masterclass Hub
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold uppercase tracking-wider">
                Industry Connected
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold uppercase tracking-wider">
                1-on-1 Expert Mentorship
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.06] tracking-tight text-text-title font-display">
              Boost Your Skills And <span className="text-gradient-cyan">Get Ahead</span>
            </h1>

            <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto leading-relaxed font-medium">
              Collaborative Knowledge Marketplace for high-stakes engineering. Master AI neural systems, distributed architecture, and fullstack frameworks with top mentors on desktop & mobile.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              {isAuthenticated ? (
                <Button
                  onClick={() => navigate(`/${user?.role || "learner"}/dashboard`)}
                  className="group gap-2 text-xs font-bold py-3.5 px-7 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-xl shadow-purple-950/20"
                >
                  Enter {user?.role || "Learner"} Workspace <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </Button>
              ) : (
                <>
                  <Link to="/courses">
                    <Button className="group gap-2 text-xs font-bold py-3.5 px-7 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-xl shadow-purple-950/20">
                      Explore Masterclasses <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="secondary" className="text-xs font-bold py-3.5 px-7 rounded-xl border border-glass-border bg-glass-card text-text-title hover:bg-glass-border">
                      Join Marketplace
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="mt-14 relative max-w-5xl mx-auto flex justify-center items-end">
            <div className="w-full max-w-4xl relative z-10 shadow-2xl">
              <div className="rounded-t-3xl border-4 border-glass-border bg-bg-dark p-2 sm:p-3 relative overflow-hidden shadow-2xl">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-700 mx-auto mb-2 border border-slate-600" />
                <div className="rounded-xl overflow-hidden relative border border-glass-border bg-bg-deep group">
                  <img
                    src="/assets/hero_laptop.jpg"
                    alt="CKM Laptop Workspace"
                    className="w-full h-auto object-cover max-h-[420px] rounded-xl shadow-inner"
                  />

                  <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm p-3.5 rounded-xl bg-bg-dark/95 border border-glass-border backdrop-blur-md space-y-1.5 text-left text-xs shadow-2xl">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="font-mono font-bold text-text-title uppercase text-[10px]">AI Neural Architecture</span>
                    </div>
                    <p className="text-[11px] text-text-muted font-medium">Interactive code execution & vector database indexing masterclass.</p>
                  </div>
                </div>
              </div>

              <div className="w-full h-4 bg-bg-dark rounded-b-2xl border-t border-glass-border relative flex justify-center shadow-xl">
                <div className="w-20 h-1.5 bg-slate-700 rounded-full mt-0.5" />
              </div>
            </div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute -right-2 sm:right-4 md:-right-8 bottom-0 z-20 w-44 sm:w-56 md:w-60 drop-shadow-2xl"
            >
              <div className="rounded-[36px] border-4 border-glass-border bg-bg-dark p-2 shadow-2xl relative overflow-hidden">
                <div className="w-16 h-3 bg-slate-700 rounded-full mx-auto mb-1 flex items-center justify-center">
                  <div className="w-3 h-1 bg-slate-600 rounded-full" />
                </div>

                <div className="rounded-[28px] overflow-hidden border border-glass-border bg-bg-deep">
                  <img
                    src="/assets/hero_mobile.jpg"
                    alt="CKM Mobile App"
                    className="w-full h-auto object-cover max-h-[340px] sm:max-h-[380px]"
                  />
                </div>

                <div className="w-16 h-1 bg-slate-600 rounded-full mx-auto mt-1.5" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TICKER BAR */}
      <section className="py-5 bg-bg-dark border-b border-glass-border overflow-hidden relative">
        <div className="flex items-center gap-4 text-xs font-mono font-bold uppercase tracking-widest text-text-muted whitespace-nowrap">
          <motion.div
            className="flex items-center gap-6 shrink-0"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            {[...facilities, ...facilities].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border ${item.color} shadow-sm`}
                >
                  <Icon size={15} />
                  <span>{item.title}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* FEATURED COURSES SECTION (COMPACT & PROFESSIONAL) */}
      <section className="py-16 border-b border-glass-border bg-bg-deep">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                TOP MASTERCLASSES
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-text-title font-display mt-2">
                Popular Courses
              </h2>
            </div>
            <Link to="/courses" className="text-xs font-extrabold text-cyan-400 hover:underline flex items-center gap-1">
              View All Courses <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {coursesLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="p-4 rounded-2xl bg-glass-card border border-glass-border animate-pulse space-y-3">
                  <div className="h-28 bg-slate-700/20 rounded-xl" />
                  <div className="h-4 bg-slate-700/20 rounded w-3/4" />
                  <div className="h-3 bg-slate-700/20 rounded w-1/2" />
                </div>
              ))
            ) : featuredCourses.length > 0 ? (
              featuredCourses.map((c) => (
                <div key={c._id} className="p-4 rounded-2xl bg-glass-card border border-glass-border hover:border-purple-500/40 shadow-lg transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="h-28 w-full rounded-xl overflow-hidden relative mb-3 bg-gradient-to-r from-purple-900/60 to-indigo-900/60">
                      {c.thumbnail ? (
                        <img src={c.thumbnail} alt={c.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-purple-400">
                          <BookOpen size={24} />
                        </div>
                      )}
                      <span className="absolute top-2 right-2 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-950/80 text-emerald-400 border border-emerald-500/30">
                        ₹{(c.price || 999).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-text-title line-clamp-1 group-hover:text-cyan-400 transition">
                      {c.title}
                    </h3>
                    <p className="text-xs text-text-muted line-clamp-2 mt-1 font-medium leading-relaxed">
                      {c.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-glass-border flex items-center justify-between">
                    <div className="text-[11px] font-semibold text-text-muted flex items-center gap-1.5 truncate max-w-[120px]">
                      <User size={12} className="text-purple-400 shrink-0" />
                      <span className="truncate">{c.createdBy?.name || "Mentor"}</span>
                    </div>
                    <Button
                      onClick={() => handleEnrollClick(c._id)}
                      className="py-1.5 px-3 rounded-lg text-[11px] font-bold bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:opacity-90 transition active:scale-95 shadow-md"
                    >
                      Enroll Now <ArrowRight size={11} />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-xs text-text-muted">
                No courses published yet. Check back soon!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* EXPERT MENTORSHIP SECTION (COMPACT & PROFESSIONAL) */}
      <section className="py-16 border-b border-glass-border bg-bg-panel/40">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                1-ON-1 CONSULTATIONS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-text-title font-display mt-2">
                Expert Mentors
              </h2>
            </div>
            <Link to="/sessions" className="text-xs font-extrabold text-amber-400 hover:underline flex items-center gap-1">
              Browse All Slots <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {mentors.map((m, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-glass-card border border-glass-border hover:border-amber-500/40 transition-all duration-300 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-start gap-3">
                    <img src={m.image} alt={m.name} className="h-14 w-14 rounded-xl object-cover border border-amber-500/30 shrink-0" />
                    <div className="space-y-0.5 overflow-hidden">
                      <h3 className="text-xs sm:text-sm font-extrabold text-text-title truncate">{m.name}</h3>
                      <p className="text-[10px] font-mono text-amber-400 truncate">{m.title}</p>
                      <span className="inline-block text-[9px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20 mt-1">
                        {m.specialty}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed line-clamp-2 mt-3 font-medium">
                    {m.bio}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-glass-border flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                    <Video size={12} /> Live Video Slot
                  </span>
                  <Button
                    onClick={handleBookCallClick}
                    variant="secondary"
                    className="py-1.5 px-3 rounded-lg text-[11px] font-bold text-text-title hover:text-cyan-400 flex items-center gap-1 border border-glass-border bg-bg-dark"
                  >
                    Book Call <ArrowRight size={11} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE SECTION */}
      <section className="py-14 bg-bg-deep border-b border-glass-border relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-3">
          <Quote size={32} className="text-cyan-500/40 mx-auto" />
          <h2 className="text-lg sm:text-xl font-extrabold text-text-title leading-relaxed font-display max-w-2xl mx-auto">
            "By far, the greatest danger of Artificial Intelligence is that <span className="text-amber-400 underline decoration-amber-500/40 underline-offset-4">people conclude too early that they understand it.</span>"
          </h2>
          <p className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest pt-1">— Eliezer Yudkowsky, AI Researcher</p>
        </div>
      </section>

      {/* TARGET AUDIENCE SECTION */}
      <section className="py-16 border-b border-glass-border bg-bg-panel/40">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
              TARGET AUDIENCE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-title font-display">
              Designed For High-Stakes Tech
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
            <div className="p-5 rounded-2xl bg-glass-card border border-glass-border hover:border-cyan-400/40 transition duration-300 space-y-3 shadow-md">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold">
                <BookOpen size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 tracking-wider block">01. LEARNER</span>
              <h3 className="text-sm font-extrabold text-text-title">Engineers & Students</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Structured unit lessons, real code blueprints, and 1-on-1 mentorship to stay ahead.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-glass-card border border-glass-border hover:border-purple-400/40 transition duration-300 space-y-3 shadow-md">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold">
                <Cpu size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase text-purple-400 tracking-wider block">02. CREATOR</span>
              <h3 className="text-sm font-extrabold text-text-title">Authors & Tech Leads</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Draft interactive courses, attach code schemas, set pricing, and monetize knowledge directly.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-glass-card border border-glass-border hover:border-emerald-400/40 transition duration-300 space-y-3 shadow-md">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
                <Video size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 tracking-wider block">03. EXPERT MENTOR</span>
              <h3 className="text-sm font-extrabold text-text-title">Domain Specialists</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Set session availability, conduct live 1-on-1 video consultations, and review learner code.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-glass-card border border-glass-border hover:border-amber-400/40 transition duration-300 space-y-3 shadow-md">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold">
                <Layers size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider block">04. OPERATIONS</span>
              <h3 className="text-sm font-extrabold text-text-title">Platform Admin</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Oversee platform user directory, update permissions, and resolve content moderation reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-16 border-b border-glass-border bg-bg-dark relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 space-y-8 text-center">
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              COMMUNITY TESTIMONIALS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-title font-display">
              Loved By Engineers & Creators
            </h2>
          </div>

          <div className="relative max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="p-6 sm:p-8 rounded-2xl bg-glass-card border border-glass-border text-left space-y-4 shadow-xl relative"
              >
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-sm sm:text-base text-text-main italic leading-relaxed font-medium">
                  "{testimonials[currentTestimonial].quote}"
                </p>

                <div className="flex items-center gap-3 pt-3 border-t border-glass-border">
                  <img
                    src={testimonials[currentTestimonial].avatar}
                    alt={testimonials[currentTestimonial].name}
                    className="h-10 w-10 rounded-full object-cover border-2 border-cyan-500/40"
                  />
                  <div>
                    <h4 className="text-xs font-extrabold text-text-title">{testimonials[currentTestimonial].name}</h4>
                    <p className="text-[11px] text-cyan-400 font-mono">{testimonials[currentTestimonial].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center items-center gap-3 mt-5">
              <button
                onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="p-2 rounded-full bg-bg-deep border border-glass-border text-text-muted hover:text-text-title transition cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-1.5">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentTestimonial === idx ? "w-6 bg-cyan-400" : "w-2 bg-slate-600"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                className="p-2 rounded-full bg-bg-deep border border-glass-border text-text-muted hover:text-text-title transition cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 border-b border-glass-border bg-bg-deep">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-title font-display">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3 text-left">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-glass-card border border-glass-border overflow-hidden transition duration-200"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex justify-between items-center gap-4 cursor-pointer hover:bg-bg-dark/50"
                >
                  <span className="text-xs sm:text-sm font-extrabold text-text-title">{faq.q}</span>
                  {openFaq === idx ? <ChevronUp size={16} className="text-cyan-400 shrink-0" /> : <ChevronDown size={16} className="text-text-muted shrink-0" />}
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-text-muted leading-relaxed border-t border-glass-border pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WAITLIST FOOTER */}
      <section className="py-16 bg-gradient-to-t from-bg-dark via-bg-deep to-bg-deep relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6 relative z-10">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black text-text-title font-display leading-tight">
              Looking for upcoming masterclasses?
            </h2>
            <p className="text-xs sm:text-sm text-text-muted font-medium max-w-xl mx-auto">
              Join our technical community waitlist to receive immediate notifications when new architecture guides and expert session slots drop.
            </p>
          </div>

          {subscribed ? (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold max-w-md mx-auto">
              ✓ Thank you! You have been added to the CKM waitlist.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="Enter your work email address..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-bg-dark border border-glass-border text-xs text-text-title placeholder:text-text-muted outline-none focus:border-cyan-400 font-mono"
              />
              <Button
                type="submit"
                className="w-full sm:w-auto text-xs font-bold py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shrink-0 shadow-md"
              >
                Join Waitlist <Send size={13} className="ml-1" />
              </Button>
            </form>
          )}

          <div className="pt-6 border-t border-glass-border flex flex-wrap items-center justify-center gap-6 text-xs text-text-muted font-mono">
            <span>© 2026 Collaborative Knowledge Marketplace</span>
            <span>•</span>
            <Link to="/courses" className="hover:text-cyan-400">Courses</Link>
            <span>•</span>
            <Link to="/sessions" className="hover:text-purple-400">Mentorship</Link>
            <span>•</span>
            <Link to="/resources" className="hover:text-emerald-400">Resources</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
