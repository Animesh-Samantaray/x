import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCourse } from "../../services/courseService";
import CourseForm from "../../components/courses/CourseForm";
import { BookOpen, ArrowLeft } from "lucide-react";

const CreateCourse = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      const res = await createCourse(formData);
      if (res && res.success) {
        navigate("/my-courses");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create course.");
    } finally {
      setSubmitting(false);
    }
  };

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
            <BookOpen className="text-accent-purple" size={24} /> Create Knowledge Course
          </h1>
          <p className="text-xs text-text-muted font-semibold mt-1">
            Assemble existing reference materials, guides, and documentation into a structured learning course.
          </p>
        </div>
      </div>

      <CourseForm onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
};

export default CreateCourse;
