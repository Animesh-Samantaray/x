import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import LoadingSkeleton from "../../components/dashboard/LoadingSkeleton";
import EmptyState from "../../components/dashboard/EmptyState";
import ErrorState from "../../components/dashboard/ErrorState";
import SpotlightCard from "../../components/SpotlightCard";
import Button from "../../components/Button";
import CourseCard from "../../components/courses/CourseCard";
import ReviewCard from "../../components/reviews/ReviewCard";
import SessionCard from "../../components/sessions/SessionCard";
import Sticker from "../../components/ui/Sticker";
import LottieAnimation from "../../components/ui/LottieAnimation";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from "../../components/motion/MotionPrimitives";
import heroBg from "../../assets/images/hero-bg.jpg";
import learnerImg from "../../assets/images/roles/learner.jpg";


import { getMyEnrolledCourses } from "../../services/courseService";
import { getMyProgress } from "../../services/progressService";
import { getMyBookmarks, deleteBookmark } from "../../services/bookmarkService";
import { getMyReviews, deleteReview } from "../../services/reviewService";
import { getMySessions, requestSession } from "../../services/sessionService";

import {
  BookOpen,
  Award,
  TrendingUp,
  Bookmark,
  Video,
  Star,
  Compass,
  ArrowRight,
  CheckCircle,
  Clock,
  Trash2,
  ExternalLink,
  PlusCircle,
  Play,
  Sparkles,
  Eye,
} from "lucide-react";

const LearnerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [progressList, setProgressList] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [activeTab, setActiveTab] = useState("overview");
  const [sessionFilter, setSessionFilter] = useState("all");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [coursesRes, progressRes, bookmarksRes, reviewsRes, sessionsRes] =
        await Promise.allSettled([
          getMyEnrolledCourses(),
          getMyProgress(),
          getMyBookmarks(),
          getMyReviews(),
          getMySessions(),
        ]);

      if (coursesRes.status === "fulfilled" && coursesRes.value?.courses) {
        setEnrolledCourses(coursesRes.value.courses);
      }
      if (progressRes.status === "fulfilled" && progressRes.value?.progress) {
        setProgressList(progressRes.value.progress);
      }
      if (bookmarksRes.status === "fulfilled" && bookmarksRes.value?.bookmarks) {
        setBookmarks(bookmarksRes.value.bookmarks);
      }
      if (reviewsRes.status === "fulfilled" && reviewsRes.value?.reviews) {
        setReviews(reviewsRes.value.reviews);
      }
      if (sessionsRes.status === "fulfilled" && sessionsRes.value?.sessions) {
        setSessions(sessionsRes.value.sessions);
      }
    } catch (err) {
      console.error("Error loading learner dashboard data:", err);
      setError(err.message || "Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [bookingLoadingId, setBookingLoadingId] = useState(null);

  const handleBookSession = async (sessionId) => {
    try {
      setBookingLoadingId(sessionId);
      const res = await requestSession(sessionId);
      if (res && res.success) {
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to book session.");
    } finally {
      setBookingLoadingId(null);
    }
  };

  const handleRemoveBookmark = async (bookmarkId) => {
    try {
      await deleteBookmark(bookmarkId);
      setBookmarks((prev) => prev.filter((b) => b._id !== bookmarkId));
    } catch (err) {
      console.error("Failed to remove bookmark:", err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete your review?")) {
      try {
        await deleteReview(reviewId);
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      } catch (err) {
        console.error("Failed to delete review:", err);
      }
    }
  };

  // Derived real stats (No mock data!)
  const totalEnrolled = enrolledCourses.length;

  const progressMap = {};
  progressList.forEach((p) => {
    const cId = p.course?._id || p.course;
    if (cId) progressMap[cId] = p;
  });

  let completedCoursesCount = 0;
  let inProgressCount = 0;
  let totalPercentageSum = 0;

  enrolledCourses.forEach((course) => {
    const p = progressMap[course._id];
    const pct = p?.percentage || 0;
    totalPercentageSum += pct;
    if (pct === 100) {
      completedCoursesCount++;
    } else {
      inProgressCount++;
    }
  });

  const overallProgressPct = totalEnrolled > 0 ? Math.round(totalPercentageSum / totalEnrolled) : 0;
  const totalBookmarks = bookmarks.length;

  const upcomingSessionsCount = sessions.filter((s) => {
    const userStatus = s.learners?.find((l) => (l.user?._id || l.user) === user?._id)?.status;
    return (s.status === "open" || s.status === "upcoming") && (userStatus === "accepted" || userStatus === "pending");
  }).length;

  const filteredSessions = sessions.filter((s) => {
    if (sessionFilter === "all") return true;
    const learnerObj = s.learners?.find((l) => (l.user?._id || l.user) === user?._id);
    const userStatus = learnerObj?.status || "pending";
    if (sessionFilter === "pending") return userStatus === "pending";
    if (sessionFilter === "accepted") return userStatus === "accepted";
    if (sessionFilter === "rejected") return userStatus === "rejected";
    if (sessionFilter === "completed") return s.status === "completed";
    if (sessionFilter === "cancelled") return s.status === "cancelled";
    return true;
  });

  const activeCoursesToContinue = enrolledCourses.filter((c) => {
    const pct = progressMap[c._id]?.percentage || 0;
    return pct < 100;
  });

  return (
    <PageTransition>
      <DashboardLayout
        title={`Welcome back, ${user?.name || "Learner"} 👋`}
        subtitle="Track your active masterclasses, saved learning units, and mentorship sessions."
        actions={
          <Button onClick={() => navigate("/courses")} className="text-xs py-2 px-4 shadow-lg flex items-center gap-2 bg-gradient-to-r from-accent-purple to-accent-indigo hover:from-purple-600 hover:to-indigo-600">
            <Compass size={14} /> Explore Masterclasses
          </Button>
        }
      >
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchData} />
        ) : (
          <div className="space-y-6 text-left">
            {/* ENTERPRISE SAAS ASYMMETRIC BENTO DATA GRID */}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-12 gap-5">
              
              {/* Bento Cell 1: Enterprise Hero Console & Telemetry Control (Span 7) */}
              <StaggerItem className="md:col-span-7">
                <div className="h-full relative overflow-hidden rounded-3xl glass-panel-futuristic border border-white/15 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-2xl flex flex-col justify-between space-y-6">
                  {/* Ultra-thin Cyan/Purple Gradient Accent Bar */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500" />
                  
                  <div className="space-y-4 relative z-10">
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Enterprise Pulse Status Pills */}
                      <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-[11px] font-mono font-semibold">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                        </span>
                        <span>LIVE TELEMETRY SYNCED</span>
                      </span>

                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-800/60 border border-white/10 text-slate-300 text-[10px] font-mono">
                        <span>v2.4.0-prod</span>
                      </span>
                    </div>

                    <h1 className="hero-heading text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                      Enterprise Workspace: <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">{user?.name || "Learner"}</span>
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium max-w-xl">
                      High-density operational telemetry. Monitor course progress fractions, manage 1-on-1 expert sessions, and inspect real-time platform activity log.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2 relative z-10">
                    <button
                      onClick={() => navigate("/courses")}
                      className="btn-futuristic-primary px-5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center space-x-2 shadow-lg cursor-pointer active:scale-95 transition-all"
                    >
                      <Compass size={15} />
                      <span>Explore Catalog</span>
                      <ArrowRight size={14} />
                    </button>
                    <button
                      onClick={() => navigate("/sessions")}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-900/80 border border-white/10 hover:border-cyan-400/40 backdrop-blur-xl transition-all duration-200 flex items-center space-x-2 cursor-pointer active:scale-95"
                    >
                      <Video size={15} className="text-cyan-400" />
                      <span>Schedule Expert Call</span>
                    </button>
                  </div>
                </div>
              </StaggerItem>

              {/* Bento Cell 2: System Telemetry & Progress Fraction (Span 5) */}
              <StaggerItem className="md:col-span-5">
                <div className="h-full p-6 rounded-3xl glass-panel-futuristic border border-white/15 bg-slate-900/70 hover:border-cyan-400/40 transition duration-300 backdrop-blur-2xl flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">Completion Fraction</span>
                    </div>
                    <span className="text-2xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">{overallProgressPct}%</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-slate-300">
                      <span>Curriculum Rate</span>
                      <span className="font-mono text-cyan-300">{completedCoursesCount} / {totalEnrolled} Units</span>
                    </div>
                    <div className="w-full h-3 bg-slate-950/90 rounded-full overflow-hidden border border-white/10 p-0.5">
                      <div
                        className="h-full glowing-progress-track rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${Math.max(overallProgressPct, 5)}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                    <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>IN PROGRESS</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                      </div>
                      <div className="text-lg font-bold text-white mt-1">{inProgressCount} Active</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>SAVED UNITS</span>
                        <Bookmark size={10} className="text-cyan-400" />
                      </div>
                      <div className="text-lg font-bold text-cyan-400 mt-1">{totalBookmarks} Bookmarks</div>
                    </div>
                  </div>
                </div>
              </StaggerItem>

              {/* Bento Cell 3: Actionable Active Course Module (Span 7) */}
              <StaggerItem className="md:col-span-7">
                <div className="h-full p-6 rounded-3xl glass-panel-futuristic border border-white/15 bg-slate-900/70 hover:border-purple-400/40 transition duration-300 backdrop-blur-2xl flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                        <BookOpen size={18} />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Primary Active Work Item</h3>
                        <p className="text-[10px] text-slate-400">Continue course execution</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab("courses")}
                      className="text-xs font-mono text-purple-400 hover:text-purple-300 flex items-center space-x-1"
                    >
                      <span>View All ({enrolledCourses.length})</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>

                  {activeCoursesToContinue.length > 0 ? (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/70 border border-white/10">
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <div className="h-12 w-12 rounded-xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold shrink-0 shadow-inner">
                          <Play size={20} className="fill-purple-400/30 text-purple-400 ml-0.5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate">{activeCoursesToContinue[0].title}</h4>
                          <p className="text-[11px] text-slate-400 flex items-center space-x-2 mt-1">
                            <span>Author: {activeCoursesToContinue[0].instructor?.name || "Instructor"}</span>
                            <span>•</span>
                            <span className="text-cyan-400 font-mono font-semibold">
                              {progressMap[activeCoursesToContinue[0]._id]?.percentage || 0}% Complete
                            </span>
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/learn/${activeCoursesToContinue[0]._id}`)}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:opacity-95 text-white text-xs font-bold transition duration-200 shadow-md shrink-0 cursor-pointer active:scale-95"
                      >
                        Resume Execution
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-950/50 border border-dashed border-white/10 text-center">
                      <p className="text-xs text-slate-400 font-medium">All enrolled masterclasses completed!</p>
                      <button onClick={() => navigate("/courses")} className="mt-2 text-xs font-bold text-cyan-400 hover:underline">
                        Explore Catalog →
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/5 font-mono">
                    <span className="flex items-center space-x-1.5">
                      <CheckCircle size={13} className="text-emerald-400" />
                      <span>Verified Certificates Enabled</span>
                    </span>
                    <span className="text-slate-500">ID: {user?._id?.substring(0, 8) || "CKM-001"}</span>
                  </div>
                </div>
              </StaggerItem>

              {/* Bento Cell 4: Enterprise Mentorship Telemetry (Span 5) */}
              <StaggerItem className="md:col-span-5">
                <div className="h-full p-6 rounded-3xl glass-panel-futuristic border border-white/15 bg-slate-900/70 hover:border-pink-400/40 transition duration-300 backdrop-blur-2xl flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400">
                        <Video size={18} />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Mentorship Telemetry</h3>
                        <p className="text-[10px] text-slate-400">Scheduled 1-on-1 calls</p>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/30">
                      {upcomingSessionsCount} Active
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-semibold">Available Expert Slots</span>
                      <span className="text-emerald-400 font-mono text-[11px]">● Operational</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Connect with domain leads for code reviews, architectural advice, and career guidance.
                    </p>
                  </div>

                  <button
                    onClick={() => navigate("/sessions")}
                    className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-white/10 text-white text-xs font-bold transition duration-200 cursor-pointer flex items-center justify-center space-x-2 active:scale-95"
                  >
                    <PlusCircle size={14} className="text-pink-400" />
                    <span>Schedule Mentorship Call</span>
                  </button>
                </div>
              </StaggerItem>

            </StaggerContainer>

            {/* DASHBOARD TAB SUB-NAV */}
            <div className="flex items-center space-x-2 border-b border-glass-border/40 pb-2 overflow-x-auto">
              {[
                { id: "overview", label: "Overview" },
                { id: "courses", label: `My Courses (${totalEnrolled})` },
                { id: "bookmarks", label: `Bookmarks (${totalBookmarks})` },
                { id: "reviews", label: `Reviews (${reviews.length})` },
                { id: "sessions", label: `Mentorship (${sessions.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition duration-150 whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-accent-purple text-white shadow-lg shadow-purple-950/30"
                      : "text-text-muted hover:text-text-title hover:bg-glass-border/40"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* OVERVIEW TAB CONTENT */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Continue Learning & Recent Enrolled */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Continue Learning Section */}
                  <div>
                    <h3 className="text-xs font-extrabold text-text-title uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Play className="text-accent-cyan" size={16} /> Continue Learning
                    </h3>

                    {activeCoursesToContinue.length === 0 ? (
                      <EmptyState
                        icon={BookOpen}
                        title="No courses in progress"
                        description={
                          totalEnrolled === 0
                            ? "You haven't enrolled in any courses yet."
                            : "Great job! You have completed all of your enrolled courses."
                        }
                        actionText="Explore Masterclasses"
                        onAction={() => navigate("/courses")}
                        glowColor="rgba(59, 130, 246, 0.08)"
                      />
                    ) : (
                      <div className="space-y-4">
                        {activeCoursesToContinue.slice(0, 3).map((course) => {
                          const prog = progressMap[course._id] || {};
                          const pct = prog.percentage || 0;
                          const completedCount = prog.completedUnits?.length || 0;
                          const totalUnits = course.units?.length || 0;

                          return (
                            <SpotlightCard
                              key={course._id}
                              className="p-5 card-tint-blue border border-glass-border rounded-2xl shadow-lg hover:border-accent-cyan/40 transition duration-300"
                              glowColor="rgba(0, 242, 255, 0.12)"
                            >
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                                <div className="flex items-center gap-4">
                                  {course.thumbnail ? (
                                    <img
                                      src={course.thumbnail}
                                      alt={course.title}
                                      className="h-16 w-24 object-cover rounded-xl border border-glass-border shrink-0"
                                    />
                                  ) : (
                                    <div className="h-16 w-24 rounded-xl bg-bg-dark border border-glass-border flex items-center justify-center text-accent-cyan shrink-0 font-bold text-xs">
                                      <BookOpen size={24} />
                                    </div>
                                  )}
                                  <div className="space-y-1">
                                    <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
                                      {course.category?.name || "Masterclass"}
                                    </span>
                                    <h4 className="text-sm font-extrabold text-text-title line-clamp-1">
                                      {course.title}
                                    </h4>
                                    <p className="text-[11px] text-text-muted">
                                      By {course.creator?.name || "Expert Creator"}
                                    </p>
                                  </div>
                                </div>

                                <div className="w-full sm:w-48 shrink-0 space-y-2 text-right">
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="text-[10px] text-text-muted font-bold">Progress</span>
                                    <span className="font-extrabold text-accent-cyan">{pct}%</span>
                                  </div>
                                  <div className="h-2 bg-bg-dark rounded-full overflow-hidden border border-glass-border">
                                    <div
                                      className="h-full bg-accent-cyan rounded-full transition-all duration-300"
                                      style={{ width: `${pct}%` }}
                                    ></div>
                                  </div>
                                  {totalUnits > 0 && (
                                    <p className="text-[9px] text-text-muted">
                                      {completedCount} / {totalUnits} units completed
                                    </p>
                                  )}
                                  <div className="flex items-center gap-2 mt-2">
                                    <Button
                                      onClick={() => navigate(`/courses/${course._id}`)}
                                      variant="secondary"
                                      className="flex-1 text-[11px] py-1.5 px-2 flex items-center justify-center gap-1 border-glass-border hover:bg-glass-border"
                                    >
                                      <Eye size={12} /> View
                                    </Button>
                                    <Button
                                      onClick={() => navigate(`/courses/${course._id}/learn`)}
                                      className="flex-1 text-[11px] py-1.5 px-2 flex items-center justify-center gap-1 bg-gradient-to-r from-accent-purple to-accent-indigo"
                                    >
                                      Continue <ArrowRight size={12} />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </SpotlightCard>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Bookmarks Teaser */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-extrabold text-text-title uppercase tracking-widest flex items-center gap-2">
                        <Bookmark className="text-accent-pink" size={16} /> Saved Resources
                      </h3>
                      {bookmarks.length > 0 && (
                        <button
                          onClick={() => setActiveTab("bookmarks")}
                          className="text-xs font-bold text-accent-purple hover:underline cursor-pointer"
                        >
                          View All ({bookmarks.length})
                        </button>
                      )}
                    </div>

                    {bookmarks.length === 0 ? (
                      <EmptyState
                        icon={Bookmark}
                        title="No bookmarks yet"
                        description="Save unit attachments and key course resources to quickly access them later."
                        glowColor="rgba(236, 72, 153, 0.08)"
                      />
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {bookmarks.slice(0, 4).map((bm) => (
                          <SpotlightCard
                            key={bm._id}
                            className="p-4 bg-glass-card border border-glass-border rounded-xl space-y-2"
                            glowColor="rgba(236, 72, 153, 0.08)"
                          >
                            <div className="flex justify-between items-start">
                              <h5 className="text-xs font-bold text-text-title truncate">
                                {bm.attachment?.name || bm.unit?.title || "Bookmarked Resource"}
                              </h5>
                              <button
                                onClick={() => handleRemoveBookmark(bm._id)}
                                className="text-text-muted hover:text-rose-400 p-1 rounded transition cursor-pointer"
                                title="Remove bookmark"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                            <p className="text-[10px] text-text-muted truncate">
                              From: {bm.course?.title || "Course"}
                            </p>
                            {bm.course?._id && (
                              <Link
                                to={`/courses/${bm.course._id}/learn`}
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-accent-cyan hover:underline mt-1"
                              >
                                Open in course <ExternalLink size={10} />
                              </Link>
                            )}
                          </SpotlightCard>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Quick Actions & Sessions Preview */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Quick Actions Card */}
                  <SpotlightCard className="p-5 card-tint-purple border border-glass-border rounded-2xl" glowColor="rgba(119, 87, 245, 0.12)">
                    <h4 className="text-xs font-bold text-text-title uppercase tracking-widest border-b border-glass-border/40 pb-3 mb-4 flex items-center gap-2">
                      <Sparkles size={14} className="text-accent-purple" /> Quick Navigation
                    </h4>
                    <div className="space-y-2.5">
                      <Button onClick={() => navigate("/courses")} className="w-full text-xs py-2 px-3 justify-start gap-2 bg-glass-card hover:bg-glass-border">
                        <Compass size={14} className="text-accent-blue" />
                        Explore Courses
                      </Button>
                      <Button onClick={() => navigate("/my-courses")} className="w-full text-xs py-2 px-3 justify-start gap-2 bg-glass-card hover:bg-glass-border">
                        <BookOpen size={14} className="text-accent-purple" />
                        My Enrolled Courses
                      </Button>
                      <Button onClick={() => navigate("/resources")} className="w-full text-xs py-2 px-3 justify-start gap-2 bg-glass-card hover:bg-glass-border">
                        <Bookmark size={14} className="text-accent-pink" />
                        Explore Resources
                      </Button>
                      <Button onClick={() => navigate("/sessions")} className="w-full text-xs py-2 px-3 justify-start gap-2 bg-glass-card hover:bg-glass-border">
                        <Video size={14} className="text-accent-orange" />
                        Book Mentorship Call
                      </Button>
                    </div>
                  </SpotlightCard>

                  {/* Upcoming Mentorship Sessions Card */}
                  <SpotlightCard className="p-5 card-tint-peach border border-glass-border rounded-2xl" glowColor="rgba(249, 115, 22, 0.12)">
                    <div className="flex items-center justify-between border-b border-glass-border/40 pb-3 mb-4">
                      <h4 className="text-xs font-bold text-text-title uppercase tracking-widest flex items-center gap-2">
                        <Video size={14} className="text-accent-orange" /> Mentorship Calls
                      </h4>
                      <span className="text-[10px] font-bold text-accent-orange bg-accent-orange/10 px-2 py-0.5 rounded border border-accent-orange/20">
                        {sessions.length} total
                      </span>
                    </div>

                    {sessions.length === 0 ? (
                      <div className="py-6 text-center space-y-2">
                        <Clock size={20} className="text-text-muted mx-auto" />
                        <p className="text-xs text-text-muted">No scheduled mentorship calls yet.</p>
                        <Button onClick={() => navigate("/sessions")} className="text-xs py-1.5 px-3 mt-2 bg-accent-orange hover:bg-amber-600">
                          Explore Sessions
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {sessions.slice(0, 3).map((session) => {
                          const learnerObj = session.learners?.find((l) => (l.user?._id || l.user) === user?._id);
                          const isAccepted = learnerObj?.status === "accepted";

                          return (
                            <div key={session._id} className="p-3 bg-bg-darker border border-glass-border rounded-xl text-left space-y-1.5">
                              <div className="flex justify-between items-start">
                                <h5 className="text-xs font-bold text-text-title truncate">{session.title}</h5>
                                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                                  isAccepted ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                }`}>
                                  {learnerObj?.status || "Pending"}
                                </span>
                              </div>
                              <p className="text-[10px] text-text-muted">
                                Expert: {session.expert?.user?.name || "Verified Expert"}
                              </p>
                              <p className="text-[10px] text-text-muted">
                                📅 {new Date(session.scheduledAt).toLocaleDateString()} at {new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({session.duration} mins)
                              </p>
                              {isAccepted && session.meetingUrl && (
                                <a
                                  href={session.meetingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] font-bold text-accent-emerald hover:underline mt-1"
                                >
                                  Join Video Call <ExternalLink size={10} />
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </SpotlightCard>
                </div>
              </div>
            )}

            {/* MY COURSES TAB CONTENT */}
            {activeTab === "courses" && (
              <div className="space-y-6">
                {enrolledCourses.length === 0 ? (
                  <EmptyState
                    icon={BookOpen}
                    title="No enrolled courses"
                    description="You are not enrolled in any courses yet. Browse our catalog of developer courses to start learning."
                    actionText="Explore Courses"
                    onAction={() => navigate("/courses")}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrolledCourses.map((course) => (
                      <CourseCard key={course._id} course={course} progress={progressMap[course._id]} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* BOOKMARKS TAB CONTENT */}
            {activeTab === "bookmarks" && (
              <div className="space-y-6">
                {bookmarks.length === 0 ? (
                  <EmptyState
                    icon={Bookmark}
                    title="No bookmarked resources"
                    description="When you bookmark attachments or units in a course, they will be listed here for fast access."
                    glowColor="rgba(236, 72, 153, 0.08)"
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bookmarks.map((bm) => (
                      <SpotlightCard key={bm._id} className="p-5 bg-glass-card border border-glass-border rounded-2xl space-y-3 text-left" glowColor="rgba(236, 72, 153, 0.1)">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-pink-500/10 text-pink-500 border border-pink-500/20">
                              Bookmark
                            </span>
                            <h4 className="text-xs font-bold text-text-title line-clamp-1">{bm.attachment?.name || bm.unit?.title || "Saved Item"}</h4>
                          </div>
                          <button onClick={() => handleRemoveBookmark(bm._id)} className="text-text-muted hover:text-rose-400 p-1.5 rounded transition cursor-pointer" title="Remove">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="text-[11px] text-text-muted truncate">Course: {bm.course?.title || "Masterclass"}</p>
                        {bm.course?._id && (
                          <Link to={`/courses/${bm.course._id}/learn`} className="inline-flex items-center gap-1 text-xs font-bold text-accent-cyan hover:underline">
                            Open in course <ExternalLink size={12} />
                          </Link>
                        )}
                      </SpotlightCard>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* REVIEWS TAB CONTENT */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <EmptyState
                    icon={Star}
                    title="No course reviews written yet"
                    description="Share your feedback on courses you have enrolled in to help other learners in the community."
                    glowColor="rgba(245, 158, 11, 0.08)"
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reviews.map((rev) => (
                      <SpotlightCard key={rev._id} className="p-5 bg-glass-card border border-glass-border rounded-2xl space-y-3 text-left" glowColor="rgba(245, 158, 11, 0.1)">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xs font-extrabold text-text-title">{rev.course?.title || "Course Review"}</h4>
                            <div className="flex items-center gap-1 mt-1 text-amber-400">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={12} className={star <= rev.rating ? "fill-amber-400 text-amber-400" : "text-text-muted"} />
                              ))}
                              <span className="text-[10px] font-bold text-text-muted ml-1">{rev.rating}.0</span>
                            </div>
                          </div>
                          <button onClick={() => handleDeleteReview(rev._id)} className="text-text-muted hover:text-rose-400 p-1.5 rounded transition cursor-pointer" title="Delete Review">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="text-xs text-text-main leading-relaxed font-medium bg-bg-darker/60 p-3 rounded-xl border border-glass-border/30">
                          "{rev.comment}"
                        </p>
                        <p className="text-[9px] text-text-muted">Reviewed on {new Date(rev.createdAt).toLocaleDateString()}</p>
                      </SpotlightCard>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SESSIONS TAB CONTENT */}
            {activeTab === "sessions" && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {["all", "pending", "accepted", "completed", "cancelled"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSessionFilter(filter)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wider transition cursor-pointer ${
                        sessionFilter === filter
                          ? "bg-accent-orange text-white"
                          : "bg-bg-darker text-text-muted hover:text-text-title border border-glass-border"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                {filteredSessions.length === 0 ? (
                  <EmptyState
                    icon={Video}
                    title="No mentorship sessions found"
                    description="You have no requested or booked sessions matching this filter."
                    actionText="Book Mentorship Call"
                    onAction={() => navigate("/sessions")}
                    glowColor="rgba(249, 115, 22, 0.08)"
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSessions.map((session) => (
                      <SessionCard
                        key={session._id}
                        session={session}
                        currentUser={user}
                        onBook={handleBookSession}
                        onViewDetails={(id) => navigate(`/sessions/${id}`)}
                        bookingLoadingId={bookingLoadingId}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </DashboardLayout>
    </PageTransition>
  );
};

export default LearnerDashboard;
