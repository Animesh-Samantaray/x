import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllSessions, getMySessions, requestSession, acceptLearner, rejectLearner, cancelSession, completeSession } from "../../services/sessionService";
import SpotlightCard from "../../components/SpotlightCard";
import Button from "../../components/Button";
import SessionCard from "../../components/sessions/SessionCard";
import CreateSessionModal from "../../components/sessions/CreateSessionModal";
import ManageSessionModal from "../../components/sessions/ManageSessionModal";
import SessionDetailsModal from "../../components/sessions/SessionDetailsModal";
import { Video, PlusCircle, Search, RefreshCw, AlertCircle, Info, Filter } from "lucide-react";

const SessionsPage = ({ initialTab = "explore" }) => {
  const { user } = useAuth();
  const isExpert = user?.role === "expert";

  const [activeTab, setActiveTab] = useState(initialTab === "my" ? "my" : "explore");
  const [learnerStatusFilter, setLearnerStatusFilter] = useState("all");

  const [openSessions, setOpenSessions] = useState([]);
  const [mySessions, setMySessions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const [bookingLoadingId, setBookingLoadingId] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [loadingLearnerId, setLoadingLearnerId] = useState(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      const [openRes, myRes] = await Promise.allSettled([
        getAllSessions(),
        getMySessions(),
      ]);

      if (openRes.status === "fulfilled" && openRes.value?.success) {
        setOpenSessions(openRes.value.sessions || []);
      }
      if (myRes.status === "fulfilled" && myRes.value?.success) {
        setMySessions(myRes.value.sessions || []);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load mentorship sessions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleBookSession = async (sessionId) => {
    try {
      setBookingLoadingId(sessionId);
      const res = await requestSession(sessionId);
      if (res && res.success) {
        triggerToast("Mentorship session requested! Waiting for expert approval.");
        fetchSessions();
      } else {
        triggerToast(res.message || "Failed to book session.");
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || "Failed to book session.");
    } finally {
      setBookingLoadingId(null);
    }
  };

  const handleCancelSession = async (sessionId) => {
    if (!window.confirm("Are you sure you want to cancel this mentorship session?")) return;
    try {
      setActionLoadingId(sessionId);
      const res = await cancelSession(sessionId);
      if (res && res.success) {
        triggerToast("Mentorship session cancelled.");
        fetchSessions();
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || "Failed to cancel session.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCompleteSession = async (sessionId) => {
    try {
      setActionLoadingId(sessionId);
      const res = await completeSession(sessionId);
      if (res && res.success) {
        triggerToast("Session marked as completed!");
        fetchSessions();
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || "Failed to complete session.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAcceptLearner = async (sessionId, learnerId) => {
    try {
      setLoadingLearnerId(learnerId);
      const res = await acceptLearner(sessionId, learnerId);
      if (res && res.success) {
        triggerToast("Learner request accepted successfully!");
        fetchSessions();
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || "Failed to accept learner.");
    } finally {
      setLoadingLearnerId(null);
    }
  };

  const handleRejectLearner = async (sessionId, learnerId) => {
    try {
      setLoadingLearnerId(learnerId);
      const res = await rejectLearner(sessionId, learnerId);
      if (res && res.success) {
        triggerToast("Learner request rejected.");
        fetchSessions();
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || "Failed to reject learner.");
    } finally {
      setLoadingLearnerId(null);
    }
  };

  const handleViewDetails = (sessionId) => {
    setSelectedSessionId(sessionId);
    setDetailsModalOpen(true);
  };

  const handleEditSession = (session) => {
    setEditingSession(session);
    setEditModalOpen(true);
  };

  const currentList = activeTab === "explore" ? openSessions : mySessions;

  const filteredSessions = currentList.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (s.title || "").toLowerCase().includes(q) ||
      (s.topic || "").toLowerCase().includes(q) ||
      (s.expert?.user?.name || "").toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (activeTab === "my" && !isExpert && learnerStatusFilter !== "all") {
      const myLearner = (s.learners || []).find((l) => {
        const lId = l.user?._id || l.user;
        return lId && String(lId) === String(user?._id);
      });
      const st = myLearner?.status;

      if (learnerStatusFilter === "pending") return st === "pending";
      if (learnerStatusFilter === "accepted") return st === "accepted" && s.status !== "completed";
      if (learnerStatusFilter === "rejected") return st === "rejected";
      if (learnerStatusFilter === "completed") return s.status === "completed";
    }

    return true;
  });

  return (
    <div className="space-y-6 text-left relative">
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[100] flex items-center gap-3 glass-surface border-accent-blue/30 bg-bg-darker/95 px-5 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-300">
          <Info className="text-accent-blue shrink-0 animate-pulse" size={18} />
          <p className="text-xs font-semibold text-text-title">{toastMessage}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-glass-border/40 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-text-title flex items-center gap-2">
            <Video className="text-accent-purple" size={24} /> Mentorship Sessions
          </h1>
          <p className="text-xs text-text-muted font-semibold mt-1">
            Learn directly from experienced experts through one-on-one or group mentorship sessions.
          </p>
        </div>

        {isExpert && (
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 text-xs py-2.5 px-4 shadow-lg shrink-0 bg-gradient-to-r from-accent-purple to-accent-indigo"
          >
            <PlusCircle size={15} /> Create Mentorship Session
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-bg-darker border border-glass-border p-3.5 rounded-2xl">
        <div className="flex items-center gap-2 w-full sm:w-auto bg-bg-dark p-1 rounded-xl border border-glass-border/50">
          <button
            onClick={() => setActiveTab("explore")}
            className={`flex-1 sm:flex-initial text-xs font-extrabold py-2 px-4 rounded-lg transition-all cursor-pointer ${
              activeTab === "explore"
                ? "bg-gradient-to-r from-accent-purple to-accent-indigo text-white shadow"
                : "text-text-muted hover:text-text-title"
            }`}
          >
            Explore Open Sessions
          </button>
          <button
            onClick={() => setActiveTab("my")}
            className={`flex-1 sm:flex-initial text-xs font-extrabold py-2 px-4 rounded-lg transition-all cursor-pointer ${
              activeTab === "my"
                ? "bg-gradient-to-r from-accent-purple to-accent-indigo text-white shadow"
                : "text-text-muted hover:text-text-title"
            }`}
          >
            {isExpert ? "My Created Sessions" : "My Booked Sessions"} ({mySessions.length})
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-80">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search sessions by title, topic, expert..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full form-input text-xs rounded-xl pl-9 pr-4 py-2 bg-bg-dark text-text-title border-glass-border focus:border-accent-purple/50 focus:outline-none"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-text-muted" />
          </div>

          <Button
            onClick={fetchSessions}
            variant="secondary"
            className="text-xs p-2 shrink-0 border-glass-border hover:bg-glass-border"
            title="Refresh sessions"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-accent-purple" : ""} />
          </Button>
        </div>
      </div>

      {activeTab === "my" && !isExpert && mySessions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter size={11} /> Filter Status:
          </span>
          {[
            { id: "all", label: "All Sessions" },
            { id: "pending", label: "Pending Approval" },
            { id: "accepted", label: "Accepted / Upcoming" },
            { id: "rejected", label: "Rejected" },
            { id: "completed", label: "Completed" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setLearnerStatusFilter(f.id)}
              className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition cursor-pointer border ${
                learnerStatusFilter === f.id
                  ? "bg-accent-purple/20 text-accent-purple border-accent-purple/40 shadow-sm"
                  : "bg-glass-border/20 text-text-muted border-glass-border/40 hover:text-text-title"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center p-8 border border-rose-500/20 bg-rose-500/5 rounded-2xl text-center max-w-md mx-auto my-6">
          <AlertCircle className="text-rose-400 mb-2 animate-bounce" size={24} />
          <h4 className="text-sm font-bold text-text-title">Failed to load mentorship sessions</h4>
          <p className="text-xs text-text-muted mt-1 mb-4">{error}</p>
          <Button onClick={fetchSessions} className="text-xs py-2 px-4">
            Try Again
          </Button>
        </div>
      )}

      {!error && loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 bg-glass-border/30 rounded-2xl border border-glass-border"></div>
          ))}
        </div>
      )}

      {!error && !loading && filteredSessions.length === 0 && (
        <SpotlightCard className="p-12 bg-glass-card border border-glass-border text-center rounded-2xl" glowColor="rgba(168, 85, 247, 0.08)">
          <Video size={32} className="text-text-muted mx-auto mb-3" />
          <h3 className="text-sm font-bold text-text-title">
            {activeTab === "explore" ? "No mentorship sessions available" : "No mentorship sessions found"}
          </h3>
          <p className="text-xs text-text-muted max-w-sm mx-auto mt-1 mb-5">
            {activeTab === "explore"
              ? "There are currently no open mentorship sessions. Check back later or explore available courses."
              : isExpert
              ? "You haven't created any mentorship sessions yet. Create your first session to start mentoring learners."
              : "You haven't booked any mentorship sessions yet. Explore open sessions above to connect with experts."}
          </p>
          {isExpert && (
            <Button
              onClick={() => setCreateModalOpen(true)}
              className="text-xs py-2.5 px-5 bg-gradient-to-r from-accent-purple to-accent-indigo"
            >
              Create Mentorship Session &rarr;
            </Button>
          )}
        </SpotlightCard>
      )}

      {!error && !loading && filteredSessions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((s) => (
            <SessionCard
              key={s._id}
              session={s}
              currentUser={user}
              onBook={handleBookSession}
              onViewDetails={handleViewDetails}
              onEditSession={handleEditSession}
              onCancel={handleCancelSession}
              onComplete={handleCompleteSession}
              onAcceptLearner={handleAcceptLearner}
              onRejectLearner={handleRejectLearner}
              loadingLearnerId={loadingLearnerId}
              bookingLoadingId={bookingLoadingId}
              actionLoadingId={actionLoadingId}
            />
          ))}
        </div>
      )}

      <CreateSessionModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={(msg) => {
          triggerToast(msg);
          fetchSessions();
        }}
      />

      <ManageSessionModal
        session={editingSession}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingSession(null);
        }}
        onSuccess={(msg) => {
          triggerToast(msg);
          fetchSessions();
        }}
      />

      <SessionDetailsModal
        sessionId={selectedSessionId}
        isOpen={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedSessionId(null);
        }}
        currentUser={user}
        onSessionUpdated={fetchSessions}
      />
    </div>
  );
};

export default SessionsPage;
