import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSkeleton from "../../components/dashboard/LoadingSkeleton";
import EmptyState from "../../components/dashboard/EmptyState";
import ErrorState from "../../components/dashboard/ErrorState";
import ProgressRing from "../../components/ProgressRing";
import Button from "../../components/Button";
import { motion, AnimatePresence } from "framer-motion";

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
  Check,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Activity,
  Target,
  Zap,
} from "lucide-react";

import { transformLearnerAnalytics } from "../../utils/analyticsTransformer";
import { RealBarChart, RealDoughnutChart } from "../../components/dashboard/RealChart";

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
      console.error("Learner dashboard fetch error:", err);
      setError(err.message || "Failed to load learning workspace.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  // Map progress by course ID
  const progressMap = {};
  progressList.forEach((p) => {
    const cId = p.course?._id || p.course;
    if (cId) progressMap[cId] = p;
  });

  const totalEnrolled = enrolledCourses.length;
  let completedCount = 0;
  let totalPctSum = 0;

  enrolledCourses.forEach((c) => {
    const pct = progressMap[c._id]?.percentage || 0;
    totalPctSum += pct;
    if (pct === 100) completedCount++;
  });

  const overallPct = totalEnrolled > 0 ? Math.round(totalPctSum / totalEnrolled) : 0;
  const activeCourses = enrolledCourses.filter((c) => (progressMap[c._id]?.percentage || 0) < 100);
  const primaryCourse = activeCourses[0] || enrolledCourses[0];

  return (
    <div className="space-y-8 text-left">
      
      {/* SECTION 1: TOP LEARNING COMMAND HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-glass-border/60 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              ● LEARNING WORKSPACE
            </span>
            <span className="text-xs text-text-muted font-mono">ID: {user?._id?.substring(0, 8) || "CKM-01"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-title tracking-tight font-display">
            Welcome back, {user?.name || "Learner"}
          </h1>
          <p className="text-xs sm:text-sm text-text-muted font-medium">
            Track unit completion milestones, manage bookmarked blueprints, and schedule expert calls.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            onClick={() => navigate("/courses")}
            className="text-xs font-bold py-2.5 px-4 rounded-xl bg-btn-primary hover:bg-btn-primary-hover text-white flex items-center gap-2 shadow-lg"
          >
            <Compass size={14} /> Explore Catalog
          </Button>
          <Button
            onClick={() => navigate("/sessions")}
            variant="secondary"
            className="text-xs font-bold py-2.5 px-4 rounded-xl border border-glass-border flex items-center gap-2"
          >
            <Video size={14} className="text-emerald-400" /> Book Consultation
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : (
        <div className="space-y-8">
          
          {/* SECTION 2: PRIMARY ACTIVE LEARNING BANNER (FOCAL POINT) */}
          {primaryCourse ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-glass-card border border-glass-border hover:border-cyan-500/40 transition duration-300 relative overflow-hidden shadow-md">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                
                {/* Left Progress ring & Course metadata */}
                <div className="lg:col-span-8 space-y-4">
                  
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                      CURRENT ACTIVE UNIT
                    </span>
                    <span className="text-xs text-text-muted font-mono">
                      {progressMap[primaryCourse._id]?.completedUnits?.length || 0} / {primaryCourse.units?.length || 0} Units Completed
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-extrabold text-text-title leading-snug">
                    {primaryCourse.title}
                  </h2>

                  <p className="text-xs text-text-main line-clamp-2 leading-relaxed">
                    {primaryCourse.description || "Master unit topics and complete code exercises in your workspace player."}
                  </p>

                  <div className="flex items-center gap-4 pt-2">
                    <Button
                      onClick={() => navigate(`/courses/${primaryCourse._id}/learn`)}
                      className="text-xs font-bold py-3 px-6 rounded-xl bg-btn-primary hover:bg-btn-primary-hover text-white flex items-center gap-2 shadow-md"
                    >
                      <Play size={14} className="fill-white" /> Resume Unit Execution <ArrowRight size={14} />
                    </Button>

                    <Button
                      onClick={() => navigate(`/courses/${primaryCourse._id}`)}
                      variant="secondary"
                      className="text-xs font-bold py-3 px-4 rounded-xl border border-glass-border"
                    >
                      View Syllabus
                    </Button>
                  </div>

                </div>

                {/* Right Visual Progress Gauge */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-bg-dark/50 border border-glass-border">
                  <ProgressRing
                    progress={progressMap[primaryCourse._id]?.percentage || 0}
                    size={110}
                    strokeWidth={10}
                    ringColor="stroke-cyan-500"
                    trackColor="stroke-glass-border"
                  />
                  <div className="text-center mt-3">
                    <span className="text-xs font-mono font-bold text-text-title uppercase block">
                      Course Mastery
                    </span>
                    <span className="text-xs text-text-muted">
                      Overall Progress: <strong className="text-cyan-500 font-mono">{progressMap[primaryCourse._id]?.percentage || 0}%</strong>
                    </span>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <EmptyState
              icon={BookOpen}
              title="No courses enrolled yet"
              description="Explore our curated catalog of software engineering and system architecture masterclasses."
              actionText="Explore Courses Catalog"
              onAction={() => navigate("/courses")}
            />
          )}

          {/* REAL LEARNER ANALYTICS PANEL (100% REAL DATA FROM CKM BACKEND) */}
          {(() => {
            const learnerData = transformLearnerAnalytics(enrolledCourses, progressList, bookmarks, reviews, sessions);

            if (learnerData.isEmpty) {
              return (
                <div className="p-8 rounded-3xl bg-glass-card border border-glass-border text-center space-y-3 shadow-sm">
                  <Activity size={28} className="text-cyan-500 mx-auto opacity-70" />
                  <h3 className="text-sm font-bold font-mono text-text-title uppercase tracking-wider">No Active Learning Analytics Recorded</h3>
                  <p className="text-xs text-text-muted max-w-md mx-auto">
                    Enroll in a course and complete unit lessons to populate real course progress, category distributions, and completion intelligence.
                  </p>
                  <Button
                    onClick={() => navigate("/courses")}
                    className="text-xs py-2 px-4 bg-btn-primary hover:bg-btn-primary-hover text-white font-bold"
                  >
                    Explore Courses Catalog
                  </Button>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* REAL METRICS ROW 1 */}
                <div className="lg:col-span-8 p-6 rounded-3xl bg-glass-card border border-glass-border shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-glass-border pb-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest block">REAL LEARNING MASTERY</span>
                      <h3 className="text-base font-extrabold text-text-title">Course Completion Progress (%)</h3>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                      Average: {learnerData.overallAvgProgress}%
                    </span>
                  </div>
                  <RealBarChart data={learnerData.progressChartData} height={200} />
                </div>

                <div className="lg:col-span-4 p-6 rounded-3xl bg-glass-card border border-glass-border shadow-md flex flex-col justify-between space-y-4">
                  <div className="border-b border-glass-border pb-3 text-left">
                    <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest block">COURSE STATUS BREAKDOWN</span>
                    <h3 className="text-sm font-extrabold text-text-title mt-0.5">{learnerData.totalEnrolled} Enrolled Masterclasses</h3>
                  </div>
                  <RealDoughnutChart data={learnerData.statusChartData} height={180} />
                </div>

                {/* REAL METRICS ROW 2 */}
                <div className="lg:col-span-6 p-6 rounded-3xl bg-glass-card border border-glass-border shadow-md space-y-4">
                  <div className="flex justify-between items-center border-b border-glass-border pb-3">
                    <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest">CATEGORY DISTRIBUTION</span>
                    <span className="text-xs font-mono text-purple-500 font-bold">{Object.keys(learnerData.categoryChartData.labels || {}).length} Domains</span>
                  </div>
                  <RealDoughnutChart data={learnerData.categoryChartData} height={180} />
                </div>

                <div className="lg:col-span-6 p-6 rounded-3xl bg-glass-card border border-glass-border shadow-md space-y-4 text-left">
                  <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest block border-b border-glass-border pb-3">REAL LEARNER SUMMARY</span>
                  <div className="grid grid-cols-2 gap-4 pt-1 font-mono text-xs">
                    <div className="p-4 rounded-2xl bg-bg-dark/60 border border-glass-border">
                      <span className="text-[10px] text-text-muted uppercase block">Units Completed</span>
                      <span className="text-2xl font-black text-emerald-500 mt-1 block">{learnerData.totalUnitsCompleted} / {learnerData.totalUnitsAvailable}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-bg-dark/60 border border-glass-border">
                      <span className="text-[10px] text-text-muted uppercase block">Saved Blueprints</span>
                      <span className="text-2xl font-black text-purple-500 mt-1 block">{learnerData.bookmarksCount} Items</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-bg-dark/60 border border-glass-border">
                      <span className="text-[10px] text-text-muted uppercase block">Mentorship Calls</span>
                      <span className="text-2xl font-black text-cyan-500 mt-1 block">{learnerData.sessionsCount} Calls</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-bg-dark/60 border border-glass-border">
                      <span className="text-[10px] text-text-muted uppercase block">Reviews Authored</span>
                      <span className="text-2xl font-black text-amber-500 mt-1 block">{learnerData.reviewsCount} Reviews</span>
                    </div>
                  </div>
                </div>

              </div>
            );
          })()}

          {/* WORKSPACE SUB-NAVIGATION TABS */}
          <div className="flex items-center gap-2 border-b border-glass-border/40 pb-2 overflow-x-auto">
            {[
              { id: "overview", label: "Workspace Overview" },
              { id: "courses", label: `Enrolled Courses (${totalEnrolled})` },
              { id: "bookmarks", label: `Saved Resources (${bookmarks.length})` },
              { id: "sessions", label: `Mentorship Calls (${sessions.length})` },
              { id: "reviews", label: `My Reviews (${reviews.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md shadow-purple-950/20"
                    : "text-text-muted hover:text-text-title hover:bg-glass-border/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW COMPOSITION */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Horizontal Course Rail & Saved Resources List */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Horizontal Enrolled Courses Rail */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold text-text-title uppercase tracking-widest font-display flex items-center gap-2">
                      <BookOpen size={16} className="text-cyan-400" /> Active Enrolled Masterclasses
                    </h3>
                    <button
                      onClick={() => setActiveTab("courses")}
                      className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      View All ({totalEnrolled}) <ChevronRight size={12} />
                    </button>
                  </div>

                  {enrolledCourses.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-bg-panel border border-glass-border text-center text-xs text-text-muted">
                      No active courses enrolled.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {enrolledCourses.slice(0, 4).map((course) => {
                        const prog = progressMap[course._id] || {};
                        const pct = prog.percentage || 0;

                        return (
                          <div
                            key={course._id}
                            className="p-4 rounded-2xl bg-glass-card border border-glass-border hover:border-cyan-400/40 transition duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className="h-12 w-12 rounded-xl bg-bg-darker border border-glass-border flex items-center justify-center shrink-0 font-bold text-cyan-400 text-xs">
                                <BookOpen size={20} />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-text-title truncate">{course.title}</h4>
                                <p className="text-[11px] text-text-muted mt-0.5 truncate">
                                  Instructor: {course.creator?.name || "Expert Creator"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                              <div className="text-right">
                                <span className="text-[10px] font-mono text-cyan-400 font-bold block">{pct}% Complete</span>
                                <div className="w-24 h-1.5 bg-bg-dark rounded-full overflow-hidden mt-1">
                                  <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                              <Button
                                onClick={() => navigate(`/courses/${course._id}/learn`)}
                                className="text-[11px] py-1.5 px-3 bg-btn-primary hover:bg-btn-primary-hover text-white font-bold"
                              >
                                Resume
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Saved Knowledge Bookmarks Timeline */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold text-text-title uppercase tracking-widest font-display flex items-center gap-2">
                      <Bookmark size={16} className="text-purple-400" /> Saved Resource Blueprints
                    </h3>
                    <button
                      onClick={() => setActiveTab("bookmarks")}
                      className="text-xs font-bold text-purple-400 hover:underline flex items-center gap-1"
                    >
                      Manage ({bookmarks.length}) <ChevronRight size={12} />
                    </button>
                  </div>

                  {bookmarks.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-bg-panel border border-glass-border text-center text-xs text-text-muted">
                      No bookmarked items. Save key attachments while taking course units.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {bookmarks.slice(0, 4).map((bm) => (
                        <div
                          key={bm._id}
                          className="p-4 rounded-2xl bg-glass-card border border-glass-border space-y-2 text-left relative group hover:border-purple-500/40 transition"
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                              Bookmark
                            </span>
                            <button
                              onClick={() => handleRemoveBookmark(bm._id)}
                              className="text-text-muted hover:text-rose-400 p-1 rounded transition cursor-pointer"
                              title="Remove bookmark"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                          <h4 className="text-xs font-bold text-text-title truncate">
                            {bm.attachment?.name || bm.unit?.title || "Saved Resource Blueprint"}
                          </h4>
                          <p className="text-[10px] text-text-muted truncate">
                            From: {bm.course?.title || "Masterclass"}
                          </p>
                          {bm.course?._id && (
                            <Link
                              to={`/courses/${bm.course._id}/learn`}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-400 hover:underline mt-1"
                            >
                              Open in course <ExternalLink size={10} />
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column: Mentorship Calls & Learning History Summary */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Upcoming Mentorship Sessions Panel */}
                <div className="p-5 rounded-3xl bg-bg-panel border border-glass-border space-y-4">
                  <div className="flex items-center justify-between border-b border-glass-border/40 pb-3">
                    <h4 className="text-xs font-extrabold text-text-title uppercase tracking-widest font-display flex items-center gap-2">
                      <Video size={15} className="text-emerald-400" /> Mentorship Calls
                    </h4>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {sessions.length} Scheduled
                    </span>
                  </div>

                  {sessions.length === 0 ? (
                    <div className="py-6 text-center space-y-2">
                      <Clock size={20} className="text-text-muted mx-auto" />
                      <p className="text-xs text-text-muted">No scheduled mentorship calls yet.</p>
                      <Button
                        onClick={() => navigate("/sessions")}
                        className="text-xs py-2 px-4 bg-btn-primary hover:bg-btn-primary-hover text-white font-bold"
                      >
                        Book Mentorship Call
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sessions.slice(0, 3).map((session) => {
                        const learnerObj = session.learners?.find((l) => (l.user?._id || l.user) === user?._id);
                        const isAccepted = learnerObj?.status === "accepted";

                        return (
                          <div key={session._id} className="p-3.5 rounded-2xl bg-bg-darker border border-glass-border space-y-2 text-left">
                            <div className="flex justify-between items-start">
                              <h5 className="text-xs font-bold text-text-title truncate">{session.title}</h5>
                              <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                                isAccepted ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              }`}>
                                {learnerObj?.status || "Pending"}
                              </span>
                            </div>
                            <p className="text-[11px] text-text-muted">
                              Expert: {session.expert?.user?.name || "Verified Expert"}
                            </p>
                            <p className="text-[10px] font-mono text-text-muted">
                              📅 {new Date(session.scheduledAt).toLocaleDateString()} at {new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            {isAccepted && session.meetingUrl && (
                              <a
                                href={session.meetingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 hover:underline pt-1"
                              >
                                Join Video Call <ExternalLink size={10} />
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Overall Telemetry Card */}
                <div className="p-5 rounded-3xl bg-slate-900/80 border border-glass-border space-y-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted block border-b border-glass-border/40 pb-2">
                    Learning Telemetry Summary
                  </span>
                  
                  <div className="space-y-2 text-xs font-medium text-text-main">
                    <div className="flex justify-between">
                      <span>Total Enrolled</span>
                      <strong className="text-text-title font-mono">{totalEnrolled} Courses</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed Courses</span>
                      <strong className="text-emerald-400 font-mono">{completedCount} Units</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Progress</span>
                      <strong className="text-cyan-400 font-mono">{overallPct}% Rate</strong>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: ENROLLED COURSES */}
          {activeTab === "courses" && (
            <div className="space-y-4">
              {enrolledCourses.length === 0 ? (
                <EmptyState
                  icon={BookOpen}
                  title="No enrolled courses"
                  description="You are not enrolled in any courses yet."
                  actionText="Explore Courses"
                  onAction={() => navigate("/courses")}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolledCourses.map((c) => {
                    const pct = progressMap[c._id]?.percentage || 0;

                    return (
                      <div
                        key={c._id}
                        className="p-5 rounded-3xl bg-glass-card border border-glass-border hover:border-cyan-400/40 transition duration-200 flex flex-col justify-between space-y-4 text-left shadow-lg"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                              {c.category?.name || "Masterclass"}
                            </span>
                            <span className="text-[10px] font-mono text-cyan-400 font-bold">{pct}%</span>
                          </div>

                          <h3 className="text-sm font-extrabold text-text-title line-clamp-2">{c.title}</h3>
                          <p className="text-xs text-text-muted line-clamp-2">{c.description}</p>
                        </div>

                        <div className="space-y-3 pt-3 border-t border-glass-border/40">
                          <div className="w-full h-1.5 bg-bg-dark rounded-full overflow-hidden">
                            <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => navigate(`/courses/${c._id}`)}
                              variant="secondary"
                              className="flex-1 text-xs py-2 border-glass-border"
                            >
                              Details
                            </Button>
                            <Button
                              onClick={() => navigate(`/courses/${c._id}/learn`)}
                              className="flex-1 text-xs py-2 bg-btn-primary hover:bg-btn-primary-hover text-white font-bold"
                            >
                              Resume
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BOOKMARKS */}
          {activeTab === "bookmarks" && (
            <div className="space-y-4">
              {bookmarks.length === 0 ? (
                <EmptyState
                  icon={Bookmark}
                  title="No bookmarks"
                  description="When you save resources during course units, they will be listed here."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bookmarks.map((bm) => (
                    <div key={bm._id} className="p-5 rounded-2xl bg-glass-card border border-glass-border space-y-3 text-left">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          Blueprint
                        </span>
                        <button onClick={() => handleRemoveBookmark(bm._id)} className="text-text-muted hover:text-rose-400 p-1">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <h4 className="text-xs font-bold text-text-title truncate">{bm.attachment?.name || bm.unit?.title || "Saved Item"}</h4>
                      <p className="text-[11px] text-text-muted truncate">Course: {bm.course?.title || "Masterclass"}</p>
                      {bm.course?._id && (
                        <Link to={`/courses/${bm.course._id}/learn`} className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:underline">
                          Open in Player <ExternalLink size={12} />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MENTORSHIP CALLS */}
          {activeTab === "sessions" && (
            <div className="space-y-4">
              {sessions.length === 0 ? (
                <EmptyState
                  icon={Video}
                  title="No scheduled mentorship calls"
                  description="Connect with domain leads for code reviews, architectural advice, and career guidance."
                  actionText="Book Mentorship Call"
                  onAction={() => navigate("/sessions")}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sessions.map((s) => {
                    const learnerObj = s.learners?.find((l) => (l.user?._id || l.user) === user?._id);

                    return (
                      <div key={s._id} className="p-5 rounded-2xl bg-glass-card border border-glass-border space-y-3 text-left">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-bold text-text-title">{s.title}</h4>
                          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {learnerObj?.status || "Pending"}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted">Expert Mentor: {s.expert?.user?.name || "Verified Expert"}</p>
                        <p className="text-[11px] font-mono text-text-muted">📅 Scheduled: {new Date(s.scheduledAt).toLocaleString()}</p>
                        {learnerObj?.status === "accepted" && s.meetingUrl && (
                          <a
                            href={s.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:underline"
                          >
                            Join Video Call Room <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: REVIEWS */}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <EmptyState
                  icon={Star}
                  title="No reviews written"
                  description="Share your feedback on courses you have completed to help fellow learners."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reviews.map((rev) => (
                    <div key={rev._id} className="p-5 rounded-2xl bg-glass-card border border-glass-border space-y-3 text-left">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-bold text-text-title">{rev.course?.title || "Course"}</h4>
                          <div className="flex items-center gap-1 mt-1 text-amber-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} size={12} className={star <= rev.rating ? "fill-amber-400 text-amber-400" : "text-text-muted"} />
                            ))}
                          </div>
                        </div>
                        <button onClick={() => handleDeleteReview(rev._id)} className="text-text-muted hover:text-rose-400 p-1">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-xs text-text-main p-3 rounded-xl bg-bg-darker border border-glass-border">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default LearnerDashboard;
