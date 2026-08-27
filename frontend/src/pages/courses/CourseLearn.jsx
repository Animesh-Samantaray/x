import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById, isCourseEnrolled } from "../../services/courseService";
import { getUnitsByCourse } from "../../services/unitService";
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
  CheckCircle,
  PlayCircle,
  FileText,
  AlertCircle,
  Layers,
  ChevronRight,
  Bookmark as BookmarkIcon,
  Star
} from "lucide-react";

const CourseLearn = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [units, setUnits] = useState([]);
  const [activeUnitIndex, setActiveUnitIndex] = useState(0);

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

      // Check learner enrollment / owner / admin access using isCourseEnrolled helper
      const isEnrolled = isCourseEnrolled(courseRes.course, user);
      const isOwner = user && (courseRes.course?.createdBy?._id === user._id || courseRes.course?.createdBy === user._id);
      const isAdmin = user?.role === "admin";

      if (!isEnrolled && !isOwner && !isAdmin) {
        setError("Access Denied. You must be enrolled in this course to access learning materials.");
        return;
      }

      // Fetch course units & course bookmarks in parallel
      const [unitsRes, bookmarksRes] = await Promise.all([
        getUnitsByCourse(id),
        getCourseBookmarks(id).catch(() => ({ success: false, bookmarks: [] }))
      ]);

      if (unitsRes && unitsRes.success) {
        setUnits(unitsRes.units || []);
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

  const handleToggleBookmark = async (attachmentId, unitId) => {
    try {
      const attIdStr = String(attachmentId);
      setBookmarkingId(attIdStr);
      const existingBookmark = bookmarksMap[attIdStr];

      if (existingBookmark) {
        // Delete bookmark
        const res = await deleteBookmark(existingBookmark._id);
        if (res && res.success) {
          setBookmarksMap((prev) => {
            const next = { ...prev };
            delete next[attIdStr];
            return next;
          });
        }
      } else {
        // Create bookmark
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
            Enrolled Student Learning Portal
          </span>
        </div>
      </div>

      {/* Main Course Learning Interface Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT SIDEBAR: Units Navigation */}
        <div className="lg:col-span-4 space-y-4">
          <SpotlightCard className="p-5 bg-glass-card border border-glass-border rounded-2xl" glowColor="rgba(168, 85, 247, 0.08)">
            <div className="space-y-3">
              <div className="border-b border-glass-border/40 pb-3">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-accent-cyan">
                  {typeof course.category === "object" ? course.category.name : course.category || "Course"}
                </span>
                <h2 className="text-sm font-extrabold text-text-title leading-snug mt-0.5">{course.title}</h2>
              </div>

              <div className="flex items-center justify-between text-[10px] font-bold text-text-muted">
                <span>CURRICULUM UNITS</span>
                <span className="text-accent-purple">{units.length} Modules</span>
              </div>

              {/* Units List */}
              {units.length === 0 ? (
                <p className="text-xs text-text-muted py-4 text-center">
                  No units have been added to this course yet.
                </p>
              ) : (
                <div className="space-y-2 max-h-[calc(100vh-22rem)] overflow-y-auto pr-1">
                  {units.map((unit, index) => {
                    const isActive = index === activeUnitIndex;
                    const attachmentCount = unit.attachments?.length || 0;

                    return (
                      <button
                        key={unit._id}
                        onClick={() => setActiveUnitIndex(index)}
                        className={`w-full p-3 rounded-xl border text-left transition flex items-start justify-between gap-2 cursor-pointer ${
                          isActive
                            ? "bg-accent-purple/15 border-accent-purple/50 text-text-title shadow-lg"
                            : "bg-bg-dark border-glass-border/60 hover:border-glass-border text-text-muted"
                        }`}
                      >
                        <div className="space-y-1 overflow-hidden">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded border ${
                              isActive
                                ? "bg-accent-purple text-white border-accent-purple"
                                : "bg-bg-darker text-text-muted border-glass-border"
                            }`}>
                              Unit {unit.order || index + 1}
                            </span>
                          </div>
                          <h4 className={`text-xs font-bold truncate ${isActive ? "text-text-title" : "text-text-main"}`}>
                            {unit.title}
                          </h4>
                          <p className="text-[10px] text-text-muted truncate">
                            {attachmentCount} {attachmentCount === 1 ? "attachment" : "attachments"}
                          </p>
                        </div>
                        <ChevronRight size={14} className={`shrink-0 mt-1 transition ${isActive ? "text-accent-purple transform translate-x-0.5" : "text-text-muted"}`} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </SpotlightCard>
        </div>

        {/* MAIN AREA: Selected Unit Content & Attachments */}
        <div className="lg:col-span-8 space-y-6">
          {!activeUnit ? (
            <SpotlightCard className="p-12 text-center rounded-2xl" glowColor="rgba(168, 85, 247, 0.05)">
              <BookOpen size={32} className="text-text-muted mx-auto mb-3" />
              <h3 className="text-md font-bold text-text-title">No content available</h3>
              <p className="text-xs text-text-muted max-w-sm mx-auto mt-1">
                There are currently no units available for study in this course.
              </p>
            </SpotlightCard>
          ) : (
            <div className="space-y-6">
              {/* Unit Title & Description Card */}
              <SpotlightCard className="p-6 md:p-8 bg-glass-card border border-glass-border rounded-2xl space-y-4" glowColor="rgba(168, 85, 247, 0.1)">
                <div className="space-y-2 border-b border-glass-border/30 pb-4">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-accent-purple bg-accent-purple/10 border border-accent-purple/20 px-2.5 py-0.5 rounded">
                    Unit {activeUnit.order || activeUnitIndex + 1} of {units.length}
                  </span>
                  <h1 className="text-xl md:text-2xl font-extrabold text-text-title leading-snug">
                    {activeUnit.title}
                  </h1>
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
                  <SpotlightCard className="p-8 text-center text-xs text-text-muted rounded-2xl" glowColor="rgba(6, 182, 212, 0.05)">
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

              {/* Navigation Controls between Units */}
              <div className="flex items-center justify-between border-t border-glass-border/40 pt-4">
                <Button
                  onClick={() => setActiveUnitIndex((prev) => Math.max(0, prev - 1))}
                  disabled={activeUnitIndex === 0}
                  variant="secondary"
                  className="text-xs py-2 px-4"
                >
                  &larr; Previous Unit
                </Button>

                <Button
                  onClick={() => setActiveUnitIndex((prev) => Math.min(units.length - 1, prev + 1))}
                  disabled={activeUnitIndex === units.length - 1}
                  className="text-xs py-2 px-4"
                >
                  Next Unit &rarr;
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseLearn;
