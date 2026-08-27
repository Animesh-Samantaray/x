import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyBookmarks, deleteBookmark } from "../services/bookmarkService";
import SpotlightCard from "../components/SpotlightCard";
import Button from "../components/Button";
import AttachmentViewer from "../components/courses/AttachmentViewer";
import { Bookmark, Trash2, ArrowLeft, AlertCircle, BookOpen, Layers } from "lucide-react";

const MyBookmarks = () => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getMyBookmarks();
      if (res && res.success) {
        setBookmarks(res.bookmarks || []);
      } else {
        setError("Failed to retrieve bookmarks.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load bookmarks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleRemoveBookmark = async (bookmarkId) => {
    try {
      setDeletingId(bookmarkId);
      const res = await deleteBookmark(bookmarkId);
      if (res && res.success) {
        setBookmarks((prev) => prev.filter((b) => b._id !== bookmarkId));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove bookmark.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 text-left relative">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-glass-border/40 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-text-title flex items-center gap-2">
            <Bookmark className="text-amber-400" size={24} /> My Bookmarked Attachments
          </h1>
          <p className="text-xs text-text-muted font-semibold mt-1">
            Access your saved unit notes, lecture videos, code references, and documentation.
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="text-xs font-bold text-text-muted hover:text-text-title flex items-center gap-1.5 transition"
        >
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex flex-col items-center justify-center p-8 border border-rose-500/20 bg-rose-500/5 rounded-2xl text-center max-w-md mx-auto">
          <AlertCircle className="text-rose-400 mb-2 animate-bounce" size={24} />
          <h4 className="text-sm font-bold text-text-title">Failed to load bookmarks</h4>
          <p className="text-xs text-text-muted mt-1 mb-4">{error}</p>
          <Button onClick={fetchBookmarks} className="text-xs py-2 px-4">
            Try Again
          </Button>
        </div>
      )}

      {/* Loading Skeleton */}
      {!error && loading && (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-glass-border/30 rounded-2xl border border-glass-border"></div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!error && !loading && bookmarks.length === 0 && (
        <SpotlightCard className="p-12 bg-glass-card border border-glass-border text-center rounded-2xl" glowColor="rgba(245, 158, 11, 0.08)">
          <Bookmark size={32} className="text-text-muted mx-auto mb-3" />
          <h3 className="text-md font-bold text-text-title">No bookmarks saved yet</h3>
          <p className="text-xs text-text-muted max-w-sm mx-auto mt-1 mb-6">
            Bookmark key learning materials directly inside course units for instant access here.
          </p>
          <Button onClick={() => navigate("/courses")} className="text-xs py-2.5 px-5">
            Explore Courses &rarr;
          </Button>
        </SpotlightCard>
      )}

      {/* Bookmarks List */}
      {!error && !loading && bookmarks.length > 0 && (
        <div className="space-y-6">
          {bookmarks.map((bm) => {
            const courseTitle = bm.course?.title || "Course";
            const unitTitle = bm.unit?.title || `Unit ${bm.unit?.order || ""}`;

            return (
              <SpotlightCard key={bm._id} className="p-6 bg-glass-card border border-glass-border rounded-2xl space-y-4" glowColor="rgba(245, 158, 11, 0.08)">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-glass-border/30 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-extrabold uppercase text-accent-purple bg-accent-purple/10 border border-accent-purple/20 px-2 py-0.5 rounded">
                        {courseTitle}
                      </span>
                      <span className="text-[9px] font-bold uppercase text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-2 py-0.5 rounded">
                        {unitTitle}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {bm.course?._id && (
                      <Link
                        to={`/courses/${bm.course._id}/learn`}
                        className="text-xs border border-glass-border hover:bg-glass-border hover:text-text-title px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer active:scale-95"
                      >
                        <BookOpen size={12} /> Open Course Workspace
                      </Link>
                    )}
                    <button
                      onClick={() => handleRemoveBookmark(bm._id)}
                      disabled={deletingId === bm._id}
                      className="text-xs border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer active:scale-95"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>

                {bm.attachment ? (
                  <AttachmentViewer attachment={bm.attachment} />
                ) : (
                  <div className="p-4 bg-bg-dark rounded-xl text-xs text-text-muted">
                    Attachment data is no longer available.
                  </div>
                )}
              </SpotlightCard>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookmarks;
