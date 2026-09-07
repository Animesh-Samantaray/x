import React, { useState, useEffect } from "react";
import { getAdminPayments } from "../services/paymentService";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import SpotlightCard from "../components/SpotlightCard";
import Button from "../components/Button";
import {
  CreditCard,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  RefreshCw,
  BookOpen,
  Video,
  User,
  ArrowRight,
  X,
  ShieldAlert,
  Calendar,
  Layers,
  Check
} from "lucide-react";

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({
    totalPayments: 0,
    totalPaid: 0,
    totalPending: 0,
    totalFailed: 0,
    totalRevenue: 0,
    courseRevenue: 0,
    sessionRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getAdminPayments({
        status: statusFilter,
        type: typeFilter,
        search: searchQuery,
      });

      if (res && res.success) {
        setPayments(res.data || []);
        if (res.summary) {
          setSummary(res.summary);
        }
      } else {
        setError("Failed to fetch admin payments");
      }
    } catch (err) {
      console.error("Admin payments fetch error:", err);
      setError(err.response?.data?.message || "Failed to load payment transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [statusFilter, typeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPayments();
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "Paid":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle size={11} /> Paid
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock size={11} /> Pending
          </span>
        );
      case "Failed":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle size={11} /> Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20">
            {status}
          </span>
        );
    }
  };

  return (
    <DashboardLayout
      title="Admin Payment Management"
      subtitle="Monitor transactions, earnings distributions, and platform financial history."
      actions={
        <Button
          onClick={fetchPayments}
          variant="secondary"
          className="text-xs py-2 px-4 flex items-center gap-1.5 border-glass-border hover:bg-glass-border"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-accent-purple" : ""} /> Refresh
        </Button>
      }
    >
      <div className="space-y-6 text-left">
        {/* SUMMARY CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue"
            value={`₹${summary.totalRevenue?.toLocaleString("en-IN") || 0}`}
            subtext={`Course: ₹${summary.courseRevenue || 0} • Session: ₹${summary.sessionRevenue || 0}`}
            icon={DollarSign}
            color="emerald"
          />
          <StatCard
            title="Total Transactions"
            value={summary.totalPayments || 0}
            subtext={`${summary.totalPaid} Paid successfully`}
            icon={CreditCard}
            color="purple"
          />
          <StatCard
            title="Pending Payments"
            value={summary.totalPending || 0}
            subtext="Orders awaiting Razorpay confirmation"
            icon={Clock}
            color="orange"
          />
          <StatCard
            title="Failed Payments"
            value={summary.totalFailed || 0}
            subtext="Verification signature failures"
            icon={XCircle}
            color="pink"
          />
        </div>

        {/* CONTROLS & SEARCH */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-bg-darker border border-glass-border p-4 rounded-2xl">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-bg-dark p-1 rounded-xl border border-glass-border/50">
              {["all", "Paid", "Pending", "Failed"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    statusFilter === st
                      ? "bg-accent-purple text-white shadow-xs"
                      : "text-text-muted hover:text-text-title"
                  }`}
                >
                  {st === "all" ? "All Status" : st}
                </button>
              ))}
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-1 bg-bg-dark p-1 rounded-xl border border-glass-border/50">
              {["all", "Course", "Session"].map((tp) => (
                <button
                  key={tp}
                  onClick={() => setTypeFilter(tp)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    typeFilter === tp
                      ? "bg-accent-cyan text-slate-950 shadow-xs"
                      : "text-text-muted hover:text-text-title"
                  }`}
                >
                  {tp === "all" ? "All Types" : tp}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search learner, recipient, payment ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full form-input text-xs rounded-xl pl-9 pr-4 py-2 bg-bg-dark text-text-title border-glass-border focus:border-accent-purple/50 focus:outline-none"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-text-muted" />
          </form>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 border border-rose-500/20 bg-rose-500/5 rounded-2xl text-xs text-rose-400 flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldAlert size={16} /> <span>{error}</span>
            </div>
            <Button onClick={fetchPayments} variant="secondary" className="text-xs py-1 px-3">
              Retry
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-glass-border/30 rounded-2xl border border-glass-border"></div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && payments.length === 0 && (
          <SpotlightCard className="p-12 bg-glass-card border border-glass-border text-center rounded-2xl" glowColor="rgba(168, 85, 247, 0.08)">
            <CreditCard size={36} className="text-text-muted mx-auto mb-3" />
            <h3 className="text-sm font-bold text-text-title">No admin payment records found</h3>
            <p className="text-xs text-text-muted max-w-sm mx-auto mt-1">
              No transactions match your current search query or filter criteria.
            </p>
          </SpotlightCard>
        )}

        {/* MAIN PAYMENT TABLE */}
        {!loading && !error && payments.length > 0 && (
          <div className="overflow-x-auto border border-glass-border rounded-2xl bg-glass-card">
            <table className="w-full text-left text-xs border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-glass-border bg-bg-darker/60 font-bold uppercase text-[10px] tracking-wider text-text-muted">
                  <th className="px-5 py-4">From (Learner)</th>
                  <th className="px-5 py-4">To (Recipient)</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Reason</th>
                  <th className="px-5 py-4">Item</th>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border/30">
                {payments.map((p) => {
                  const isCourse = p.type === "Course";
                  const itemTitle = isCourse ? p.course?.title : p.session?.title;
                  const dateStr = p.paidAt || p.createdAt;
                  const formattedDate = dateStr
                    ? new Date(dateStr).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A";

                  return (
                    <tr key={p._id} className="hover:bg-glass-border/20 transition duration-150">
                      {/* From */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-text-title">{p.learner?.name || "Learner"}</div>
                        <div className="text-[10px] text-text-muted truncate max-w-[140px]">{p.learner?.email || "N/A"}</div>
                      </td>

                      {/* To */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-text-title">{p.recipient?.name || "Creator/Expert"}</div>
                        <div className="text-[10px] text-text-muted truncate max-w-[140px]">{p.recipient?.email || "N/A"}</div>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4 font-extrabold text-accent-emerald text-sm">
                        ₹{p.amount?.toLocaleString("en-IN")}
                      </td>

                      {/* Reason */}
                      <td className="px-5 py-4 text-text-main font-medium">
                        {p.reason || (isCourse ? "Course Enrollment" : "Mentorship Session Booking")}
                      </td>

                      {/* Item */}
                      <td className="px-5 py-4 font-bold text-text-title truncate max-w-[160px]" title={itemTitle}>
                        {itemTitle || "N/A"}
                      </td>

                      {/* Type */}
                      <td className="px-5 py-4">
                        <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded border ${
                          isCourse
                            ? "bg-accent-purple/10 text-accent-purple border-accent-purple/20"
                            : "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20"
                        }`}>
                          {p.type}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        {renderStatusBadge(p.status)}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-text-muted text-[11px] whitespace-nowrap">
                        {formattedDate}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedPayment(p);
                            setDetailsModalOpen(true);
                          }}
                          className="text-[11px] font-bold text-accent-purple hover:text-accent-indigo px-3 py-1 rounded-lg border border-accent-purple/30 bg-accent-purple/10 transition cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* PAYMENT DETAILS MODAL / DRAWER */}
        {detailsModalOpen && selectedPayment && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[60] flex items-center justify-center p-4">
            <SpotlightCard
              className="w-full max-w-lg bg-bg-panel border border-glass-border/90 p-6 sm:p-7 rounded-3xl text-left shadow-2xl space-y-6 relative overflow-hidden max-h-[90vh] overflow-y-auto"
              glowColor="rgba(168, 85, 247, 0.12)"
            >
              <div className="flex items-center justify-between border-b border-glass-border/40 pb-4">
                <h3 className="text-xs font-extrabold text-text-title uppercase tracking-widest flex items-center gap-2">
                  <CreditCard size={16} className="text-accent-purple" /> Admin Payment Detail View
                </h3>
                <button
                  onClick={() => setDetailsModalOpen(false)}
                  className="text-text-muted hover:text-rose-400 transition cursor-pointer p-1.5 rounded-lg hover:bg-glass-border"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Visually obvious FROM -> TO Relationship */}
              <div className="p-4 bg-bg-darker border border-glass-border rounded-2xl space-y-4">
                <div className="text-[10px] font-extrabold text-text-muted uppercase tracking-widest border-b border-glass-border/30 pb-2">
                  Transaction Flow
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  {/* FROM */}
                  <div className="sm:col-span-5 p-3 bg-bg-dark border border-glass-border/60 rounded-xl space-y-1">
                    <span className="text-[9px] font-bold text-accent-purple uppercase tracking-wider block">FROM (Learner)</span>
                    <p className="text-xs font-bold text-text-title truncate">{selectedPayment.learner?.name || "N/A"}</p>
                    <p className="text-[10px] text-text-muted truncate">{selectedPayment.learner?.email || "N/A"}</p>
                  </div>

                  {/* Arrow */}
                  <div className="sm:col-span-2 flex justify-center text-accent-purple">
                    <ArrowRight size={20} className="rotate-90 sm:rotate-0" />
                  </div>

                  {/* TO */}
                  <div className="sm:col-span-5 p-3 bg-bg-dark border border-glass-border/60 rounded-xl space-y-1">
                    <span className="text-[9px] font-bold text-accent-cyan uppercase tracking-wider block">TO (Recipient)</span>
                    <p className="text-xs font-bold text-text-title truncate">{selectedPayment.recipient?.name || "N/A"}</p>
                    <p className="text-[10px] text-text-muted truncate">{selectedPayment.recipient?.email || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Transaction Overview */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-bg-darker border border-glass-border rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-text-muted uppercase">Amount</span>
                  <div className="text-lg font-extrabold text-accent-emerald">
                    ₹{selectedPayment.amount} {selectedPayment.currency || "INR"}
                  </div>
                </div>

                <div className="p-3.5 bg-bg-darker border border-glass-border rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-text-muted uppercase">Status</span>
                  <div>{renderStatusBadge(selectedPayment.status)}</div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-2 border-b border-glass-border/20">
                  <span className="text-text-muted">Reason</span>
                  <span className="font-bold text-text-title">
                    {selectedPayment.reason || (selectedPayment.type === "Course" ? "Course Enrollment" : "Mentorship Session Booking")}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-glass-border/20">
                  <span className="text-text-muted">Purchased Item</span>
                  <span className="font-bold text-text-title truncate max-w-[240px]">
                    {selectedPayment.course?.title || selectedPayment.session?.title || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-glass-border/20">
                  <span className="text-text-muted">Item Type</span>
                  <span className="font-bold text-text-title">{selectedPayment.type}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-glass-border/20">
                  <span className="text-text-muted">Payment Record ID</span>
                  <span className="font-mono text-[11px] text-text-title">{selectedPayment._id}</span>
                </div>

                {selectedPayment.razorpayOrderId && (
                  <div className="flex justify-between py-2 border-b border-glass-border/20">
                    <span className="text-text-muted">Razorpay Order ID</span>
                    <span className="font-mono text-[11px] text-accent-purple">{selectedPayment.razorpayOrderId}</span>
                  </div>
                )}

                {selectedPayment.razorpayPaymentId && (
                  <div className="flex justify-between py-2 border-b border-glass-border/20">
                    <span className="text-text-muted">Razorpay Payment ID</span>
                    <span className="font-mono text-[11px] text-accent-cyan">{selectedPayment.razorpayPaymentId}</span>
                  </div>
                )}

                <div className="flex justify-between py-2 border-b border-glass-border/20">
                  <span className="text-text-muted">Paid At</span>
                  <span className="font-semibold text-text-title">
                    {selectedPayment.paidAt ? new Date(selectedPayment.paidAt).toLocaleString() : "N/A"}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-glass-border/20">
                  <span className="text-text-muted">Created At</span>
                  <span className="font-semibold text-text-title">
                    {selectedPayment.createdAt ? new Date(selectedPayment.createdAt).toLocaleString() : "N/A"}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button variant="secondary" onClick={() => setDetailsModalOpen(false)} className="text-xs py-2 px-5">
                  Close
                </Button>
              </div>
            </SpotlightCard>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminPaymentsPage;
