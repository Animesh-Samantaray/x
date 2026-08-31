import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCourseById,
  deleteCourse,
  enrollInCourse,
  unenrollFromCourse,
  isCourseEnrolled
} from "../../services/courseService";
import { getCourseProgress } from "../../services/progressService";
import { useAuth } from "../../context/AuthContext";
import SpotlightCard from "../../components/SpotlightCard";
import Button from "../../components/Button";
import EnrolledStudents from "../../components/courses/EnrolledStudents";
import {
  BookOpen,
  Calendar,
  User,
  Users,
  Layers,
  Edit2,
  Trash2,
  GraduationCap,
  ArrowLeft,
  AlertCircle,
  PlayCircle,
  X,
  Settings,
  LogOut,
  CheckCircle
} from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [enrolling, setEnrolling] = useState(false);
  const [unenrolling, setUnenrolling] = useState(false);
  const [unenrollModalOpen, setUnenrollModalOpen] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [studentsModalOpen, setStudentsModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getCourseById(id);
      if (res && res.success) {
        setCourse(res.course);
        if (user && isCourseEnrolled(res.course, user)) {
          try {
            const progRes = await getCourseProgress(id);
            if (progRes && progRes.success) {
              setProgress(progRes.progress);
            }
          } catch (pErr) {
            console.error("Progress fetch error:", pErr);
          }
        }
      } else {
        setError("Course not found.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load course details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && user) {
      fetchCourse();
    } else if (id) {
      fetchCourse();
    }
  }, [id, user]);

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      setError("");
      const res = await enrollInCourse(id);
      if (res && res.success) {
        await fetchCourse();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to enroll in course.");
    } finally {
      setEnrolling(false);
    }
  };

  const handleUnenrollConfirm = async () => {
    try {
      setUnenrolling(true);
      setError("");
      const res = await unenrollFromCourse(id);
      if (res && res.success) {
        setUnenrollModalOpen(false);
        await fetchCourse();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to unenroll from course.");
    } finally {
      setUnenrolling(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const res = await deleteCourse(id);
      if (res && res.success) {
        navigate("/my-courses");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete course.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-text-muted flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-accent-purple"></div>
        Loading course information...
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-rose-500/20 bg-rose-500/5 rounded-2xl text-center max-w-md mx-auto my-12 text-left">
        <AlertCircle className="text-rose-400 mb-2 animate-bounce" size={28} />
        <h4 className="text-sm font-bold text-text-title">Course Not Found</h4>
        <p className="text-xs text-text-muted mt-1 mb-4">{error || "The requested course does not exist."}</p>
        <Button onClick={() => navigate("/courses")} className="text-xs py-2 px-4">
          &larr; Return to Courses
        </Button>
      </div>
    );
  }

  const isOwner = user && (course.createdBy?._id === user._id || course.createdBy === user._id);
  const isAdmin = user && user.role === "admin";
  const isLearner = user && user.role === "learner";
  const canManage = isOwner || isAdmin;

  // Determine if user is enrolled
  const isEnrolled = isCourseEnrolled(course, user);

  const enrollmentCount = course.enrolledStudents?.length || 0;
  const unitCount = course.units?.length || 0;
  const hasThumbnail = course.thumbnail && course.thumbnail.startsWith("http");

  return (
    <div className="space-y-6 text-left relative">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-glass-border/40 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-bold text-text-muted hover:text-text-title flex items-center gap-1.5 transition"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Manage Course button for Creator/Admin */}
          {canManage && (
            <>
              <Button
                onClick={() => navigate(`/courses/${course._id}/manage`)}
                className="text-xs py-2 px-3 flex items-center gap-1.5 bg-accent-indigo hover:bg-accent-purple"
              >
                <Settings size={14} /> Manage Course Curriculum
              </Button>
              <Button
                onClick={() => setStudentsModalOpen(true)}
                variant="secondary"
                className="text-xs py-2 px-3 flex items-center gap-1.5 border-accent-cyan/30 text-accent-cyan hover:bg-accent-cyan/10"
              >
                <GraduationCap size={14} /> Enrolled Students ({enrollmentCount})
              </Button>
              <Button
                onClick={() => navigate(`/courses/edit/${course._id}`)}
                variant="secondary"
                className="text-xs py-2 px-3 flex items-center gap-1.5"
              >
                <Edit2 size={14} /> Edit Metadata
              </Button>
              <Button
                onClick={() => setDeleteConfirmOpen(true)}
                variant="danger"
                className="text-xs py-2 px-3 flex items-center gap-1.5"
              >
                <Trash2 size={14} /> Delete
              </Button>
            </>
          )}

          {/* Learner Enrollment / Learning Actions */}
          {isEnrolled ? (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate(`/courses/${course._id}/learn`)}
                className="text-xs py-2.5 px-5 flex items-center gap-2 shadow-lg bg-gradient-to-r from-accent-purple to-accent-indigo"
              >
                <PlayCircle size={16} /> Continue Learning &rarr;
              </Button>
              <Button
                onClick={() => setUnenrollModalOpen(true)}
                variant="danger"
                className="text-xs py-2.5 px-3 border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white"
              >
                Unenroll
              </Button>
            </div>
          ) : isLearner ? (
            <Button
              onClick={handleEnroll}
              loading={enrolling}
              className="text-xs py-2.5 px-6 shadow-lg flex items-center gap-2 bg-gradient-to-r from-accent-purple to-accent-indigo"
            >
              <GraduationCap size={16} /> Enroll in Course
            </Button>
          ) : null}
        </div>
      </div>

      {/* Error alert inside page */}
      {error && (
        <div className="p-3 border border-rose-500/20 bg-rose-500/5 rounded-xl text-xs text-rose-400 flex items-center gap-2 font-semibold">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Course Details Header Card */}
      <SpotlightCard className="p-6 md:p-8 bg-glass-card border border-glass-border rounded-2xl overflow-hidden" glowColor="rgba(168, 85, 247, 0.12)">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Thumbnail */}
          <div className="md:col-span-4 h-56 w-full bg-bg-dark border border-glass-border rounded-xl overflow-hidden relative">
            {hasThumbnail ? (
              <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#1E114A] via-[#140C36] to-[#0F072D] text-accent-purple/60">
                <BookOpen size={48} />
              </div>
            )}
            {course.status && (
              <span className={`absolute top-3 right-3 text-[9px] border px-2.5 py-0.5 rounded font-bold uppercase tracking-wider backdrop-blur-md ${
                course.status === "published" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                course.status === "archived" ? "bg-slate-500/10 text-slate-400 border-slate-500/20" :
                "bg-amber-500/10 text-amber-500 border-amber-500/20"
              }`}>
                {course.status}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="md:col-span-8 space-y-4">
            <div className="space-y-2">
              {course.category && (
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-accent-purple bg-accent-purple/10 border border-accent-purple/20 px-2.5 py-1 rounded">
                  {typeof course.category === "object" ? course.category.name : course.category}
                </span>
              )}
              <h1 className="text-xl md:text-2xl font-extrabold text-text-title leading-snug">
                {course.title}
              </h1>
            </div>

            <p className="text-xs text-text-main leading-relaxed whitespace-pre-wrap">
              {course.description}
            </p>

            {/* Topics */}
            {course.topics && course.topics.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {course.topics.map((topic, i) => (
                  <span key={i} className="text-[9px] bg-accent-purple/10 text-accent-purple border border-accent-purple/20 px-2 py-0.5 rounded font-semibold">
                    #{topic}
                  </span>
                ))}
              </div>
            )}

            {/* Metadata Bar */}
            <div className="pt-4 border-t border-glass-border/30 flex flex-wrap items-center gap-6 text-xs text-text-muted">
              <div className="flex items-center gap-1.5">
                <User size={14} className="text-accent-purple" />
                <span>Created by <strong className="text-text-title">{course.createdBy?.name || "Instructor"}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers size={14} className="text-accent-purple" />
                <span><strong className="text-text-title">{unitCount}</strong> Learning Units</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users size={14} className="text-accent-cyan" />
                <span><strong className="text-text-title">{enrollmentCount}</strong> Enrolled Students</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                <span>{course.createdAt ? new Date(course.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A"}</span>
              </div>
            </div>

            {/* CTA for Learner Flow */}
            <div className="pt-4 border-t border-glass-border/30 space-y-4">
              {isEnrolled && (
                <div className="p-3.5 bg-bg-dark rounded-xl border border-glass-border/60 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-text-muted flex items-center gap-1.5">
                      <CheckCircle size={14} className="text-emerald-400" />
                      Course Progress
                      {progress && progress.totalUnits !== undefined && (
                        <span className="text-text-muted font-normal">
                          ({progress.completedCount || 0}/{progress.totalUnits} units)
                        </span>
                      )}
                    </span>
                    <span className="text-accent-purple font-extrabold">
                      {progress ? progress.percentage || 0 : 0}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-bg-deep rounded-full overflow-hidden border border-glass-border/50">
                    <div
                      className="h-full bg-gradient-to-r from-accent-purple to-accent-cyan transition-all duration-300 rounded-full"
                      style={{ width: `${progress ? progress.percentage || 0 : 0}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-4">
                {isEnrolled ? (
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => navigate(`/courses/${course._id}/learn`)}
                      className="text-xs py-2.5 px-5 flex items-center gap-2 bg-gradient-to-r from-accent-purple to-accent-indigo"
                    >
                      <PlayCircle size={16} /> Continue Learning &rarr;
                    </Button>
                  </div>
                ) : isLearner ? (
                  <Button
                    onClick={handleEnroll}
                    loading={enrolling}
                    className="text-xs py-2.5 px-6 shadow-lg flex items-center gap-2 bg-gradient-to-r from-accent-purple to-accent-indigo"
                  >
                    <GraduationCap size={16} /> Enroll in Course
                  </Button>
                ) : (isOwner || isAdmin) ? (
                  <Button
                    onClick={() => navigate(`/courses/${course._id}/learn`)}
                    className="text-xs py-2.5 px-5 flex items-center gap-2 bg-accent-purple/20 text-accent-purple border border-accent-purple/30 hover:bg-accent-purple hover:text-white"
                  >
                    <PlayCircle size={16} /> Preview Learning Workspace &rarr;
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </SpotlightCard>

      {/* Unenroll Confirmation Modal */}
      {unenrollModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <SpotlightCard className="w-full max-w-sm bg-bg-panel border border-glass-border/70 p-6 rounded-2xl text-left shadow-2xl space-y-4" glowColor="rgba(244, 63, 94, 0.12)">
            <div className="flex items-center justify-between border-b border-glass-border/30 pb-3">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2">
                <LogOut size={14} /> Confirm Unenrollment
              </h3>
              <button onClick={() => setUnenrollModalOpen(false)} className="text-text-muted hover:text-rose-400 transition cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-text-main leading-relaxed">
              Are you sure you want to unenroll from <strong className="text-text-title">{course.title}</strong>? You will lose access to the learning module.
            </p>

            <div className="flex justify-end gap-2.5 pt-2">
              <Button variant="secondary" onClick={() => setUnenrollModalOpen(false)} disabled={unenrolling}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleUnenrollConfirm} loading={unenrolling}>
                {unenrolling ? "Unenrolling..." : "Confirm Unenroll"}
              </Button>
            </div>
          </SpotlightCard>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <SpotlightCard className="w-full max-w-sm bg-bg-panel border border-glass-border/70 p-6 rounded-2xl text-left shadow-2xl space-y-4" glowColor="rgba(244, 63, 94, 0.12)">
            <div className="flex items-center justify-between border-b border-glass-border/30 pb-3">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2">
                <Trash2 size={14} /> Delete Course
              </h3>
              <button onClick={() => setDeleteConfirmOpen(false)} className="text-text-muted hover:text-rose-400 transition cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-text-main leading-relaxed">
              Are you sure you want to delete <strong className="text-text-title">{course.title}</strong>? This action is permanent and cannot be undone.
            </p>

            <div className="flex justify-end gap-2.5 pt-2">
              <Button variant="secondary" onClick={() => setDeleteConfirmOpen(false)} disabled={deleting}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete} loading={deleting}>
                {deleting ? "Deleting..." : "Confirm Delete"}
              </Button>
            </div>
          </SpotlightCard>
        </div>
      )}

      {/* Enrolled Students Modal */}
      {studentsModalOpen && (
        <EnrolledStudents
          courseId={course._id}
          courseTitle={course.title}
          onClose={() => setStudentsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CourseDetail;
