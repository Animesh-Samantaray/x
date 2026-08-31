import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyCourses, getAllCourses, getMyEnrolledCourses, deleteCourse } from "../../services/courseService";
import { getMyProgress, getCourseProgress } from "../../services/progressService";
import { useAuth } from "../../context/AuthContext";
import CourseCard from "../../components/courses/CourseCard";
import EnrolledStudents from "../../components/courses/EnrolledStudents";
import SpotlightCard from "../../components/SpotlightCard";
import Button from "../../components/Button";
import { BookOpen, PlusCircle, AlertCircle, Trash2, X } from "lucide-react";

const MyCourses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [selectedStudentCourse, setSelectedStudentCourse] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");

      if (user?.role === "learner") {
        const [enrolledRes, progressRes] = await Promise.all([
          getMyEnrolledCourses(),
          getMyProgress().catch(() => ({ success: false, progress: [] })),
        ]);

        if (enrolledRes && enrolledRes.success) {
          const enrolledCourses = enrolledRes.courses || [];
          setCourses(enrolledCourses);

          const map = {};
          if (progressRes && progressRes.success && Array.isArray(progressRes.progress)) {
            progressRes.progress.forEach((p) => {
              const courseId = typeof p.course === "object" ? p.course?._id : p.course;
              if (courseId) {
                map[String(courseId)] = p;
              }
            });
          }

          const fetchMissingPromises = enrolledCourses.map(async (c) => {
            if (!map[String(c._id)]) {
              try {
                const pRes = await getCourseProgress(c._id);
                if (pRes && pRes.success) {
                  map[String(c._id)] = pRes.progress;
                }
              } catch (err) {
                console.error(`Failed to load progress for course ${c._id}`, err);
              }
            }
          });
          await Promise.all(fetchMissingPromises);
          setProgressMap(map);
        } else {
          setError("Failed to load enrolled courses.");
        }
      } else {
        const res = user?.role === "admin" ? await getAllCourses() : await getMyCourses();
        if (res && res.success) {
          setCourses(res.courses || []);
        } else {
          setError("Failed to load course portfolio.");
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to retrieve courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [user]);

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      const res = await deleteCourse(confirmDeleteId);
      if (res && res.success) {
        setConfirmDeleteId(null);
        fetchCourses();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete course.");
    } finally {
      setDeleting(false);
    }
  };

  const isCreatorOrExpert = user?.role === "creator" || user?.role === "expert" || user?.role === "admin";

  return (
    <div className="space-y-6 text-left relative">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-glass-border/40 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-text-title flex items-center gap-2">
            <BookOpen className="text-accent-purple" size={24} /> Course Management
          </h1>
          <p className="text-xs text-text-muted font-semibold mt-1">
            {user?.role === "admin"
              ? "Manage all published, draft, and archived courses across the platform."
              : "Organize, publish, and track enrollment metrics for your authoring portfolio."}
          </p>
        </div>

        {isCreatorOrExpert && (
          <Button
            onClick={() => navigate("/courses/new")}
            className="flex items-center gap-2 text-xs py-2.5 px-4 shadow-lg shrink-0"
          >
            <PlusCircle size={14} /> Create Course
          </Button>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="flex flex-col items-center justify-center p-8 border border-rose-500/20 bg-rose-500/5 rounded-2xl text-center max-w-md mx-auto">
          <AlertCircle className="text-rose-400 mb-2 animate-bounce" size={24} />
          <h4 className="text-sm font-bold text-text-title">Failed to load courses</h4>
          <p className="text-xs text-text-muted mt-1 mb-4">{error}</p>
          <Button onClick={fetchCourses} className="text-xs py-2 px-4">
            Try Again
          </Button>
        </div>
      )}

      {/* Loading Skeleton */}
      {!error && loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-glass-border/30 rounded-2xl border border-glass-border"></div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!error && !loading && courses.length === 0 && (
        <SpotlightCard className="p-12 bg-glass-card border border-glass-border text-center rounded-2xl" glowColor="rgba(168, 85, 247, 0.08)">
          <BookOpen size={32} className="text-text-muted mx-auto mb-3" />
          <h3 className="text-md font-bold text-text-title">No courses created yet</h3>
          <p className="text-xs text-text-muted max-w-sm mx-auto mt-1 mb-6">
            Assemble existing reference materials and developer documentation into your first interactive course.
          </p>
          {isCreatorOrExpert && (
            <Button onClick={() => navigate("/courses/new")} className="text-xs py-2.5 px-5">
              Create your first course &rarr;
            </Button>
          )}
        </SpotlightCard>
      )}

      {/* Course Grid */}
      {!error && !loading && courses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const isOwner = user && (course.createdBy?._id === user._id || course.createdBy === user._id);
            const isAdmin = user && user.role === "admin";
            const canManage = isOwner || isAdmin;

            return (
              <CourseCard
                key={course._id}
                course={course}
                progress={progressMap[String(course._id)]}
                isOwnerOrAdmin={canManage}
                onEdit={(id) => navigate(`/courses/edit/${id}`)}
                onDelete={(id) => setConfirmDeleteId(id)}
                onViewStudents={(c) => setSelectedStudentCourse(c)}
              />
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <SpotlightCard className="w-full max-w-sm bg-bg-panel border border-glass-border/70 p-6 rounded-2xl text-left shadow-2xl space-y-4" glowColor="rgba(244, 63, 94, 0.12)">
            <div className="flex items-center justify-between border-b border-glass-border/30 pb-3">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2">
                <Trash2 size={14} /> Confirm Course Deletion
              </h3>
              <button onClick={() => setConfirmDeleteId(null)} className="text-text-muted hover:text-rose-400 transition cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-text-main leading-relaxed">
              Are you sure you want to delete this course? This action is permanent and cannot be undone.
            </p>

            <div className="flex justify-end gap-2.5 pt-2">
              <Button variant="secondary" onClick={() => setConfirmDeleteId(null)} disabled={deleting}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteConfirm} loading={deleting}>
                {deleting ? "Deleting..." : "Confirm Delete"}
              </Button>
            </div>
          </SpotlightCard>
        </div>
      )}

      {/* Enrolled Students Modal */}
      {selectedStudentCourse && (
        <EnrolledStudents
          courseId={selectedStudentCourse._id}
          courseTitle={selectedStudentCourse.title}
          onClose={() => setSelectedStudentCourse(null)}
        />
      )}
    </div>
  );
};

export default MyCourses;
