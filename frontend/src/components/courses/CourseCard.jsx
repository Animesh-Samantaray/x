import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SpotlightCard from "../SpotlightCard";
import Button from "../Button";
import { useAuth } from "../../context/AuthContext";
import { isCourseEnrolled, enrollInCourse } from "../../services/courseService";
import CourseRatingDisplay from "../reviews/CourseRatingDisplay";
import { BookOpen, Users, Calendar, User, Eye, Edit2, Trash2, GraduationCap, Settings, PlayCircle, CheckCircle } from "lucide-react";

const CourseCard = ({
  course,
  progress,
  isOwnerOrAdmin = false,
  onEdit,
  onDelete,
  onViewStudents,
  onEnrollSuccess,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrolling, setEnrolling] = useState(false);

  const hasThumbnail = course.thumbnail && course.thumbnail.startsWith("http");
  const isEnrolled = isCourseEnrolled(course, user);
  const isLearner = user?.role === "learner";
  const isOwner = user && (course.createdBy?._id === user._id || course.createdBy === user._id);
  const isAdmin = user?.role === "admin";

  const handleQuickEnroll = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setEnrolling(true);
      const res = await enrollInCourse(course._id);
      if (res && res.success) {
        if (onEnrollSuccess) {
          onEnrollSuccess(course._id);
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to enroll in course.");
    } finally {
      setEnrolling(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "published":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "archived":
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      case "draft":
      default:
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    }
  };

  const enrollmentCount =
    course.enrolledStudents?.length || course.enrollmentCount || 0;

  return (
    <SpotlightCard className="h-full flex flex-col justify-between rounded-xl overflow-hidden border border-glass-border bg-glass-card hover:border-accent-purple/30 transition-all duration-200" glowColor="rgba(168, 85, 247, 0.08)">
      <div className="flex-grow flex flex-col">
        {/* Thumbnail & Badges */}
        <div className="h-36 w-full bg-bg-dark border-b border-glass-border relative overflow-hidden">
          {hasThumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#1E114A] via-[#140C36] to-[#0F072D] text-white">
              <BookOpen size={32} className="text-accent-purple/60" />
            </div>
          )}

          {course.category && (
            <span className="absolute top-2.5 left-2.5 text-[8px] font-extrabold uppercase tracking-widest bg-bg-deep/85 text-accent-purple border border-accent-purple/20 px-2 py-0.5 rounded-md backdrop-blur-md">
              {typeof course.category === "object" ? course.category.name : course.category}
            </span>
          )}

          <span className={`absolute top-2.5 right-2.5 text-[8px] border px-2 py-0.5 rounded-md font-bold uppercase tracking-wider backdrop-blur-md ${getStatusStyle(course.status)}`}>
            {course.status || "draft"}
          </span>
        </div>

        {/* Content Body */}
        <div className="p-4 text-left space-y-2.5 flex-grow flex flex-col justify-between">
          <div className="space-y-1.5">
            <Link to={`/courses/${course._id}`} className="block group">
              <h3 className="text-xs sm:text-sm font-bold text-text-title leading-snug group-hover:text-accent-purple transition duration-150 line-clamp-1">
                {course.title}
              </h3>
            </Link>
            {/* Rating display */}
            <div className="pt-0.5">
              <CourseRatingDisplay
                averageRating={course.averageRating}
                reviewCount={course.reviewCount}
                size="xs"
              />
            </div>
            <p className="text-[10px] text-text-muted leading-relaxed line-clamp-2">
              {course.description}
            </p>
          </div>

          {/* Topics */}
          {course.topics && course.topics.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {course.topics.slice(0, 3).map((topic, i) => (
                <span key={i} className="text-[8px] bg-accent-purple/10 text-accent-purple border border-accent-purple/20 px-1.5 py-0.2 rounded-md font-semibold">
                  #{topic}
                </span>
              ))}
              {course.topics.length > 3 && (
                <span className="text-[8px] text-text-muted px-1 py-0.2">
                  +{course.topics.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Info Bar & Actions */}
      <div className="px-4 pb-4 pt-2.5 border-t border-glass-border/30 space-y-2.5">
        <div className="flex items-center justify-between text-[9px] text-text-muted">
          <div className="flex items-center gap-1">
            <User size={10} className="text-accent-purple/70" />
            <span className="font-semibold text-text-main truncate max-w-[90px]">
              {course.createdBy?.name || "Unknown"}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 text-accent-cyan">
              <Users size={10} />
              <span className="font-bold">{enrollmentCount} enrolled</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={10} />
              <span>
                {course.createdAt ? new Date(course.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar for Enrolled Learner */}
        {(() => {
          const progressObj = progress || course.progress;
          if (!progressObj) return null;
          const pct = progressObj.percentage ?? 0;
          const compCount = progressObj.completedCount ?? (Array.isArray(progressObj.completedUnits) ? progressObj.completedUnits.length : undefined);
          const totUnits = progressObj.totalUnits ?? course.units?.length;

          return (
            <div className="pt-1 space-y-1 border-t border-glass-border/20">
              <div className="flex items-center justify-between text-[9px] font-bold">
                <span className="text-text-muted">
                  {compCount !== undefined && totUnits !== undefined
                    ? `${compCount} / ${totUnits} units completed`
                    : "Course Progress"}
                </span>
                <span className="text-accent-purple font-extrabold">{pct}%</span>
              </div>
              <div className="w-full h-1 bg-bg-dark rounded-full overflow-hidden border border-glass-border/60">
                <div
                  className="h-full bg-gradient-to-r from-accent-purple to-accent-cyan transition-all duration-300 rounded-full"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })()}

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-1.5 pt-0.5">
          {/* Enrollment controls shown strictly for Learners or when user is enrolled */}
          {isEnrolled ? (
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                <CheckCircle size={10} /> Enrolled
              </span>
              <Link
                to={`/courses/${course._id}/learn`}
                className="text-[9px] bg-accent-purple/15 text-accent-purple border border-accent-purple/30 hover:bg-accent-purple hover:text-white px-2 py-0.5 rounded-md font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <PlayCircle size={10} /> Go to Course
              </Link>
            </div>
          ) : isOwner || isAdmin ? (
            <div className="flex items-center gap-1.5">
              <Link
                to={`/courses/${course._id}/learn`}
                className="text-[9px] bg-accent-purple/15 text-accent-purple border border-accent-purple/30 hover:bg-accent-purple hover:text-white px-2 py-0.5 rounded-md font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <PlayCircle size={10} /> Preview Workspace
              </Link>
              <Link
                to={`/courses/${course._id}`}
                className="text-[9px] border border-glass-border hover:bg-glass-border hover:text-text-title px-2 py-0.5 rounded-md font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <Eye size={10} /> Details
              </Link>
            </div>
          ) : isLearner || !user ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleQuickEnroll}
                disabled={enrolling}
                className="text-[9px] bg-gradient-to-r from-accent-purple to-accent-indigo text-white px-2 py-0.5 rounded-md font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1 active:scale-95 shadow-xs"
              >
                <GraduationCap size={10} /> {enrolling ? "Enrolling..." : "Enroll"}
              </button>
              <Link
                to={`/courses/${course._id}`}
                className="text-[9px] border border-glass-border hover:bg-glass-border hover:text-text-title px-2 py-0.5 rounded-md font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <Eye size={10} /> Details
              </Link>
            </div>
          ) : (
            <Link
              to={`/courses/${course._id}`}
              className="text-[9px] border border-glass-border hover:bg-glass-border hover:text-text-title px-2 py-0.5 rounded-md font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1 active:scale-95"
            >
              <Eye size={10} /> View Course
            </Link>
          )}

          {isOwnerOrAdmin && (
            <div className="flex items-center gap-1">
              <Link
                to={`/courses/${course._id}/manage`}
                className="text-[9px] border border-accent-indigo/30 bg-accent-indigo/10 text-accent-indigo hover:bg-accent-indigo hover:text-white px-2 py-0.5 rounded-md font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1 active:scale-95"
                title="Manage units & curriculum"
              >
                <Settings size={10} /> Manage
              </Link>
              {onEdit && (
                <button
                  onClick={() => onEdit(course._id)}
                  className="text-[9px] border border-accent-blue/25 bg-accent-blue/5 text-accent-blue hover:bg-accent-blue hover:text-white px-2 py-0.5 rounded-md font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1 active:scale-95"
                >
                  <Edit2 size={10} /> Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(course._id)}
                  className="text-[9px] border border-rose-500/25 bg-rose-500/5 text-rose-400 hover:bg-rose-500 hover:text-white px-2 py-0.5 rounded-md font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1 active:scale-95"
                >
                  <Trash2 size={10} /> Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </SpotlightCard>
  );
};

export default CourseCard;
