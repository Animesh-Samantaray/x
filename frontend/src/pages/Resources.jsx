import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getResources } from "../services/resourceService";
import { getCategories } from "../services/categoryService";
import Button from "../components/Button";
import ResourceCard from "../components/resources/ResourceCard";
import {
  Search,
  BookOpen,
  Compass,
  ExternalLink,
  Calendar,
  User,
  Folder,
  Tag,
  AlertCircle,
  RefreshCw,
  X,
  FileText,
  Bookmark,
  ArrowRight,
  Download,
  Eye,
} from "lucide-react";
import SEO from "../components/common/SEO";

const Resources = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("list"); // "list" or "grid"

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [resData, catData] = await Promise.all([
        getResources(),
        getCategories(),
      ]);

      if (resData && resData.success) {
        setResources(resData.resources || []);
      }
      if (catData && catData.success) {
        setCategories(catData.categories || []);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load platform resources.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const hasActiveFilters = searchQuery.trim() !== "" || selectedCategory !== "all";

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  const filteredResources = resources.filter((res) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      (res.title || "").toLowerCase().includes(query) ||
      (res.description || "").toLowerCase().includes(query) ||
      (res.topics && res.topics.some((topic) => (topic || "").toLowerCase().includes(query)));

    const categoryId = res.category
      ? typeof res.category === "object"
        ? res.category._id
        : res.category
      : null;

    const matchesCategory =
      selectedCategory === "all" ||
      (categoryId && categoryId === selectedCategory) ||
      (res.category && typeof res.category === "object" && res.category.name === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 text-left">
      <SEO
        title="Technical Resource Library — Blueprints & PDFs"
        description="Browse community-contributed technical articles, architecture blueprints, code cheatsheets, and developer resources."
        keywords="developer resources, architecture blueprints, coding guides, technical PDFs, CKM library"
      />
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-glass-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              ● KNOWLEDGE LIBRARY
            </span>
          </div>
          <h1 className="text-2xl font-black text-text-title tracking-tight font-display mt-1">
            Technical Resource Library
          </h1>
          <p className="text-xs text-text-muted font-medium">
            Browse verified architecture blueprints, deployment scripts, code cheatsheets, and developer PDFs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
            variant="secondary"
            className="text-xs py-2 px-3 border-glass-border"
          >
            Switch to {viewMode === "list" ? "Grid" : "List"} View
          </Button>
          <Button
            onClick={() => navigate("/resources/new")}
            className="text-xs font-bold py-2 px-4 bg-btn-primary hover:bg-btn-primary-hover text-white shadow-md"
          >
            + Upload Resource
          </Button>
        </div>
      </div>

      {/* FILTER SEARCH BAR */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-bg-panel border border-glass-border p-3.5 rounded-2xl">
        <div className="md:col-span-5 relative w-full">
          <input
            type="text"
            placeholder="Search blueprints by title, description, or #topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs rounded-xl pl-9 pr-4 py-2.5 bg-bg-darker text-text-title border border-glass-border focus:border-cyan-400/50 outline-none"
          />
          <Search size={14} className="absolute left-3 top-3 text-text-muted" />
        </div>

        <div className="md:col-span-4 text-xs w-full">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-xl p-2.5 bg-bg-darker text-text-title border border-glass-border focus:border-cyan-400/50 outline-none cursor-pointer"
          >
            <option value="all">All Taxonomy Categories</option>
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
              onClick={handleClearFilters}
              variant="secondary"
              className="flex items-center gap-1 py-2 px-3 text-xs w-full justify-center text-rose-400 border-rose-500/30"
            >
              <X size={12} /> Clear Filters
            </Button>
          )}
          <Button
            onClick={fetchData}
            variant="secondary"
            className="flex items-center gap-1.5 py-2 px-3 text-xs w-full justify-center border-glass-border"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex flex-col items-center justify-center p-8 border border-rose-500/20 bg-rose-500/5 rounded-2xl text-center max-w-md mx-auto">
          <AlertCircle className="text-rose-400 mb-2 animate-bounce" size={24} />
          <h4 className="text-sm font-bold text-text-title">Unable to load Knowledge Library</h4>
          <p className="text-xs text-text-muted mt-1 mb-4">{error}</p>
          <Button onClick={fetchData} className="text-xs py-2 px-4">
            Try Again
          </Button>
        </div>
      )}

      {!error && loading && (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-glass-border/30 rounded-2xl border border-glass-border" />
          ))}
        </div>
      )}

      {!error && !loading && (
        <>
          {filteredResources.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-bg-panel border border-glass-border space-y-3">
              <FileText size={32} className="text-text-muted mx-auto" />
              <h3 className="text-sm font-bold text-text-title">No resources match criteria</h3>
              <p className="text-xs text-text-muted max-w-md mx-auto">
                {hasActiveFilters
                  ? "No resource files matched your current search filters."
                  : "Currently, no published reference files or configuration templates are available."}
              </p>
              {hasActiveFilters && (
                <Button onClick={handleClearFilters} variant="secondary" className="text-xs py-2 px-4 border-glass-border">
                  Clear Filters
                </Button>
              )}
            </div>
          ) : viewMode === "list" ? (
            /* STRUCTURED KNOWLEDGE LIBRARY LIST VIEW */
            <div className="rounded-2xl border border-glass-border bg-bg-panel overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-glass-border/60 bg-bg-darker text-[10px] font-mono font-bold text-text-muted uppercase tracking-wider">
                      <th className="p-4">Resource Document</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Author</th>
                      <th className="p-4">Topics</th>
                      <th className="p-4">Added Date</th>
                      <th className="p-4 text-right">Inspect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-glass-border/40 text-xs">
                    {filteredResources.map((res) => (
                      <tr key={res._id} className="hover:bg-glass-border/30 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-cyan-500/10 text-cyan-400 font-bold flex items-center justify-center border border-cyan-500/20 shrink-0">
                              <FileText size={16} />
                            </div>
                            <div className="min-w-0">
                              <Link to={`/resources/${res._id}`} className="font-bold text-text-title hover:text-cyan-400 transition truncate block">
                                {res.title}
                              </Link>
                              <p className="text-[11px] text-text-muted line-clamp-1 mt-0.5">{res.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            {res.category?.name || "General"}
                          </span>
                        </td>
                        <td className="p-4 text-text-main font-semibold">
                          {res.createdBy?.name || "Unknown Author"}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {res.topics?.slice(0, 2).map((t, i) => (
                              <span key={i} className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-glass-border text-text-muted">
                                #{t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 font-mono text-text-muted">
                          {res.createdAt ? new Date(res.createdAt).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="p-4 text-right">
                          <Button
                            onClick={() => navigate(`/resources/${res._id}`)}
                            className="text-[11px] py-1.5 px-3 bg-btn-primary hover:bg-btn-primary-hover text-white font-bold flex items-center gap-1 ml-auto"
                          >
                            <Eye size={12} /> Inspect
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* GRID VIEW WITH REDESIGNED CARDS */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((res) => (
                <ResourceCard
                  key={res._id}
                  resource={res}
                  onInspect={(id) => navigate(`/resources/${id}`)}
                />
              ))}
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default Resources;
