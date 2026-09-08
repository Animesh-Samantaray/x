import React, { useState, useEffect } from "react";
import { getMyReports } from "../services/reportApi";
import SpotlightCard from "../components/SpotlightCard";
import LoadingSkeleton from "../components/dashboard/LoadingSkeleton";
import EmptyState from "../components/dashboard/EmptyState";
import ErrorState from "../components/dashboard/ErrorState";
import { Flag, Clock, CheckCircle2, XCircle, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });

  const fetchReports = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getMyReports(page, 10);
      if (res.success) {
        setReports(res.reports || []);
        setPagination(res.pagination || { page: 1, limit: 10, total: 0, pages: 1 });
      }
    } catch (err) {
      console.error("Fetch My Reports Error:", err);
      setError(err.response?.data?.message || "Failed to load your reports history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(1);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
            <Clock size={11} /> Pending Review
          </span>
        );
      case "reviewing":
        return (
          <span className="inline-flex items-center gap-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
            <Clock size={11} className="animate-spin" /> Under Review
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
            <CheckCircle2 size={11} /> Resolved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
            <XCircle size={11} /> Rejected
          </span>
        );
      default:
        return (
          <span className="bg-bg-darker text-text-muted border border-glass-border text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
            {status}
          </span>
        );
    }
  };

  const formatReason = (reasonStr) => {
    return reasonStr
      ? reasonStr
          .split("_")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "General Issue";
  };

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-glass-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-accent-blue/15 text-accent-blue flex items-center justify-center">
              <Flag size={16} />
            </div>
            <h1 className="text-2xl font-extrabold text-text-title tracking-tight">My Reports</h1>
          </div>
          <p className="text-xs text-text-muted font-medium mt-1">
            Track the status and resolutions of your submitted content reports.
          </p>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchReports(1)} />
      ) : reports.length === 0 ? (
        <EmptyState
          icon={Flag}
          title="No reports submitted"
          description="You haven't submitted any content reports yet. If you encounter inappropriate content on CKM, use the report button to alert our moderators."
          glowColor="rgba(59, 130, 246, 0.08)"
        />
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <SpotlightCard
              key={report._id}
              className="p-5 sm:p-6 bg-glass-card border border-glass-border rounded-2xl transition duration-150"
              glowColor="rgba(59, 130, 246, 0.06)"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-glass-border/30 pb-4 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded bg-bg-darker text-accent-cyan border border-glass-border">
                    {report.targetType}
                  </span>
                  <h3 className="text-sm font-bold text-text-title">
                    Reason: {formatReason(report.reason)}
                  </h3>
                </div>

                <div>{getStatusBadge(report.status)}</div>
              </div>

              {report.description && (
                <p className="text-xs text-text-main font-medium mb-3 bg-bg-darker/60 p-3 rounded-xl border border-glass-border/30">
                  "{report.description}"
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between text-[11px] text-text-muted font-medium pt-2">
                <span>Submitted on {new Date(report.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                {report.adminNote && (
                  <span className="text-accent-cyan italic">
                    Admin Note: "{report.adminNote}"
                  </span>
                )}
              </div>
            </SpotlightCard>
          ))}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between border-t border-glass-border/40 pt-4 text-xs">
              <span className="text-text-muted">
                Page {pagination.page} of {pagination.pages} ({pagination.total} total reports)
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => fetchReports(pagination.page - 1)}
                  className="p-2 rounded-xl border border-glass-border hover:bg-glass-border text-text-title disabled:opacity-40 transition cursor-pointer"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => fetchReports(pagination.page + 1)}
                  className="p-2 rounded-xl border border-glass-border hover:bg-glass-border text-text-title disabled:opacity-40 transition cursor-pointer"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyReports;
