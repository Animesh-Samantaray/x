import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById, updateCourse } from "../../services/courseService";
import CourseForm from "../../components/courses/CourseForm";
import { BookOpen, ArrowLeft, AlertCircle } from "lucide-react";
import Button from "../../components/Button";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
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
        setError(err.response?.data?.message || "Failed to fetch course details for editing.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseData();
    }
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      const res = await updateCourse(id, formData);
      if (res && res.success) {
        navigate(`/courses/${id}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update course.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-text-muted flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-accent-purple"></div>
        Loading course configuration for editing...
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-rose-500/20 bg-rose-500/5 rounded-2xl text-center max-w-md mx-auto my-12 text-left">
        <AlertCircle className="text-rose-400 mb-2 animate-bounce" size={28} />
        <h4 className="text-sm font-bold text-text-title">Unable to Edit Course</h4>
        <p className="text-xs text-text-muted mt-1 mb-4">{error || "Course not found."}</p>
        <Button onClick={() => navigate("/my-courses")} className="text-xs py-2 px-4">
          &larr; Back to My Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between border-b border-glass-border/40 pb-5">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-xs font-bold text-text-muted hover:text-text-title flex items-center gap-1.5 transition mb-2"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <h1 className="text-2xl font-extrabold text-text-title flex items-center gap-2">
            <BookOpen className="text-accent-purple" size={24} /> Edit Course
          </h1>
          <p className="text-xs text-text-muted font-semibold mt-1">
            Modify course details, topics, attached resources, or published status.
          </p>
        </div>
      </div>

      <CourseForm initialData={course} onSubmit={handleSubmit} submitting={submitting} isEdit={true} />
    </div>
  );
};

export default EditCourse;
