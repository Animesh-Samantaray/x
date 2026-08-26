import React, { useState, useEffect } from "react";
import { getCategories } from "../../services/categoryService";
import SpotlightCard from "../SpotlightCard";
import Button from "../Button";
import CourseTopics from "./CourseTopics";
import CourseResources from "./CourseResources";
import { BookOpen, Layers, Image, AlertCircle, Save } from "lucide-react";

const CourseForm = ({
  initialData = null,
  onSubmit,
  submitting = false,
  isEdit = false,
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || "");
  const [category, setCategory] = useState(
    initialData?.category
      ? typeof initialData.category === "object"
        ? initialData.category._id
        : initialData.category
      : ""
  );
  const [topics, setTopics] = useState(initialData?.topics || []);
  const [selectedResourceIds, setSelectedResourceIds] = useState(
    initialData?.resources
      ? initialData.resources.map((r) => (typeof r === "object" ? r._id : r))
      : []
  );
  const [status, setStatus] = useState(initialData?.status || "published");

  const [categories, setCategories] = useState([]);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        if (res && res.success) {
          setCategories(res.categories || []);
          if (!category && res.categories && res.categories.length > 0) {
            setCategory(res.categories[0]._id);
          }
        }
      } catch (err) {
        console.error("Failed to load categories for course form:", err);
      }
    };

    fetchCats();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (!title.trim()) {
      setFormError("Course title is required");
      return;
    }

    if (!description.trim()) {
      setFormError("Course description is required");
      return;
    }

    if (!category) {
      setFormError("Course category is required");
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      thumbnail: thumbnail.trim(),
      category,
      topics,
      resources: selectedResourceIds,
      status,
    };

    onSubmit(payload);
  };

  return (
    <SpotlightCard className="p-6 md:p-8 bg-glass-card border border-glass-border rounded-2xl text-left" glowColor="rgba(168, 85, 247, 0.08)">
      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {formError && (
          <div className="p-4 border border-rose-500/20 bg-rose-500/5 rounded-xl text-rose-400 flex items-center gap-2 font-semibold">
            <AlertCircle size={16} className="shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Core Fields */}
          <div className="md:col-span-7 space-y-4">
            <div className="space-y-1">
              <label className="font-bold text-text-muted uppercase">Course Title *</label>
              <input
                type="text"
                placeholder="e.g. Masterclass: Fullstack Web Development with React & Node"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full form-input rounded-xl p-3 bg-bg-dark text-text-title border-glass-border focus:border-accent-purple/50 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-text-muted uppercase">Description *</label>
              <textarea
                placeholder="Provide a comprehensive summary of what learners will gain from this course..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full form-input rounded-xl p-3 bg-bg-dark text-text-title border-glass-border focus:border-accent-purple/50 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-text-muted uppercase flex items-center gap-1.5">
                <Image size={12} className="text-accent-purple" /> Thumbnail URL
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                className="w-full form-input rounded-xl p-3 bg-bg-dark text-text-title border-glass-border focus:border-accent-purple/50 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-text-muted uppercase flex items-center gap-1.5">
                  <Layers size={12} className="text-accent-indigo" /> Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full form-input rounded-xl p-3 bg-bg-dark cursor-pointer text-text-title border-glass-border focus:border-accent-purple/50"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-muted uppercase">Course Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full form-input rounded-xl p-3 bg-bg-dark cursor-pointer text-text-title border-glass-border focus:border-accent-purple/50"
                >
                  <option value="draft">Draft (Hidden)</option>
                  <option value="published">Published (Public)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <CourseTopics topics={topics} setTopics={setTopics} />
          </div>

          {/* Right Column: Resources Selection */}
          <div className="md:col-span-5 space-y-4">
            <CourseResources
              selectedResourceIds={selectedResourceIds}
              setSelectedResourceIds={setSelectedResourceIds}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-glass-border/30">
          <Button type="submit" loading={submitting} className="py-2.5 px-6 shadow-lg flex items-center gap-2">
            <Save size={14} />
            {submitting ? (isEdit ? "Updating..." : "Creating...") : isEdit ? "Update Course" : "Create Course"}
          </Button>
        </div>
      </form>
    </SpotlightCard>
  );
};

export default CourseForm;
