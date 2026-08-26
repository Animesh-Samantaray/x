import React from "react";
import { Search, X, RefreshCw } from "lucide-react";
import Button from "../Button";

const CourseFilters = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories = [],
  onRefresh,
  loading = false,
}) => {
  const hasActiveFilters = searchQuery.trim() !== "" || selectedCategory !== "all";

  const handleClear = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-bg-darker border border-glass-border p-4 rounded-2xl">
      <div className="md:col-span-5 relative w-full">
        <input
          type="text"
          placeholder="Search courses by title, description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full form-input text-xs rounded-xl pl-9 pr-4 py-2.5 bg-bg-dark text-text-title border-glass-border focus:border-accent-purple/50 focus:outline-none"
        />
        <Search size={14} className="absolute left-3 top-3.5 text-text-muted" />
      </div>

      <div className="md:col-span-4 text-xs w-full">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full form-input rounded-xl p-2.5 bg-bg-dark cursor-pointer text-text-title border-glass-border focus:border-accent-purple/50"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="md:col-span-3 flex items-center gap-2 w-full">
        {hasActiveFilters && (
          <Button
            onClick={handleClear}
            variant="secondary"
            className="flex items-center gap-1 py-2 px-3 text-xs w-full justify-center text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
          >
            <X size={12} /> Clear Filters
          </Button>
        )}
        {onRefresh && (
          <Button
            onClick={onRefresh}
            variant="secondary"
            className="flex items-center gap-1.5 py-2 px-3 text-xs w-full justify-center"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
          </Button>
        )}
      </div>
    </div>
  );
};

export default CourseFilters;
