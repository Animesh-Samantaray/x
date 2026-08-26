import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCourseById, deleteCourse } from "../../services/courseService";
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
  Tag,
  Edit2,
  Trash2,
  GraduationCap,
  ArrowLeft,
  AlertCircle,
  FileText,
  ExternalLink,
  Eye,
  X
} from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
    if (id) {
      fetchCourse();
    }
  }, [id]);

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

  if (error || !course) {
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
  const canManage = isOwner || isAdmin;
  const enrollmentCount = course.enrolledStudents?.length || 0;
  const hasThumbnail = course.thumbnail && course.thumbnail.startsWith("http");

  return (
    <div className="space-y-6 text-left relative">
      {/* Back button & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-glass-border/40 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-bold text-text-muted hover:text-text-title flex items-center gap-1.5 transition"
        >
          <ArrowLeft size={14} /> Back
        </button>

        {canManage && (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setStudentsModalOpen(true)}
              variant="secondary"
              className="text-xs py-2 px-3 flex items-center gap-1.5 border-accent-cyan/30 text-accent-cyan hover:bg-accent-cyan/10"
            >
              <GraduationCap size={14} /> View Enrolled Students ({enrollmentCount})
            </Button>
            <Button
              onClick={() => navigate(`/courses/edit/${course._id}`)}
              className="text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <Edit2 size={14} /> Edit Course
            </Button>
            <Button
              onClick={() => setDeleteConfirmOpen(true)}
              variant="danger"
              className="text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <Trash2 size={14} /> Delete
            </Button>
          </div>
        )}
      </div>

      {/* Main Course Header Card */}
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
                <Users size={14} className="text-accent-cyan" />
                <span><strong className="text-text-title">{enrollmentCount}</strong> Enrolled Students</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                <span>{course.createdAt ? new Date(course.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </SpotlightCard>

      {/* Attached Resources Section */}
      <div className="space-y-4 pt-2">
        <h2 className="text-md font-bold text-text-title flex items-center gap-2 border-b border-glass-border/40 pb-3">
          <FileText className="text-accent-cyan" size={18} /> Course Knowledge Resources ({course.resources?.length || 0})
        </h2>

        {!course.resources || course.resources.length === 0 ? (
          <SpotlightCard className="p-8 text-center text-xs text-text-muted rounded-2xl" glowColor="rgba(6, 182, 212, 0.05)">
            No resources are currently attached to this course.
          </SpotlightCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course.resources.map((res) => (
              <SpotlightCard key={res._id || res} className="p-5 flex flex-col justify-between rounded-xl" glowColor="rgba(6, 182, 212, 0.08)">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[8px] font-extrabold uppercase tracking-widest text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-2 py-0.5 rounded">
                      {res.category?.name || "Resource"}
                    </span>
                    {res.resourceType && (
                      <span className="text-[8px] text-text-muted border border-glass-border px-1.5 py-0.2 rounded font-semibold uppercase">
                        {res.resourceType}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs font-bold text-text-title line-clamp-1">{res.title}</h3>
                  <p className="text-[10px] text-text-muted line-clamp-2 leading-relaxed">{res.description}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-glass-border/30 flex justify-end">
                  <Link
                    to={`/resources/${res._id}`}
                    className="text-[9px] border border-glass-border hover:bg-glass-border hover:text-text-title px-2.5 py-1 rounded-md font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1 active:scale-95"
                  >
                    <Eye size={10} /> View Resource
                  </Link>
                </div>
              </SpotlightCard>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
