import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import LoadingSkeleton from "../../components/dashboard/LoadingSkeleton";
import EmptyState from "../../components/dashboard/EmptyState";
import ErrorState from "../../components/dashboard/ErrorState";
import SpotlightCard from "../../components/SpotlightCard";
import Button from "../../components/Button";
import SessionCard from "../../components/sessions/SessionCard";
import CreateSessionModal from "../../components/sessions/CreateSessionModal";

import { getExpertProfile } from "../../services/expertApi";
import { getMySessions, acceptLearner, rejectLearner, cancelSession, completeSession } from "../../services/sessionService";
import { getMyCourses, deleteCourse } from "../../services/courseService";
import { getMyResources, deleteResource } from "../../services/resourceService";

import {
  Video,
  Users,
  Award,
  BookOpen,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  PlusCircle,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  UserCheck,
  Star,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

const ExpertDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [profile, setProfile] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [resources, setResources] = useState([]);

  const [activeTab, setActiveTab] = useState("overview");
  const [createSessionOpen, setCreateSessionOpen] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [profileRes, sessionsRes, coursesRes, resourcesRes] = await Promise.allSettled([
        getExpertProfile(),
        getMySessions(),
        getMyCourses(),
        getMyResources(),
      ]);

      if (profileRes.status === "fulfilled" && profileRes.value?.profile) {
        setProfile(profileRes.value.profile);
      }
      if (sessionsRes.status === "fulfilled" && sessionsRes.value?.sessions) {
        setSessions(sessionsRes.value.sessions);
      }
      if (coursesRes.status === "fulfilled" && coursesRes.value?.courses) {
        setCourses(coursesRes.value.courses);
      }
      if (resourcesRes.status === "fulfilled" && resourcesRes.value?.resources) {
        setResources(resourcesRes.value.resources);
      }
    } catch (err) {
      console.error("Error fetching expert dashboard data:", err);
      setError(err.message || "Failed to load expert dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAcceptLearner = async (sessionId, learnerId) => {
    try {
      setActionLoadingId(`${sessionId}-${learnerId}`);
      await acceptLearner(sessionId, learnerId);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept learner.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectLearner = async (sessionId, learnerId) => {
    try {
      setActionLoadingId(`${sessionId}-${learnerId}`);
      await rejectLearner(sessionId, learnerId);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject learner.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancelSession = async (sessionId) => {
    if (window.confirm("Are you sure you want to cancel this mentorship session?")) {
      try {
        await cancelSession(sessionId);
        await fetchData();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to cancel session.");
      }
    }
  };

  const handleCompleteSession = async (sessionId) => {
    if (window.confirm("Mark this session as completed?")) {
      try {
        await completeSession(sessionId);
        await fetchData();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to complete session.");
      }
    }
  };

  // Real statistics calculation
  const totalCourses = courses.length;
  const publishedCourses = courses.filter((c) => c.status === "published").length;
  const totalResources = resources.length;
  const totalLearners = courses.reduce((acc, c) => acc + (c.enrolledStudents?.length || 0), 0);

  const totalSessions = sessions.length;
  
  let pendingRequestsCount = 0;
  let upcomingSessionsCount = 0;
  let completedSessionsCount = 0;

  sessions.forEach((s) => {
    if (s.status === "completed") completedSessionsCount++;
    if (s.status === "open" || s.status === "upcoming") upcomingSessionsCount++;

    (s.learners || []).forEach((l) => {
      if (l.status === "pending") pendingRequestsCount++;
    });
  });

  return (
    <DashboardLayout
      title={`Expert Mentorship Workspace — ${user?.name || "Expert"}`}
      subtitle="Manage your 1-on-1 calls, learner join requests, and published courses."
      actions={
        <div className="flex items-center gap-2">
          <Button onClick={() => setCreateSessionOpen(true)} className="text-xs py-2 px-3 bg-accent-orange hover:bg-amber-600 flex items-center gap-1.5">
            <PlusCircle size={14} /> Create Mentorship Session
          </Button>
          <Button onClick={() => navigate("/profile")} className="text-xs py-2 px-3 bg-glass-card hover:bg-glass-border flex items-center gap-1.5">
            <Edit size={14} /> Edit Profile
          </Button>
        </div>
      }
    >
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : (
        <div className="space-y-8 text-left">
          {/* EXPERT PROFILE SUMMARY CARD */}
          <SpotlightCard className="p-6 card-tint-peach border border-glass-border rounded-2xl" glowColor="rgba(249, 115, 22, 0.12)">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-accent p-[2px] shrink-0">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} className="h-full w-full rounded-2xl object-cover" />
                  ) : (
                    <div className="h-full w-full rounded-2xl bg-bg-dark flex items-center justify-center font-extrabold text-white text-lg uppercase">
                      {user?.name ? user.name[0] : "E"}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-text-title">{user?.name}</h3>
                    {profile?.isVerified && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <ShieldCheck size={10} /> Verified Expert
                      </span>
                    )}
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                      profile?.isAvailable ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                    }`}>
                      {profile?.isAvailable ? "Available for Calls" : "Unavailable"}
                    </span>
                  </div>
                  <p className="text-xs text-accent-orange font-semibold">
                    {profile?.headline || "Expert Consultant & Educator"}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-text-muted">
                    {profile?.expertise?.length > 0 && <span><strong>Domain:</strong> {profile.expertise.join(", ")}</span>}
                    {profile?.experienceYears && <span><strong>Experience:</strong> {profile.experienceYears} Years</span>}
                    {profile?.hourlyRate !== undefined && <span><strong>Rate:</strong> ${profile.hourlyRate}/hr</span>}
                  </div>
                </div>
              </div>

              <Button onClick={() => navigate("/profile")} className="text-xs py-2 px-4 bg-bg-darker hover:bg-glass-border">
                Manage Expert Profile
              </Button>
            </div>
          </SpotlightCard>

          {/* STATS OVERVIEW GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Mentorship Sessions"
              value={totalSessions}
              subtext={`${upcomingSessionsCount} upcoming / ${completedSessionsCount} completed`}
              icon={Video}
              color="orange"
            />
            <StatCard
              title="Pending Requests"
              value={pendingRequestsCount}
              subtext="Learner join requests awaiting decision"
              icon={Clock}
              color="pink"
            />
            <StatCard
              title="Published Courses"
              value={publishedCourses}
              subtext={`${totalLearners} total enrolled students`}
              icon={BookOpen}
              color="purple"
            />
            <StatCard
              title="Technical Resources"
              value={totalResources}
              subtext="Uploaded reference packages"
              icon={FileText}
              color="cyan"
            />
          </div>

          {/* DASHBOARD TAB SUB-NAV */}
          <div className="flex items-center space-x-2 border-b border-glass-border/40 pb-2">
            {[
              { id: "overview", label: "Overview" },
              { id: "sessions", label: `Mentorship Sessions (${totalSessions})` },
              { id: "requests", label: `Learner Requests (${pendingRequestsCount})` },
              { id: "courses", label: `Courses (${totalCourses})` },
              { id: "resources", label: `Resources (${totalResources})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition duration-150 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-accent-orange text-white shadow-md shadow-orange-900/30"
                    : "text-text-muted hover:text-text-title hover:bg-glass-border/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Learner Requests Section */}
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-text-title uppercase tracking-wider mb-4 flex items-center gap-2">
                    <UserCheck className="text-accent-orange" size={16} /> Pending Learner Requests ({pendingRequestsCount})
                  </h3>

                  {pendingRequestsCount === 0 ? (
                    <EmptyState
                      icon={UserCheck}
                      title="No pending requests"
                      description="All learner registration requests for your mentorship sessions have been processed."
                      glowColor="rgba(249, 115, 22, 0.08)"
                    />
                  ) : (
                    <div className="space-y-4">
                      {sessions.flatMap((session) =>
                        (session.learners || [])
                          .filter((l) => l.status === "pending")
                          .map((learner) => (
                            <SpotlightCard key={`${session._id}-${learner.user?._id || learner.user}`} className="p-4 bg-glass-card border border-glass-border rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-accent-orange/10 border border-accent-orange/20 flex items-center justify-center font-bold text-accent-orange uppercase shrink-0">
                                  {learner.user?.name ? learner.user.name[0] : "L"}
                                </div>
                                <div className="space-y-0.5 text-left">
                                  <h4 className="text-xs font-extrabold text-text-title">{learner.user?.name || "Learner"}</h4>
                                  <p className="text-[10px] text-text-muted">{learner.user?.email}</p>
                                  <p className="text-[10px] text-accent-orange font-semibold">Session: {session.title}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 border-glass-border/30 pt-2 sm:pt-0">
                                <Button
                                  onClick={() => handleAcceptLearner(session._id, learner.user?._id || learner.user)}
                                  disabled={actionLoadingId === `${session._id}-${learner.user?._id || learner.user}`}
                                  className="text-xs py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1"
                                >
                                  <CheckCircle size={12} /> Accept
                                </Button>
                                <Button
                                  onClick={() => handleRejectLearner(session._id, learner.user?._id || learner.user)}
                                  disabled={actionLoadingId === `${session._id}-${learner.user?._id || learner.user}`}
                                  className="text-xs py-1.5 px-3 bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1"
                                >
                                  <XCircle size={12} /> Reject
                                </Button>
                              </div>
                            </SpotlightCard>
                          ))
                      )}
                    </div>
                  )}
                </div>

                {/* Recent Sessions */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-text-title uppercase tracking-wider flex items-center gap-2">
                      <Video className="text-accent-orange" size={16} /> Active Mentorship Calls
                    </h3>
                    <button onClick={() => setActiveTab("sessions")} className="text-xs font-bold text-accent-orange hover:underline cursor-pointer">
                      View All ({totalSessions})
                    </button>
                  </div>

                  {sessions.length === 0 ? (
                    <EmptyState
                      icon={Video}
                      title="No mentorship sessions created"
                      description="Schedule consultation time slots for learners to request 1-on-1 advice."
                      actionText="Create Session"
                      onAction={() => setCreateSessionOpen(true)}
                      glowColor="rgba(249, 115, 22, 0.08)"
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sessions.slice(0, 4).map((session) => (
                        <SessionCard
                          key={session._id}
                          session={session}
                          currentUser={user}
                          onCancel={handleCancelSession}
                          onComplete={handleCompleteSession}
                          onAcceptLearner={handleAcceptLearner}
                          onRejectLearner={handleRejectLearner}
                          actionLoadingId={actionLoadingId}
                        />

                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions & Expert Tools */}
              <div className="lg:col-span-4 space-y-6">
                <SpotlightCard className="p-5 card-tint-peach border border-glass-border rounded-2xl" glowColor="rgba(249, 115, 22, 0.12)">
                  <h4 className="text-xs font-bold text-text-title uppercase tracking-widest border-b border-glass-border/40 pb-3 mb-4">
                    Expert Tools
                  </h4>
                  <div className="space-y-2.5">
                    <Button onClick={() => setCreateSessionOpen(true)} className="w-full text-xs py-2 px-3 justify-start gap-2 bg-glass-card hover:bg-glass-border">
                      <PlusCircle size={14} className="text-accent-orange" />
                      Create New Mentorship Call
                    </Button>
                    <Button onClick={() => navigate("/courses/new")} className="w-full text-xs py-2 px-3 justify-start gap-2 bg-glass-card hover:bg-glass-border">
                      <PlusCircle size={14} className="text-accent-purple" />
                      Create Masterclass Course
                    </Button>
                    <Button onClick={() => navigate("/resources/new")} className="w-full text-xs py-2 px-3 justify-start gap-2 bg-glass-card hover:bg-glass-border">
                      <PlusCircle size={14} className="text-accent-cyan" />
                      Upload Technical Resource
                    </Button>
                    <Button onClick={() => navigate("/profile")} className="w-full text-xs py-2 px-3 justify-start gap-2 bg-glass-card hover:bg-glass-border">
                      <Edit size={14} className="text-accent-blue" />
                      Update Hourly Rate & Expertise
                    </Button>
                  </div>
                </SpotlightCard>
              </div>
            </div>
          )}

          {/* SESSIONS TAB */}
          {activeTab === "sessions" && (
            <div className="space-y-6">
              {sessions.length === 0 ? (
                <EmptyState
                  icon={Video}
                  title="No sessions created"
                  description="Offer 1-on-1 mentorship sessions to share your domain expertise."
                  actionText="Create Session"
                  onAction={() => setCreateSessionOpen(true)}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sessions.map((session) => (
                    <SessionCard
                      key={session._id}
                      session={session}
                      currentUser={user}
                      onCancel={handleCancelSession}
                      onComplete={handleCompleteSession}
                      onAcceptLearner={handleAcceptLearner}
                      onRejectLearner={handleRejectLearner}
                      actionLoadingId={actionLoadingId}
                    />
                  ))}

                </div>
              )}
            </div>
          )}

          {/* LEARNER REQUESTS TAB */}
          {activeTab === "requests" && (
            <div className="space-y-6">
              {pendingRequestsCount === 0 ? (
                <EmptyState
                  icon={UserCheck}
                  title="No pending requests"
                  description="There are currently no pending learner requests awaiting your decision."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sessions.flatMap((session) =>
                    (session.learners || [])
                      .filter((l) => l.status === "pending")
                      .map((learner) => (
                        <SpotlightCard key={`${session._id}-${learner.user?._id || learner.user}`} className="p-5 bg-glass-card border border-glass-border rounded-2xl space-y-3 text-left">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-xs font-bold text-text-title">{learner.user?.name || "Learner"}</h4>
                              <p className="text-[10px] text-text-muted">{learner.user?.email}</p>
                            </div>
                            <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              Pending
                            </span>
                          </div>
                          <p className="text-xs text-accent-orange font-semibold">Session: {session.title}</p>
                          <p className="text-[10px] text-text-muted">Requested on: {new Date(learner.requestedAt || session.createdAt).toLocaleDateString()}</p>
                          <div className="flex items-center gap-2 pt-2 border-t border-glass-border/30">
                            <Button onClick={() => handleAcceptLearner(session._id, learner.user?._id || learner.user)} className="w-full text-xs py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700">
                              Accept Learner
                            </Button>
                            <Button onClick={() => handleRejectLearner(session._id, learner.user?._id || learner.user)} className="w-full text-xs py-1.5 px-3 bg-rose-600 hover:bg-rose-700">
                              Reject
                            </Button>
                          </div>
                        </SpotlightCard>
                      ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* COURSES TAB */}
          {activeTab === "courses" && (
            <div className="space-y-6">
              {courses.length === 0 ? (
                <EmptyState
                  icon={BookOpen}
                  title="No courses created"
                  description="You have not created any course modules yet."
                  actionText="Create Course"
                  onAction={() => navigate("/courses/new")}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <SpotlightCard key={course._id} className="p-5 bg-glass-card border border-glass-border rounded-2xl space-y-4 text-left">
                      <h4 className="text-sm font-extrabold text-text-title line-clamp-1">{course.title}</h4>
                      <p className="text-xs text-text-muted">{course.units?.length || 0} Units • {course.enrolledStudents?.length || 0} Learners</p>
                      <Button onClick={() => navigate(`/courses/${course._id}`)} className="w-full text-xs py-2 px-3">
                        View Course Details
                      </Button>
                    </SpotlightCard>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* RESOURCES TAB */}
          {activeTab === "resources" && (
            <div className="space-y-6">
              {resources.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No resources uploaded"
                  description="Upload guides and code packages for learners."
                  actionText="Upload Resource"
                  onAction={() => navigate("/resources/new")}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resources.map((res) => (
                    <SpotlightCard key={res._id} className="p-5 bg-glass-card border border-glass-border rounded-2xl space-y-3 text-left">
                      <h4 className="text-sm font-extrabold text-text-title line-clamp-1">{res.title}</h4>
                      <p className="text-xs text-text-muted">{res.documents?.length || 0} Docs uploaded</p>
                      <Button onClick={() => navigate(`/resources/${res._id}`)} className="w-full text-xs py-2 px-3">
                        View Resource
                      </Button>
                    </SpotlightCard>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CREATE SESSION MODAL */}
          {createSessionOpen && (
            <CreateSessionModal
              isOpen={createSessionOpen}
              onClose={() => setCreateSessionOpen(false)}
              onSuccess={() => {
                setCreateSessionOpen(false);
                fetchData();
              }}
            />
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ExpertDashboard;
