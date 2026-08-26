import React, { useState, useEffect } from "react";
import { getResources } from "../../services/resourceService";
import { BookOpen, Check, Plus, Trash2, Search, FileText } from "lucide-react";

const CourseResources = ({ selectedResourceIds = [], setSelectedResourceIds }) => {
  const [availableResources, setAvailableResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const res = await getResources();
        if (res && res.success) {
          setAvailableResources(res.resources || []);
        }
      } catch (err) {
        console.error("Failed to load resources for selection:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const toggleResource = (id) => {
    if (selectedResourceIds.includes(id)) {
      setSelectedResourceIds(selectedResourceIds.filter((resId) => resId !== id));
    } else {
      setSelectedResourceIds([...selectedResourceIds, id]);
    }
  };

  const filteredResources = availableResources.filter((res) => {
    const q = search.toLowerCase();
    const titleMatch = (res.title || "").toLowerCase().includes(q);
    const descMatch = (res.description || "").toLowerCase().includes(q);
    const categoryName = res.category ? (typeof res.category === "object" ? res.category.name : res.category) : "";
    const catMatch = (categoryName || "").toLowerCase().includes(q);
    return titleMatch || descMatch || catMatch;
  });

  return (
    <div className="space-y-3 text-left">
      <div className="flex items-center justify-between">
        <label className="font-bold text-text-muted uppercase text-xs flex items-center gap-1.5">
          <FileText size={12} className="text-accent-cyan" /> Attach Existing Resources
        </label>
        <span className="text-[10px] text-accent-cyan font-bold">
          {selectedResourceIds.length} resources selected
        </span>
      </div>

      {/* Filter inside resource picker */}
      <div className="relative">
        <input
          type="text"
          placeholder="Filter available resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full form-input rounded-xl p-2 pl-8 text-xs bg-bg-dark text-text-title border-glass-border focus:border-accent-cyan/50 focus:outline-none"
        />
        <Search size={12} className="absolute left-2.5 top-2.5 text-text-muted" />
      </div>

      {/* Resource selector list */}
      <div className="max-h-60 overflow-y-auto border border-glass-border rounded-xl p-2 bg-bg-darker/60 space-y-2">
        {loading ? (
          <div className="py-6 text-center text-xs text-text-muted">Loading available platform resources...</div>
        ) : filteredResources.length === 0 ? (
          <div className="py-6 text-center text-xs text-text-muted">
            {search ? "No matching resources found." : "No published resources available to attach."}
          </div>
        ) : (
          filteredResources.map((res) => {
            const isSelected = selectedResourceIds.includes(res._id);
            const categoryName = res.category
              ? typeof res.category === "object"
                ? res.category.name
                : res.category
              : "Uncategorized";

            return (
              <div
                key={res._id}
                onClick={() => toggleResource(res._id)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between gap-3 ${
                  isSelected
                    ? "bg-accent-purple/15 border-accent-purple/40 text-text-title"
                    : "bg-bg-dark border-glass-border/60 hover:border-glass-border text-text-main"
                }`}
              >
                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-accent-purple bg-accent-purple/10 px-1.5 py-0.2 rounded border border-accent-purple/20">
                      {categoryName}
                    </span>
                    <h4 className="font-bold text-text-title truncate">{res.title}</h4>
                  </div>
                  <p className="text-[10px] text-text-muted truncate">{res.description}</p>
                </div>

                <div className="shrink-0">
                  {isSelected ? (
                    <span className="h-6 w-6 rounded-lg bg-accent-purple text-white flex items-center justify-center">
                      <Check size={12} />
                    </span>
                  ) : (
                    <span className="h-6 w-6 rounded-lg border border-glass-border bg-bg-dark text-text-muted flex items-center justify-center hover:border-accent-purple">
                      <Plus size={12} />
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CourseResources;
