import React, { useState, useEffect } from "react";
import { getAllCourses } from "../../services/courseService";
import { getCategories } from "../../services/categoryService";
import CourseCard from "../../components/courses/CourseCard";
import CourseFilters from "../../components/courses/CourseFilters";
import SpotlightCard from "../../components/SpotlightCard";
import Button from "../../components/Button";
import { BookOpen, AlertCircle } from "lucide-react";

const ExploreCourses = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [courseRes, catRes] = await Promise.all([
        getAllCourses(),
        getCategories(),
      ]);

      if (courseRes && courseRes.success) {
        setCourses(courseRes.courses || []);
      }
      if (catRes && catRes.success) {
        setCategories(catRes.categories || []);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load platform courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const hasActiveFilters = searchQuery.trim() !== "" || selectedCategory !== "all";

  const filteredCourses = courses.filter((course) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (course.title || "").toLowerCase().includes(q) ||
      (course.description || "").toLowerCase().includes(q);

    const categoryId = course.category
      ? typeof course.category === "object"
        ? course.category._id
        : course.category
      : null;

    const matchesCategory =
      selectedCategory === "all" ||
      (categoryId && categoryId === selectedCategory) ||
      (course.category && typeof course.category === "object" && course.category.name === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-glass-border/40 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-text-title flex items-center gap-2">
            <BookOpen className="text-accent-purple" size={24} /> Explore Courses
          </h1>
          <p className="text-xs text-text-muted font-semibold mt-1">
            Discover curated developer learning pathways and knowledge-based masterclasses.
          </p>
        </div>
      </div>

      {/* Filters */}
      <CourseFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        onRefresh={fetchData}
        loading={loading}
      />

      {/* Error state */}
      {error && (
        <div className="flex flex-col items-center justify-center p-8 border border-rose-500/20 bg-rose-500/5 rounded-2xl text-center max-w-md mx-auto">
          <AlertCircle className="text-rose-400 mb-2 animate-bounce" size={24} />
          <h4 className="text-sm font-bold text-text-title">Unable to load Courses</h4>
          <p className="text-xs text-text-muted mt-1 mb-4">{error}</p>
          <Button onClick={fetchData} className="text-xs py-2 px-4">
            Try Again
          </Button>
        </div>
      )}

      {/* Loading Skeleton */}
      {!error && loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-glass-border/30 rounded-2xl border border-glass-border"></div>
          ))}
        </div>
      )}

      {/* Content Grid / Empty state */}
      {!error && !loading && (
        <>
          {filteredCourses.length === 0 ? (
            <SpotlightCard className="p-12 bg-glass-card border border-glass-border text-center rounded-2xl" glowColor="rgba(168, 85, 247, 0.08)">
              <BookOpen size={28} className="text-text-muted mx-auto mb-3" />
              <h3 className="text-md font-bold text-text-title">No courses found</h3>
              <p className="text-xs text-text-muted max-w-md mx-auto mt-1 mb-4">
                {hasActiveFilters
                  ? "We couldn't find any courses matching your search query or category filter."
                  : "Currently, no published courses are available."}
              </p>
              {hasActiveFilters && (
                <Button onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }} variant="secondary" className="text-xs py-2 px-4">
                  Clear Filters
                </Button>
              )}
            </SpotlightCard>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExploreCourses;
