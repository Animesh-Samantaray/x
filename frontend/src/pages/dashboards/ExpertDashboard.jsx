import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSkeleton from "../../components/dashboard/LoadingSkeleton";
import EmptyState from "../../components/dashboard/EmptyState";
import ErrorState from "../../components/dashboard/ErrorState";
import Button from "../../components/Button";
import toast from "react-hot-toast";

import {
  getMySessions,
  getAllSessions,
  acceptLearner,
  rejectLearner,
} from "../../services/sessionService";

import {
  Video,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  ExternalLink,
  PlusCircle,
  Sparkles,
  UserCheck,
  ShieldCheck,
  ChevronRight,
  Activity,
} from "lucide-react";

import { transformExpertAnalytics } from "../../utils/analyticsTransformer";
import { RealLineChart, RealDoughnutChart } from "../../components/dashboard/RealChart";

const ExpertDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState("my");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getMySessions();
      if (res && res.success) {
        setSessions(res.sessions || []);
      }
    } catch (err) {
      console.error("Expert hub fetch error:", err);
      setError(err.message || "Failed to load expert hub data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAccept = async (sessionId, learnerId) => {
    try {
      const res = await acceptLearner(sessionId, learnerId);
      if (res && res.success) {
        toast.success("Learner request accepted!");
        fetchData();
      }
    } catch (err) {
      toast.error("Failed to accept learner request.");
    }
  };

  const handleReject = async (sessionId, learnerId) => {
    try {
      const res = await rejectLearner(sessionId, learnerId);
      if (res && res.success) {
        toast.success("Learner request rejected.");
        fetchData();
      }
    } catch (err) {
      toast.error("Failed to reject learner request.");
    }
  };

  // Collect pending requests across expert sessions
  const pendingRequests = [];
  sessions.forEach((s) => {
    (s.learners || []).forEach((l) => {
      if (l.status === "pending") {
        pendingRequests.push({
          sessionId: s._id,
          sessionTitle: s.title,
          scheduledAt: s.scheduledAt,
          learner: l.user,
          status: l.status,
        });
      }
    });
  });

  const upcomingCalls = sessions.filter((s) => s.status === "open" || s.status === "upcoming");

  return (
    <div className="space-y-8 text-left">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-glass-border/60 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ● EXPERT MENTORSHIP HUB
            </span>
            <span className="text-xs text-text-muted font-mono">Expert: {user?.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-title tracking-tight font-display">
            Mentorship Operations Center
          </h1>
          <p className="text-xs sm:text-sm text-text-muted font-medium">
            Review learner session requests, host 1-on-1 consultations, set availability slots, and guide emerging engineers.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            onClick={() => navigate("/sessions")}
            className="text-xs font-bold py-2.5 px-4 rounded-xl bg-btn-primary hover:bg-btn-primary-hover text-white flex items-center gap-2 shadow-lg"
          >
            <PlusCircle size={15} /> Manage Mentorship Sessions
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : (
        <div className="space-y-8">
          
          {/* EXPERT TELEMETRY ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-glass-card border border-glass-border space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-text-muted">
                <span>PENDING REQUESTS</span>
                <Clock size={14} className="text-amber-500" />
              </div>
              <div className="text-2xl font-black text-amber-500 font-mono">{pendingRequests.length} Requests</div>
              <p className="text-[10px] text-text-muted">Awaiting your approval</p>
            </div>

            <div className="p-5 rounded-2xl bg-glass-card border border-glass-border space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-text-muted">
                <span>ACTIVE SESSIONS</span>
                <Video size={14} className="text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-emerald-500 font-mono">{upcomingCalls.length} Slots</div>
              <p className="text-[10px] text-text-muted">Open video appointments</p>
            </div>

            <div className="p-5 rounded-2xl bg-glass-card border border-glass-border space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-text-muted">
                <span>TOTAL CREATED</span>
                <Users size={14} className="text-cyan-500" />
              </div>
              <div className="text-2xl font-black text-cyan-500 font-mono">{sessions.length} Sessions</div>
              <p className="text-[10px] text-text-muted">Created mentorship slots</p>
            </div>

            <div className="p-5 rounded-2xl bg-glass-card border border-glass-border space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-text-muted">
                <span>CONSULTATION STATUS</span>
                <DollarSign size={14} className="text-purple-500" />
              </div>
              <div className="text-2xl font-black text-purple-500 font-mono">Verified Expert</div>
              <p className="text-[10px] text-text-muted">Available for booking</p>
            </div>

          </div>

          {/* REAL EXPERT ANALYTICS PANEL (100% REAL DATA FROM BACKEND DATABASE) */}
          {(() => {
            const expertData = transformExpertAnalytics(sessions);

            if (expertData.isEmpty) {
              return (
                <div className="p-8 rounded-3xl bg-glass-card border border-glass-border text-center space-y-3 shadow-sm">
                  <Activity size={28} className="text-emerald-500 mx-auto opacity-70" />
                  <h3 className="text-sm font-bold font-mono text-text-title uppercase tracking-wider">No Mentorship Consultation Analytics Recorded</h3>
                  <p className="text-xs text-text-muted max-w-md mx-auto">
                    Create 1-on-1 mentorship session slots to start receiving learner booking requests and tracking consultation trends.
                  </p>
                  <Button
                    onClick={() => navigate("/sessions")}
                    className="text-xs py-2 px-4 bg-btn-primary hover:bg-btn-primary-hover text-white font-bold"
                  >
                    Manage Mentorship Slots
                  </Button>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* REAL METRICS ROW 1 */}
                <div className="lg:col-span-7 p-6 rounded-3xl bg-glass-card border border-glass-border shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-glass-border pb-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest block">SESSION SCHEDULING TRENDS</span>
                      <h3 className="text-base font-extrabold text-text-title">Monthly Advisory Sessions Scheduled</h3>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      Total: {expertData.totalSessions} Sessions
                    </span>
                  </div>
                  <RealLineChart data={expertData.monthlyChartData} height={200} />
                </div>

                <div className="lg:col-span-5 p-6 rounded-3xl bg-glass-card border border-glass-border shadow-md flex flex-col justify-between space-y-4">
                  <div className="border-b border-glass-border pb-3 text-left">
                    <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest block">LEARNER REQUEST STATUS</span>
                    <h3 className="text-sm font-extrabold text-text-title mt-0.5">{expertData.acceptedRequests + expertData.pendingRequests + expertData.rejectedRequests} Booking Requests</h3>
                  </div>
                  <RealDoughnutChart data={expertData.requestsChartData} height={180} />
                </div>

                {/* REAL METRICS ROW 2 */}
                <div className="lg:col-span-12 p-6 rounded-3xl bg-glass-card border border-glass-border shadow-md space-y-4 text-left">
                  <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest block border-b border-glass-border pb-3">MENTORSHIP OPERATIONS SUMMARY</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
                    <div className="p-4 rounded-2xl bg-bg-dark/60 border border-glass-border">
                      <span className="text-[10px] text-text-muted uppercase block">Pending Learner Requests</span>
                      <span className="text-2xl font-black text-amber-500 mt-1 block">{expertData.pendingRequests} Requests</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-bg-dark/60 border border-glass-border">
                      <span className="text-[10px] text-text-muted uppercase block">Accepted Consultations</span>
                      <span className="text-2xl font-black text-emerald-500 mt-1 block">{expertData.acceptedRequests} Sessions</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-bg-dark/60 border border-glass-border">
                      <span className="text-[10px] text-text-muted uppercase block">Active Open Slots</span>
                      <span className="text-2xl font-black text-cyan-500 mt-1 block">{expertData.openCount} Slots</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-bg-dark/60 border border-glass-border">
                      <span className="text-[10px] text-text-muted uppercase block">Completed Calls</span>
                      <span className="text-2xl font-black text-purple-400 mt-1 block">{expertData.completedCount} Completed</span>
                    </div>
                  </div>
                </div>

              </div>
            );
          })()}

          {/* SUB NAV TABS */}
          <div className="flex items-center gap-2 border-b border-glass-border/40 pb-2 overflow-x-auto">
            {[
              { id: "requests", label: `Pending Requests (${pendingRequests.length})` },
              { id: "my", label: `My Sessions (${sessions.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow"
                    : "text-text-muted hover:text-text-title hover:bg-glass-border/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: PENDING REQUESTS QUEUE */}
          {activeTab === "requests" && (
            <div className="space-y-4">
              {pendingRequests.length === 0 ? (
                <EmptyState
                  icon={Clock}
                  title="No pending requests"
                  description="When learners request a 1-on-1 consultation slot, they will be listed here for approval."
                />
              ) : (
                <div className="space-y-3">
                  {pendingRequests.map((req) => (
                    <div
                      key={`${req.sessionId}-${req.learner?._id}`}
                      className="p-5 rounded-2xl bg-glass-card border border-glass-border hover:border-emerald-500/40 transition duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-500/20">
                          {req.learner?.name?.[0] || "L"}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-text-title">{req.sessionTitle || "Mentorship Session"}</h4>
                          <p className="text-[11px] text-text-muted mt-0.5">
                            Learner: <strong className="text-text-title">{req.learner?.name}</strong> ({req.learner?.email})
                          </p>
                          <p className="text-[10px] font-mono text-text-muted mt-0.5">
                            📅 Scheduled: {new Date(req.scheduledAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                        <Button
                          onClick={() => handleReject(req.sessionId, req.learner?._id)}
                          variant="secondary"
                          className="text-[11px] py-1.5 px-3 border-glass-border hover:bg-rose-500/10 hover:text-rose-400"
                        >
                          <XCircle size={13} /> Reject
                        </Button>
                        <Button
                          onClick={() => handleAccept(req.sessionId, req.learner?._id)}
                          className="text-[11px] py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1"
                        >
                          <CheckCircle size={13} /> Accept Request
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MY SESSIONS */}
          {activeTab === "my" && (
            <div className="space-y-4">
              {sessions.length === 0 ? (
                <EmptyState
                  icon={Video}
                  title="No sessions created"
                  description="Create your first mentorship session to start accepting learner bookings."
                  actionText="Manage Sessions"
                  onAction={() => navigate("/sessions")}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sessions.map((s) => (
                    <div key={s._id} className="p-5 rounded-2xl bg-glass-card border border-glass-border space-y-3 text-left">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-text-title">{s.title}</h4>
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {s.status}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted line-clamp-2">{s.description}</p>
                      <p className="text-[10px] font-mono text-text-muted">📅 Scheduled: {new Date(s.scheduledAt).toLocaleString()}</p>
                      {s.meetingUrl && (
                        <a
                          href={s.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:underline pt-1"
                        >
                          Meeting Link <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default ExpertDashboard;
