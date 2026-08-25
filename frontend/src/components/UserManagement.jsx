import React, { useState } from "react";
import {
  Search,
  Users,
  CheckCircle,
  AlertCircle,
  X,
  Shield,
  User as UserIcon,
  Trash2,
  Edit2,
  Eye,
  Globe,
  Info,
  BookOpen,
  Briefcase,
  TrendingUp
} from "lucide-react";
import SpotlightCard from "./SpotlightCard";

// Brand icons defined inline since lucide-react version lacks them
const LinkedinIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
    style={{ width: props.size || 24, height: props.size || 24 }}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
    style={{ width: props.size || 24, height: props.size || 24 }}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
    style={{ width: props.size || 24, height: props.size || 24 }}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);
import Button from "./Button";
import { updateUser, deleteUser, getUserById } from "../services/adminApi";

const UserManagement = ({ users, loadingUsers, fetchUsers }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [verifiedFilter, setVerifiedFilter] = useState("all");

  const [toastMessage, setToastMessage] = useState("");

  const [viewUserModal, setViewUserModal] = useState(null);
  const [loadingViewUser, setLoadingViewUser] = useState(false);
  const [editUserModal, setEditUserModal] = useState(null);
  const [loadingEditUser, setLoadingEditUser] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editProfilePicture, setEditProfilePicture] = useState("");
  const [editIsVerified, setEditIsVerified] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [editSkills, setEditSkills] = useState("");
  const [editInterests, setEditInterests] = useState("");
  const [editLearningGoals, setEditLearningGoals] = useState("");
  const [editEducation, setEditEducation] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editHeadline, setEditHeadline] = useState("");
  const [editExpertise, setEditExpertise] = useState("");
  const [editExperience, setEditExperience] = useState(0);
  const [editWebsite, setEditWebsite] = useState("");
  const [editQualifications, setEditQualifications] = useState("");
  const [editLanguages, setEditLanguages] = useState("");
  const [editHourlyRate, setEditHourlyRate] = useState(0);
  const [editIsAvailable, setEditIsAvailable] = useState(true);
  const [editDepartment, setEditDepartment] = useState("");
  const [editPermissions, setEditPermissions] = useState("");
  const [editLinkedin, setEditLinkedin] = useState("");
  const [editGithub, setEditGithub] = useState("");
  const [editTwitter, setEditTwitter] = useState("");
  const [editWebsiteLink, setEditWebsiteLink] = useState("");

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const getRoleColors = (roleName) => {
    switch (roleName) {
      case "admin":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:bg-accent-purple/10 dark:text-accent-purple dark:border-accent-purple/20";
      case "expert":
        return "bg-pink-500/10 text-pink-600 border-pink-500/20 dark:bg-accent-pink/10 dark:text-accent-pink dark:border-accent-pink/20";
      case "creator":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-accent-emerald/10 dark:text-accent-emerald dark:border-accent-emerald/20";
      default:
        return "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-accent-blue/10 dark:text-accent-blue dark:border-accent-blue/20";
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user and all associated profiles? This cannot be undone.")) {
      try {
        const res = await deleteUser(id);
        if (res && res.success) {
          triggerToast("User successfully deleted.");
          fetchUsers();
        }
      } catch (err) {
        triggerToast(err.response?.data?.message || "Failed to delete user.");
      }
    }
  };

  const handleOpenViewUser = async (id) => {
    try {
      setLoadingViewUser(true);
      const res = await getUserById(id);
      if (res && res.success) {
        setViewUserModal(res.profile);
      } else {
        setViewUserModal(null);
      }
    } catch (err) {
      setViewUserModal(null);
      triggerToast("Failed to retrieve user profile information.");
    } finally {
      setLoadingViewUser(false);
    }
  };

  const handleOpenEditUser = async (id) => {
    try {
      setLoadingEditUser(true);
      const res = await getUserById(id);
      if (res && res.success) {
        const p = res.profile;
        setEditUserModal(p);

        setEditName(p.user?.name || "");
        setEditRole(p.user?.role || "");
        setEditProfilePicture(p.user?.profilePicture || "");
        setEditIsVerified(p.user?.isVerified || false);
        setEditBio(p.bio || "");
        setEditSkills(Array.isArray(p.skills) ? p.skills.join(", ") : "");
        setEditInterests(Array.isArray(p.interests) ? p.interests.join(", ") : "");
        setEditLearningGoals(Array.isArray(p.learningGoals) ? p.learningGoals.join(", ") : "");
        setEditEducation(p.education || "");
        setEditLocation(p.location || "");
        setEditHeadline(p.headline || "");
        setEditExpertise(Array.isArray(p.expertise) ? p.expertise.join(", ") : "");
        setEditExperience(p.experience || 0);
        setEditWebsite(p.website || "");
        setEditQualifications(Array.isArray(p.qualifications) ? p.qualifications.join(", ") : "");
        setEditLanguages(Array.isArray(p.languages) ? p.languages.join(", ") : "");
        setEditHourlyRate(p.hourlyRate || 0);
        setEditIsAvailable(p.isAvailable !== undefined ? p.isAvailable : true);
        setEditDepartment(p.department || "");
        setEditPermissions(Array.isArray(p.permissions) ? p.permissions.join(", ") : "");
        setEditLinkedin(p.socialLinks?.linkedin || "");
        setEditGithub(p.socialLinks?.github || "");
        setEditTwitter(p.socialLinks?.twitter || "");
        setEditWebsiteLink(p.socialLinks?.website || "");
      }
    } catch (err) {
      triggerToast("Failed to load edit form.");
    } finally {
      setLoadingEditUser(false);
    }
  };

  const handleUpdateUserSubmit = async (e) => {
    e.preventDefault();
    if (!editUserModal) return;

    try {
      setSubmitting(true);
      const splitArray = (str) =>
        str ? str.split(",").map((s) => s.trim()).filter((s) => s.length > 0) : [];

      const baseSocials = {
        linkedin: editLinkedin.trim(),
        github: editGithub.trim()
      };

      let payload = {
        name: editName.trim(),
        role: editRole,
        profilePicture: editProfilePicture.trim(),
        isVerified: editIsVerified
      };

      if (editRole === "learner") {
        Object.assign(payload, {
          bio: editBio.trim(),
          skills: splitArray(editSkills),
          interests: splitArray(editInterests),
          learningGoals: splitArray(editLearningGoals),
          education: editEducation.trim(),
          location: editLocation.trim(),
          socialLinks: {
            ...baseSocials,
            website: editWebsiteLink.trim()
          }
        });
      } else if (editRole === "creator") {
        Object.assign(payload, {
          headline: editHeadline.trim(),
          bio: editBio.trim(),
          skills: splitArray(editSkills),
          expertise: splitArray(editExpertise),
          experience: Number(editExperience),
          education: editEducation.trim(),
          website: editWebsite.trim(),
          socialLinks: {
            ...baseSocials,
            twitter: editTwitter.trim()
          }
        });
      } else if (editRole === "expert") {
        Object.assign(payload, {
          headline: editHeadline.trim(),
          bio: editBio.trim(),
          expertise: splitArray(editExpertise),
          skills: splitArray(editSkills),
          experience: Number(editExperience),
          qualifications: splitArray(editQualifications),
          languages: splitArray(editLanguages),
          hourlyRate: Number(editHourlyRate),
          isAvailable: editIsAvailable,
          socialLinks: {
            ...baseSocials,
            website: editWebsiteLink.trim()
          }
        });
      } else if (editRole === "admin") {
        Object.assign(payload, {
          department: editDepartment.trim(),
          permissions: splitArray(editPermissions)
        });
      }

      const res = await updateUser(editUserModal.user?._id || editUserModal.user, payload);
      if (res && res.success) {
        triggerToast("User configuration saved successfully!");
        setEditUserModal(null);
        fetchUsers();
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || "Failed to update user.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered lists
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesVerified =
      verifiedFilter === "all" ||
      (verifiedFilter === "verified" && u.isVerified) ||
      (verifiedFilter === "unverified" && !u.isVerified);
    return matchesSearch && matchesRole && matchesVerified;
  });

  return (
    <div className="space-y-6 text-left relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-bg-panel border border-accent-blue/30 bg-bg-darker/95 px-5 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-300">
          <Info className="text-accent-blue shrink-0 animate-pulse" size={18} />
          <p className="text-xs font-semibold text-text-title">{toastMessage}</p>
        </div>
      )}

      <div className="border-b border-glass-border/40 pb-5">
        <h1 className="text-2xl font-extrabold text-text-title">User Management</h1>
        <p className="text-xs text-text-muted font-semibold mt-1">
          View profiles, edit roles, toggle verifications, and delete accounts.
        </p>
      </div>

      {/* Filter and Search controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-bg-darker border border-glass-border p-4 rounded-2xl">
        <div className="md:col-span-6 relative">
          <input
            type="text"
            placeholder="Search users by name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full form-input text-xs rounded-xl pl-9 pr-4 py-2.5 bg-bg-dark border-glass-border text-text-title focus:border-accent-emerald/50 focus:outline-none"
          />
          <Search size={14} className="absolute left-3 top-3.5 text-text-muted" />
        </div>
        <div className="md:col-span-3 text-xs">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full form-input rounded-xl p-2.5 bg-bg-dark cursor-pointer text-text-title border-glass-border focus:border-accent-emerald/50"
          >
            <option value="all">All Roles</option>
            <option value="learner">Learners</option>
            <option value="creator">Creators</option>
            <option value="expert">Experts</option>
            <option value="admin">Admins</option>
          </select>
        </div>
        <div className="md:col-span-3 text-xs">
          <select
            value={verifiedFilter}
            onChange={(e) => setVerifiedFilter(e.target.value)}
            className="w-full form-input rounded-xl p-2.5 bg-bg-dark cursor-pointer text-text-title border-glass-border focus:border-accent-emerald/50"
          >
            <option value="all">All Statuses</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Unverified Only</option>
          </select>
        </div>
      </div>

      {/* Users list table */}
      <SpotlightCard className="p-0 bg-glass-card border border-glass-border rounded-2xl overflow-hidden" glowColor="rgba(16, 185, 129, 0.05)">
        {loadingUsers ? (
          <div className="text-center py-20 text-xs text-text-muted flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-accent-emerald"></div>
            Loading user database...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20 text-xs text-text-muted">
            No user accounts matched the filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs text-left">
              <thead>
                <tr className="border-b border-glass-border bg-bg-darker/60 font-bold uppercase text-[10px] tracking-wider text-text-muted">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Verification</th>
                  <th className="px-6 py-4">Joined At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border/30">
                {filteredUsers.map((item) => (
                  <tr key={item._id} className="hover:bg-accent-purple/5 dark:hover:bg-glass-border/20 transition duration-150">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg overflow-hidden shrink-0 border border-glass-border bg-bg-dark">
                        {item.profilePicture ? (
                          <img src={item.profilePicture} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center font-bold text-[10px] bg-bg-panel text-text-title">
                            {item.name[0]}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-text-title leading-tight">{item.name}</h4>
                        <p className="text-[10px] text-text-muted mt-0.5">{item.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[9px] border px-2 py-0.5 rounded font-bold uppercase tracking-wider ${getRoleColors(item.role)}`}>
                        {item.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {item.isVerified ? (
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:bg-accent-cyan/15 dark:text-accent-cyan dark:border-accent-cyan/25 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                          Verified
                        </span>
                      ) : (
                        <span className="text-[9px] bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:bg-glass-border dark:text-text-muted dark:border-glass-border/50 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 shrink-0">
                      <button onClick={() => handleOpenViewUser(item._id)} className="text-[10px] border border-glass-border hover:bg-glass-border hover:text-text-title px-2.5 py-1 rounded-md font-bold uppercase tracking-wider transition cursor-pointer active:scale-95">
                        View
                      </button>
                      <button onClick={() => handleOpenEditUser(item._id)} className="text-[10px] border border-accent-blue/20 bg-accent-blue/5 text-accent-blue hover:bg-accent-blue hover:text-white px-2.5 py-1 rounded-md font-bold uppercase tracking-wider transition cursor-pointer active:scale-95">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteUser(item._id)} className="text-[10px] border border-rose-500/25 bg-rose-500/5 text-rose-400 hover:bg-rose-500 hover:text-white px-2.5 py-1 rounded-md font-bold uppercase tracking-wider transition cursor-pointer active:scale-95">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SpotlightCard>

      {/* VIEW USER DETAIL MODAL */}
      {viewUserModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <SpotlightCard className="w-full max-w-2xl bg-gradient-to-br from-[#faf7ff] to-[#f5f3ff] dark:from-[#15172F] dark:to-[#0F1026] border border-glass-border/70 p-6 sm:p-8 rounded-2xl text-left shadow-[0_20px_50px_rgba(124, 58, 237, 0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]" glowColor="rgba(124, 58, 237, 0.12)">
            <div className="flex items-center justify-between border-b border-glass-border/30 pb-3.5 mb-5">
              <h3 className="text-xs font-bold text-text-title uppercase tracking-widest flex items-center gap-2">
                <UserIcon size={14} className="text-accent-emerald" /> User Account Details
              </h3>
              <button onClick={() => setViewUserModal(null)} className="text-text-muted hover:text-rose-400 transition cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* View Profile Layout */}
            <div className="space-y-6 text-xs max-h-[70vh] overflow-y-auto pr-1">
              {/* Header Profile Section */}
              <div className="flex items-center gap-4.5 bg-bg-darker/60 p-4 border border-glass-border rounded-xl">
                <div className="h-14 w-14 rounded-xl overflow-hidden border border-glass-border bg-bg-dark">
                  {viewUserModal.user?.profilePicture ? (
                    <img src={viewUserModal.user.profilePicture} alt={viewUserModal.user.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center font-bold text-lg bg-bg-panel text-text-title uppercase">
                      {viewUserModal.user?.name ? viewUserModal.user.name[0] : ""}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-text-title">{viewUserModal.user?.name}</h4>
                  <p className="text-text-muted font-semibold">{viewUserModal.user?.email}</p>
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className={`text-[8px] border px-2 py-0.2 rounded font-bold uppercase tracking-wider ${getRoleColors(viewUserModal.user?.role)}`}>
                      {viewUserModal.user?.role}
                    </span>
                    {viewUserModal.user?.isVerified ? (
                      <span className="text-[8px] bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/25 px-2 py-0.2 rounded font-bold uppercase tracking-wider">
                        Verified
                      </span>
                    ) : (
                      <span className="text-[8px] bg-glass-border text-text-muted dark:border-glass-border/50 px-2 py-0.2 rounded font-bold uppercase tracking-wider">
                        Unverified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio block */}
              {viewUserModal.bio && (
                <div className="space-y-1 bg-bg-darker/30 p-4 border border-glass-border rounded-xl">
                  <h4 className="font-bold text-text-muted uppercase text-[9px] tracking-wider mb-1">Biography</h4>
                  <p className="text-text-main leading-relaxed whitespace-pre-wrap">{viewUserModal.bio}</p>
                </div>
              )}

              {/* Core attributes grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {viewUserModal.user?.role !== "admin" && (
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-text-muted uppercase text-[9px] tracking-wider">Education</h4>
                    <p className="bg-bg-darker/30 p-3 border border-glass-border rounded-xl text-text-title font-semibold">
                      {viewUserModal.education || <span className="italic text-text-muted font-normal">Not provided</span>}
                    </p>
                  </div>
                )}
                {viewUserModal.user?.role !== "admin" && (
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-text-muted uppercase text-[9px] tracking-wider">Location</h4>
                    <p className="bg-bg-darker/30 p-3 border border-glass-border rounded-xl text-text-title font-semibold">
                      {viewUserModal.location || <span className="italic text-text-muted font-normal">Not provided</span>}
                    </p>
                  </div>
                )}
                {viewUserModal.headline && (
                  <div className="space-y-1.5 sm:col-span-2">
                    <h4 className="font-bold text-text-muted uppercase text-[9px] tracking-wider">Headline / Role Description</h4>
                    <p className="bg-bg-darker/30 p-3 border border-glass-border rounded-xl text-text-title font-semibold leading-relaxed">
                      {viewUserModal.headline}
                    </p>
                  </div>
                )}
              </div>

              {/* Tag lists */}
              <div className="space-y-4">
                {viewUserModal.skills && viewUserModal.skills.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-text-muted uppercase text-[9px] tracking-wider">Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {viewUserModal.skills.map((s, idx) => (
                        <span key={idx} className="bg-glass-border px-2.5 py-1 rounded text-[10px] font-semibold text-text-main border border-glass-border/30">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {viewUserModal.interests && viewUserModal.interests.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-text-muted uppercase text-[9px] tracking-wider">Interests</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {viewUserModal.interests.map((s, idx) => (
                        <span key={idx} className="bg-glass-border px-2.5 py-1 rounded text-[10px] font-semibold text-text-main border border-glass-border/30">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {viewUserModal.learningGoals && viewUserModal.learningGoals.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-text-muted uppercase text-[9px] tracking-wider">Learning Goals</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {viewUserModal.learningGoals.map((s, idx) => (
                        <span key={idx} className="bg-glass-border px-2.5 py-1 rounded text-[10px] font-semibold text-text-main border border-glass-border/30">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {viewUserModal.expertise && viewUserModal.expertise.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-text-muted uppercase text-[9px] tracking-wider">Areas of Expertise</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {viewUserModal.expertise.map((s, idx) => (
                        <span key={idx} className="bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20 px-2.5 py-1 rounded text-[10px] font-semibold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Expert specific metrics */}
              {viewUserModal.user?.role === "expert" && (
                <div className="grid grid-cols-2 gap-4 bg-bg-darker/30 p-4 border border-glass-border rounded-xl">
                  <div>
                    <h5 className="font-bold text-text-muted uppercase text-[8px] tracking-wider mb-1">Hourly Consultation Rate</h5>
                    <p className="text-sm font-extrabold text-accent-orange">${viewUserModal.hourlyRate || 0} / hr</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-text-muted uppercase text-[8px] tracking-wider mb-1">Availability Status</h5>
                    <span className={`text-[10px] font-bold ${viewUserModal.isAvailable ? "text-accent-emerald" : "text-rose-400"}`}>
                      {viewUserModal.isAvailable ? "Available for Schedulers" : "Temporarily Unavailable"}
                    </span>
                  </div>
                </div>
              )}

              {/* Admin specific metrics */}
              {viewUserModal.user?.role === "admin" && (
                <div className="grid grid-cols-2 gap-4 bg-bg-darker/30 p-4 border border-glass-border rounded-xl">
                  <div>
                    <h5 className="font-bold text-text-muted uppercase text-[8px] tracking-wider mb-1">Department</h5>
                    <p className="text-xs font-bold text-text-title">{viewUserModal.department || "General Operations"}</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-text-muted uppercase text-[8px] tracking-wider mb-1">System Permissions</h5>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {viewUserModal.permissions?.map((p, idx) => (
                        <span key={idx} className="bg-glass-border px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold">
                          {p}
                        </span>
                      )) || <span className="italic text-text-muted font-normal">None</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* Social links */}
              {viewUserModal.user?.role !== "admin" && (
                <div className="pt-4 border-t border-glass-border/30">
                  <h4 className="font-bold text-text-muted uppercase text-[10px] tracking-wider mb-2.5">Social Directories</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-[11px]">
                    {viewUserModal.socialLinks?.linkedin && (
                      <div className="flex items-center gap-2.5 text-accent-blue font-semibold">
                        <LinkedinIcon size={13} className="shrink-0" />
                        <a href={viewUserModal.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline font-mono text-[10px] truncate max-w-[200px]">
                          {viewUserModal.socialLinks.linkedin}
                        </a>
                      </div>
                    )}
                    {viewUserModal.socialLinks?.github && (
                      <div className="flex items-center gap-2.5 text-text-title dark:text-white font-semibold">
                        <GithubIcon size={13} className="shrink-0 text-text-title dark:text-white" />
                        <a href={viewUserModal.socialLinks.github} target="_blank" rel="noopener noreferrer" className="hover:underline font-mono text-[10px] text-text-main truncate max-w-[200px]">
                          {viewUserModal.socialLinks.github}
                        </a>
                      </div>
                    )}
                    {viewUserModal.socialLinks?.twitter && (
                      <div className="flex items-center gap-2.5 text-accent-cyan font-semibold">
                        <TwitterIcon size={13} className="shrink-0" />
                        <a href={viewUserModal.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:underline font-mono text-[10px] truncate max-w-[200px]">
                          {viewUserModal.socialLinks.twitter}
                        </a>
                      </div>
                    )}
                    {viewUserModal.socialLinks?.website && (
                      <div className="flex items-center gap-2.5 text-accent-purple font-semibold">
                        <Globe size={13} className="shrink-0" />
                        <a href={viewUserModal.socialLinks.website} target="_blank" rel="noopener noreferrer" className="hover:underline font-mono text-[10px] truncate max-w-[200px]">
                          {viewUserModal.socialLinks.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </SpotlightCard>
        </div>
      )}

      {/* EDIT USER DETAILS MODAL */}
      {editUserModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <SpotlightCard className="w-full max-w-2xl bg-bg-panel border border-glass-border/70 p-6 sm:p-8 rounded-2xl text-left shadow-2xl overflow-hidden" glowColor="rgba(124, 58, 237, 0.12)">
            <div className="flex items-center justify-between border-b border-glass-border/30 pb-3.5 mb-5">
              <h3 className="text-xs font-bold text-text-title uppercase tracking-widest flex items-center gap-2">
                <Edit2 size={14} className="text-accent-blue" /> Edit User Configuration
              </h3>
              <button onClick={() => setEditUserModal(null)} className="text-text-muted hover:text-rose-400 transition cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateUserSubmit} className="space-y-4 text-xs max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-text-muted uppercase">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full form-input rounded-xl p-3 bg-bg-dark border-glass-border text-text-title focus:border-accent-blue/50 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-text-muted uppercase">Account Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full form-input rounded-xl p-3 bg-bg-dark border-glass-border text-text-title focus:border-accent-blue/50 cursor-pointer"
                  >
                    <option value="learner">Learner</option>
                    <option value="creator">Creator</option>
                    <option value="expert">Expert</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-text-muted uppercase">Avatar Image URL</label>
                  <input
                    type="text"
                    value={editProfilePicture}
                    onChange={(e) => setEditProfilePicture(e.target.value)}
                    className="w-full form-input rounded-xl p-3 bg-bg-dark border-glass-border text-text-title focus:border-accent-blue/50 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="editIsVerified"
                    checked={editIsVerified}
                    onChange={(e) => setEditIsVerified(e.target.checked)}
                    className="h-4 w-4 bg-bg-dark border-glass-border rounded text-accent-blue focus:ring-accent-blue cursor-pointer"
                  />
                  <label htmlFor="editIsVerified" className="font-bold text-text-title uppercase cursor-pointer">
                    Verified User Account
                  </label>
                </div>
              </div>

              {/* Dynamic Profiles fields based on selected role */}
              {editRole !== "admin" && (
                <div className="pt-4 border-t border-glass-border/30 space-y-4">
                  <h4 className="font-bold text-text-muted uppercase text-[9px] tracking-wider mb-2">Dynamic Profile Metadata</h4>
                  
                  <div className="space-y-1">
                    <label className="font-bold text-text-muted uppercase">Biography</label>
                    <textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      rows={3}
                      className="w-full form-input rounded-xl p-3 bg-bg-dark border-glass-border text-text-title focus:border-accent-blue/50 focus:outline-none leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-text-muted uppercase">Education</label>
                      <input
                        type="text"
                        value={editEducation}
                        onChange={(e) => setEditEducation(e.target.value)}
                        className="w-full form-input rounded-xl p-3 bg-bg-dark border-glass-border text-text-title focus:border-accent-blue/50 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-text-muted uppercase">Location</label>
                      <input
                        type="text"
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        className="w-full form-input rounded-xl p-3 bg-bg-dark border-glass-border text-text-title focus:border-accent-blue/50 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Role specific forms */}
              {editRole === "learner" && (
                <div className="space-y-4 pt-4 border-t border-glass-border/30">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-text-muted uppercase">Skills (comma separated)</label>
                      <input
                        type="text"
                        value={editSkills}
                        onChange={(e) => setEditSkills(e.target.value)}
                        className="w-full form-input rounded-xl p-3 bg-bg-dark border-glass-border text-text-title focus:border-accent-blue/50 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-text-muted uppercase">Interests (comma separated)</label>
                      <input
                        type="text"
                        value={editInterests}
                        onChange={(e) => setEditInterests(e.target.value)}
                        className="w-full form-input rounded-xl p-3 bg-bg-dark border-glass-border text-text-title focus:border-accent-blue/50 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-text-muted uppercase">Learning Goals (comma separated)</label>
                      <input
                        type="text"
                        value={editLearningGoals}
                        onChange={(e) => setEditLearningGoals(e.target.value)}
                        className="w-full form-input rounded-xl p-3 bg-bg-dark border-glass-border text-text-title focus:border-accent-blue/50 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {editRole === "creator" && (
                <div className="space-y-4 pt-4 border-t border-glass-border/30">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-bold text-text-muted uppercase">Headline</label>
                      <input
                        type="text"
                        value={editHeadline}
                        onChange={(e) => setEditHeadline(e.target.value)}
                        className="w-full form-input rounded-xl p-3 bg-bg-dark border-glass-border text-text-title focus:border-accent-blue/50 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-text-muted uppercase">Experience (years)</label>
                      <input
                        type="number"
                        value={editExperience}
                        onChange={(e) => setEditExperience(e.target.value)}
                        className="w-full form-input rounded-xl p-3 bg-bg-dark border-glass-border text-text-title focus:border-accent-blue/50 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-text-muted uppercase">Portfolio Website URL</label>
                      <input
                        type="text"
                        value={editWebsite}
                        onChange={(e) => setEditWebsite(e.target.value)}
                        className="w-full form-input rounded-xl p-3 bg-bg-dark border-glass-border text-text-title focus:border-accent-blue/50 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-text-muted uppercase">Core Skills (comma separated)</label>
                      <input
                        type="text"
                        value={editSkills}
                        onChange={(e) => setEditSkills(e.target.value)}
                        className="w-full form-input rounded-xl p-3 bg-bg-dark border-glass-border text-text-title focus:border-accent-blue/50 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-text-muted uppercase">Expertise domains (comma separated)</label>
                      <input
                        type="text"
                        value={editExpertise}
                        onChange={(e) => setEditExpertise(e.target.value)}
                        className="w-full form-input rounded-xl p-3 bg-bg-dark border-glass-border text-text-title focus:border-accent-blue/50 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {editRole === "expert" && (
                <div className="space-y-4 pt-4 border-t border-glass-border/30">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-bold text-text-muted uppercase">Headline</label>
                      <input
                        type="text"
                        value={editHeadline}
                        onChange={(e) => setEditHeadline(e.target.value)}
                        className="w-full form-input rounded-xl p-3 bg-bg-dark border-glass-border text-text-title focus:border-accent-blue/50 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-text-muted uppercase">Experience (years)</label>
                      <input
                        type="number"
                        value={editExperience}
                        onChange={(e) => setEditExperience(e.target.value)}
                        className="w-full form-input rounded-xl p-3 bg-bg-dark border-glass-border text-text-title focus:border-accent-blue/50 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-text-muted uppercase">Consultation Price ($ per hour)</label>
                      <input
                        type="number"
                        value={editHourlyRate}
                        onChange={(e) => setEditHourlyRate(e.target.value)}
                        className="w-full form-input rounded-xl p-3 bg-bg-dark border-glass-border text-text-title focus:border-accent-blue/50 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-text-muted uppercase">Qualifications (comma separated)</label>
                      <input
                        type="text"
                        value={editQualifications}
                        onChange={(e) => setEditQualifications(e.target.value)}
                        className="w-full form-input rounded-xl p-3 bg-bg-dark border-glass-border text-text-title focus:border-accent-blue/50 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-text-muted uppercase">Spoken Languages (comma separated)</label>
                      <input
                        type="text"
                        value={editLanguages}
                        onChange={(e) => setEditLanguages(e.target.value)}
                        className="w-full form-input rounded-xl p-3 bg-bg-dark border-glass-border text-text-title focus:border-accent-blue/50 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-text-muted uppercase">Core Skills (comma separated)</label>
                      <input
                        type="text"
                        value={editSkills}
                        onChange={(e) => setEditSkills(e.target.value)}
                        className="w-full form-input rounded-xl p-3 bg-bg-dark border-glass-border text-text-title focus:border-accent-blue/50 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-text-muted uppercase">Expertise domains (comma separated)</label>
                      <input
                        type="text"
                        value={editExpertise}
                        onChange={(e) => setEditExpertise(e.target.value)}
                        className="w-full form-input rounded-xl p-3 bg-bg-dark border-glass-border text-text-title focus:border-accent-blue/50 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-5">
                      <input
                        type="checkbox"
                        id="editIsAvailable"
                        checked={editIsAvailable}
                        onChange={(e) => setEditIsAvailable(e.target.checked)}
                        className="h-4 w-4 bg-bg-dark border-glass-border rounded text-accent-blue focus:ring-accent-blue cursor-pointer"
                      />
                      <label htmlFor="editIsAvailable" className="font-bold text-text-title uppercase cursor-pointer">
                        Available for Consultations
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {editRole === "admin" && (
                <div className="space-y-4 pt-4 border-t border-glass-border/30">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-text-muted uppercase">Operations Department</label>
                      <input
                        type="text"
                        value={editDepartment}
                        onChange={(e) => setEditDepartment(e.target.value)}
                        className="w-full form-input rounded-xl p-3 bg-bg-dark border-glass-border text-text-title focus:border-accent-blue/50 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-text-muted uppercase">Access Permissions (comma separated)</label>
                      <input
                        type="text"
                        value={editPermissions}
                        onChange={(e) => setEditPermissions(e.target.value)}
                        className="w-full form-input rounded-xl p-3 bg-bg-dark border-glass-border text-text-title focus:border-accent-blue/50 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Social URLs editing */}
              {editRole !== "admin" && (
                <div className="space-y-4 pt-4 border-t border-glass-border/30">
                  <h4 className="font-bold text-text-muted uppercase text-[9px] tracking-wider mb-2">Social Network Directories</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-text-muted uppercase text-[8px] tracking-wider">LinkedIn Profile URL</label>
                      <input
                        type="text"
                        value={editLinkedin}
                        onChange={(e) => setEditLinkedin(e.target.value)}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full form-input rounded-xl p-3 bg-bg-dark border-glass-border text-text-title focus:border-accent-blue/50 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-text-muted uppercase text-[8px] tracking-wider">GitHub Username URL</label>
                      <input
                        type="text"
                        value={editGithub}
                        onChange={(e) => setEditGithub(e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full form-input rounded-xl p-3 bg-bg-dark border-glass-border text-text-title focus:border-accent-blue/50 focus:outline-none font-mono"
                      />
                    </div>

                    {editRole === "creator" && (
                      <div className="space-y-1">
                        <label className="font-bold text-text-muted uppercase text-[8px] tracking-wider">Twitter Handler URL</label>
                        <input
                          type="text"
                          value={editTwitter}
                          onChange={(e) => setEditTwitter(e.target.value)}
                          placeholder="https://twitter.com/..."
                          className="w-full form-input rounded-xl p-3 bg-bg-dark border-glass-border text-text-title focus:border-accent-blue/50 focus:outline-none font-mono"
                        />
                      </div>
                    )}

                    {editRole !== "creator" && (
                      <div className="space-y-1">
                        <label className="font-bold text-text-muted uppercase text-[8px] tracking-wider">Personal Website Link</label>
                        <input
                          type="text"
                          value={editWebsiteLink}
                          onChange={(e) => setEditWebsiteLink(e.target.value)}
                          placeholder="https://mywebsite.com"
                          className="w-full form-input rounded-xl p-3 bg-bg-dark border-glass-border text-text-title focus:border-accent-blue/50 focus:outline-none font-mono"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Form buttons */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-glass-border/30">
                <Button type="button" variant="secondary" onClick={() => setEditUserModal(null)} disabled={submitting}>
                  Cancel Settings
                </Button>
                <Button type="submit" loading={submitting}>
                  {submitting ? "Saving..." : "Save Diagnostics Configuration"}
                </Button>
              </div>
            </form>
          </SpotlightCard>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
