import React from "react";
import { Link } from "react-router-dom";
import SpotlightCard from "../SpotlightCard";
import { BookOpen, Users, Calendar, User, Eye, Edit2, Trash2, GraduationCap } from "lucide-react";

const CourseCard = ({
  course,
  isOwnerOrAdmin = false,
  onEdit,
  onDelete,
  onViewStudents,
}) => {
  const hasThumbnail = course.thumbnail && course.thumbnail.startsWith("http");

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
    <SpotlightCard className="h-full flex flex-col justify-between" glowColor="rgba(168, 85, 247, 0.1)">
      <div className="flex-grow flex flex-col">
        {/* Thumbnail & Badges */}
        <div className="h-44 w-full bg-bg-dark border-b border-glass-border relative overflow-hidden rounded-t-2xl">
          {hasThumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#1E114A] via-[#140C36] to-[#0F072D] text-white">
              <BookOpen size={40} className="text-accent-purple/60" />
            </div>
          )}

          {course.category && (
            <span className="absolute top-3 left-3 text-[8px] font-extrabold uppercase tracking-widest bg-bg-deep/80 text-accent-purple border border-accent-purple/20 px-2 py-0.5 rounded backdrop-blur-md">
              {typeof course.category === "object" ? course.category.name : course.category}
            </span>
          )}

          <span className={`absolute top-3 right-3 text-[8px] border px-2 py-0.5 rounded font-bold uppercase tracking-wider backdrop-blur-md ${getStatusStyle(course.status)}`}>
            {course.status || "draft"}
          </span>
        </div>

        {/* Content Body */}
        <div className="p-5 text-left space-y-3 flex-grow flex flex-col justify-between">
          <div className="space-y-2">
            <Link to={`/courses/${course._id}`} className="block group">
              <h3 className="text-sm font-bold text-text-title leading-snug group-hover:text-accent-purple transition duration-150 line-clamp-1">
                {course.title}
              </h3>
            </Link>
            <p className="text-[10px] text-text-muted leading-relaxed line-clamp-2">
              {course.description}
            </p>
          </div>

          {/* Topics */}
          {course.topics && course.topics.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {course.topics.slice(0, 3).map((topic, i) => (
                <span key={i} className="text-[8px] bg-accent-purple/10 text-accent-purple border border-accent-purple/20 px-1.5 py-0.2 rounded font-semibold">
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
      <div className="px-5 pb-5 pt-3 border-t border-glass-border/30 space-y-3">
        <div className="flex items-center justify-between text-[9px] text-text-muted">
          <div className="flex items-center gap-1">
            <User size={10} className="text-accent-purple/70" />
            <span className="font-semibold text-text-main truncate max-w-[90px]">
              {course.createdBy?.name || "Unknown"}
            </span>
          </div>

          <div className="flex items-center gap-3">
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

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-1.5 pt-1">
          <Link
            to={`/courses/${course._id}`}
            className="text-[9px] border border-glass-border hover:bg-glass-border hover:text-text-title px-2.5 py-1 rounded-md font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1 active:scale-95"
          >
            <Eye size={10} /> View
          </Link>

          {isOwnerOrAdmin && (
            <div className="flex items-center gap-1">
              {onViewStudents && (
                <button
                  onClick={() => onViewStudents(course)}
                  className="text-[9px] border border-accent-cyan/25 bg-accent-cyan/5 text-accent-cyan hover:bg-accent-cyan hover:text-white px-2 py-1 rounded-md font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1 active:scale-95"
                >
                  <GraduationCap size={10} /> Students
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(course._id)}
                  className="text-[9px] border border-accent-blue/25 bg-accent-blue/5 text-accent-blue hover:bg-accent-blue hover:text-white px-2 py-1 rounded-md font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1 active:scale-95"
                >
                  <Edit2 size={10} /> Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(course._id)}
                  className="text-[9px] border border-rose-500/25 bg-rose-500/5 text-rose-400 hover:bg-rose-500 hover:text-white px-2 py-1 rounded-md font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1 active:scale-95"
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
