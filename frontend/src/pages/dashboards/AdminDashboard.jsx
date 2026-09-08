import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import LoadingSkeleton from "../../components/dashboard/LoadingSkeleton";
import EmptyState from "../../components/dashboard/EmptyState";
import ErrorState from "../../components/dashboard/ErrorState";
import SpotlightCard from "../../components/SpotlightCard";
import Button from "../../components/Button";
import UserManagement from "../../components/UserManagement";
import Categories from "../Categories";
import ReportsManagement from "../admin/ReportsManagement";

import { getAllUsers } from "../../services/adminApi";
import { getAllCourses, deleteCourse } from "../../services/courseService";
import { getAllResourcesAdmin, deleteResource, publishResource, archiveResource } from "../../services/resourceService";
import { getCategories } from "../../services/categoryService";

import {
  Shield,
  Users,
  BookOpen,
  FileText,
  Layers,
  Award,
  BarChart3,
  TrendingUp,
  Search,
  CheckCircle,
  Archive,
  Trash2,
  Eye,
  PlusCircle,
  AlertCircle
} from "lucide-react";
import adminImg from "../../assets/images/roles/admin.jpg";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);

  const [activeTab, setActiveTab] = useState(() => {
    return searchParams.get("tab") || "overview";
  });

  const [resourceSearchQuery, setResourceSearchQuery] = useState("");
  const [resourceStatusFilter, setResourceStatusFilter] = useState("all");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersRes, coursesRes, resourcesRes, categoriesRes] = await Promise.allSettled([
        getAllUsers(),
        getAllCourses(),
        getAllResourcesAdmin(),
        getCategories(),
      ]);

      if (usersRes.status === "fulfilled" && usersRes.value?.users) {
        setUsers(usersRes.value.users);
      }
      if (coursesRes.status === "fulfilled" && coursesRes.value?.courses) {
        setCourses(coursesRes.value.courses);
      }
      if (resourcesRes.status === "fulfilled" && resourcesRes.value?.resources) {
        setResources(resourcesRes.value.resources);
      }
      if (categoriesRes.status === "fulfilled" && categoriesRes.value?.categories) {
        setCategories(categoriesRes.value.categories);
      }
    } catch (err) {
      console.error("Error loading admin dashboard data:", err);
      setError(err.message || "Failed to load platform administration metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteCourse = async (id) => {
    if (window.confirm("Admin Warning: Delete this course permanently?")) {
      try {
        await deleteCourse(id);
        setCourses((prev) => prev.filter((c) => c._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete course.");
      }
    }
  };

  const handleDeleteResource = async (id) => {
    if (window.confirm("Admin Warning: Delete this resource permanently?")) {
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

  // Real statistics derived from database
  const totalUsers = users.length;
  const statLearners = users.filter((u) => u.role === "learner").length;
  const statCreators = users.filter((u) => u.role === "creator").length;
  const statExperts = users.filter((u) => u.role === "expert").length;

  const totalCourses = courses.length;
  const totalResources = resources.length;
  const totalCategories = categories.length;

  const totalEnrollments = courses.reduce(
    (sum, c) => sum + (c.enrolledStudents?.length || 0),
    0
  );

  const filteredAdminResources = resources.filter((r) => {
    const matchesSearch =
      r.title?.toLowerCase().includes(resourceSearchQuery.toLowerCase()) ||
      (r.createdBy?.name || "").toLowerCase().includes(resourceSearchQuery.toLowerCase());
    const matchesStatus = resourceStatusFilter === "all" || r.status === resourceStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout
      title="Platform System Administration"
      subtitle="Complete platform overview, account controls, and content moderation."
      actions={
        <Button onClick={fetchData} className="text-xs py-2 px-4 bg-accent-emerald hover:bg-emerald-600 flex items-center gap-1.5">
          <Shield size={14} /> Refresh Diagnostics
        </Button>
      }
    >
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : (
        <div className="space-y-6 text-left">
          {/* ENTERPRISE ADMIN OPERATIONS CONSOLE */}
          <div className="relative overflow-hidden rounded-3xl glass-panel-futuristic border border-white/15 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
            {/* Top Accent Gradient Bar */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-[11px] font-mono font-semibold">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                    </span>
                    <span>PLATFORM DIAGNOSTICS OPERATIONAL</span>
                  </span>
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-800/60 border border-white/10 text-slate-300 text-[10px] font-mono">
                    <span>Admin Controls Active</span>
                  </span>
                </div>

                <h1 className="hero-heading text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  System Health & Moderation Console.
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium max-w-xl">
                  Manage user directory permissions, moderate reported platform content, audit transactions, and manage platform taxonomy.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setActiveTab("moderation")}
                  className="btn-futuristic-primary px-5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center space-x-2 shadow-lg cursor-pointer active:scale-95 transition-all"
                >
                  <Shield size={15} />
                  <span>Moderation Queue</span>
                </button>
              </div>
            </div>
          </div>

          {/* HIGH-DENSITY ENTERPRISE ADMIN METRICS STRIP */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl glass-panel-futuristic border border-white/15 bg-slate-900/70 hover:border-emerald-400/40 transition duration-300 backdrop-blur-xl space-y-1.5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">User Directory</span>
                <Users size={16} className="text-emerald-400" />
              </div>
              <div className="text-2xl font-extrabold text-white font-mono">{totalUsers}</div>
              <p className="text-[10px] text-slate-400 font-medium">{statLearners} Learners • {statCreators} Creators • {statExperts} Experts</p>
            </div>

            <div className="p-5 rounded-2xl glass-panel-futuristic border border-white/15 bg-slate-900/70 hover:border-purple-400/40 transition duration-300 backdrop-blur-xl space-y-1.5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Catalog Masterclasses</span>
                <BookOpen size={16} className="text-purple-400" />
              </div>
              <div className="text-2xl font-extrabold text-white">{totalCourses}</div>
              <p className="text-[10px] text-slate-400 font-medium">{totalEnrollments} student enrollments</p>
            </div>

            <div className="p-5 rounded-2xl glass-panel-futuristic border border-white/15 bg-slate-900/70 hover:border-cyan-400/40 transition duration-300 backdrop-blur-xl space-y-1.5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Technical Resources</span>
                <FileText size={16} className="text-cyan-400" />
              </div>
              <div className="text-2xl font-extrabold text-cyan-300 font-mono">{totalResources}</div>
              <p className="text-[10px] text-slate-400 font-medium">Platform resource units</p>
            </div>

            <div className="p-5 rounded-2xl glass-panel-futuristic border border-white/15 bg-slate-900/70 hover:border-amber-400/40 transition duration-300 backdrop-blur-xl space-y-1.5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Taxonomy Categories</span>
                <Layers size={16} className="text-amber-400" />
              </div>
              <div className="text-2xl font-extrabold text-white">{totalCategories}</div>
              <p className="text-[10px] text-slate-400 font-medium">Active tags</p>
            </div>
          </div>

          {/* DASHBOARD TAB SUB-NAV */}
          <div className="flex items-center space-x-2 border-b border-white/10 pb-2 overflow-x-auto">
            {[
              { id: "overview", label: "Analytics & System Health" },
              { id: "users", label: `User Directory (${totalUsers})` },
              { id: "courses", label: `Course Catalog (${totalCourses})` },
              { id: "content", label: `Resource Units (${totalResources})` },
              { id: "categories", label: `Taxonomy (${totalCategories})` },
              { id: "moderation", label: "Moderation Queue" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition duration-150 whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/40 border border-emerald-500/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* HIGH-PERFORMANCE ANALYTICS & SYSTEM OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Analytics Section (Span 8) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* User Role Distribution Telemetry */}
                <div className="p-6 rounded-3xl glass-panel-futuristic border border-white/15 bg-slate-900/70 backdrop-blur-2xl space-y-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center space-x-2">
                      <BarChart3 size={16} className="text-emerald-400" />
                      <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        Platform User Demographics Telemetry
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {totalUsers} Accounts Total
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-blue-400 uppercase">Learners</span>
                      <div className="text-2xl font-black text-white font-mono">{statLearners}</div>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {totalUsers > 0 ? Math.round((statLearners / totalUsers) * 100) : 0}% of platform
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">Creators</span>
                      <div className="text-2xl font-black text-white font-mono">{statCreators}</div>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {totalUsers > 0 ? Math.round((statCreators / totalUsers) * 100) : 0}% of platform
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-pink-400 uppercase">Experts</span>
                      <div className="text-2xl font-black text-white font-mono">{statExperts}</div>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {totalUsers > 0 ? Math.round((statExperts / totalUsers) * 100) : 0}% of platform
                      </p>
                    </div>
                  </div>

                  {/* Multi-Color Percentage Visual Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>ROLE DISTRIBUTION BREAKDOWN</span>
                      <span>100% ACCOUNT POOL</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-950 border border-white/10 overflow-hidden flex">
                      <div
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${totalUsers > 0 ? (statLearners / totalUsers) * 100 : 0}%` }}
                        title="Learners"
                      />
                      <div
                        className="h-full bg-purple-500 transition-all duration-500"
                        style={{ width: `${totalUsers > 0 ? (statCreators / totalUsers) * 100 : 0}%` }}
                        title="Creators"
                      />
                      <div
                        className="h-full bg-pink-500 transition-all duration-500"
                        style={{ width: `${totalUsers > 0 ? (statExperts / totalUsers) * 100 : 0}%` }}
                        title="Experts"
                      />
                    </div>
                  </div>
                </div>

                {/* Content & Ecosystem Analytics */}
                <div className="p-6 rounded-3xl glass-panel-futuristic border border-white/15 bg-slate-900/70 backdrop-blur-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center space-x-2">
                      <TrendingUp size={16} className="text-cyan-400" />
                      <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        Ecosystem Throughput Analytics
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400">Real-time DB Telemetry</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Avg Enrollments / Course</span>
                      <div className="text-xl font-bold text-white font-mono">
                        {totalCourses > 0 ? (totalEnrollments / totalCourses).toFixed(1) : 0}
                      </div>
                      <p className="text-[10px] text-emerald-400">Active engagement rate</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Content Units per Category</span>
                      <div className="text-xl font-bold text-white font-mono">
                        {totalCategories > 0 ? ((totalCourses + totalResources) / totalCategories).toFixed(1) : 0}
                      </div>
                      <p className="text-[10px] text-cyan-400">Taxonomy density</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Quick Admin Actions & Operations (Span 4) */}
              <div className="lg:col-span-4 space-y-6">
                <div className="p-6 rounded-3xl glass-panel-futuristic border border-white/15 bg-slate-900/70 backdrop-blur-2xl space-y-4">
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
                    Administrative Command Suite
                  </h3>
                  <div className="space-y-2.5">
                    <button
                      onClick={() => setActiveTab("users")}
                      className="w-full text-xs font-semibold py-2.5 px-3.5 rounded-xl bg-slate-950/60 hover:bg-white/10 border border-white/10 text-white flex items-center justify-between transition cursor-pointer"
                    >
                      <span className="flex items-center space-x-2">
                        <Users size={14} className="text-emerald-400" />
                        <span>Manage User Directory</span>
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">{totalUsers}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("courses")}
                      className="w-full text-xs font-semibold py-2.5 px-3.5 rounded-xl bg-slate-950/60 hover:bg-white/10 border border-white/10 text-white flex items-center justify-between transition cursor-pointer"
                    >
                      <span className="flex items-center space-x-2">
                        <BookOpen size={14} className="text-purple-400" />
                        <span>Moderate Masterclasses</span>
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">{totalCourses}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("content")}
                      className="w-full text-xs font-semibold py-2.5 px-3.5 rounded-xl bg-slate-950/60 hover:bg-white/10 border border-white/10 text-white flex items-center justify-between transition cursor-pointer"
                    >
                      <span className="flex items-center space-x-2">
                        <FileText size={14} className="text-cyan-400" />
                        <span>Technical Resources</span>
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">{totalResources}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("moderation")}
                      className="w-full text-xs font-semibold py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-300 flex items-center justify-between transition cursor-pointer"
                    >
                      <span className="flex items-center space-x-2">
                        <Shield size={14} className="text-emerald-400" />
                        <span>Audit Reports Queue</span>
                      </span>
                      <span className="font-mono text-[10px] text-emerald-300">Active</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* USER MANAGEMENT TAB */}
          {activeTab === "users" && (
            <UserManagement users={users} loadingUsers={loading} fetchUsers={fetchData} />
          )}

          {/* COURSE CATALOG TAB */}
          {activeTab === "courses" && (
            <div className="space-y-6">
              <div className="overflow-x-auto rounded-3xl glass-panel-futuristic border border-white/15 bg-slate-900/70 backdrop-blur-2xl shadow-xl">
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead>
                    <tr className="border-b border-white/10 bg-slate-950/80 font-mono font-bold uppercase text-[10px] tracking-wider text-slate-400">
                      <th className="px-6 py-4">Course Unit</th>
                      <th className="px-6 py-4">Author</th>
                      <th className="px-6 py-4">Category Tag</th>
                      <th className="px-6 py-4">Status Telemetry</th>
                      <th className="px-6 py-4">Enrolled Students</th>
                      <th className="px-6 py-4 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-medium">
                    {courses.map((course) => (
                      <tr key={course._id} className="hover:bg-white/5 transition duration-150">
                        <td className="px-6 py-4 font-bold text-white">{course.title}</td>
                        <td className="px-6 py-4 text-slate-300">{course.creator?.name || "System"}</td>
                        <td className="px-6 py-4 text-purple-400 font-mono font-semibold">{course.category?.name || "Uncategorized"}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[9px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                            course.status === "published" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          }`}>
                            ● {course.status || "draft"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-cyan-300 font-mono font-bold">{course.enrolledStudents?.length || 0}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button onClick={() => navigate(`/courses/${course._id}`)} className="text-[10px] font-mono border border-white/10 hover:border-cyan-400/40 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl font-bold uppercase transition cursor-pointer active:scale-95">
                            Inspect
                          </button>
                          <button onClick={() => handleDeleteCourse(course._id)} className="text-[10px] font-mono border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 px-3 py-1.5 rounded-xl font-bold uppercase transition cursor-pointer active:scale-95">
                            Purge
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* RESOURCE CATALOG TAB */}
          {activeTab === "content" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center rounded-2xl glass-panel-futuristic border border-white/15 bg-slate-900/70 p-4 backdrop-blur-2xl">
                <div className="md:col-span-8 relative">
                  <input
                    type="text"
                    placeholder="Search technical packages by title, author..."
                    value={resourceSearchQuery}
                    onChange={(e) => setResourceSearchQuery(e.target.value)}
                    className="w-full form-input text-xs rounded-xl pl-9 pr-4 py-2.5 bg-slate-950/70 border-white/10 text-white placeholder-slate-500"
                  />
                  <Search size={14} className="absolute left-3 top-3.5 text-cyan-400" />
                </div>
                <div className="md:col-span-4 text-xs">
                  <select
                    value={resourceStatusFilter}
                    onChange={(e) => setResourceStatusFilter(e.target.value)}
                    className="w-full rounded-xl p-2.5 bg-slate-950/90 cursor-pointer text-white border border-white/10 outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="draft">Drafts</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto rounded-3xl glass-panel-futuristic border border-white/15 bg-slate-900/70 backdrop-blur-2xl shadow-xl">
                <table className="w-full border-collapse text-xs text-left font-sans">
                  <thead>
                    <tr className="border-b border-white/10 bg-slate-950/80 font-mono font-bold uppercase text-[10px] tracking-wider text-slate-400">
                      <th className="px-6 py-4">Resource Package</th>
                      <th className="px-6 py-4">Creator</th>
                      <th className="px-6 py-4">Status Telemetry</th>
                      <th className="px-6 py-4">Files Payload</th>
                      <th className="px-6 py-4 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-medium">
                    {filteredAdminResources.map((item) => (
                      <tr key={item._id} className="hover:bg-white/5 transition duration-150">
                        <td className="px-6 py-4 font-bold text-white">{item.title}</td>
                        <td className="px-6 py-4 text-slate-300">{item.createdBy?.name || "System"}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[9px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                            item.status === "published" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          }`}>
                            ● {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 font-mono">{item.documents?.length || 0} Docs</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button onClick={() => navigate(`/resources/${item._id}`)} className="text-[10px] font-mono border border-white/10 hover:border-cyan-400/40 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl font-bold uppercase cursor-pointer active:scale-95">
                            Inspect
                          </button>
                          {item.status !== "published" && (
                            <button onClick={() => handlePublishResource(item._id)} className="text-[10px] font-mono border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-3 py-1.5 rounded-xl font-bold uppercase cursor-pointer active:scale-95">
                              Publish
                            </button>
                          )}
                          {item.status !== "archived" && (
                            <button onClick={() => handleArchiveResource(item._id)} className="text-[10px] font-mono border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 px-3 py-1.5 rounded-xl font-bold uppercase cursor-pointer active:scale-95">
                              Archive
                            </button>
                          )}
                          <button onClick={() => handleDeleteResource(item._id)} className="text-[10px] font-mono border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 px-3 py-1.5 rounded-xl font-bold uppercase cursor-pointer active:scale-95">
                            Purge
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CATEGORIES TAB */}
          {activeTab === "categories" && <Categories />}

          {/* MODERATION QUEUE TAB */}
          {activeTab === "moderation" && <ReportsManagement />}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
