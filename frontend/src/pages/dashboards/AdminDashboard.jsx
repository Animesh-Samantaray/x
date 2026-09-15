import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSkeleton from "../../components/dashboard/LoadingSkeleton";
import EmptyState from "../../components/dashboard/EmptyState";
import ErrorState from "../../components/dashboard/ErrorState";
import Button from "../../components/Button";
import toast from "react-hot-toast";

import {
  getAllUsers,
  updateUser,
  deleteUser,
} from "../../services/adminApi";
import { getAllReportsAdmin } from "../../services/reportApi";
import { getCategories, createCategory } from "../../services/categoryService";
import { getAdminPayments } from "../../services/paymentService";

import {
  ShieldAlert,
  Users,
  BookOpen,
  FileText,
  CreditCard,
  Layers,
  Search,
  PlusCircle,
  Activity,
  DollarSign,
} from "lucide-react";

import { transformAdminAnalytics } from "../../utils/analyticsTransformer";
import { RealLineChart, RealDoughnutChart } from "../../components/dashboard/RealChart";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPlatformRevenue, setTotalPlatformRevenue] = useState(0);

  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [activeTab, setActiveTab] = useState(() => {
    return location.search.includes("tab=users") ? "users" : "overview";
  });

  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [creatingCat, setCreatingCat] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersRes, reportsRes, categoriesRes, paymentsRes] = await Promise.allSettled([
        getAllUsers(),
        getAllReportsAdmin(),
        getCategories(),
        getAdminPayments(),
      ]);

      if (usersRes.status === "fulfilled" && usersRes.value?.users) {
        setUsers(usersRes.value.users);
      }
      if (reportsRes.status === "fulfilled" && reportsRes.value?.reports) {
        setReports(reportsRes.value.reports);
      }
      if (categoriesRes.status === "fulfilled" && categoriesRes.value?.categories) {
        setCategories(categoriesRes.value.categories);
      }
      if (paymentsRes.status === "fulfilled" && paymentsRes.value?.data) {
        const paidPayments = paymentsRes.value.data.filter((p) => p.status === "Paid");
        const total = paidPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
        setTotalPlatformRevenue(total);
      }
    } catch (err) {
      console.error("Admin dashboard fetch error:", err);
      setError(err.message || "Failed to load admin operations data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await updateUser(userId, { role: newRole });
      if (res && res.success) {
        toast.success(`User role updated to ${newRole}`);
        setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      }
    } catch (err) {
      toast.error("Failed to update user role.");
    }
  };


  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      setCreatingCat(true);
      const res = await createCategory({ name: newCatName, description: newCatDesc });
      if (res && res.category) {
        toast.success("New category added!");
        setCategories((prev) => [res.category, ...prev]);
        setNewCatName("");
        setNewCatDesc("");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create category.");
    } finally {
      setCreatingCat(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesSearch =
      !userSearch.trim() ||
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const pendingReportsCount = reports.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-8 text-left">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-glass-border/60 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              ● PLATFORM OPERATIONS CENTER
            </span>
            <span className="text-xs text-text-muted font-mono">Admin: {user?.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-title tracking-tight font-display">
            Platform Operations & Moderation
          </h1>
          <p className="text-xs sm:text-sm text-text-muted font-medium">
            Manage user roles and directory permissions, resolve moderation queue reports, and oversee platform taxonomy.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            onClick={() => navigate("/admin/reports")}
            className="text-xs font-bold py-2.5 px-4 rounded-xl bg-btn-primary hover:bg-btn-primary-hover text-white flex items-center gap-2 shadow-lg"
          >
            <ShieldAlert size={15} /> Moderation Queue ({pendingReportsCount})
          </Button>
          <Button
            onClick={() => navigate("/admin/payments")}
            variant="secondary"
            className="text-xs font-bold py-2.5 px-4 rounded-xl border border-glass-border flex items-center gap-2"
          >
            <CreditCard size={15} className="text-amber-400" /> Payment Platform
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : (
        <div className="space-y-8">
          
          {/* PLATFORM METRICS TELEMETRY ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-glass-card border border-glass-border space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-text-muted">
                <span>TOTAL USERS</span>
                <Users size={14} className="text-cyan-500" />
              </div>
              <div className="text-2xl font-black text-text-title font-mono">{users.length} Accounts</div>
              <p className="text-[10px] text-text-muted">Registered platform accounts</p>
            </div>

            <div className="p-5 rounded-2xl bg-glass-card border border-glass-border space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-text-muted">
                <span>CATEGORIES</span>
                <Layers size={14} className="text-purple-500" />
              </div>
              <div className="text-2xl font-black text-purple-500 font-mono">{categories.length} Categories</div>
              <p className="text-[10px] text-text-muted">Taxonomy domains</p>
            </div>

            <div className="p-5 rounded-2xl bg-glass-card border border-glass-border space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-text-muted">
                <span>REPORTS QUEUE</span>
                <ShieldAlert size={14} className="text-amber-500" />
              </div>
              <div className="text-2xl font-black text-amber-500 font-mono">{pendingReportsCount} Pending</div>
              <p className="text-[10px] text-text-muted">Moderation queue reports</p>
            </div>

            <div className="p-5 rounded-2xl bg-glass-card border border-glass-border space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-text-muted">
                <span>TOTAL PLATFORM REVENUE</span>
                <DollarSign size={14} className="text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-emerald-500 font-mono">
                ₹{totalPlatformRevenue.toLocaleString()}
              </div>
              <p className="text-[10px] text-text-muted">Gross Platform Volume</p>
            </div>

          </div>

          {/* REAL ADMIN ANALYTICS PANEL (100% REAL DATA FROM CKM BACKEND DATABASE) */}
          {(() => {
            const adminData = transformAdminAnalytics(users, reports, categories);

            if (adminData.isEmpty) {
              return (
                <div className="p-8 rounded-3xl bg-glass-card border border-glass-border text-center space-y-3 shadow-sm">
                  <Activity size={28} className="text-amber-500 mx-auto opacity-70" />
                  <h3 className="text-sm font-bold font-mono text-text-title uppercase tracking-wider">No System Operational Analytics Recorded</h3>
                  <p className="text-xs text-text-muted max-w-md mx-auto">
                    Platform metrics and user registration growth trends will appear as user accounts are created and content reports are filed.
                  </p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* REAL METRICS ROW 1 */}
                <div className="lg:col-span-7 p-6 rounded-3xl bg-glass-card border border-glass-border shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-glass-border pb-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest block">USER REGISTRATION GROWTH</span>
                      <h3 className="text-base font-extrabold text-text-title">Monthly User Account Signups</h3>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                      Total: {adminData.totalUsers} Accounts
                    </span>
                  </div>
                  <RealLineChart data={adminData.userGrowthChartData} height={200} />
                </div>

                <div className="lg:col-span-5 p-6 rounded-3xl bg-glass-card border border-glass-border shadow-md flex flex-col justify-between space-y-4">
                  <div className="border-b border-glass-border pb-3 text-left">
                    <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest block">USER ROLES DISTRIBUTION</span>
                    <h3 className="text-sm font-extrabold text-text-title mt-0.5">{adminData.totalUsers} Registered Users</h3>
                  </div>
                  <RealDoughnutChart data={adminData.rolesChartData} height={180} />
                </div>

                {/* REAL METRICS ROW 2 */}
                <div className="lg:col-span-6 p-6 rounded-3xl bg-glass-card border border-glass-border shadow-md space-y-4">
                  <div className="flex justify-between items-center border-b border-glass-border pb-3">
                    <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest">MODERATION QUEUE REPORTS</span>
                    <span className="text-xs font-mono font-bold text-amber-500">{adminData.totalReports} Filed Reports</span>
                  </div>
                  <RealDoughnutChart data={adminData.reportsChartData} height={180} />
                </div>

                <div className="lg:col-span-6 p-6 rounded-3xl bg-glass-card border border-glass-border shadow-md space-y-4 text-left">
                  <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest block border-b border-glass-border pb-3">PLATFORM HEALTH SUMMARY</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 font-mono text-xs">
                    <div className="p-4 rounded-2xl bg-bg-dark/60 border border-glass-border">
                      <span className="text-[10px] text-text-muted uppercase block">Active User Accounts</span>
                      <span className="text-2xl font-black text-emerald-500 mt-1 block">{adminData.totalUsers} Total</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-bg-dark/60 border border-glass-border">
                      <span className="text-[10px] text-text-muted uppercase block">Pending Moderation</span>
                      <span className="text-2xl font-black text-amber-500 mt-1 block">{adminData.pendingReports} Reports</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-bg-dark/60 border border-glass-border">
                      <span className="text-[10px] text-text-muted uppercase block">Taxonomy Categories</span>
                      <span className="text-2xl font-black text-purple-500 mt-1 block">{adminData.categoriesCount} Domains</span>
                    </div>
                  </div>
                </div>

              </div>
            );
          })()}

          {/* SUB NAV TABS */}
          <div className="flex items-center gap-2 border-b border-glass-border/40 pb-2 overflow-x-auto">
            {[
              { id: "overview", label: "Operations Overview" },
              { id: "users", label: `User Directory (${users.length})` },
              { id: "moderation", label: `Moderation Queue (${reports.length})` },
              { id: "categories", label: `Categories (${categories.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow"
                    : "text-text-muted hover:text-text-title hover:bg-glass-border/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OPERATIONS OVERVIEW */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-6">
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-glass-border space-y-4">
                  <div className="flex items-center justify-between border-b border-glass-border/40 pb-3">
                    <h3 className="text-xs font-extrabold text-text-title uppercase tracking-widest font-display flex items-center gap-2">
                      <ShieldAlert size={16} className="text-amber-400" /> Moderation Reports Summary
                    </h3>
                    <button onClick={() => setActiveTab("moderation")} className="text-xs font-bold text-amber-400 hover:underline">
                      View All ({reports.length}) →
                    </button>
                  </div>

                  {reports.length === 0 ? (
                    <p className="text-xs text-text-muted py-4">No content reports filed.</p>
                  ) : (
                    <div className="space-y-3">
                      {reports.slice(0, 4).map((r) => (
                        <div key={r._id} className="p-3.5 rounded-xl bg-bg-darker border border-glass-border space-y-1.5 text-xs">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-text-title">Reason: {r.reason}</span>
                            <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              {r.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-text-muted">Target: {r.targetType || "Content Item"}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-glass-border space-y-4">
                  <h3 className="text-xs font-extrabold text-text-title uppercase tracking-widest font-display">
                    Quick Operations Actions
                  </h3>
                  <div className="space-y-2">
                    <Button onClick={() => setActiveTab("users")} className="w-full text-xs py-2.5 px-3 justify-start gap-2 bg-glass-card hover:bg-glass-border">
                      <Users size={14} className="text-cyan-400" /> Manage Platform User Directory
                    </Button>
                    <Button onClick={() => navigate("/admin/reports")} className="w-full text-xs py-2.5 px-3 justify-start gap-2 bg-glass-card hover:bg-glass-border">
                      <ShieldAlert size={14} className="text-amber-400" /> Open Moderation Center
                    </Button>
                    <Button onClick={() => navigate("/admin/payments")} className="w-full text-xs py-2.5 px-3 justify-start gap-2 bg-glass-card hover:bg-glass-border">
                      <CreditCard size={14} className="text-purple-400" /> View Financial Audit Logs
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USER DIRECTORY MASTER TABLE */}
          {activeTab === "users" && (
            <div className="space-y-4">
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-bg-panel border border-glass-border">
                <div className="flex items-center gap-2 w-full sm:w-80 bg-bg-darker border border-glass-border rounded-xl px-3 py-2">
                  <Search size={14} className="text-text-muted" />
                  <input
                    type="text"
                    placeholder="Filter by user name or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-text-title outline-none placeholder:text-text-muted"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                  {["all", "learner", "creator", "expert", "admin"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRoleFilter(r)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider transition cursor-pointer ${
                        roleFilter === r ? "bg-amber-500 text-white" : "bg-bg-darker text-text-muted hover:text-text-title border border-glass-border"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-glass-border bg-bg-panel overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-glass-border/60 bg-bg-darker text-[10px] font-mono font-bold text-text-muted uppercase tracking-wider">
                        <th className="p-4">User Identity</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Platform Role</th>
                        <th className="p-4">2FA Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-glass-border/40 text-xs">
                      {filteredUsers.map((u) => (
                        <tr key={u._id} className="hover:bg-glass-border/30 transition">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-cyan-500/10 text-cyan-400 font-bold flex items-center justify-center border border-cyan-500/20">
                                {u.name?.[0] || "U"}
                              </div>
                              <span className="font-bold text-text-title">{u.name}</span>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-text-muted">{u.email}</td>
                          <td className="p-4">
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u._id, e.target.value)}
                              className="bg-bg-darker border border-glass-border text-text-title font-mono text-[11px] font-bold px-2 py-1 rounded outline-none cursor-pointer"
                            >
                              <option value="learner">learner</option>
                              <option value="creator">creator</option>
                              <option value="expert">expert</option>
                              <option value="admin">admin</option>
                            </select>
                          </td>
                          <td className="p-4 font-mono">
                            {u.twoFactorEnabled ? (
                              <span className="text-emerald-400 font-bold">● Enabled</span>
                            ) : (
                              <span className="text-text-muted">Off</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: MODERATION QUEUE */}
          {activeTab === "moderation" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-bg-panel border border-glass-border flex justify-between items-center">
                <span className="text-xs font-bold text-text-title">Moderation Reports Queue</span>
                <Button onClick={() => navigate("/admin/reports")} className="text-xs py-1.5 px-3 bg-amber-500 hover:bg-amber-600 text-white font-bold">
                  Open Full Split-Pane Moderation
                </Button>
              </div>
              <div className="space-y-3">
                {reports.map((r) => (
                  <div key={r._id} className="p-4 rounded-2xl bg-glass-card border border-glass-border flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-text-title">Reason: {r.reason}</h4>
                      <p className="text-text-muted mt-0.5">Reporter: {r.reportedBy?.name || "Member"}</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CATEGORIES TAXONOMY EDITOR */}
          {activeTab === "categories" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-glass-border space-y-4 text-left">
                <h3 className="text-xs font-extrabold text-text-title uppercase tracking-widest font-display flex items-center gap-2">
                  <PlusCircle size={16} className="text-amber-400" /> Create Category
                </h3>
                <form onSubmit={handleCreateCategory} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-text-muted block mb-1">Category Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Distributed Systems"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-bg-darker border border-glass-border text-xs text-text-title outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-text-muted block mb-1">Description</label>
                    <textarea
                      placeholder="Brief category scope..."
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-bg-darker border border-glass-border text-xs text-text-title outline-none focus:border-amber-400 h-20 resize-none"
                    />
                  </div>
                  <Button
                    disabled={creatingCat}
                    type="submit"
                    className="w-full text-xs font-bold py-2.5 bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    {creatingCat ? "Creating..." : "Add Category"}
                  </Button>
                </form>
              </div>

              <div className="lg:col-span-7 space-y-3 text-left">
                <h3 className="text-xs font-extrabold text-text-title uppercase tracking-widest font-display">
                  System Categories ({categories.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <div key={cat._id} className="p-4 rounded-2xl bg-glass-card border border-glass-border space-y-1">
                      <h4 className="text-xs font-bold text-text-title">{cat.name}</h4>
                      <p className="text-[11px] text-text-muted">{cat.description || "No description."}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
