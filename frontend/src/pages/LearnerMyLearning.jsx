import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyEnrolledCourses, unenrollFromCourse } from "../services/courseService";
import SpotlightCard from "../components/SpotlightCard";
import Button from "../components/Button";
import CourseCard from "../components/courses/CourseCard";
import { BookOpen, AlertCircle, PlayCircle, LogOut } from "lucide-react";

const LearnerMyLearning = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getMyEnrolledCourses();
      if (res && res.success) {
        setCourses(res.courses || []);
      } else {
        setError("Failed to fetch enrolled courses.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load your learning portfolio.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  return (
    <div className="space-y-6 text-left relative">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-glass-border/40 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-text-title flex items-center gap-2">
            <BookOpen className="text-accent-purple" size={24} /> My Learning Pathways
          </h1>
          <p className="text-xs text-text-muted font-semibold mt-1">
            Access courses you are currently enrolled in and continue your learning modules.
          </p>
        </div>

        <Button
          onClick={() => navigate("/courses")}
          variant="secondary"
          className="text-xs py-2 px-4 shrink-0"
        >
          Explore More Courses &rarr;
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex flex-col items-center justify-center p-8 border border-rose-500/20 bg-rose-500/5 rounded-2xl text-center max-w-md mx-auto">
          <AlertCircle className="text-rose-400 mb-2 animate-bounce" size={24} />
          <h4 className="text-sm font-bold text-text-title">Failed to load learning portfolio</h4>
          <p className="text-xs text-text-muted mt-1 mb-4">{error}</p>
          <Button onClick={fetchEnrolledCourses} className="text-xs py-2 px-4">
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
          <h3 className="text-md font-bold text-text-title">No enrolled courses yet</h3>
          <p className="text-xs text-text-muted max-w-sm mx-auto mt-1 mb-6">
            You are not enrolled in any courses. Explore the marketplace catalog to get started.
          </p>
          <Button onClick={() => navigate("/courses")} className="text-xs py-2.5 px-5">
            Explore Marketplace Courses &rarr;
          </Button>
        </SpotlightCard>
      )}

      {/* Enrolled Courses Grid */}
      {!error && !loading && courses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onEnrollSuccess={fetchEnrolledCourses}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LearnerMyLearning;
