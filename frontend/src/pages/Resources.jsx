import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getResources } from "../services/resourceService";
import { getCategories } from "../services/categoryService";
import SpotlightCard from "../components/SpotlightCard";
import Button from "../components/Button";
import { Search, BookOpen, Compass, ExternalLink, Calendar, User, Folder, Tag, AlertCircle, RefreshCw } from "lucide-react";

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [resData, catData] = await Promise.all([
        getResources(),
        getCategories()
      ]);

      if (resData.success) {
        setResources(resData.resources || []);
      }
      if (catData.success) {
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

  const filteredResources = resources.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.topics.some((topic) => topic.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" ||
      (res.category && (res.category._id === selectedCategory || res.category.name === selectedCategory));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-glass-border/40 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-text-title flex items-center gap-2">
            <Compass className="text-accent-cyan" size={24} /> Explore Resources
          </h1>
          <p className="text-xs text-text-muted font-semibold mt-1">
            Browse and download documentation, deployment guides, shell configs, and developer checklists.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-bg-darker border border-glass-border p-4 rounded-2xl">
        <div className="md:col-span-6 relative w-full">
          <input
            type="text"
            placeholder="Search resources by title, description, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full form-input text-xs rounded-xl pl-9 pr-4 py-2.5 bg-bg-dark text-text-title border-glass-border focus:border-accent-cyan/50 focus:outline-none"
          />
          <Search size={14} className="absolute left-3 top-3.5 text-text-muted" />
        </div>
        
        <div className="md:col-span-4 text-xs w-full">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full form-input rounded-xl p-2.5 bg-bg-dark cursor-pointer text-text-title border-glass-border focus:border-accent-cyan/50"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 w-full">
          <Button onClick={fetchData} variant="secondary" className="flex items-center gap-1.5 py-2 px-3 text-xs w-full justify-center">
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex flex-col items-center justify-center p-8 border border-rose-500/20 bg-rose-500/5 rounded-2xl text-center max-w-md mx-auto">
          <AlertCircle className="text-rose-400 mb-2 animate-bounce" size={24} />
          <h4 className="text-sm font-bold text-text-title">Unable to load Resources</h4>
          <p className="text-xs text-text-muted mt-1 mb-4">{error}</p>
          <Button onClick={fetchData} className="text-xs py-2 px-4">
            Try Again
          </Button>
        </div>
      )}

      {!error && loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-glass-border/30 rounded-2xl border border-glass-border"></div>
          ))}
        </div>
      )}

      {!error && !loading && (
        <>
          {filteredResources.length === 0 ? (
            <SpotlightCard className="p-12 bg-glass-card border border-glass-border text-center rounded-2xl" glowColor="rgba(6, 182, 212, 0.08)">
              <BookOpen size={28} className="text-text-muted mx-auto mb-3" />
              <h3 className="text-md font-bold text-text-title">No resources found</h3>
              <p className="text-xs text-text-muted max-w-md mx-auto mt-1">
                {searchQuery || selectedCategory !== "all" 
                  ? "We couldn't find any resources matching your search queries or selected category filter."
                  : "Currently, no published reference files or configuration templates are available."}
              </p>
            </SpotlightCard>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((res) => {
                const hasThumbnail = res.thumbnail && res.thumbnail.startsWith("http");
                
                return (
                  <SpotlightCard key={res._id} className="h-full flex flex-col justify-between" glowColor="rgba(6, 182, 212, 0.1)">
                    <Link to={`/resources/${res._id}`} className="block flex-grow group">
                      <div className="h-44 w-full bg-bg-dark border-b border-glass-border relative overflow-hidden rounded-t-2xl">
                        {hasThumbnail ? (
                          <img
                            src={res.thumbnail}
                            alt={res.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#1E114A] to-[#0F072D] text-white">
                            <BookOpen size={36} className="text-accent-cyan/60" />
                          </div>
                        )}
                        {res.category && (
                          <span className="absolute top-3 left-3 text-[8px] font-extrabold uppercase tracking-widest bg-bg-deep/80 text-accent-cyan border border-accent-cyan/20 px-2 py-0.5 rounded backdrop-blur-md">
                            {res.category.name}
                          </span>
                        )}
                      </div>

                      <div className="p-5 text-left space-y-3.5">
                        <div className="space-y-1.5">
                          <h3 className="text-xs font-bold text-text-title leading-snug group-hover:text-accent-cyan transition duration-150 line-clamp-1">
                            {res.title}
                          </h3>
                          <p className="text-[10px] text-text-muted leading-relaxed line-clamp-2">
                            {res.description}
                          </p>
                        </div>

                        {res.topics && res.topics.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {res.topics.slice(0, 3).map((topic, i) => (
                              <span key={i} className="text-[8px] bg-glass-border text-text-main px-1.5 py-0.2 rounded font-semibold">
                                #{topic}
                              </span>
                            ))}
                            {res.topics.length > 3 && (
                              <span className="text-[8px] text-text-muted px-1 py-0.2">
                                +{res.topics.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="px-5 pb-5 border-t border-glass-border/30 pt-3 flex items-center justify-between text-[9px] text-text-muted">
                      <div className="flex items-center gap-1">
                        <User size={10} className="text-accent-cyan/70" />
                        <span className="font-semibold text-text-main truncate max-w-[80px]">
                          {res.createdBy?.name || "Unknown"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={10} />
                        <span>
                          {res.createdAt ? new Date(res.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "N/A"}
                        </span>
                      </div>
                    </div>
                  </SpotlightCard>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Resources;
