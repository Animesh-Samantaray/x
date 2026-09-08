import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SpotlightCard from "../SpotlightCard";
import Sticker from "../ui/Sticker";
import CourseIsometricGraphic from "../graphics/CourseIsometricGraphic";
import { useAuth } from "../../context/AuthContext";
import { isCourseEnrolled } from "../../services/courseService";
import CourseRatingDisplay from "../reviews/CourseRatingDisplay";
import {
  BookOpen,
  Users,
  Calendar,
  User,
  Eye,
  Edit2,
  Trash2,
  GraduationCap,
  Settings,
  PlayCircle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

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

  const hasThumbnail = course.thumbnail && course.thumbnail.startsWith("http");
  const isEnrolled = isCourseEnrolled(course, user);
  const isLearner = user?.role === "learner";
  const isOwner = user && (course.createdBy?._id === user._id || course.createdBy === user._id);
  const isAdmin = user?.role === "admin";

  const getStatusStyle = (status) => {
    switch (status) {
      case "published":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "archived":
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      case "draft":
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
  };

  const enrollmentCount =
    course.enrolledStudents?.length || course.enrollmentCount || 0;

  // Determine sticker badge type based on rating or enrollment count
  let stickerType = null;
  if (course.averageRating >= 4.5) stickerType = "top";
  else if (enrollmentCount >= 5) stickerType = "trending";
  else if (course.status === "published") stickerType = "new";

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="h-full flex flex-col justify-between"
    >
      <SpotlightCard
        className="h-full flex flex-col justify-between rounded-2xl overflow-hidden border border-glass-border bg-glass-card hover:border-accent-purple/40 shadow-xl transition-all duration-300 group"
        glowColor="rgba(119, 87, 245, 0.12)"
      >
        <div className="flex-grow flex flex-col">
          {/* Top 3D Isometric Visual / Image Container */}
          <div className="h-44 w-full bg-bg-dark border-b border-glass-border relative overflow-hidden shrink-0">
            {hasThumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <CourseIsometricGraphic
                category={course.category}
                title={course.title}
              />
            )}

            {/* Sticker Badge top-left */}
            {stickerType && (
              <div className="absolute top-3 left-3 z-10">
                <Sticker type={stickerType} />
              </div>
            )}

            {/* Status Badge top-right */}
            <span
              className={`absolute top-3 right-3 text-[9px] border px-2.5 py-0.5 rounded-lg font-extrabold uppercase tracking-widest backdrop-blur-md z-10 ${getStatusStyle(
                course.status
              )}`}
            >
              ● {course.status || "draft"}
            </span>
          </div>

          {/* Content Body */}
          <div className="p-5 text-left space-y-3 flex-grow flex flex-col justify-between">
            <div className="space-y-2">
              <Link to={`/courses/${course._id}`} className="block group/link">
                <h3 className="text-sm font-extrabold text-text-title leading-snug group-hover/link:text-accent-purple transition duration-200 line-clamp-1">
                  {course.title}
                </h3>
              </Link>

              {/* Rating & Review Count */}
              <div className="flex items-center justify-between">
                <CourseRatingDisplay
                  averageRating={course.averageRating}
                  reviewCount={course.reviewCount}
                  size="xs"
                />
                {course.category && (
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-accent-purple bg-accent-purple/10 border border-accent-purple/20 px-2 py-0.5 rounded-md">
                    {typeof course.category === "object" ? course.category.name : course.category}
                  </span>
                )}
              </div>

              <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                {course.description}
              </p>
            </div>

            {/* Topics Tags */}
            {course.topics && course.topics.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {course.topics.slice(0, 3).map((topic, i) => (
                  <span
                    key={i}
                    className="text-[9px] bg-accent-purple/10 text-accent-purple border border-accent-purple/20 px-2 py-0.5 rounded-md font-semibold"
                  >
                    #{topic}
                  </span>
                ))}
                {course.topics.length > 3 && (
                  <span className="text-[9px] text-text-muted px-1 py-0.5">
                    +{course.topics.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Info Bar & Actions */}
        <div className="px-5 pb-5 pt-3 border-t border-glass-border/40 space-y-3">
          <div className="flex items-center justify-between text-[10px] text-text-muted">
            <div className="flex items-center gap-1.5">
              <User size={12} className="text-accent-purple shrink-0" />
              <span className="font-bold text-text-main truncate max-w-[100px]">
                {course.createdBy?.name || "Instructor"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-accent-cyan">
                <Users size={12} />
                <span className="font-extrabold">{enrollmentCount} enrolled</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>
                  {course.createdAt
                    ? new Date(course.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar for Enrolled Learner */}
          {(() => {
            const progressObj = progress || course.progress;
            if (!progressObj) return null;
            const pct = progressObj.percentage ?? 0;
            const compCount =
              progressObj.completedCount ??
              (Array.isArray(progressObj.completedUnits)
                ? progressObj.completedUnits.length
                : undefined);
            const totUnits = progressObj.totalUnits ?? course.units?.length;

            return (
              <div className="pt-1 space-y-1.5 border-t border-glass-border/30">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-text-muted">
                    {compCount !== undefined && totUnits !== undefined
                      ? `${compCount} / ${totUnits} units completed`
                      : "Course Progress"}
                  </span>
                  <span className="text-accent-cyan font-extrabold">{pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-bg-dark rounded-full overflow-hidden border border-glass-border">
                  <div
                    className="h-full bg-gradient-to-r from-accent-purple to-accent-cyan transition-all duration-300 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })()}

          {/* Action Controls & Price */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              {!isEnrolled && (
                <span className="text-sm font-extrabold text-accent-emerald tracking-tight">
                  ₹{(course.price || 999).toLocaleString("en-IN")}
                </span>
              )}

              {/* View Overview Button for ALL users */}
              <Link
                to={`/courses/${course._id}`}
                className="text-[10px] border border-glass-border hover:bg-glass-border text-text-title px-2.5 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 active:scale-95"
                title="View Course Overview"
              >
                <Eye size={12} /> Overview
              </Link>

              {isEnrolled && (
                <Link
                  to={`/courses/${course._id}/learn`}
                  className="text-[10px] bg-accent-purple text-white hover:bg-purple-600 px-3 py-1.5 rounded-lg font-extrabold uppercase tracking-wider transition cursor-pointer flex items-center gap-1 shadow-md active:scale-95"
                >
                  <PlayCircle size={12} /> Learn
                </Link>
              )}

              {(isOwner || isAdmin) && (
                <Link
                  to={`/courses/${course._id}/learn`}
                  className="text-[10px] bg-accent-purple/15 text-accent-purple border border-accent-purple/30 hover:bg-accent-purple hover:text-white px-2.5 py-1.5 rounded-lg font-extrabold uppercase tracking-wider transition cursor-pointer flex items-center gap-1 active:scale-95"
                >
                  <PlayCircle size={12} /> Preview
                </Link>
              )}
            </div>

            {isOwnerOrAdmin && (
              <div className="flex items-center gap-1">
                <Link
                  to={`/courses/${course._id}/manage`}
                  className="text-[10px] border border-accent-indigo/30 bg-accent-indigo/10 text-accent-indigo hover:bg-accent-indigo hover:text-white p-1.5 rounded-lg font-bold transition cursor-pointer"
                  title="Manage Curriculum"
                >
                  <Settings size={13} />
                </Link>
                {onEdit && (
                  <button
                    onClick={() => onEdit(course._id)}
                    className="text-[10px] border border-accent-blue/25 bg-accent-blue/5 text-accent-blue hover:bg-accent-blue hover:text-white p-1.5 rounded-lg font-bold transition cursor-pointer"
                    title="Edit Course"
                  >
                    <Edit2 size={13} />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(course._id)}
                    className="text-[10px] border border-rose-500/25 bg-rose-500/5 text-rose-400 hover:bg-rose-500 hover:text-white p-1.5 rounded-lg font-bold transition cursor-pointer"
                    title="Delete Course"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
};

export default CourseCard;
