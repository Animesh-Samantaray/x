import React, { useState, useEffect } from "react";
import { getMyPayments, getPaymentById } from "../services/paymentService";
import SpotlightCard from "../components/SpotlightCard";
import Button from "../components/Button";
import Sticker from "../components/ui/Sticker";
import { PageTransition, FadeIn } from "../components/motion/MotionPrimitives";
import {
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  RefreshCw,
  Search,
  BookOpen,
  Video,
  X,
  ExternalLink,
  Calendar,
  User,
  DollarSign,
  Receipt,
  CheckCircle2,
} from "lucide-react";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getMyPayments();
      if (res && res.success) {
        setPayments(res.data || []);
      } else {
        setError("Failed to fetch payments");
      }
    } catch (err) {
      console.error("Fetch payments error:", err);
      setError(err.response?.data?.message || "Failed to load payment history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleViewDetails = async (paymentId) => {
    try {
      setLoadingDetails(true);
      setDetailsModalOpen(true);
      const res = await getPaymentById(paymentId);
      if (res && res.success) {
        setSelectedPayment(res.data);
      } else {
        setSelectedPayment(null);
      }
    } catch (err) {
      console.error("Fetch payment details error:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const filteredPayments = payments.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const itemTitle = (p.course?.title || p.session?.title || p.type || "").toLowerCase();
    const recipientName = (p.recipient?.name || "").toLowerCase();
    const matchesSearch = !q || itemTitle.includes(q) || recipientName.includes(q) || (p.razorpayPaymentId || "").toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;

    return true;
  });

  const renderStatusBadge = (status) => {
    switch (status) {
      case "Paid":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 size={11} /> Paid
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
    <PageTransition>
      <div className="space-y-6 text-left relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-glass-border/40 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sticker type="verified" text="Fintech Transaction Ledger" />
            </div>
            <h1 className="text-2xl font-black text-text-title flex items-center gap-2">
              <CreditCard className="text-accent-purple" size={26} /> Payment History
            </h1>
            <p className="text-xs text-text-muted font-semibold mt-1">
              Track and view receipts for all your course enrollments and mentorship session bookings.
            </p>
          </div>

          <Button
            onClick={fetchPayments}
            variant="secondary"
            className="text-xs py-2 px-4 flex items-center gap-2 border-glass-border hover:bg-glass-border shrink-0"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-accent-purple" : ""} /> Refresh
          </Button>
        </div>

        {/* Filter & Search Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#181824] border border-white/10 p-3.5 rounded-2xl shadow-xl">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {["all", "Paid", "Pending", "Failed"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold capitalize transition cursor-pointer ${
                  statusFilter === st
                    ? "bg-[#7757F5]/20 text-[#00F2FF] border border-[#7757F5]/40 shadow-xs"
                    : "text-text-muted hover:text-text-title hover:bg-white/5"
                }`}
              >
                {st === "all" ? "All Statuses" : st}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by title, recipient, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full form-input text-xs rounded-xl pl-9 pr-4 py-2 bg-[#0F0F17] text-text-title border-white/10 focus:border-[#7757F5] focus:outline-none"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-text-muted" />
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="p-4 border border-rose-500/20 bg-rose-500/5 rounded-2xl text-xs text-rose-400 flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle size={16} /> <span>{error}</span>
            </div>
            <Button onClick={fetchPayments} variant="secondary" className="text-xs py-1 px-3">
              Retry
            </Button>
          </div>
        )}

        {/* Loading state */}
        {loading && !error && (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-[#181824] rounded-2xl border border-white/10"></div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredPayments.length === 0 && (
          <SpotlightCard className="p-12 bg-[#181824] border border-white/10 text-center rounded-2xl shadow-xl" glowColor="rgba(119, 87, 245, 0.08)">
            <Receipt size={40} className="text-text-muted mx-auto mb-3" />
            <h3 className="text-sm font-extrabold text-text-title">No payment records found</h3>
            <p className="text-xs text-text-muted max-w-sm mx-auto mt-1">
              {searchQuery || statusFilter !== "all"
                ? "No payments match your current search or status filter."
                : "You haven't completed any course or mentorship session payments yet."}
            </p>
          </SpotlightCard>
        )}

        {/* Payment List Table / Fintech Cards */}
        {!loading && !error && filteredPayments.length > 0 && (
          <div className="space-y-3">
            {filteredPayments.map((p) => {
              const isCourse = p.type === "Course";
              const itemTitle = isCourse ? p.course?.title : p.session?.title;
              const dateStr = p.paidAt || p.createdAt;
              const formattedDate = dateStr
                ? new Date(dateStr).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })
                : "N/A";

              return (
                <SpotlightCard
                  key={p._id}
                  className="p-4 sm:p-5 bg-[#181824] border border-white/10 rounded-2xl transition hover:border-[#7757F5]/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  glowColor="rgba(119, 87, 245, 0.08)"
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <div className={`p-3 rounded-2xl border shrink-0 ${
                      isCourse
                        ? "bg-[#7757F5]/15 text-[#00F2FF] border-[#7757F5]/30"
                        : "bg-[#00F2FF]/15 text-[#00F2FF] border-[#00F2FF]/30"
                    }`}>
                      {isCourse ? <BookOpen size={22} /> : <Video size={22} />}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded border ${
                          isCourse
                            ? "bg-[#7757F5]/15 text-[#00F2FF] border-[#7757F5]/30"
                            : "bg-[#00F2FF]/15 text-[#00F2FF] border-[#00F2FF]/30"
                        }`}>
                          {p.type}
                        </span>
                        {renderStatusBadge(p.status)}
                      </div>

                      <h3 className="text-sm sm:text-base font-extrabold text-white truncate leading-snug">
                        {itemTitle || `${p.type} Transaction`}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#9696A8] font-semibold">
                        <span className="flex items-center gap-1">
                          <User size={12} className="text-[#7757F5]" />
                          To: <strong className="text-white">{p.recipient?.name || "Creator/Expert"}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formattedDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0 shrink-0">
                    <div className="text-base sm:text-lg font-black text-emerald-400 tracking-tight">
                      ₹{p.amount?.toLocaleString("en-IN")} <span className="text-[10px] text-text-muted">{p.currency || "INR"}</span>
                    </div>
                    <button
                      onClick={() => handleViewDetails(p._id)}
                      className="text-xs font-extrabold text-[#00F2FF] hover:underline flex items-center gap-1 cursor-pointer transition mt-1"
                    >
                      View Receipt &rarr;
                    </button>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        )}

        {/* Payment Details Modal */}
        {detailsModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <SpotlightCard className="w-full max-w-md bg-[#181824] border border-white/10 p-6 rounded-3xl text-left shadow-2xl space-y-5" glowColor="rgba(119, 87, 245, 0.15)">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-xs font-extrabold text-white uppercase tracking-widest flex items-center gap-2">
                  <Receipt size={16} className="text-[#00F2FF]" /> Payment Receipt Details
                </h3>
                <button onClick={() => setDetailsModalOpen(false)} className="text-text-muted hover:text-white transition cursor-pointer p-1 rounded-lg">
                  <X size={18} />
                </button>
              </div>

              {loadingDetails ? (
                <div className="py-12 text-center text-xs text-text-muted space-y-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#7757F5] mx-auto"></div>
                  <p>Loading payment receipt...</p>
                </div>
              ) : selectedPayment ? (
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-[#0F0F17] rounded-2xl border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Payment Amount</span>
                      <span className="text-xl font-black text-emerald-400">
                        ₹{selectedPayment.amount} {selectedPayment.currency || "INR"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Status</span>
                      {renderStatusBadge(selectedPayment.status)}
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex justify-between py-1 border-b border-white/10">
                      <span className="text-text-muted">Reason</span>
                      <span className="font-bold text-white">
                        {selectedPayment.reason || (selectedPayment.type === "Course" ? "Course Enrollment" : "Mentorship Session Booking")}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/10">
                      <span className="text-text-muted">Item Type</span>
                      <span className="font-bold text-white">{selectedPayment.type}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/10">
                      <span className="text-text-muted">Item Title</span>
                      <span className="font-bold text-white truncate max-w-[200px]">
                        {selectedPayment.course?.title || selectedPayment.session?.title || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/10">
                      <span className="text-text-muted">Recipient</span>
                      <span className="font-bold text-white">{selectedPayment.recipient?.name || "Instructor/Expert"}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/10">
                      <span className="text-text-muted">Payment Date</span>
                      <span className="font-bold text-white">
                        {selectedPayment.paidAt
                          ? new Date(selectedPayment.paidAt).toLocaleString()
                          : selectedPayment.createdAt
                          ? new Date(selectedPayment.createdAt).toLocaleString()
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/10">
                      <span className="text-text-muted">Transaction ID</span>
                      <span className="font-mono text-[10px] text-white">{selectedPayment._id}</span>
                    </div>
                    {selectedPayment.razorpayPaymentId && (
                      <div className="flex justify-between py-1 border-b border-white/10">
                        <span className="text-text-muted">Razorpay Payment ID</span>
                        <span className="font-mono text-[10px] text-[#00F2FF]">{selectedPayment.razorpayPaymentId}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button variant="secondary" onClick={() => setDetailsModalOpen(false)} className="text-xs py-1.5 px-4">
                      Close
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-rose-400">
                  Failed to load receipt details.
                </div>
              )}
            </SpotlightCard>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default PaymentHistory;
