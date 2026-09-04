import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import LoadingSkeleton from "../../components/dashboard/LoadingSkeleton";
import EmptyState from "../../components/dashboard/EmptyState";
import ErrorState from "../../components/dashboard/ErrorState";
import SpotlightCard from "../../components/SpotlightCard";
import Button from "../../components/Button";

import { getMyCourses, deleteCourse } from "../../services/courseService";
import { getMyResources, deleteResource, publishResource, archiveResource } from "../../services/resourceService";
import { getMyEarnings } from "../../services/paymentService";

import {
  BookOpen,
  FileText,
  Users,
  PlusCircle,
  TrendingUp,
  Layers,
  Edit,
  Trash2,
  Eye,
  Settings,
  CheckCircle,
  Archive,
  ArrowRight,
  DollarSign
} from "lucide-react";

const CreatorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [courses, setCourses] = useState([]);
  const [resources, setResources] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [coursesRes, resourcesRes, earningsRes] = await Promise.allSettled([
        getMyCourses(),
        getMyResources(),
        getMyEarnings(),
      ]);

      if (coursesRes.status === "fulfilled" && coursesRes.value?.courses) {
        setCourses(coursesRes.value.courses);
      }
      if (resourcesRes.status === "fulfilled" && resourcesRes.value?.resources) {
        setResources(resourcesRes.value.resources);
      }
      if (earningsRes.status === "fulfilled" && earningsRes.value?.data) {
        setTotalEarnings(earningsRes.value.data.earnings || 0);
      }
    } catch (err) {
      console.error("Error fetching creator dashboard data:", err);
      setError(err.message || "Failed to load creator statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteCourse = async (id) => {
    if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      try {
        await deleteCourse(id);
        setCourses((prev) => prev.filter((c) => c._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete course.");
      }
    }
  };

  const handleDeleteResource = async (id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        await deleteResource(id);
        setResources((prev) => prev.filter((r) => r._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete resource.");
      }
    }
  };

  const handlePublishResource = async (id) => {
    try {
      await publishResource(id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to publish resource.");
    }
  };

  const handleArchiveResource = async (id) => {
    try {
      await archiveResource(id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to archive resource.");
    }
  };

  // Real Stats Calculations
  const totalCourses = courses.length;
  const publishedCourses = courses.filter((c) => c.status === "published").length;
  const draftCourses = courses.filter((c) => c.status === "draft" || !c.status).length;
  const archivedCourses = courses.filter((c) => c.status === "archived").length;

  const totalEnrolledLearners = courses.reduce(
    (sum, c) => sum + (c.enrolledStudents?.length || 0),
    0
  );

  const totalResources = resources.length;

  return (
    <DashboardLayout
      title={`Creator Control Center — ${user?.name || "Creator"}`}
      subtitle="Publish masterclasses, release developer tools, and manage enrolled learners."
      actions={
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate("/courses/new")} className="text-xs py-2 px-3 bg-accent-purple hover:bg-purple-600 flex items-center gap-1.5">
            <PlusCircle size={14} /> Create Course
          </Button>
          <Button onClick={() => navigate("/resources/new")} className="text-xs py-2 px-3 bg-accent-cyan hover:bg-cyan-600 flex items-center gap-1.5">
            <PlusCircle size={14} /> Create Resource
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
          {/* STATS OVERVIEW GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Income"
              value={`₹${totalEarnings.toLocaleString("en-IN")}`}
              subtext="Total course sales revenue"
              icon={DollarSign}
              color="emerald"
            />
            <StatCard
              title="Total Courses"
              value={totalCourses}
              subtext={`${publishedCourses} live / ${draftCourses} draft`}
              icon={BookOpen}
              color="purple"
            />
            <StatCard
              title="Enrolled Learners"
              value={totalEnrolledLearners}
              subtext="Across all courses"
              icon={Users}
              color="blue"
            />
            <StatCard
              title="Total Resources"
              value={totalResources}
              subtext="Uploaded guides & tools"
              icon={FileText}
              color="cyan"
            />
          </div>

          {/* DASHBOARD TAB SUB-NAV */}
          <div className="flex items-center space-x-2 border-b border-glass-border/40 pb-2">
            {[
              { id: "overview", label: "Overview" },
              { id: "courses", label: `Course Catalog (${totalCourses})` },
              { id: "resources", label: `Uploaded Resources (${totalResources})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition duration-150 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-accent-purple text-white shadow-md shadow-purple-900/30"
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
              {/* Recent Courses */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-text-title uppercase tracking-wider flex items-center gap-2">
                    <BookOpen size={16} className="text-accent-purple" /> Recent Masterclasses
                  </h3>
                  <button onClick={() => setActiveTab("courses")} className="text-xs font-bold text-accent-purple hover:underline cursor-pointer">
                    View All ({totalCourses})
                  </button>
                </div>

                {courses.length === 0 ? (
                  <EmptyState
                    icon={BookOpen}
                    title="No courses created yet"
                    description="Build your first course module with interactive units and rich resources."
                    actionText="Create Course Now"
                    onAction={() => navigate("/courses/new")}
                    glowColor="rgba(168, 85, 247, 0.08)"
                  />
                ) : (
                  <div className="space-y-4">
                    {courses.slice(0, 4).map((course) => (
                      <SpotlightCard key={course._id} className="p-5 bg-glass-card border border-glass-border rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          {course.thumbnail ? (
                            <img src={course.thumbnail} alt={course.title} className="h-16 w-24 object-cover rounded-xl border border-glass-border shrink-0" />
                          ) : (
                            <div className="h-16 w-24 rounded-xl bg-bg-dark border border-glass-border flex items-center justify-center text-text-muted shrink-0">
                              <BookOpen size={24} />
                            </div>
                          )}
                          <div className="space-y-1 text-left">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-accent-purple/10 text-accent-purple border border-accent-purple/20">
                                {course.category?.name || "Uncategorized"}
                              </span>
                              <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                                course.status === "published" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              }`}>
                                {course.status || "draft"}
                              </span>
                            </div>
                            <h4 className="text-sm font-extrabold text-text-title line-clamp-1">{course.title}</h4>
                            <p className="text-[10px] text-text-muted">
                              {course.units?.length || 0} Units • {course.enrolledStudents?.length || 0} Learners enrolled
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 border-glass-border/30 pt-3 sm:pt-0">
                          <button onClick={() => navigate(`/courses/${course._id}`)} className="p-2 border border-glass-border hover:bg-glass-border rounded-lg text-text-muted hover:text-text-title transition cursor-pointer" title="View">
                            <Eye size={14} />
                          </button>
                          <button onClick={() => navigate(`/courses/edit/${course._id}`)} className="p-2 border border-accent-blue/30 bg-accent-blue/10 text-accent-blue rounded-lg transition cursor-pointer" title="Edit">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => navigate(`/courses/${course._id}/manage`)} className="p-2 border border-accent-purple/30 bg-accent-purple/10 text-accent-purple rounded-lg transition cursor-pointer" title="Manage Units">
                            <Settings size={14} />
                          </button>
                          <button onClick={() => handleDeleteCourse(course._id)} className="p-2 border border-rose-500/30 bg-rose-500/10 text-rose-400 rounded-lg transition cursor-pointer" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </SpotlightCard>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions & Recent Resources */}
              <div className="lg:col-span-4 space-y-6">
                <SpotlightCard className="p-5 card-tint-mint border border-glass-border rounded-2xl" glowColor="rgba(16, 185, 129, 0.12)">
                  <h4 className="text-xs font-bold text-text-title uppercase tracking-widest border-b border-glass-border/40 pb-3 mb-4">
                    Quick Creator Tools
                  </h4>
                  <div className="space-y-2.5">
                    <Button onClick={() => navigate("/courses/new")} className="w-full text-xs py-2 px-3 justify-start gap-2 bg-glass-card hover:bg-glass-border">
                      <PlusCircle size={14} className="text-accent-purple" />
                      Create New Course
                    </Button>
                    <Button onClick={() => navigate("/resources/new")} className="w-full text-xs py-2 px-3 justify-start gap-2 bg-glass-card hover:bg-glass-border">
                      <PlusCircle size={14} className="text-accent-cyan" />
                      Upload Resource Package
                    </Button>
                    <Button onClick={() => navigate("/my-courses")} className="w-full text-xs py-2 px-3 justify-start gap-2 bg-glass-card hover:bg-glass-border">
                      <BookOpen size={14} className="text-accent-blue" />
                      Manage All Courses
                    </Button>
                    <Button onClick={() => navigate("/my-resources")} className="w-full text-xs py-2 px-3 justify-start gap-2 bg-glass-card hover:bg-glass-border">
                      <FileText size={14} className="text-accent-emerald" />
                      Manage All Resources
                    </Button>
                  </div>
                </SpotlightCard>
              </div>
            </div>
          )}

          {/* COURSES TAB */}
          {activeTab === "courses" && (
            <div className="space-y-6">
              {courses.length === 0 ? (
                <EmptyState
                  icon={BookOpen}
                  title="No courses created"
                  description="You have not published or drafted any courses yet."
                  actionText="Create Course"
                  onAction={() => navigate("/courses/new")}
                />
              ) : (
                <div className="overflow-x-auto border border-glass-border rounded-2xl bg-glass-card">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-glass-border bg-bg-darker/60 font-bold uppercase text-[10px] tracking-wider text-text-muted">
                        <th className="px-6 py-4">Course</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Units</th>
                        <th className="px-6 py-4">Learners</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-glass-border/30">
                      {courses.map((course) => (
                        <tr key={course._id} className="hover:bg-glass-border/20 transition duration-150">
                          <td className="px-6 py-4">
                            <h4 className="font-bold text-text-title">{course.title}</h4>
                            <p className="text-[10px] text-text-muted">Created {new Date(course.createdAt).toLocaleDateString()}</p>
                          </td>
                          <td className="px-6 py-4 text-accent-purple font-semibold">
                            {course.category?.name || "Uncategorized"}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                              course.status === "published" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            }`}>
                              {course.status || "draft"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-text-main font-bold">{course.units?.length || 0}</td>
                          <td className="px-6 py-4 text-text-main font-bold">{course.enrolledStudents?.length || 0}</td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button onClick={() => navigate(`/courses/${course._id}`)} className="text-[10px] border border-glass-border hover:bg-glass-border px-2.5 py-1 rounded font-bold uppercase transition cursor-pointer">
                              View
                            </button>
                            <button onClick={() => navigate(`/courses/edit/${course._id}`)} className="text-[10px] border border-accent-blue/30 bg-accent-blue/5 text-accent-blue px-2.5 py-1 rounded font-bold uppercase transition cursor-pointer">
                              Edit
                            </button>
                            <button onClick={() => navigate(`/courses/${course._id}/manage`)} className="text-[10px] border border-accent-purple/30 bg-accent-purple/5 text-accent-purple px-2.5 py-1 rounded font-bold uppercase transition cursor-pointer">
                              Units
                            </button>
                            <button onClick={() => handleDeleteCourse(course._id)} className="text-[10px] border border-rose-500/30 bg-rose-500/5 text-rose-400 px-2.5 py-1 rounded font-bold uppercase transition cursor-pointer">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                  description="Share deployment guides, code snippets, or reference documents with the community."
                  actionText="Upload Resource"
                  onAction={() => navigate("/resources/new")}
                  glowColor="rgba(6, 182, 212, 0.08)"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resources.map((res) => (
                    <SpotlightCard key={res._id} className="p-5 bg-glass-card border border-glass-border rounded-2xl space-y-4 text-left" glowColor="rgba(6, 182, 212, 0.08)">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
                            {res.category?.name || "Resource"}
                          </span>
                          <h4 className="text-sm font-extrabold text-text-title mt-2 line-clamp-1">{res.title}</h4>
                        </div>
                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                          res.status === "published" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}>
                          {res.status}
                        </span>
                      </div>

                      <p className="text-xs text-text-muted line-clamp-2">{res.description || "No description provided."}</p>

                      <div className="text-[10px] text-text-muted space-y-0.5">
                        <div>📄 {res.documents?.length || 0} Documents uploaded</div>
                        <div>🔗 {res.links?.length || 0} Reference links</div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-glass-border/30 text-right space-x-1">
                        <button onClick={() => navigate(`/resources/${res._id}`)} className="text-[10px] border border-glass-border hover:bg-glass-border px-2 py-1 rounded font-bold uppercase transition cursor-pointer">
                          View
                        </button>
                        <button onClick={() => navigate(`/resources/edit/${res._id}`)} className="text-[10px] border border-accent-blue/30 bg-accent-blue/5 text-accent-blue px-2 py-1 rounded font-bold uppercase transition cursor-pointer">
                          Edit
                        </button>
                        {res.status !== "published" && (
                          <button onClick={() => handlePublishResource(res._id)} className="text-[10px] border border-emerald-500/30 text-emerald-400 px-2 py-1 rounded font-bold uppercase transition cursor-pointer">
                            Publish
                          </button>
                        )}
                        {res.status !== "archived" && (
                          <button onClick={() => handleArchiveResource(res._id)} className="text-[10px] border border-amber-500/30 text-amber-400 px-2 py-1 rounded font-bold uppercase transition cursor-pointer">
                            Archive
                          </button>
                        )}
                        <button onClick={() => handleDeleteResource(res._id)} className="text-[10px] border border-rose-500/30 text-rose-400 px-2 py-1 rounded font-bold uppercase transition cursor-pointer">
                          Delete
                        </button>
                      </div>
                    </SpotlightCard>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default CreatorDashboard;
