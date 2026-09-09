import React from "react";
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
  PlayCircle,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Tag
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

  if (!course) return null;

  const hasThumbnail = course.thumbnail && course.thumbnail.startsWith("http");
  const isEnrolled = isCourseEnrolled(course, user);
  const isOwner = user && (course.createdBy?._id === user._id || course.createdBy === user._id);
  const isAdmin = user?.role === "admin";

  const getStatusStyle = (status) => {
    switch (status) {
      case "published":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "archived":
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
      case "draft":
      default:
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    }
  };

  const enrollmentCount =
    course.enrolledStudents?.length || course.enrollmentCount || 0;

  // Determine sticker badge type based on rating or enrollment count
  let stickerType = null;
  if (course.averageRating >= 4.5) stickerType = "top";
  else if (enrollmentCount >= 5) stickerType = "trending";
  else if (course.status === "published") stickerType = "new";

  const categoryName = typeof course.category === "object" ? course.category.name : (course.category || "Masterclass");

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="h-full flex flex-col justify-between"
    >
      {/* Container: rounded-[28px], light white or dark space violet background */}
      <div className="h-full p-4 sm:p-5 rounded-[28px] bg-white dark:bg-[#14121f] border-2 border-gray-200 dark:border-[#2b243d] hover:border-purple-500/50 shadow-md dark:shadow-2xl transition-all duration-300 flex flex-col justify-between text-left group">
        
        <div>
          {/* Top Banner Graphics (Thumbnail header with 20px rounded curves matching reference UI/UX) */}
          <div className="h-40 sm:h-44 w-full rounded-[20px] overflow-hidden relative mb-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900">
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
              className={`absolute top-3 right-3 text-[9px] border px-2.5 py-1 rounded-full font-extrabold uppercase tracking-widest backdrop-blur-md z-10 ${getStatusStyle(
                course.status
              )}`}
            >
              ● {course.status || "draft"}
            </span>

            {/* Category tag bottom-left */}
            <span className="absolute bottom-3 left-3 text-[9px] font-extrabold uppercase tracking-wider bg-slate-950/80 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-full backdrop-blur-md z-10">
              {categoryName}
            </span>
          </div>

          {/* Card Body */}
          <div className="space-y-3">
            <Link to={`/courses/${course._id}`} className="block group/title">
              <h3 className="text-lg font-black tracking-tight text-gray-900 dark:text-white line-clamp-1 group-hover/title:text-purple-600 dark:group-hover/title:text-purple-300 transition duration-200">
                {course.title}
              </h3>
            </Link>

            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-wide uppercase">
              Course Details:
            </p>

            {/* Feature Bullet Points (3 circular icon rows matching reference picture UI/UX) */}
            <div className="space-y-2.5 pt-1">
              {/* Instructor Row */}
              <div className="flex items-center gap-3 text-xs text-gray-700 dark:text-gray-300 font-medium">
                <div className="w-7 h-7 rounded-full bg-purple-50 dark:bg-[#272138] border border-purple-100 dark:border-[#3b3254] text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <User size={13} />
                </div>
                <span className="truncate">Instructor: <strong className="text-gray-900 dark:text-white font-bold">{course.createdBy?.name || "Mentor"}</strong></span>
              </div>

              {/* Rating & Enrollment Row */}
              <div className="flex items-center gap-3 text-xs text-gray-700 dark:text-gray-300 font-medium">
                <div className="w-7 h-7 rounded-full bg-cyan-50 dark:bg-[#272138] border border-cyan-100 dark:border-[#3b3254] text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                  <Users size={13} />
                </div>
                <div className="flex items-center gap-2 truncate">
                  <span>Enrolled: <strong className="text-gray-900 dark:text-white font-bold">{enrollmentCount}</strong></span>
                  <span className="text-gray-400">•</span>
                  <CourseRatingDisplay
                    averageRating={course.averageRating}
                    reviewCount={course.reviewCount}
                    size="xs"
                  />
                </div>
              </div>

              {/* Units / Topics Row */}
              <div className="flex items-center gap-3 text-xs text-gray-700 dark:text-gray-300 font-medium">
                <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-[#272138] border border-emerald-100 dark:border-[#3b3254] text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <BookOpen size={13} />
                </div>
                <span className="truncate">
                  {course.units?.length ? `${course.units.length} Learning Modules` : course.topics?.length ? `#${course.topics.slice(0, 2).join(" #")}` : "Interactive Masterclass"}
                </span>
              </div>
            </div>

            {/* Progress Bar for Enrolled Learner */}
            {(() => {
              const progressObj = progress || course.progress;
              if (!progressObj) return null;
              const pct = progressObj.percentage ?? 0;
              return (
                <div className="pt-2 space-y-1.5 border-t border-gray-100 dark:border-[#2e2447]">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-gray-500 dark:text-gray-400">Course Progress</span>
                    <span className="text-cyan-600 dark:text-cyan-300 font-extrabold">{pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-[#1b152d] rounded-full overflow-hidden border border-gray-200 dark:border-[#332752]">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 transition-all duration-300 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Bottom Action Pill Bar (Signature pill container matching reference UI/UX) */}
        <div className="mt-5 p-1.5 rounded-full bg-gray-100 dark:bg-[#1c182b] border border-gray-200 dark:border-[#332a4a] flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2 pl-3 text-xs font-black truncate">
            {isEnrolled ? (
              <span className="text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                <CheckCircle size={13} /> Enrolled
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 text-sm tracking-tight">
                ₹{(course.price || 999).toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {isEnrolled ? (
              <button
                onClick={() => navigate(`/courses/${course._id}/learn`)}
                className="px-5 py-2 rounded-full bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-950 font-black text-xs shadow-md transition cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <PlayCircle size={13} /> Learn
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => navigate(`/courses/${course._id}`)}
                  className="px-3 py-2 rounded-full bg-gray-200 dark:bg-[#28213b] hover:bg-gray-300 dark:hover:bg-[#342b4d] text-gray-800 dark:text-gray-200 font-bold text-xs transition cursor-pointer active:scale-95"
                >
                  Overview
                </button>
                <button
                  onClick={() => {
                    if (!user) {
                      navigate("/login");
                    } else {
                      navigate(`/courses/${course._id}`);
                    }
                  }}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-black text-xs shadow-md transition cursor-pointer flex items-center gap-1 active:scale-95"
                >
                  Enroll Now <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </motion.div>
  );
};

export default CourseCard;
