import React, { useState, useEffect } from "react";
import {
  getCourseReviews,
  getMyCourseReview,
  createReview,
  updateReview,
  deleteReview,
} from "../../services/reviewService";
import { useAuth } from "../../context/AuthContext";
import SpotlightCard from "../SpotlightCard";
import Button from "../Button";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import {
  Star,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Trash2,
  X,
  Lock,
  PlusCircle,
  Sparkles,
} from "lucide-react";

const ReviewList = ({
  courseId,
  isEnrolled = false,
  onReviewChange,
}) => {
  const { user } = useAuth();
  const isLearner = user?.role === "learner";
  const isAdmin = user?.role === "admin";

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [myReview, setMyReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchReviewsData = async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      setError("");

      const [reviewsRes, myReviewRes] = await Promise.all([
        getCourseReviews(courseId),
        user && isLearner
          ? getMyCourseReview(courseId).catch(() => ({ success: false, review: null }))
          : Promise.resolve({ success: false, review: null }),
      ]);

      if (reviewsRes && reviewsRes.success) {
        const fetchedReviews = reviewsRes.reviews || [];
        setReviews(fetchedReviews);
        setAverageRating(reviewsRes.averageRating || 0);
        setTotalCount(reviewsRes.count || fetchedReviews.length);

        if (onReviewChange) {
          onReviewChange({
            averageRating: reviewsRes.averageRating || 0,
            reviewCount: reviewsRes.count || fetchedReviews.length,
          });
        }
      }

      if (myReviewRes && myReviewRes.success && myReviewRes.review) {
        setMyReview(myReviewRes.review);
      } else {
        setMyReview(null);
      }
    } catch (err) {
      console.error("Fetch reviews error:", err);
      setError(err.response?.data?.message || "Failed to load course reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewsData();
  }, [courseId, user]);

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg("");
    }, 4000);
  };

  // Submit new review
  const handleCreateReview = async (formData) => {
    try {
      setSubmitting(true);
      setError("");
      const res = await createReview(courseId, formData);
      if (res && res.success) {
        setShowReviewForm(false);
        showNotification("Your review has been published successfully!");
        await fetchReviewsData();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  // Update existing review
  const handleUpdateReview = async (formData) => {
    if (!editingReview) return;
    try {
      setSubmitting(true);
      setError("");
      const res = await updateReview(editingReview._id, formData);
      if (res && res.success) {
        setEditingReview(null);
        showNotification("Your review has been updated successfully.");
        await fetchReviewsData();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update review.");
    } finally {
      setSubmitting(false);
    }
  };

  // Confirm delete review
  const handleDeleteConfirm = async () => {
    if (!confirmDeleteId) return;
    try {
      setDeletingId(confirmDeleteId);
      setError("");
      const res = await deleteReview(confirmDeleteId);
      if (res && res.success) {
        setConfirmDeleteId(null);
        if (editingReview && editingReview._id === confirmDeleteId) {
          setEditingReview(null);
        }
        showNotification("Review deleted successfully.");
        await fetchReviewsData();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete review.");
    } finally {
      setDeletingId(null);
    }
  };

  // Compute rating distribution from actual fetched reviews
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
    return { star, count, percentage };
  });

  return (
    <div className="space-y-6 text-left relative" id="reviews-section">
      {/* Toast Success Notification */}
      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-bold flex items-center justify-between gap-2 animate-fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} /> {successMsg}
          </span>
          <button onClick={() => setSuccessMsg("")} className="text-emerald-400 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Global Error Banner */}
      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 font-semibold flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </span>
          <button onClick={() => setError("")} className="text-rose-400 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header & Rating Overview */}
      <SpotlightCard className="p-6 md:p-8 bg-glass-card border border-glass-border rounded-2xl space-y-6" glowColor="rgba(168, 85, 247, 0.1)">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-glass-border/30 pb-6">
          <div>
            <h2 className="text-lg md:text-xl font-extrabold text-text-title flex items-center gap-2">
              <MessageSquare className="text-accent-purple" size={22} /> Reviews & Ratings
            </h2>
            <p className="text-xs text-text-muted mt-1 font-semibold">
              Feedback and ratings submitted by enrolled learners.
            </p>
          </div>

          {/* Average Rating Banner */}
          <div className="flex items-center gap-4 bg-bg-dark border border-glass-border/60 p-4 rounded-2xl shrink-0">
            <div className="text-center space-y-0.5 pr-4 border-r border-glass-border/40">
              <div className="text-3xl font-black text-text-title leading-none">
                {totalCount > 0 ? averageRating.toFixed(1) : "0.0"}
              </div>
              <div className="flex items-center justify-center gap-0.5 text-amber-400 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={13}
                    className={
                      star <= Math.round(averageRating) && totalCount > 0
                        ? "fill-amber-400 text-amber-400"
                        : "text-text-muted/30"
                    }
                  />
                ))}
              </div>
              <div className="text-[10px] text-text-muted font-bold pt-0.5">
                {totalCount > 0 ? `${totalCount} ${totalCount === 1 ? "review" : "reviews"}` : "No reviews"}
              </div>
            </div>

            {/* Rating Breakdown Bars */}
            <div className="space-y-1 w-36 sm:w-44">
              {distribution.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-2 text-[10px]">
                  <span className="font-bold text-text-muted w-5">{star} ★</span>
                  <div className="flex-1 h-1.5 bg-bg-deep rounded-full overflow-hidden border border-glass-border/40">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="font-semibold text-text-muted w-4 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Learner Action Area: Review Form or Existing Review */}
        <div className="space-y-4 pt-1">
          {/* Case A: Non-enrolled Learner */}
          {user && isLearner && !isEnrolled && (
            <div className="p-4 bg-bg-dark border border-glass-border/60 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 text-xs text-text-muted font-semibold">
                <Lock size={16} className="text-accent-purple shrink-0" />
                <span>Enroll in this course to leave a review</span>
              </div>
            </div>
          )}

          {/* Case B: Enrolled Learner with Existing Review */}
          {user && isLearner && isEnrolled && myReview && !editingReview && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-accent-purple uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} /> Your Review
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setEditingReview(myReview)}
                    variant="secondary"
                    className="text-xs py-1.5 px-3"
                  >
                    Edit Review
                  </Button>
                  <Button
                    onClick={() => setConfirmDeleteId(myReview._id)}
                    variant="danger"
                    className="text-xs py-1.5 px-3 border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white"
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <ReviewCard
                review={myReview}
                isOwnReview={true}
                onEdit={() => setEditingReview(myReview)}
                onDelete={(id) => setConfirmDeleteId(id)}
              />
            </div>
          )}

          {/* Case C: Editing Existing Review */}
          {user && isLearner && isEnrolled && editingReview && (
            <ReviewForm
              initialReview={editingReview}
              onSubmit={handleUpdateReview}
              onCancel={() => setEditingReview(null)}
              submitting={submitting}
            />
          )}

          {/* Case D: Enrolled Learner without Review */}
          {user && isLearner && isEnrolled && !myReview && !showReviewForm && (
            <div className="flex items-center justify-between p-4 bg-bg-dark border border-glass-border/60 rounded-xl">
              <div>
                <h4 className="text-xs font-bold text-text-title">
                  Have you studied this course?
                </h4>
                <p className="text-[10px] text-text-muted mt-0.5">
                  Share your experience to help future learners.
                </p>
              </div>
              <Button
                onClick={() => setShowReviewForm(true)}
                className="text-xs py-2 px-4 flex items-center gap-1.5 bg-gradient-to-r from-accent-purple to-accent-indigo"
              >
                <PlusCircle size={14} /> Write a Review
              </Button>
            </div>
          )}

          {/* Case E: Writing New Review Form */}
          {user && isLearner && isEnrolled && !myReview && showReviewForm && (
            <ReviewForm
              onSubmit={handleCreateReview}
              onCancel={() => setShowReviewForm(false)}
              submitting={submitting}
            />
          )}
        </div>
      </SpotlightCard>

      {/* Review List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-text-muted">
            All Reviews ({reviews.length})
          </h3>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-28 bg-glass-border/30 rounded-2xl animate-pulse border border-glass-border"></div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && reviews.length === 0 && (
          <SpotlightCard className="p-10 bg-glass-card border border-glass-border text-center rounded-2xl space-y-3" glowColor="rgba(168, 85, 247, 0.05)">
            <MessageSquare size={32} className="text-text-muted mx-auto" />
            <h4 className="text-xs font-bold text-text-title">No reviews yet</h4>
            <p className="text-[11px] text-text-muted max-w-sm mx-auto">
              Be the first learner to share your experience with this course.
            </p>
            {user && isLearner && isEnrolled && !myReview && !showReviewForm && (
              <Button onClick={() => setShowReviewForm(true)} className="text-xs py-2 px-4">
                Write the first review &rarr;
              </Button>
            )}
          </SpotlightCard>
        )}

        {/* List of Reviews */}
        {!loading && reviews.length > 0 && (
          <div className="space-y-4">
            {reviews.map((rev) => {
              const isOwn = user && (rev.user?._id === user._id || rev.user === user._id);
              return (
                <ReviewCard
                  key={rev._id}
                  review={rev}
                  isOwnReview={Boolean(isOwn)}
                  isAdmin={isAdmin}
                  onEdit={() => setEditingReview(rev)}
                  onDelete={(id) => setConfirmDeleteId(id)}
                  deleting={deletingId === rev._id}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <SpotlightCard
            className="w-full max-w-sm bg-bg-panel border border-glass-border/70 p-6 rounded-2xl text-left shadow-2xl space-y-4"
            glowColor="rgba(244, 63, 94, 0.12)"
          >
            <div className="flex items-center justify-between border-b border-glass-border/30 pb-3">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2">
                <Trash2 size={14} /> Confirm Delete Review
              </h3>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="text-text-muted hover:text-rose-400 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-text-main leading-relaxed">
              Are you sure you want to delete your review? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2.5 pt-2">
              <Button
                variant="secondary"
                onClick={() => setConfirmDeleteId(null)}
                disabled={Boolean(deletingId)}
                className="text-xs py-2 px-3"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteConfirm}
                loading={Boolean(deletingId)}
                className="text-xs py-2 px-4"
              >
                {deletingId ? "Deleting..." : "Confirm Delete"}
              </Button>
            </div>
          </SpotlightCard>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
