import React, { useState, useEffect } from "react";
import {
  getAllReportsAdmin,
  getReportByIdAdmin,
  updateReportStatusAdmin,
  takeModerationActionAdmin,
} from "../../services/reportApi";
import SpotlightCard from "../../components/SpotlightCard";
import Button from "../../components/Button";
import LoadingSkeleton from "../../components/dashboard/LoadingSkeleton";
import EmptyState from "../../components/dashboard/EmptyState";
import ErrorState from "../../components/dashboard/ErrorState";
import toast from "react-hot-toast";
import {
  ShieldAlert,
  Flag,
  Filter,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Trash2,
  Archive,
  UserX,
  X,
  FileText,
  BookOpen,
  User,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

const ReportsManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const [statusFilter, setStatusFilter] = useState("all");
  const [targetTypeFilter, setTargetTypeFilter] = useState("all");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });


  const [selectedReport, setSelectedReport] = useState(null);
  const [targetDetails, setTargetDetails] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [confirmAction, setConfirmAction] = useState(null); 
  const [adminNoteInput, setAdminNoteInput] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReports = async (currentPage = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: 20,
      };

      if (statusFilter !== "all") params.status = statusFilter;
      if (targetTypeFilter !== "all") params.targetType = targetTypeFilter;
      if (reasonFilter !== "all") params.reason = reasonFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await getAllReportsAdmin(params);
      if (res.success) {
        setReports(res.reports || []);
        setPagination(res.pagination || { page: 1, limit: 20, total: 0, pages: 1 });
      }
    } catch (err) {
      console.error("Fetch Admin Reports Error:", err);
      setError(err.response?.data?.message || "Failed to load moderation reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(page);
  }, [page, statusFilter, targetTypeFilter, reasonFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchReports(1);
  };

  const handleOpenDetail = async (reportId) => {
    try {
      setIsDetailOpen(true);
      setDetailLoading(true);
      setSelectedReport(null);
      setTargetDetails(null);

      const res = await getReportByIdAdmin(reportId);
      if (res.success) {
        setSelectedReport(res.report);
        setTargetDetails(res.targetDetails);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load report details.");
      setIsDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      const res = await updateReportStatusAdmin(reportId, newStatus);
      if (res.success) {
        toast.success(res.message);
        if (selectedReport && selectedReport._id === reportId) {
          setSelectedReport(res.report);
        }
        fetchReports(page);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status.");
    }
  };

  const handleExecuteAction = async () => {
    if (!selectedReport || !confirmAction) return;

    try {
      setActionLoading(true);
      const res = await takeModerationActionAdmin(
        selectedReport._id,
        confirmAction.action,
        adminNoteInput.trim()
      );

      if (res.success) {
        toast.success(res.message);
        setSelectedReport(res.report);
        setConfirmAction(null);
        setAdminNoteInput("");
        fetchReports(page);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to execute moderation action.");
    } finally {
      setActionLoading(false);
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

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
            Pending
          </span>
        );
      case "reviewing":
        return (
          <span className="inline-flex items-center gap-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
            Reviewing
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
            Resolved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
            Rejected
          </span>
        );
      default:
        return (
          <span className="bg-bg-darker text-text-muted border border-glass-border text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
            {status}
          </span>
        );
    }
  };

  const getTargetIcon = (targetType) => {
    switch (targetType) {
      case "course": return <BookOpen size={14} className="text-accent-purple" />;
      case "resource": return <FileText size={14} className="text-accent-cyan" />;
      case "user": return <User size={14} className="text-accent-emerald" />;
      case "review":
      case "comment": return <MessageSquare size={14} className="text-accent-orange" />;
      default: return <Flag size={14} className="text-accent-blue" />;
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Search and Filters */}
      <div className="bg-bg-darker border border-glass-border p-4 rounded-2xl space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-6 relative">
            <input
              type="text"
              placeholder="Search reports by description or admin notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full form-input text-xs rounded-xl pl-9 pr-4 py-2.5"
            />
            <Search size={14} className="absolute left-3 top-3.5 text-text-muted" />
          </div>

          <div className="sm:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="w-full form-input text-xs rounded-xl p-2.5 bg-bg-dark border-glass-border text-text-title cursor-pointer font-semibold"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={targetTypeFilter}
              onChange={(e) => { setTargetTypeFilter(e.target.value); setPage(1); }}
              className="w-full form-input text-xs rounded-xl p-2.5 bg-bg-dark border-glass-border text-text-title cursor-pointer font-semibold"
            >
              <option value="all">All Target Types</option>
              <option value="course">Course</option>
              <option value="resource">Resource</option>
              <option value="user">User Profile</option>
              <option value="unit">Course Unit</option>
              <option value="review">Review</option>
              <option value="comment">Comment</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <Button type="submit" className="w-full text-xs py-2.5 font-bold rounded-xl flex items-center justify-center gap-1.5">
              <Filter size={13} /> Filter
            </Button>
          </div>
        </form>
      </div>

      {/* Reports Listing Table / Cards */}
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchReports(1)} />
      ) : reports.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No reports match criteria"
          description="There are no content reports matching your selected status and filters."
          glowColor="rgba(16, 185, 129, 0.06)"
        />
      ) : (
        <div className="space-y-4">
        
          <div className="md:hidden space-y-3.5">
            {reports.map((report) => (
              <div key={report._id} className="p-4 rounded-2xl bg-glass-card border border-glass-border space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-semibold text-text-title">
                    {getTargetIcon(report.targetType)}
                    <span className="uppercase text-[10px] font-bold tracking-wider">{report.targetType}</span>
                  </div>
                  {getStatusBadge(report.status)}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-text-title">{formatReason(report.reason)}</h4>
                  <p className="text-[10px] text-text-muted mt-0.5">
                    {new Date(report.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                </div>

                <div className="pt-2 border-t border-glass-border/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-accent-blue/15 text-accent-blue flex items-center justify-center font-bold text-[10px] uppercase">
                      {report.reportedBy?.name ? report.reportedBy.name[0] : "U"}
                    </div>
                    <span className="font-medium text-text-muted text-[11px] truncate max-w-[150px]">
                      {report.reportedBy?.name || "User"}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenDetail(report._id)}
                    className="text-[10px] border border-glass-border hover:bg-glass-border px-3 py-1.5 rounded-lg font-bold uppercase transition cursor-pointer inline-flex items-center gap-1 text-text-title"
                  >
                    <Eye size={12} /> Inspect
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE VIEW (>= md) */}
          <div className="hidden md:block overflow-x-auto border border-glass-border rounded-2xl bg-glass-card">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-glass-border bg-bg-darker/60 font-bold uppercase text-[10px] tracking-wider text-text-muted">
                  <th className="px-5 py-3.5">Reporter</th>
                  <th className="px-5 py-3.5">Target</th>
                  <th className="px-5 py-3.5">Reason</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Created Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border/30">
                {reports.map((report) => (
                  <tr key={report._id} className="hover:bg-glass-border/20 transition duration-150">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-accent-blue/15 text-accent-blue flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {report.reportedBy?.name ? report.reportedBy.name[0] : "U"}
                        </div>
                        <div>
                          <p className="font-bold text-text-title leading-tight">{report.reportedBy?.name || "Anonymous User"}</p>
                          <p className="text-[10px] text-text-muted">{report.reportedBy?.email || ""}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 font-semibold text-text-title">
                        {getTargetIcon(report.targetType)}
                        <span className="uppercase text-[10px] font-bold tracking-wider">{report.targetType}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 font-bold text-text-main">
                      {formatReason(report.reason)}
                    </td>

                    <td className="px-5 py-4">
                      {getStatusBadge(report.status)}
                    </td>

                    <td className="px-5 py-4 text-text-muted text-[11px] font-medium">
                      {new Date(report.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>

                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenDetail(report._id)}
                        className="text-[10px] border border-glass-border hover:bg-glass-border px-3 py-1.5 rounded-lg font-bold uppercase transition cursor-pointer inline-flex items-center gap-1 text-text-title"
                      >
                        <Eye size={12} /> Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between border-t border-glass-border/40 pt-4 text-xs">
              <span className="text-text-muted">
                Page {pagination.page} of {pagination.pages} ({pagination.total} total reports)
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="p-2 rounded-xl border border-glass-border hover:bg-glass-border text-text-title disabled:opacity-40 transition cursor-pointer"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => setPage((p) => Math.min(p + 1, pagination.pages))}
                  className="p-2 rounded-xl border border-glass-border hover:bg-glass-border text-text-title disabled:opacity-40 transition cursor-pointer"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

   
      {isDetailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl relative z-10 text-left">
            <SpotlightCard
              className="p-6 sm:p-7 bg-bg-dark border border-glass-border rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
              glowColor="rgba(59, 130, 246, 0.1)"
            >
             
              <div className="flex items-center justify-between border-b border-glass-border/40 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-accent-blue/15 border border-accent-blue/30 flex items-center justify-center text-accent-blue">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-text-title">Report Moderation Inspection</h3>
                    <p className="text-xs text-text-muted font-medium mt-0.5">
                      Review report payload, reporter information, and target content.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="text-text-muted hover:text-text-title p-1.5 rounded-lg hover:bg-glass-border/40 transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {detailLoading || !selectedReport ? (
                <LoadingSkeleton />
              ) : (
                <div className="space-y-6 text-xs">
                  
                
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-bg-darker p-4 rounded-xl border border-glass-border">
                    <div>
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Report Reason</span>
                      <span className="text-sm font-extrabold text-text-title">{formatReason(selectedReport.reason)}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-1">Current Status</span>
                      {getStatusBadge(selectedReport.status)}
                    </div>
                  </div>

                  {/* Reporter Info & Description */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-bg-darker/60 rounded-xl border border-glass-border/30 space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Reporter Info</span>
                      <p className="font-bold text-text-title">{selectedReport.reportedBy?.name || "Unknown"}</p>
                      <p className="text-text-muted">{selectedReport.reportedBy?.email || ""}</p>
                      <span className="inline-block mt-1 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
                        {selectedReport.reportedBy?.role || "user"}
                      </span>
                    </div>

                    <div className="p-4 bg-bg-darker/60 rounded-xl border border-glass-border/30 space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Reported Target</span>
                      <div className="flex items-center gap-1.5 font-bold text-text-title">
                        {getTargetIcon(selectedReport.targetType)}
                        <span className="uppercase">{selectedReport.targetType}</span>
                      </div>
                      <p className="text-text-muted font-mono text-[10px]">ID: {selectedReport.targetId}</p>
                    </div>
                  </div>

                  {/* Reporter Description */}
                  {selectedReport.description && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Reporter Note</span>
                      <div className="p-3 bg-bg-darker rounded-xl border border-glass-border text-text-main font-medium leading-relaxed">
                        "{selectedReport.description}"
                      </div>
                    </div>
                  )}

                  {/* Target Content Payload Details */}
                  {targetDetails && (
                    <div className="space-y-2 border-t border-glass-border/30 pt-4">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Target Content Preview</span>
                      <div className="p-4 bg-bg-darker border border-glass-border rounded-xl space-y-2">
                        {targetDetails.title && <p className="font-extrabold text-text-title text-sm">{targetDetails.title}</p>}
                        {targetDetails.name && <p className="font-extrabold text-text-title text-sm">{targetDetails.name}</p>}
                        {targetDetails.description && <p className="text-text-main font-medium line-clamp-3">{targetDetails.description}</p>}
                        {targetDetails.comment && <p className="text-text-main font-medium italic">"{targetDetails.comment}"</p>}
                        {targetDetails.createdBy?.name && <p className="text-text-muted">Creator: <strong className="text-text-title">{targetDetails.createdBy.name}</strong></p>}
                      </div>
                    </div>
                  )}

                  {/* Status Management Actions */}
                  <div className="space-y-2 border-t border-glass-border/30 pt-4">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Update Status</span>
                    <div className="flex flex-wrap gap-2">
                      {["pending", "reviewing", "resolved", "rejected"].map((st) => (
                        <button
                          key={st}
                          disabled={selectedReport.status === st}
                          onClick={() => handleStatusChange(selectedReport._id, st)}
                          className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase border transition cursor-pointer ${
                            selectedReport.status === st
                              ? "bg-glass-border text-text-title opacity-50 cursor-not-allowed"
                              : "bg-bg-darker border-glass-border text-text-muted hover:text-text-title hover:bg-glass-border/40"
                          }`}
                        >
                          Mark as {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Take Moderation Actions */}
                  <div className="space-y-3 border-t border-glass-border/30 pt-4">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Moderation Action Execution</span>
                    
                    <div className="flex flex-wrap gap-2">
                      {selectedReport.targetType === "course" && (
                        <Button
                          onClick={() => setConfirmAction({ action: "archive_course", label: "Archive Course" })}
                          className="text-xs py-2 px-3 bg-amber-600 hover:bg-amber-700 font-bold rounded-xl flex items-center gap-1.5"
                        >
                          <Archive size={13} /> Archive Course
                        </Button>
                      )}

                      {selectedReport.targetType === "resource" && (
                        <Button
                          onClick={() => setConfirmAction({ action: "archive_resource", label: "Archive Resource" })}
                          className="text-xs py-2 px-3 bg-amber-600 hover:bg-amber-700 font-bold rounded-xl flex items-center gap-1.5"
                        >
                          <Archive size={13} /> Archive Resource
                        </Button>
                      )}

                      {(selectedReport.targetType === "review" || selectedReport.targetType === "comment") && (
                        <Button
                          onClick={() => setConfirmAction({ action: "delete_review", label: "Delete Comment/Review" })}
                          className="text-xs py-2 px-3 bg-rose-600 hover:bg-rose-700 font-bold rounded-xl flex items-center gap-1.5"
                        >
                          <Trash2 size={13} /> Delete Review
                        </Button>
                      )}

                      {selectedReport.targetType === "user" && (
                        <Button
                          onClick={() => setConfirmAction({ action: "disable_user", label: "Disable / Suspend User" })}
                          className="text-xs py-2 px-3 bg-rose-600 hover:bg-rose-700 font-bold rounded-xl flex items-center gap-1.5"
                        >
                          <UserX size={13} /> Suspend User
                        </Button>
                      )}

                      <Button
                        onClick={() => setConfirmAction({ action: "remove_content", label: "Remove Content" })}
                        className="text-xs py-2 px-3 bg-rose-600 hover:bg-rose-700 font-bold rounded-xl flex items-center gap-1.5"
                      >
                        <Trash2 size={13} /> Remove Content
                      </Button>

                      <Button
                        variant="secondary"
                        onClick={() => setConfirmAction({ action: "dismiss", label: "Dismiss Report" })}
                        className="text-xs py-2 px-3 text-text-muted hover:text-text-title font-bold rounded-xl flex items-center gap-1.5"
                      >
                        <X size={13} /> Dismiss Report
                      </Button>
                    </div>
                  </div>

                </div>
              )}
            </SpotlightCard>
          </div>
        </div>
      )}

      {/* MODERATION ACTION CONFIRMATION MODAL */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md relative z-10 text-left">
            <SpotlightCard className="p-6 bg-bg-dark border border-glass-border rounded-2xl shadow-2xl space-y-4" glowColor="rgba(244, 63, 94, 0.15)">
              <div className="flex items-center gap-3 border-b border-glass-border/40 pb-3">
                <div className="h-9 w-9 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center">
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-text-title">Confirm Action</h3>
                  <p className="text-xs text-text-muted font-medium">{confirmAction.label}</p>
                </div>
              </div>

              <p className="text-xs text-text-main leading-relaxed font-medium">
                Are you sure you want to perform this moderation action? This will update the status of the reported content on the platform.
              </p>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                  Admin Resolution Note (Optional)
                </label>
                <textarea
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  placeholder="Reason or explanation for this moderation decision..."
                  rows={3}
                  className="w-full form-input text-xs rounded-xl p-3 bg-bg-darker border-glass-border resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-glass-border/40">
                <Button
                  variant="secondary"
                  onClick={() => setConfirmAction(null)}
                  disabled={actionLoading}
                  className="text-xs py-2 px-4"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleExecuteAction}
                  loading={actionLoading}
                  className="text-xs py-2 px-5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl"
                >
                  Confirm & Execute
                </Button>
              </div>
            </SpotlightCard>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReportsManagement;
