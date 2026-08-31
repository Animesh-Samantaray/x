import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById, isCourseEnrolled } from "../../services/courseService";
import { getUnitsByCourse } from "../../services/unitService";
import {
  getCourseProgress,
  completeUnit,
  uncompleteUnit
} from "../../services/progressService";
import {
  getCourseBookmarks,
  createBookmark,
  deleteBookmark
} from "../../services/bookmarkService";
import { useAuth } from "../../context/AuthContext";
import SpotlightCard from "../../components/SpotlightCard";
import Button from "../../components/Button";
import AttachmentViewer from "../../components/courses/AttachmentViewer";
import {
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  Circle,
  PlayCircle,
  FileText,
  AlertCircle,
  ChevronRight,
  Star,
  Trophy,
  RotateCcw,
  Sparkles,
  Check,
  CheckCircle
} from "lucide-react";

const CourseLearn = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [units, setUnits] = useState([]);
  const [activeUnitIndex, setActiveUnitIndex] = useState(0);

  // Progress state
  const [progress, setProgress] = useState(null);
  const [togglingComplete, setTogglingComplete] = useState(false);

  // Map of attachmentId -> bookmark object
  const [bookmarksMap, setBookmarksMap] = useState({});
  const [bookmarkingId, setBookmarkingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch course details
      const courseRes = await getCourseById(id);
      if (courseRes && courseRes.success) {
        setCourse(courseRes.course);
      } else {
        setError("Course not found.");
        return;
      }

      // Check learner enrollment / owner / admin access
      const isEnrolled = isCourseEnrolled(courseRes.course, user);
      const isOwner = user && (courseRes.course?.createdBy?._id === user._id || courseRes.course?.createdBy === user._id);
      const isAdmin = user?.role === "admin";

      if (!isEnrolled && !isOwner && !isAdmin) {
        setError("Access Denied. You must be enrolled in this course to access learning materials.");
        return;
      }

      // Fetch units, bookmarks, and course progress in parallel
      const [unitsRes, bookmarksRes, progressRes] = await Promise.all([
        getUnitsByCourse(id),
        getCourseBookmarks(id).catch(() => ({ success: false, bookmarks: [] })),
        getCourseProgress(id).catch(() => ({ success: false, progress: null }))
      ]);

      if (unitsRes && unitsRes.success) {
        // Sort units by order
        const sortedUnits = (unitsRes.units || []).sort((a, b) => (a.order || 0) - (b.order || 0));
        setUnits(sortedUnits);
      }

      if (progressRes && progressRes.success && progressRes.progress) {
        setProgress(progressRes.progress);
      }

      if (bookmarksRes && bookmarksRes.success) {
        const map = {};
        (bookmarksRes.bookmarks || []).forEach((bm) => {
          if (bm.attachmentId) {
            map[String(bm.attachmentId)] = bm;
          }
        });
        setBookmarksMap(map);
      }
    } catch (err) {
      console.error("Fetch learning details failed:", err);
      if (err.response?.status === 403) {
        setError("Access Denied. You are not authorized to view this learning module.");
      } else {
        setError(err.response?.data?.message || "Failed to load course learning content.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && user) {
      fetchData();
    }
  }, [id, user]);

  // Helper to safely check if a unit is completed (handles ObjectId strings and populated objects)
  const isUnitCompleted = (unitId) => {
    if (!progress || !Array.isArray(progress.completedUnits)) return false;
    const unitIdStr = String(unitId);
    return progress.completedUnits.some((item) => {
      if (!item) return false;
      const idToCheck = typeof item.unit === "object" ? item.unit?._id : item.unit;
      return String(idToCheck) === unitIdStr;
    });
  };

  // Toggle unit complete/uncomplete action
  const handleToggleComplete = async (unitId) => {
    if (!unitId || togglingComplete) return;

    const completed = isUnitCompleted(unitId);
    try {
      setTogglingComplete(true);
      const res = completed
        ? await uncompleteUnit(id, unitId)
        : await completeUnit(id, unitId);

      if (res && res.success) {
        // Fetch updated progress from backend source of truth
        const updatedProgRes = await getCourseProgress(id);
        if (updatedProgRes && updatedProgRes.success) {
          setProgress(updatedProgRes.progress);
        } else if (res.progress) {
          setProgress(res.progress);
        }
      }
    } catch (err) {
      console.error("Complete/Uncomplete unit failed:", err);
      alert(err.response?.data?.message || "Failed to update unit progress.");
    } finally {
      setTogglingComplete(false);
    }
  };

  const handleToggleBookmark = async (attachmentId, unitId) => {
    try {
      const attIdStr = String(attachmentId);
      setBookmarkingId(attIdStr);
      const existingBookmark = bookmarksMap[attIdStr];

      if (existingBookmark) {
        const res = await deleteBookmark(existingBookmark._id);
        if (res && res.success) {
          setBookmarksMap((prev) => {
            const next = { ...prev };
            delete next[attIdStr];
            return next;
          });
        }
      } else {
        const res = await createBookmark(id, unitId, attachmentId);
        if (res && res.success) {
          setBookmarksMap((prev) => ({
            ...prev,
            [attIdStr]: res.bookmark,
          }));
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update bookmark.");
    } finally {
      setBookmarkingId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-text-muted flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-accent-purple"></div>
        Opening course workspace...
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-rose-500/20 bg-rose-500/5 rounded-2xl text-center max-w-md mx-auto my-12 text-left">
        <AlertCircle className="text-rose-400 mb-2 animate-bounce" size={28} />
        <h4 className="text-sm font-bold text-text-title">Learning Page Unavailable</h4>
        <p className="text-xs text-text-muted mt-1 mb-4">{error || "Could not load learning interface."}</p>
        <Button onClick={() => navigate(`/courses/${id}`)} className="text-xs py-2 px-4">
          &larr; Return to Course Overview
        </Button>
      </div>
    );
  }

  const activeUnit = units[activeUnitIndex] || null;
  const activeUnitCompleted = activeUnit ? isUnitCompleted(activeUnit._id) : false;

  const totalUnitsCount = progress?.totalUnits ?? units.length;
  const completedUnitsCount = progress?.completedCount ?? (Array.isArray(progress?.completedUnits) ? progress.completedUnits.length : 0);
  const progressPercentage = progress?.percentage ?? (totalUnitsCount > 0 ? Math.round((completedUnitsCount / totalUnitsCount) * 100) : 0);
  const isCourse100Percent = progressPercentage === 100 && (progress?.courseCompleted || completedUnitsCount >= totalUnitsCount) && totalUnitsCount > 0;

  return (
    <div className="space-y-6 text-left relative">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-glass-border/40 pb-4">
        <button
          onClick={() => navigate(`/courses/${course._id}`)}
          className="text-xs font-bold text-text-muted hover:text-text-title flex items-center gap-1.5 transition"
        >
          <ArrowLeft size={14} /> Back to Course Info
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-accent-purple bg-accent-purple/10 border border-accent-purple/20 px-2.5 py-1 rounded">
            Learner Learning Workspace
          </span>
        </div>
      </div>

      {/* Course Overall Progress Header Card */}
      <SpotlightCard className="p-5 md:p-6 bg-glass-card border border-glass-border rounded-2xl space-y-4" glowColor="rgba(168, 85, 247, 0.1)">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-accent-cyan">
              {typeof course.category === "object" ? course.category.name : course.category || "Course"}
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-text-title leading-snug">
              {course.title}
            </h1>
            <p className="text-xs text-text-muted line-clamp-1">
              {course.description}
            </p>
          </div>

          {/* Overall Progress Widget */}
          <div className="shrink-0 bg-bg-dark border border-glass-border/60 p-4 rounded-xl space-y-2 min-w-[220px]">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-text-muted">Your Progress</span>
              <span className="text-accent-purple font-extrabold">{progressPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-bg-deep rounded-full overflow-hidden border border-glass-border/50">
              <div
                className="h-full bg-gradient-to-r from-accent-purple to-accent-cyan transition-all duration-500 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="text-[10px] text-text-muted text-right font-semibold">
              {completedUnitsCount} / {totalUnitsCount} units completed
            </div>
          </div>
        </div>

        {/* 100% Course Completion Celebration Banner */}
        {isCourse100Percent && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
                <Trophy size={24} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-emerald-400 flex items-center gap-1.5">
                  🎉 Course Completed!
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  You have completed all units in this course. Excellent job!
                </p>
              </div>
            </div>
          </div>
        )}
      </SpotlightCard>

      {/* Main Course Learning Interface Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT SIDEBAR: Units Navigation */}
        <div className="lg:col-span-4 space-y-4">
          <SpotlightCard className="p-5 bg-glass-card border border-glass-border rounded-2xl" glowColor="rgba(168, 85, 247, 0.08)">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] font-bold text-text-muted border-b border-glass-border/40 pb-3">
                <span className="uppercase tracking-wider">Course Content</span>
                <span className="text-accent-purple font-extrabold">{units.length} Units</span>
              </div>

              {/* Units List */}
              {units.length === 0 ? (
                <p className="text-xs text-text-muted py-6 text-center">
                  No units have been added to this course yet.
                </p>
              ) : (
                <div className="space-y-2 max-h-[calc(100vh-20rem)] overflow-y-auto pr-1">
                  {units.map((unit, index) => {
                    const isActive = index === activeUnitIndex;
                    const completed = isUnitCompleted(unit._id);
                    const attachmentCount = unit.attachments?.length || 0;

                    return (
                      <button
                        key={unit._id}
                        onClick={() => setActiveUnitIndex(index)}
                        className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between gap-3 cursor-pointer ${
                          isActive
                            ? "bg-accent-purple/15 border-accent-purple/50 text-text-title shadow-lg"
                            : completed
                            ? "bg-emerald-500/5 border-emerald-500/20 text-text-main hover:border-emerald-500/40"
                            : "bg-bg-dark border-glass-border/60 hover:border-glass-border text-text-muted"
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          {/* Completion Icon Indicator */}
                          <div className="shrink-0">
                            {completed ? (
                              <CheckCircle2 size={18} className="text-emerald-400 fill-emerald-500/20" />
                            ) : (
                              <Circle size={18} className="text-text-muted/60" />
                            )}
                          </div>

                          <div className="space-y-0.5 overflow-hidden">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded border ${
                                completed
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                  : isActive
                                  ? "bg-accent-purple text-white border-accent-purple"
                                  : "bg-bg-darker text-text-muted border-glass-border"
                              }`}>
                                Unit {unit.order || index + 1}
                              </span>
                            </div>
                            <h4 className={`text-xs font-bold truncate ${isActive ? "text-text-title" : completed ? "text-text-title" : "text-text-main"}`}>
                              {unit.title}
                            </h4>
                            <p className="text-[10px] text-text-muted truncate">
                              {attachmentCount} {attachmentCount === 1 ? "attachment" : "attachments"}
                            </p>
                          </div>
                        </div>

                        <ChevronRight size={14} className={`shrink-0 transition ${isActive ? "text-accent-purple transform translate-x-0.5" : "text-text-muted"}`} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </SpotlightCard>
        </div>

        {/* MAIN AREA: Selected Unit Content & Actions */}
        <div className="lg:col-span-8 space-y-6">
          {!activeUnit ? (
            <SpotlightCard className="p-12 text-center rounded-2xl bg-glass-card border border-glass-border" glowColor="rgba(168, 85, 247, 0.05)">
              <BookOpen size={32} className="text-text-muted mx-auto mb-3" />
              <h3 className="text-md font-bold text-text-title">No units available</h3>
              <p className="text-xs text-text-muted max-w-sm mx-auto mt-1">
                There are currently no units available for study in this course.
              </p>
            </SpotlightCard>
          ) : (
            <div className="space-y-6">
              {/* Unit Title & Description Card */}
              <SpotlightCard className="p-6 md:p-8 bg-glass-card border border-glass-border rounded-2xl space-y-4" glowColor="rgba(168, 85, 247, 0.1)">
                <div className="space-y-2 border-b border-glass-border/30 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-accent-purple bg-accent-purple/10 border border-accent-purple/20 px-2.5 py-0.5 rounded">
                      Unit {activeUnit.order || activeUnitIndex + 1} of {units.length}
                    </span>
                    <h1 className="text-xl md:text-2xl font-extrabold text-text-title leading-snug mt-1">
                      {activeUnit.title}
                    </h1>
                  </div>

                  {activeUnitCompleted && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                      <CheckCircle2 size={14} /> Unit Completed
                    </span>
                  )}
                </div>

                {activeUnit.description && (
                  <div className="text-xs text-text-main leading-relaxed whitespace-pre-wrap">
                    {activeUnit.description}
                  </div>
                )}
              </SpotlightCard>

              {/* Unit Attachments Section */}
              <div className="space-y-4">
                <h3 className="text-md font-bold text-text-title flex items-center gap-2 border-b border-glass-border/40 pb-3">
                  <FileText className="text-accent-cyan" size={18} /> Unit Attachments & Learning Materials ({activeUnit.attachments?.length || 0})
                </h3>

                {!activeUnit.attachments || activeUnit.attachments.length === 0 ? (
                  <SpotlightCard className="p-8 text-center text-xs text-text-muted rounded-2xl bg-glass-card border border-glass-border" glowColor="rgba(6, 182, 212, 0.05)">
                    This unit has no attachments.
                  </SpotlightCard>
                ) : (
                  <div className="space-y-6">
                    {activeUnit.attachments.map((att, idx) => {
                      const attId = String(att._id || idx);
                      const isBookmarked = Boolean(bookmarksMap[attId]);

                      return (
                        <SpotlightCard key={attId || idx} className="p-5 bg-glass-card border border-glass-border rounded-2xl space-y-3" glowColor="rgba(168, 85, 247, 0.08)">
                          <div className="flex items-center justify-between border-b border-glass-border/30 pb-2">
                            <span className="text-[9px] uppercase font-bold text-text-muted">
                              Attachment {idx + 1}
                            </span>
                            <button
                              onClick={() => handleToggleBookmark(attId, activeUnit._id)}
                              disabled={bookmarkingId === attId}
                              className={`text-xs px-3 py-1 rounded-lg border font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95 ${
                                isBookmarked
                                  ? "bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25"
                                  : "bg-bg-dark text-text-muted border-glass-border hover:text-text-title hover:border-amber-500/30"
                              }`}
                            >
                              <Star
                                size={14}
                                className={isBookmarked ? "fill-amber-400 text-amber-400" : ""}
                              />
                              <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
                            </button>
                          </div>

                          <AttachmentViewer attachment={att} />
                        </SpotlightCard>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bottom Action Section: Mark Complete / Incomplete & Navigation */}
              <div className="p-6 bg-glass-card border border-glass-border rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <Button
                    onClick={() => setActiveUnitIndex((prev) => Math.max(0, prev - 1))}
                    disabled={activeUnitIndex === 0}
                    variant="secondary"
                    className="text-xs py-2.5 px-4 w-full sm:w-auto"
                  >
                    &larr; Previous Unit
                  </Button>

                  {/* Main Action Button: Complete / Uncomplete */}
                  <Button
                    onClick={() => handleToggleComplete(activeUnit._id)}
                    loading={togglingComplete}
                    className={`text-xs py-3 px-6 font-bold shadow-lg transition-all flex items-center justify-center gap-2 w-full sm:w-auto ${
                      activeUnitCompleted
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
                        : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
                    }`}
                  >
                    {activeUnitCompleted ? (
                      <>
                        <RotateCcw size={16} /> Mark as Incomplete
                      </>
                    ) : (
                      <>
                        <Check size={16} /> Mark as Complete
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => setActiveUnitIndex((prev) => Math.min(units.length - 1, prev + 1))}
                    disabled={activeUnitIndex === units.length - 1}
                    className="text-xs py-2.5 px-4 w-full sm:w-auto"
                  >
                    Next Unit &rarr;
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseLearn;
