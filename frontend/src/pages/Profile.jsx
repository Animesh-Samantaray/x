import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getLearnerProfile, updateLearnerProfile } from "../services/learnerApi";
import { getCreatorProfile, updateCreatorProfile } from "../services/creatorApi";
import { getExpertProfile, updateExpertProfile } from "../services/expertApi";
import { getAdminProfile, updateAdminProfile } from "../services/adminApi";
import { update2FA } from "../services/authService";
import ReportDialog from "../components/reports/ReportDialog";
import { PageTransition, StaggerContainer, StaggerItem } from "../components/motion/MotionPrimitives";
import AchievementsSection from "../components/achievements/AchievementsSection";

import {
  Calendar,
  Mail,
  Shield,
  ShieldCheck,
  User as UserIcon,
  BookOpen,
  Edit2,
  Save,
  X,
  Link as LinkIcon,
  Globe,
  Flag,
  CheckCircle2,
  Sparkles,
  MapPin,
  GraduationCap,
  Award,
  Code2,
  Languages,
  DollarSign,
  Briefcase,
  Key,
  Info
} from "lucide-react";

// Branded SVGs
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
    style={{ width: props.size || 18, height: props.size || 18 }}
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
    style={{ width: props.size || 18, height: props.size || 18 }}
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
    style={{ width: props.size || 18, height: props.size || 18 }}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Profile = () => {
  const { user, getCurrentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled || false);
  const [updating2FA, setUpdating2FA] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setTwoFactorEnabled(!!user.twoFactorEnabled);
    }
  }, [user]);

  const handleToggle2FA = async (newVal) => {
    try {
      setUpdating2FA(true);
      const res = await update2FA(newVal);
      if (res && res.success) {
        setTwoFactorEnabled(res.twoFactorEnabled);
        await getCurrentUser();
        triggerToast(res.message || (newVal ? "Two-factor authentication enabled" : "Two-factor authentication disabled"));
      } else {
        triggerToast("Failed to update 2FA status.");
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || "Failed to update 2FA status.");
    } finally {
      setUpdating2FA(false);
    }
  };

  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [learningGoals, setLearningGoals] = useState("");
  const [education, setEducation] = useState("");
  const [location, setLocation] = useState("");
  const [headline, setHeadline] = useState("");
  const [expertise, setExpertise] = useState("");
  const [experience, setExperience] = useState(0);
  const [qualifications, setQualifications] = useState("");
  const [languages, setLanguages] = useState("");
  const [hourlyRate, setHourlyRate] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);
  const [website, setWebsite] = useState("");
  
  const [department, setDepartment] = useState("");
  const [permissions, setPermissions] = useState("");

  const [linkedinLink, setLinkedinLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [twitterLink, setTwitterLink] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");

  const role = user?.role || "learner";

  const syncProfileStates = (p) => {
    setProfile(p);
    setBio(p.bio || "");
    setSkills(Array.isArray(p.skills) ? p.skills.join(", ") : "");
    setInterests(Array.isArray(p.interests) ? p.interests.join(", ") : "");
    setLearningGoals(Array.isArray(p.learningGoals) ? p.learningGoals.join(", ") : "");
    setEducation(p.education || "");
    setLocation(p.location || "");
    setHeadline(p.headline || "");
    setExpertise(Array.isArray(p.expertise) ? p.expertise.join(", ") : "");
    setExperience(p.experience || 0);
    setQualifications(Array.isArray(p.qualifications) ? p.qualifications.join(", ") : "");
    setLanguages(Array.isArray(p.languages) ? p.languages.join(", ") : "");
    setHourlyRate(p.hourlyRate || 0);
    setIsAvailable(p.isAvailable !== undefined ? p.isAvailable : true);
    setWebsite(p.website || p.socialLinks?.website || "");
    
    setDepartment(p.department || "");
    setPermissions(Array.isArray(p.permissions) ? p.permissions.join(", ") : "");

    setLinkedinLink(p.socialLinks?.linkedin || "");
    setGithubLink(p.socialLinks?.github || "");
    setTwitterLink(p.socialLinks?.twitter || "");
    setWebsiteLink(p.socialLinks?.website || p.website || "");
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    if (profile) {
      syncProfileStates(profile);
    }
  };

  const loadProfile = async () => {
    try {
      setLoadingProfile(true);
      let res;
      if (role === "learner") {
        res = await getLearnerProfile();
      } else if (role === "creator") {
        res = await getCreatorProfile();
      } else if (role === "expert") {
        res = await getExpertProfile();
      } else if (role === "admin") {
        res = await getAdminProfile();
      }

      if (res && res.success && res.profile) {
        syncProfileStates(res.profile);
      }
    } catch (err) {
      console.error("Load profile details failed:", err);
      triggerToast("Failed to retrieve profile details.");
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [role]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const splitArray = (str) => 
        str ? str.split(",").map((s) => s.trim()).filter((s) => s.length > 0) : [];

      const baseSocials = {
        linkedin: linkedinLink.trim(),
        github: githubLink.trim()
      };

      let payload = {};
      if (role === "learner") {
        payload = {
          bio: bio.trim(),
          skills: splitArray(skills),
          interests: splitArray(interests),
          learningGoals: splitArray(learningGoals),
          education: education.trim(),
          location: location.trim(),
          socialLinks: {
            ...baseSocials,
            website: websiteLink.trim()
          }
        };
      } else if (role === "creator") {
        payload = {
          headline: headline.trim(),
          bio: bio.trim(),
          skills: splitArray(skills),
          expertise: splitArray(expertise),
          experience: Number(experience),
          education: education.trim(),
          website: website.trim(),
          socialLinks: {
            ...baseSocials,
            twitter: twitterLink.trim(),
            website: website.trim()
          }
        };
      } else if (role === "expert") {
        payload = {
          headline: headline.trim(),
          bio: bio.trim(),
          expertise: splitArray(expertise),
          skills: splitArray(skills),
          experience: Number(experience),
          qualifications: splitArray(qualifications),
          languages: splitArray(languages),
          hourlyRate: Number(hourlyRate),
          isAvailable,
          socialLinks: {
            ...baseSocials,
            website: websiteLink.trim()
          }
        };
      } else if (role === "admin") {
        payload = {
          department: department.trim(),
          permissions: splitArray(permissions)
        };
      }

      let res;
      if (role === "learner") {
        res = await updateLearnerProfile(payload);
      } else if (role === "creator") {
        res = await updateCreatorProfile(payload);
      } else if (role === "expert") {
        res = await updateExpertProfile(payload);
      } else if (role === "admin") {
        res = await updateAdminProfile(payload);
      }

      if (res && res.success) {
        syncProfileStates(res.profile);
        setEditMode(false);
        triggerToast("Profile successfully updated!");
      }
    } catch (err) {
      console.error("Save profile error:", err);
      triggerToast(err.response?.data?.message || "Failed to update profile details.");
    }
  };

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Recently Joined";

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="relative z-10 space-y-6 text-left">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 border border-cyan-500/40 bg-bg-panel px-5 py-4 rounded-2xl shadow-2xl">
            <Info className="text-cyan-500 shrink-0 animate-pulse" size={18} />
            <p className="text-xs font-semibold text-text-title">{toastMessage}</p>
          </div>
        )}

        {/* Dynamic Enterprise Header / Hero Container */}
        <div className="relative rounded-3xl bg-glass-card border border-glass-border p-6 sm:p-8 overflow-hidden shadow-md">
          {/* Top Multi-Color Gradient Banner Accent */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              
              {/* Avatar Pill with Live Status Indicator */}
              <div className="relative shrink-0">
                <div className="h-24 w-24 rounded-2xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 p-[1.5px] shadow-xl overflow-hidden">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} className="h-full w-full rounded-[14px] object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-bg-dark text-2xl font-black text-text-title uppercase font-display">
                      {user?.name ? user.name[0] : <UserIcon size={28} />}
                    </div>
                  )}
                </div>

                {/* Live Status Badge */}
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-bg-panel border border-glass-border">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </span>
              </div>

              {/* Core Account Details */}
              <div className="text-center sm:text-left space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-text-title font-display tracking-tight leading-none">
                    {user?.name || "Member"}
                  </h1>
                  
                  {/* Verified Badge */}
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-500 text-[10px] font-mono font-bold uppercase tracking-wider">
                    <CheckCircle2 size={12} className="text-cyan-500" />
                    <span>Verified {role}</span>
                  </span>
                </div>

                {headline && (
                  <p className="text-xs text-purple-500 font-medium">{headline}</p>
                )}
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-text-muted font-medium font-mono pt-1">
                  <div className="flex items-center gap-1.5">
                    <Mail size={13} className="text-cyan-500" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-purple-500" />
                    <span>Member since {formattedDate}</span>
                  </div>
                  {location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-pink-500" />
                      <span>{location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Trigger Buttons */}
            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => setEditMode(!editMode)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-btn-primary hover:bg-btn-primary-hover text-white flex items-center space-x-2 shadow-md cursor-pointer active:scale-95 transition-all"
              >
                {editMode ? <X size={14} /> : <Edit2 size={14} />}
                <span>{editMode ? "Cancel Editing" : "Edit Profile"}</span>
              </button>

              <button
                type="button"
                onClick={() => setReportDialogOpen(true)}
                className="px-3 py-2.5 rounded-xl text-xs font-bold border border-rose-500/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition cursor-pointer flex items-center space-x-1.5 active:scale-95"
              >
                <Flag size={13} />
                <span>Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Edit Mode Form */}
        {editMode ? (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-glass-card border border-glass-border space-y-6 shadow-md">
              <div className="flex items-center justify-between border-b border-glass-border pb-4">
                <h3 className="text-sm font-bold text-text-title font-mono uppercase tracking-wider flex items-center space-x-2">
                  <Edit2 size={16} className="text-cyan-500" />
                  <span>Edit Account & Professional Credentials</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                {role !== "admin" && (
                  <>
                    <div className="sm:col-span-2 space-y-2">
                      <label className="font-mono text-[11px] font-bold text-text-muted uppercase">Professional Biography</label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell the community about your background, experience, and projects..."
                        rows={4}
                        className="w-full text-xs rounded-xl p-3 bg-bg-darker text-text-title border border-glass-border focus:border-purple-500 outline-none"
                      />
                    </div>

                    {(role === "creator" || role === "expert") && (
                      <div className="space-y-2">
                        <label className="font-mono text-[11px] font-bold text-text-muted uppercase">Headline Title</label>
                        <input
                          type="text"
                          value={headline}
                          onChange={(e) => setHeadline(e.target.value)}
                          placeholder="e.g. Senior Full-Stack Engineer"
                          className="w-full text-xs rounded-xl p-3 bg-bg-darker text-text-title border border-glass-border focus:border-purple-500 outline-none"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="font-mono text-[11px] font-bold text-text-muted uppercase">Tech Stack & Skills (Comma-separated)</label>
                      <input
                        type="text"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        placeholder="e.g. React, Node.js, TypeScript, Docker"
                        className="w-full text-xs rounded-xl p-3 bg-bg-darker text-text-title border border-glass-border focus:border-purple-500 outline-none"
                      />
                    </div>

                    {role === "learner" && (
                      <>
                        <div className="space-y-2">
                          <label className="font-mono text-[11px] font-bold text-text-muted uppercase">Focus Interests (Comma-separated)</label>
                          <input
                            type="text"
                            value={interests}
                            onChange={(e) => setInterests(e.target.value)}
                            placeholder="e.g. System Design, Distributed Systems"
                            className="w-full text-xs rounded-xl p-3 bg-bg-darker text-text-title border border-glass-border focus:border-purple-500 outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-mono text-[11px] font-bold text-text-muted uppercase">Learning Goals (Comma-separated)</label>
                          <input
                            type="text"
                            value={learningGoals}
                            onChange={(e) => setLearningGoals(e.target.value)}
                            placeholder="e.g. Master Microservices, Deploy Next.js App"
                            className="w-full text-xs rounded-xl p-3 bg-bg-darker text-text-title border border-glass-border focus:border-purple-500 outline-none"
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <label className="font-mono text-[11px] font-bold text-text-muted uppercase">Education & Credentials</label>
                      <input
                        type="text"
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        placeholder="e.g. B.S. Computer Science"
                        className="w-full text-xs rounded-xl p-3 bg-bg-darker text-text-title border border-glass-border focus:border-purple-500 outline-none"
                      />
                    </div>

                    {role === "learner" && (
                      <div className="space-y-2">
                        <label className="font-mono text-[11px] font-bold text-text-muted uppercase">Location</label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. San Francisco, CA"
                          className="w-full text-xs rounded-xl p-3 bg-bg-darker text-text-title border border-glass-border focus:border-purple-500 outline-none"
                        />
                      </div>
                    )}

                    {/* Social Links Form Inputs */}
                    <div className="sm:col-span-2 border-t border-glass-border pt-4 mt-2">
                      <h4 className="font-mono font-bold text-text-title uppercase text-xs mb-3">Connected Developer Profiles</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-text-muted text-[11px]">LinkedIn URL</label>
                          <input
                            type="text"
                            value={linkedinLink}
                            onChange={(e) => setLinkedinLink(e.target.value)}
                            placeholder="https://linkedin.com/in/username"
                            className="w-full text-xs rounded-xl p-3 bg-bg-darker text-text-title border border-glass-border focus:border-purple-500 outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-text-muted text-[11px]">GitHub URL</label>
                          <input
                            type="text"
                            value={githubLink}
                            onChange={(e) => setGithubLink(e.target.value)}
                            placeholder="https://github.com/username"
                            className="w-full text-xs rounded-xl p-3 bg-bg-darker text-text-title border border-glass-border focus:border-purple-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-glass-border">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-text-muted hover:text-text-title bg-bg-darker border border-glass-border transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-btn-primary hover:bg-btn-primary-hover text-white flex items-center space-x-2 shadow-md cursor-pointer active:scale-95"
                >
                  <Save size={14} />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Enterprise Bento Display Grid */
          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Bento Column (Span 4) */}
            <StaggerItem className="lg:col-span-4 space-y-6">
              
              {/* Bio Card */}
              <div className="p-6 rounded-3xl bg-glass-card border border-glass-border space-y-3 shadow-sm hover:border-purple-500/40 transition">
                <div className="flex items-center space-x-2 border-b border-glass-border pb-3">
                  <UserIcon size={16} className="text-purple-500" />
                  <h3 className="text-xs font-mono font-bold text-text-title uppercase tracking-wider">Biography</h3>
                </div>
                <p className="text-xs text-text-main leading-relaxed font-medium">
                  {profile?.bio || "No professional biography added yet. Click 'Edit Profile' to add your bio."}
                </p>
              </div>

              {/* Skills & Tech Stack Card */}
              <div className="p-6 rounded-3xl bg-glass-card border border-glass-border space-y-4 shadow-sm hover:border-cyan-500/40 transition">
                <div className="flex items-center space-x-2 border-b border-glass-border pb-3">
                  <Code2 size={16} className="text-cyan-500" />
                  <h3 className="text-xs font-mono font-bold text-text-title uppercase tracking-wider">Skills & Tech Stack</h3>
                </div>

                {profile?.skills && profile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl text-xs font-mono font-semibold bg-bg-darker border border-glass-border text-cyan-500 transition"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-text-muted italic">No skills listed yet.</p>
                )}
              </div>

              {/* Connected Social & Developer Links */}
              {(linkedinLink || githubLink || twitterLink || websiteLink) && (
                <div className="p-6 rounded-3xl bg-glass-card border border-glass-border space-y-3.5 shadow-sm hover:border-pink-500/40 transition">
                  <div className="flex items-center space-x-2 border-b border-glass-border pb-3">
                    <Globe size={16} className="text-pink-500" />
                    <h3 className="text-xs font-mono font-bold text-text-title uppercase tracking-wider">Connected Profiles</h3>
                  </div>

                  <div className="space-y-2.5 text-xs font-mono text-text-main">
                    {linkedinLink && (
                      <a href={linkedinLink} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2.5 hover:text-cyan-500 transition py-1">
                        <LinkedinIcon size={15} className="text-cyan-500" />
                        <span className="truncate">{linkedinLink}</span>
                      </a>
                    )}
                    {githubLink && (
                      <a href={githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2.5 hover:text-purple-500 transition py-1">
                        <GithubIcon size={15} className="text-purple-500" />
                        <span className="truncate">{githubLink}</span>
                      </a>
                    )}
                    {twitterLink && (
                      <a href={twitterLink} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2.5 hover:text-pink-500 transition py-1">
                        <TwitterIcon size={15} className="text-pink-500" />
                        <span className="truncate">{twitterLink}</span>
                      </a>
                    )}
                    {websiteLink && (
                      <a href={websiteLink} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2.5 hover:text-emerald-500 transition py-1">
                        <Globe size={15} className="text-emerald-500" />
                        <span className="truncate">{websiteLink}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

            </StaggerItem>

            {/* Right Bento Column (Span 8) */}
            <StaggerItem className="lg:col-span-8 space-y-6">
              
              {/* Credentials & Goals Bento Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="p-6 rounded-3xl bg-glass-card border border-glass-border space-y-2 shadow-sm">
                  <div className="flex items-center space-x-2 text-text-muted">
                    <GraduationCap size={16} className="text-cyan-500" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Education</span>
                  </div>
                  <p className="text-sm font-bold text-text-title">{profile?.education || "Not specified"}</p>
                </div>

                <div className="p-6 rounded-3xl bg-glass-card border border-glass-border space-y-2 shadow-sm">
                  <div className="flex items-center space-x-2 text-text-muted">
                    <MapPin size={16} className="text-pink-500" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Location</span>
                  </div>
                  <p className="text-sm font-bold text-text-title">{profile?.location || "Not specified"}</p>
                </div>

              </div>

              {/* Automatic Achievements / Badges Section */}
              <AchievementsSection />

              {/* Learning Goals / Expertise Areas Card */}
              {role === "learner" && (
                <div className="p-6 rounded-3xl bg-glass-card border border-glass-border space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-glass-border pb-3">
                    <div className="flex items-center space-x-2">
                      <Sparkles size={16} className="text-purple-500" />
                      <h3 className="text-xs font-mono font-bold text-text-title uppercase tracking-wider">Learning Goals</h3>
                    </div>
                  </div>

                  {profile?.learningGoals && profile.learningGoals.length > 0 ? (
                    <ul className="space-y-2 text-xs font-medium text-text-main">
                      {profile.learningGoals.map((goal, idx) => (
                        <li key={idx} className="flex items-center space-x-2 p-2.5 rounded-xl bg-bg-darker border border-glass-border">
                          <CheckCircle2 size={14} className="text-purple-500 shrink-0" />
                          <span>{goal}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-text-muted italic">No custom learning goals specified yet.</p>
                  )}
                </div>
              )}

              {/* Role Credentials (Creator / Expert / Admin) */}
              {(role === "creator" || role === "expert") && (
                <div className="p-6 rounded-3xl bg-glass-card border border-glass-border space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-glass-border pb-3">
                    <div className="flex items-center space-x-2">
                      <Award size={16} className="text-amber-500" />
                      <h3 className="text-xs font-mono font-bold text-text-title uppercase tracking-wider">Expertise Areas</h3>
                    </div>
                  </div>

                  {profile?.expertise && profile.expertise.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.expertise.map((exp, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-xl text-xs font-mono bg-bg-darker border border-glass-border text-amber-500">
                          {exp}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-text-muted italic">No expertise areas listed.</p>
                  )}
                </div>
              )}

            </StaggerItem>

          </StaggerContainer>
        )}

        {/* Report User Profile Modal */}
        {user && (
          <ReportDialog
            isOpen={reportDialogOpen}
            onClose={() => setReportDialogOpen(false)}
            targetType="user"
            targetId={user._id}
            targetTitle={user.name}
          />
        )}
      </div>
    </PageTransition>
  );
};

export default Profile;
