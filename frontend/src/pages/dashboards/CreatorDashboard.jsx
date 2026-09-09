import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSkeleton from "../../components/dashboard/LoadingSkeleton";
import EmptyState from "../../components/dashboard/EmptyState";
import ErrorState from "../../components/dashboard/ErrorState";
import Button from "../../components/Button";

import { getMyCourses } from "../../services/courseService";
import { getMyResources } from "../../services/resourceService";

import {
  BookOpen,
  PlusCircle,
  FileText,
  DollarSign,
  Users,
  Layers,
  Edit,
  CheckCircle,
  BarChart2,
  TrendingUp,
  Activity,
} from "lucide-react";

import { transformCreatorAnalytics } from "../../utils/analyticsTransformer";
import { RealBarChart, RealDoughnutChart } from "../../components/dashboard/RealChart";

const CreatorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [courses, setCourses] = useState([]);
  const [resources, setResources] = useState([]);

  const [activeTab, setActiveTab] = useState("courses");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [coursesRes, resourcesRes] = await Promise.allSettled([
        getMyCourses(),
        getMyResources(),
      ]);

      if (coursesRes.status === "fulfilled" && coursesRes.value?.courses) {
        setCourses(coursesRes.value.courses);
      }
      if (resourcesRes.status === "fulfilled" && resourcesRes.value?.resources) {
        setResources(resourcesRes.value.resources);
      }
    } catch (err) {
      console.error("Creator studio fetch error:", err);
      setError(err.message || "Failed to load creator studio data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalCourses = courses.length;
  const publishedCourses = courses.filter((c) => c.status === "published" || c.isPublished !== false).length;
  const totalResources = resources.length;

  let totalLearners = 0;
  courses.forEach((c) => {
    totalLearners += c.enrolledStudents?.length || c.enrollmentCount || 0;
  });

  return (
    <div className="space-y-8 text-left">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-glass-border/60 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              ● CREATOR CONTENT STUDIO
            </span>
            <span className="text-xs text-text-muted font-mono">Author: {user?.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-title tracking-tight font-display">
            Authoring Workspace
          </h1>
          <p className="text-xs sm:text-sm text-text-muted font-medium">
            Draft interactive units, publish masterclasses, monitor learner enrollments, and manage resource blueprints.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            onClick={() => navigate("/courses/new")}
            className="text-xs font-bold py-2.5 px-4 rounded-xl bg-btn-primary hover:bg-btn-primary-hover text-white flex items-center gap-2 shadow-lg"
          >
            <PlusCircle size={15} /> Create Course
          </Button>
          <Button
            onClick={() => navigate("/resources/new")}
            variant="secondary"
            className="text-xs font-bold py-2.5 px-4 rounded-xl border border-glass-border flex items-center gap-2"
          >
            <FileText size={15} className="text-purple-400" /> Upload Resource
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : (
        <div className="space-y-8">
          
          {/* AUTHORING TELEMETRY ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-glass-card border border-glass-border space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-text-muted">
                <span>AUTHORING INVENTORY</span>
                <BookOpen size={14} className="text-purple-500" />
              </div>
              <div className="text-2xl font-black text-text-title font-mono">{totalCourses} Courses</div>
              <p className="text-[10px] text-text-muted">{publishedCourses} Published / Live</p>
            </div>

            <div className="p-5 rounded-2xl bg-glass-card border border-glass-border space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-text-muted">
                <span>KNOWLEDGE RESOURCES</span>
                <FileText size={14} className="text-cyan-500" />
              </div>
              <div className="text-2xl font-black text-text-title font-mono">{totalResources} Documents</div>
              <p className="text-[10px] text-text-muted">Attached Blueprints & Scripts</p>
            </div>

            <div className="p-5 rounded-2xl bg-glass-card border border-glass-border space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-text-muted">
                <span>COMMUNITY IMPACT</span>
                <Users size={14} className="text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-emerald-500 font-mono">{totalLearners} Learners</div>
              <p className="text-[10px] text-text-muted">Active Masterclass Enrollments</p>
            </div>

            <div className="p-5 rounded-2xl bg-glass-card border border-glass-border space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-text-muted">
                <span>AUTHOR STATUS</span>
                <DollarSign size={14} className="text-amber-500" />
              </div>
              <div className="text-2xl font-black text-amber-500 font-mono">
                Active Creator
              </div>
              <p className="text-[10px] text-text-muted">Content Monetization Enabled</p>
            </div>

          </div>

          {/* REAL CREATOR ANALYTICS PANEL (100% REAL DATA FROM BACKEND DATABASE) */}
          {(() => {
            const creatorData = transformCreatorAnalytics(courses, resources);

            if (creatorData.isEmpty) {
              return (
                <div className="p-8 rounded-3xl bg-glass-card border border-glass-border text-center space-y-3 shadow-sm">
                  <Activity size={28} className="text-purple-500 mx-auto opacity-70" />
                  <h3 className="text-sm font-bold font-mono text-text-title uppercase tracking-wider">No Content Authoring Analytics Recorded</h3>
                  <p className="text-xs text-text-muted max-w-md mx-auto">
                    Publish your first interactive course masterclass or upload downloadable blueprint resources to start gathering enrollment metrics.
                  </p>
                  <Button
                    onClick={() => navigate("/courses/new")}
                    className="text-xs py-2 px-4 bg-btn-primary hover:bg-btn-primary-hover text-white font-bold"
                  >
                    Create New Course
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
                      <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest block">LEARNER ENROLLMENT DISTRIBUTION</span>
                      <h3 className="text-base font-extrabold text-text-title">Student Count Per Authored Course</h3>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-purple-500/10 text-purple-500 border border-purple-500/20">
                      Total: {creatorData.totalLearners} Learners
                    </span>
                  </div>
                  <RealBarChart data={creatorData.enrollmentChartData} height={200} />
                </div>

                <div className="lg:col-span-5 p-6 rounded-3xl bg-glass-card border border-glass-border shadow-md flex flex-col justify-between space-y-4">
                  <div className="border-b border-glass-border pb-3 text-left">
                    <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest block">AUTHORING STATUS BREAKDOWN</span>
                    <h3 className="text-sm font-extrabold text-text-title mt-0.5">{creatorData.totalCourses} Authored Masterclasses</h3>
                  </div>
                  <RealDoughnutChart data={creatorData.statusChartData} height={180} />
                </div>

                {/* REAL METRICS ROW 2 */}
                <div className="lg:col-span-12 p-6 rounded-3xl bg-glass-card border border-glass-border shadow-md space-y-4 text-left">
                  <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest block border-b border-glass-border pb-3">ESTIMATED MONETIZATION & INVENTORY SUMMARY</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
                    <div className="p-4 rounded-2xl bg-bg-dark/60 border border-glass-border">
                      <span className="text-[10px] text-text-muted uppercase block">Gross Course Revenue</span>
                      <span className="text-2xl font-black text-amber-500 mt-1 block">₹{creatorData.grossRevenue.toLocaleString()}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-bg-dark/60 border border-glass-border">
                      <span className="text-[10px] text-text-muted uppercase block">Published Masterclasses</span>
                      <span className="text-2xl font-black text-emerald-500 mt-1 block">{creatorData.publishedCount} / {creatorData.totalCourses}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-bg-dark/60 border border-glass-border">
                      <span className="text-[10px] text-text-muted uppercase block">Uploaded Blueprint Resources</span>
                      <span className="text-2xl font-black text-cyan-500 mt-1 block">{creatorData.totalResources} Documents</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-bg-dark/60 border border-glass-border">
                      <span className="text-[10px] text-text-muted uppercase block">Draft Works</span>
                      <span className="text-2xl font-black text-purple-500 mt-1 block">{creatorData.draftCount} Drafts</span>
                    </div>
                  </div>
                </div>

              </div>
            );
          })()}

          {/* SUB NAV TABS */}
          <div className="flex items-center gap-2 border-b border-glass-border/40 pb-2 overflow-x-auto">
            {[
              { id: "courses", label: `Course Inventory (${totalCourses})` },
              { id: "resources", label: `Uploaded Resources (${totalResources})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow"
                    : "text-text-muted hover:text-text-title hover:bg-glass-border/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: COURSES AUTHORING TABLE */}
          {activeTab === "courses" && (
            <div className="space-y-4">
              {courses.length === 0 ? (
                <EmptyState
                  icon={BookOpen}
                  title="No courses authored yet"
                  description="Start creating your first interactive software engineering or system design masterclass."
                  actionText="Create New Course"
                  onAction={() => navigate("/courses/new")}
                />
              ) : (
                <div className="rounded-2xl border border-glass-border bg-bg-panel overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-glass-border/60 bg-bg-darker text-[10px] font-mono font-bold text-text-muted uppercase tracking-wider">
                          <th className="p-4">Course Title & Category</th>
                          <th className="p-4">Units</th>
                          <th className="p-4">Price</th>
                          <th className="p-4">Learners</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Authoring Controls</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-glass-border/40 text-xs">
                        {courses.map((c) => (
                          <tr key={c._id} className="hover:bg-glass-border/30 transition">
                            <td className="p-4">
                              <div className="space-y-1">
                                <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                  {typeof c.category === "object" ? c.category?.name : c.category || "General"}
                                </span>
                                <h4 className="font-bold text-text-title">{c.title}</h4>
                              </div>
                            </td>
                            <td className="p-4 font-mono font-semibold text-text-main">
                              {c.units?.length || 0} Units
                            </td>
                            <td className="p-4 font-mono font-bold text-text-title">
                              ₹{c.price || 999}
                            </td>
                            <td className="p-4 font-mono text-cyan-400 font-bold">
                              {c.enrolledStudents?.length || c.enrollmentCount || 0} Enrolled
                            </td>
                            <td className="p-4">
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <CheckCircle size={10} /> {c.status || "published"}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  onClick={() => navigate(`/courses/${c._id}/manage`)}
                                  className="text-[11px] py-1.5 px-3 bg-btn-primary hover:bg-btn-primary-hover text-white font-bold flex items-center gap-1"
                                >
                                  <Layers size={12} /> Manage Syllabus
                                </Button>
                                <Button
                                  onClick={() => navigate(`/courses/edit/${c._id}`)}
                                  variant="secondary"
                                  className="text-[11px] py-1.5 px-2.5 border-glass-border"
                                >
                                  <Edit size={12} /> Edit Metadata
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: RESOURCES INVENTORY */}
          {activeTab === "resources" && (
            <div className="space-y-4">
              {resources.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No resources uploaded"
                  description="Upload downloadable blueprints, code cheatsheets, and architectural PDFs."
                  actionText="Upload Resource"
                  onAction={() => navigate("/resources/new")}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resources.map((res) => (
                    <div key={res._id} className="p-5 rounded-2xl bg-glass-card border border-glass-border space-y-3 text-left">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          {typeof res.category === "object" ? res.category?.name : res.category || "Resource"}
                        </span>
                        <Button
                          onClick={() => navigate(`/resources/edit/${res._id}`)}
                          variant="secondary"
                          className="text-[10px] py-1 px-2 border-glass-border"
                        >
                          <Edit size={12} /> Edit
                        </Button>
                      </div>
                      <h4 className="text-xs font-bold text-text-title line-clamp-1">{res.title}</h4>
                      <p className="text-[11px] text-text-muted line-clamp-2">{res.description}</p>
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

export default CreatorDashboard;
