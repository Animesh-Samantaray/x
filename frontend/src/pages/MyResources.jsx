import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMyResources, deleteResource, publishResource, archiveResource } from "../services/resourceService";
import SpotlightCard from "../components/SpotlightCard";
import Button from "../components/Button";
import { FileText, PlusCircle, Trash2, Edit2, PlayCircle, Archive, AlertCircle, Info, Calendar, User, Eye, X, BookOpen } from "lucide-react";

const MyResources = () => {
  const navigate = useNavigate();
  
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmPublishId, setConfirmPublishId] = useState(null);
  const [confirmArchiveId, setConfirmArchiveId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchMyResources = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getMyResources();
      if (res && res.success) {
        setResources(res.resources || []);
      } else {
        setError("Failed to fetch your resources.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to connect to backend api.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyResources();
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handlePublish = async () => {
    try {
      setSubmitting(true);
      const res = await publishResource(confirmPublishId);
      if (res && res.success) {
        triggerToast("Resource published successfully");
        setConfirmPublishId(null);
        fetchMyResources();
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || "Failed to publish resource.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleArchive = async () => {
    try {
      setSubmitting(true);
      const res = await archiveResource(confirmArchiveId);
      if (res && res.success) {
        triggerToast("Resource archived successfully");
        setConfirmArchiveId(null);
        fetchMyResources();
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || "Failed to archive resource.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSubmitting(true);
      const res = await deleteResource(confirmDeleteId);
      if (res && res.success) {
        triggerToast("Resource deleted successfully");
        setConfirmDeleteId(null);
        fetchMyResources();
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || "Failed to delete resource.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "published":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "archived":
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      case "draft":
      default:
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    }
  };

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
            <FileText className="text-accent-purple" size={24} /> My Resources
          </h1>
          <p className="text-xs text-text-muted font-semibold mt-1">
            Manage your reference lists, drafts, published documents, and archive options.
          </p>
        </div>
        <Button onClick={() => navigate("/resources/new")} className="flex items-center gap-2 text-xs py-2.5 px-4 shadow-lg shrink-0">
          <PlusCircle size={14} /> Create Resource
        </Button>
      </div>

      {error && (
        <div className="flex flex-col items-center justify-center p-8 border border-rose-500/20 bg-rose-500/5 rounded-2xl text-center max-w-md mx-auto my-6">
          <AlertCircle className="text-rose-400 mb-2 animate-bounce" size={24} />
          <h4 className="text-sm font-bold text-text-title">Failed to load owned resources</h4>
          <p className="text-xs text-text-muted mt-1 mb-4">{error}</p>
          <Button onClick={fetchMyResources} className="text-xs py-2 px-4">
            Try Again
          </Button>
        </div>
      )}

      {!error && loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-glass-border/30 rounded-2xl border border-glass-border"></div>
          ))}
        </div>
      )}

      {!error && !loading && resources.length === 0 && (
        <SpotlightCard className="p-12 bg-glass-card border border-glass-border text-center rounded-2xl" glowColor="rgba(168, 85, 247, 0.08)">
          <FileText size={28} className="text-text-muted mx-auto mb-3" />
          <h3 className="text-md font-bold text-text-title">No resources created</h3>
          <p className="text-xs text-text-muted max-w-xs mx-auto mt-1 mb-6">
            You haven't uploaded or drafted any technical resource configurations yet.
          </p>
          <Button onClick={() => navigate("/resources/new")} className="text-xs py-2 px-4">
            Create your first resource &rarr;
          </Button>
        </SpotlightCard>
      )}

      {!error && !loading && resources.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((res) => {
            const hasThumbnail = res.thumbnail && res.thumbnail.startsWith("http");

            return (
              <SpotlightCard key={res._id} className="p-5 flex flex-col justify-between" glowColor="rgba(168, 85, 247, 0.08)">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="space-y-1">
                      <span className="text-[8px] font-extrabold uppercase tracking-widest text-accent-purple bg-accent-purple/10 px-2 py-0.5 rounded border border-accent-purple/20">
                        {res.category?.name || "Uncategorized"}
                      </span>
                      <h3 className="text-xs font-bold text-text-title leading-snug line-clamp-1">
                        {res.title}
                      </h3>
                    </div>
                    <span className={`text-[8px] border px-2 py-0.5 rounded font-bold uppercase tracking-wider ${getStatusStyle(res.status)}`}>
                      {res.status}
                    </span>
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="h-16 w-16 bg-bg-dark border border-glass-border rounded-xl shrink-0 overflow-hidden">
                      {hasThumbnail ? (
                        <img src={res.thumbnail} alt={res.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#1E114A] to-[#0F072D] text-[10px] text-accent-purple/60">
                          <BookOpen size={20} />
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-text-muted line-clamp-3 leading-relaxed">
                      {res.description}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-glass-border/30 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Link
                      to={`/resources/${res._id}`}
                      className="text-[9px] border border-glass-border hover:bg-glass-border hover:text-text-title px-2 py-1 rounded-md font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1 active:scale-95"
                    >
                      <Eye size={10} /> View
                    </Link>

                    <button
                      onClick={() => navigate(`/resources/edit/${res._id}`)}
                      className="text-[9px] border border-accent-blue/20 bg-accent-blue/5 text-accent-blue hover:bg-accent-blue hover:text-white px-2 py-1 rounded-md font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1 active:scale-95"
                    >
                      <Edit2 size={10} /> Edit
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {res.status === "draft" && (
                      <button
                        onClick={() => setConfirmPublishId(res._id)}
                        className="text-[9px] border border-emerald-500/25 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500 hover:text-white px-2 py-1 rounded-md font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1 active:scale-95"
                      >
                        <PlayCircle size={10} /> Publish
                      </button>
                    )}

                    {res.status !== "archived" && (
                      <button
                        onClick={() => setConfirmArchiveId(res._id)}
                        className="text-[9px] border border-slate-500/25 bg-slate-500/5 text-slate-400 hover:bg-slate-500 hover:text-white px-2 py-1 rounded-md font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1 active:scale-95"
                      >
                        <Archive size={10} /> Archive
                      </button>
                    )}

                    <button
                      onClick={() => setConfirmDeleteId(res._id)}
                      className="text-[9px] border border-rose-500/25 bg-rose-500/5 text-rose-400 hover:bg-rose-500 hover:text-white px-2 py-1 rounded-md font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1 active:scale-95"
                    >
                      <Trash2 size={10} /> Delete
                    </button>
                  </div>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      )}

      {confirmPublishId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <SpotlightCard className="w-full max-w-sm bg-bg-panel border border-glass-border/70 p-6 rounded-2xl text-left shadow-2xl" glowColor="rgba(16, 185, 129, 0.12)">
            <div className="flex items-center justify-between border-b border-glass-border/30 pb-3 mb-4">
              <h3 className="text-xs font-bold text-accent-emerald uppercase tracking-widest flex items-center gap-2">
                <PlayCircle size={14} /> Publish Resource
              </h3>
              <button onClick={() => setConfirmPublishId(null)} className="text-text-muted hover:text-rose-400 transition cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-text-main leading-relaxed">
                Are you sure you want to publish this resource? It will become visible on the public explorer, allowing learners to browse and view its documents/links.
              </p>

              <div className="flex justify-end gap-2.5 pt-2">
                <Button variant="secondary" onClick={() => setConfirmPublishId(null)} disabled={submitting}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handlePublish} loading={submitting} className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                  {submitting ? "Publishing..." : "Confirm Publish"}
                </Button>
              </div>
            </div>
          </SpotlightCard>
        </div>
      )}

      {confirmArchiveId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <SpotlightCard className="w-full max-w-sm bg-bg-panel border border-glass-border/70 p-6 rounded-2xl text-left shadow-2xl" glowColor="rgba(100, 116, 139, 0.12)">
            <div className="flex items-center justify-between border-b border-glass-border/30 pb-3 mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Archive size={14} /> Archive Resource
              </h3>
              <button onClick={() => setConfirmArchiveId(null)} className="text-text-muted hover:text-rose-400 transition cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-text-main leading-relaxed">
                Are you sure you want to archive this resource? Archived resources will no longer be visible on the public explorer, and cannot be re-published directly without editing.
              </p>

              <div className="flex justify-end gap-2.5 pt-2">
                <Button variant="secondary" onClick={() => setConfirmArchiveId(null)} disabled={submitting}>
                  Cancel
                </Button>
                <Button onClick={handleArchive} loading={submitting} className="bg-slate-700 text-white hover:bg-slate-650">
                  {submitting ? "Archiving..." : "Confirm Archive"}
                </Button>
              </div>
            </div>
          </SpotlightCard>
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <SpotlightCard className="w-full max-w-sm bg-bg-panel border border-glass-border/70 p-6 rounded-2xl text-left shadow-2xl" glowColor="rgba(244, 63, 94, 0.12)">
            <div className="flex items-center justify-between border-b border-glass-border/30 pb-3 mb-4">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2">
                <Trash2 size={14} /> Delete Resource
              </h3>
              <button onClick={() => setConfirmDeleteId(null)} className="text-text-muted hover:text-rose-400 transition cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-text-main leading-relaxed">
                Are you sure you want to delete this resource? All associated references, links, and documents will be permanently removed. 
                <span className="font-bold text-rose-400 block mt-2">This action cannot be undone.</span>
              </p>

              <div className="flex justify-end gap-2.5 pt-2">
                <Button variant="secondary" onClick={() => setConfirmDeleteId(null)} disabled={submitting}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleDelete} loading={submitting}>
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

export default MyResources;
