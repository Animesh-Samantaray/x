import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../services/categoryService";
import SpotlightCard from "../components/SpotlightCard";
import Button from "../components/Button";
import { Search, PlusCircle, Trash2, Edit2, Eye, X, AlertCircle, Info, Layers, Check, RefreshCw } from "lucide-react";

const Categories = () => {
  const { user } = useAuth();
  
  const isAuthorized = user?.role === "creator" || user?.role === "admin";

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [viewCategory, setViewCategory] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCategories();
      if (res && res.success) {
        setCategories(res.categories || []);
      } else {
        setError("Failed to load categories.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch categories from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = formName.trim();
    const trimmedDesc = formDescription.trim();

    if (!trimmedName) {
      setFormError("Category name is required");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");
      const res = await createCategory({ name: trimmedName, description: trimmedDesc });
      if (res && res.success) {
        triggerToast("Category created successfully");
        setCreateModalOpen(false);
        setFormName("");
        setFormDescription("");
        fetchCategories();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create category.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = formName.trim();
    const trimmedDesc = formDescription.trim();

    if (!trimmedName) {
      setFormError("Category name is required");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");
      const res = await updateCategory(editCategory._id, {
        name: trimmedName,
        description: trimmedDesc,
        isActive: formIsActive,
      });
      if (res && res.success) {
        triggerToast("Category updated successfully");
        setEditCategory(null);
        fetchCategories();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to update category.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setSubmitting(true);
      const res = await deleteCategory(deleteId);
      if (res && res.success) {
        triggerToast("Category deleted successfully");
        setDeleteId(null);
        fetchCategories();
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || "Failed to delete category.");
    } finally {
      setSubmitting(false);
    }
  };

  const openCreateModal = () => {
    setFormName("");
    setFormDescription("");
    setFormError("");
    setCreateModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditCategory(cat);
    setFormName(cat.name);
    setFormDescription(cat.description || "");
    setFormIsActive(cat.isActive !== false);
    setFormError("");
  };

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="space-y-6 text-left relative">
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[100] flex items-center gap-3 bg-bg-panel border border-accent-blue/30 bg-bg-darker/95 px-5 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-300">
          <Info className="text-accent-blue shrink-0 animate-pulse" size={18} />
          <p className="text-xs font-semibold text-text-title">{toastMessage}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-glass-border/40 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-text-title flex items-center gap-2">
            <Layers className="text-accent-indigo" size={24} /> Category Management
          </h1>
          <p className="text-xs text-text-muted font-semibold mt-1">
            Organize knowledge resources, templates, and configurations into browseable domains.
          </p>
        </div>
        {isAuthorized && (
          <Button onClick={openCreateModal} className="flex items-center gap-2 text-xs py-2.5 px-4 shadow-lg shrink-0">
            <PlusCircle size={14} /> + Create Category
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-bg-darker border border-glass-border p-4 rounded-2xl">
        <div className="relative flex-grow w-full">
          <input
            type="text"
            placeholder="Search categories by name, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full form-input text-xs rounded-xl pl-9 pr-4 py-2.5 bg-bg-dark text-text-title border-glass-border focus:border-accent-indigo/50 focus:outline-none"
          />
          <Search size={14} className="absolute left-3 top-3.5 text-text-muted" />
        </div>
        <Button onClick={fetchCategories} variant="secondary" className="flex items-center gap-1.5 py-2 px-3 text-xs w-full md:w-auto justify-center">
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
        </Button>
      </div>

      {error && (
        <div className="flex flex-col items-center justify-center p-8 border border-rose-500/20 bg-rose-500/5 rounded-2xl text-center max-w-md mx-auto">
          <AlertCircle className="text-rose-400 mb-2 animate-bounce" size={24} />
          <h4 className="text-sm font-bold text-text-title">Failed to load Categories</h4>
          <p className="text-xs text-text-muted mt-1 mb-4">{error}</p>
          <Button onClick={fetchCategories} className="text-xs py-2 px-4">
            Try Again
          </Button>
        </div>
      )}

      {!error && (
        <SpotlightCard className="p-0 bg-glass-card border border-glass-border rounded-2xl overflow-hidden" glowColor="rgba(124, 58, 237, 0.05)">
          {loading ? (
            <div className="text-center py-20 text-xs text-text-muted flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-accent-indigo"></div>
              Loading categories...
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-20 text-xs text-text-muted">
              {searchQuery ? "No categories matched your search." : "No categories available."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs text-left">
                <thead>
                  <tr className="border-b border-glass-border bg-bg-darker/60 font-bold uppercase text-[10px] tracking-wider text-text-muted">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Created Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glass-border/30">
                  {filteredCategories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-accent-indigo/5 dark:hover:bg-glass-border/10 transition duration-150">
                      <td className="px-6 py-4 font-bold text-text-title">{cat.name}</td>
                      <td className="px-6 py-4 text-text-main max-w-xs truncate">{cat.description || <span className="italic text-text-muted">No description provided</span>}</td>
                      <td className="px-6 py-4">
                        {cat.isActive !== false ? (
                          <span className="text-[9px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:bg-accent-emerald/15 dark:text-accent-emerald dark:border-accent-emerald/25 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                            Active
                          </span>
                        ) : (
                          <span className="text-[9px] bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:bg-glass-border dark:text-text-muted dark:border-glass-border/50 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-text-muted">
                        {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                        <button onClick={() => setViewCategory(cat)} className="text-[10px] border border-glass-border hover:bg-glass-border hover:text-text-title px-2 py-1 rounded-md font-bold uppercase tracking-wider transition cursor-pointer active:scale-95">
                          <Eye size={12} className="inline mr-1" /> View
                        </button>
                        {isAuthorized && (
                          <>
                            <button onClick={() => openEditModal(cat)} className="text-[10px] border border-accent-blue/20 bg-accent-blue/5 text-accent-blue hover:bg-accent-blue hover:text-white px-2 py-1 rounded-md font-bold uppercase tracking-wider transition cursor-pointer active:scale-95">
                              <Edit2 size={12} className="inline mr-1" /> Edit
                            </button>
                            <button onClick={() => setDeleteId(cat._id)} className="text-[10px] border border-rose-500/25 bg-rose-500/5 text-rose-400 hover:bg-rose-500 hover:text-white px-2 py-1 rounded-md font-bold uppercase tracking-wider transition cursor-pointer active:scale-95">
                              <Trash2 size={12} className="inline mr-1" /> Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SpotlightCard>
      )}

      {createModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <SpotlightCard className="w-full max-w-md bg-bg-panel border border-glass-border/70 p-6 rounded-2xl text-left shadow-2xl" glowColor="rgba(124, 58, 237, 0.12)">
            <div className="flex items-center justify-between border-b border-glass-border/30 pb-3 mb-4">
              <h3 className="text-xs font-bold text-text-title uppercase tracking-widest flex items-center gap-2">
                <PlusCircle size={14} className="text-accent-indigo" /> Create New Category
              </h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-text-muted hover:text-rose-400 transition cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              {formError && (
                <div className="p-3 border border-rose-500/20 bg-rose-500/5 rounded-xl text-rose-400 flex items-center gap-2 font-semibold">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-text-muted uppercase">Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Artificial Intelligence"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full form-input rounded-xl p-3 bg-bg-dark text-text-title border-glass-border focus:border-accent-indigo/50 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-muted uppercase">Category Description</label>
                <textarea
                  placeholder="Summarize the kind of resources that belong in this category..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  className="w-full form-input rounded-xl p-3 bg-bg-dark text-text-title border-glass-border focus:border-accent-indigo/50 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <Button type="button" variant="secondary" onClick={() => setCreateModalOpen(false)} disabled={submitting}>
                  Cancel
                </Button>
                <Button type="submit" loading={submitting}>
                  {submitting ? "Creating..." : "Create Category"}
                </Button>
              </div>
            </form>
          </SpotlightCard>
        </div>
      )}

      {editCategory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <SpotlightCard className="w-full max-w-md bg-bg-panel border border-glass-border/70 p-6 rounded-2xl text-left shadow-2xl" glowColor="rgba(124, 58, 237, 0.12)">
            <div className="flex items-center justify-between border-b border-glass-border/30 pb-3 mb-4">
              <h3 className="text-xs font-bold text-text-title uppercase tracking-widest flex items-center gap-2">
                <Edit2 size={14} className="text-accent-blue" /> Edit Category
              </h3>
              <button onClick={() => setEditCategory(null)} className="text-text-muted hover:text-rose-400 transition cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              {formError && (
                <div className="p-3 border border-rose-500/20 bg-rose-500/5 rounded-xl text-rose-400 flex items-center gap-2 font-semibold">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-text-muted uppercase">Category Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full form-input rounded-xl p-3 bg-bg-dark text-text-title border-glass-border focus:border-accent-indigo/50 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-muted uppercase">Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  className="w-full form-input rounded-xl p-3 bg-bg-dark text-text-title border-glass-border focus:border-accent-indigo/50 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2.5 py-1">
                <input
                  type="checkbox"
                  id="formIsActive"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-glass-border bg-bg-dark text-accent-indigo focus:ring-accent-indigo"
                />
                <label htmlFor="formIsActive" className="font-bold text-text-title cursor-pointer uppercase">
                  Active State (Visible to Learners)
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <Button type="button" variant="secondary" onClick={() => setEditCategory(null)} disabled={submitting}>
                  Cancel
                </Button>
                <Button type="submit" loading={submitting}>
                  {submitting ? "Updating..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </SpotlightCard>
        </div>
      )}

      {viewCategory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <SpotlightCard className="w-full max-w-md bg-bg-panel border border-glass-border/70 p-6 rounded-2xl text-left shadow-2xl" glowColor="rgba(124, 58, 237, 0.12)">
            <div className="flex items-center justify-between border-b border-glass-border/30 pb-3 mb-4">
              <h3 className="text-xs font-bold text-text-title uppercase tracking-widest flex items-center gap-2">
                <Layers size={14} className="text-accent-emerald" /> Category Details
              </h3>
              <button onClick={() => setViewCategory(null)} className="text-text-muted hover:text-rose-400 transition cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-text-muted uppercase tracking-wider text-[10px]">Name</span>
                <p className="text-sm font-extrabold text-text-title bg-bg-darker p-3 border border-glass-border rounded-xl">{viewCategory.name}</p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-text-muted uppercase tracking-wider text-[10px]">Description</span>
                <p className="text-text-main bg-bg-darker p-3 border border-glass-border rounded-xl whitespace-pre-wrap leading-relaxed">
                  {viewCategory.description || <span className="italic text-text-muted">No description provided</span>}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="font-bold text-text-muted uppercase tracking-wider text-[10px]">Status</span>
                  <div className="bg-bg-darker p-3 border border-glass-border rounded-xl">
                    {viewCategory.isActive !== false ? (
                      <span className="text-emerald-500 font-bold uppercase tracking-wider flex items-center gap-1"><Check size={12} /> Active</span>
                    ) : (
                      <span className="text-amber-500 font-bold uppercase tracking-wider">Inactive</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-text-muted uppercase tracking-wider text-[10px]">Created Date</span>
                  <p className="bg-bg-darker p-3 border border-glass-border rounded-xl text-text-main">
                    {viewCategory.createdAt ? new Date(viewCategory.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={() => setViewCategory(null)} variant="secondary">
                  Close Window
                </Button>
              </div>
            </div>
          </SpotlightCard>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <SpotlightCard className="w-full max-w-sm bg-bg-panel border border-glass-border/70 p-6 rounded-2xl text-left shadow-2xl" glowColor="rgba(244, 63, 94, 0.12)">
            <div className="flex items-center justify-between border-b border-glass-border/30 pb-3 mb-4">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2">
                <Trash2 size={14} /> Delete Category
              </h3>
              <button onClick={() => setDeleteId(null)} className="text-text-muted hover:text-rose-400 transition cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-text-main leading-relaxed">
                Are you sure you want to delete this category? Resources referencing it might become uncategorized. This action is permanent and cannot be undone.
              </p>

              <div className="flex justify-end gap-2.5 pt-2">
                <Button variant="secondary" onClick={() => setDeleteId(null)} disabled={submitting}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleDeleteConfirm} loading={submitting}>
                  {submitting ? "Deleting..." : "Confirm Delete"}
                </Button>
              </div>
            </div>
          </SpotlightCard>
        </div>
      )}
    </div>
  );
};

export default Categories;
