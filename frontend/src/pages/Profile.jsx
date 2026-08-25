import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getLearnerProfile, updateLearnerProfile } from "../services/learnerApi";
import { getCreatorProfile, updateCreatorProfile } from "../services/creatorApi";
import { getExpertProfile, updateExpertProfile } from "../services/expertApi";
import { getAdminProfile, updateAdminProfile } from "../services/adminApi";
import {
  Calendar,
  Mail,
  Shield,
  User as UserIcon,
  BookOpen,
  Heart,
  Settings,
  Info,
  Edit2,
  Save,
  X,
  Link as LinkIcon
} from "lucide-react";
import SpotlightCard from "../components/SpotlightCard";
import Button from "../components/Button";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Form states matching schemas
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
  
  // Admin-specific
  const [department, setDepartment] = useState("");
  const [permissions, setPermissions] = useState("");

  // Social links
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

    // Social Links
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

  const checkCompletion = () => {
    if (!profile) return false;
    if (role === "learner") {
      return (
        profile.bio &&
        profile.bio.trim().length > 0 &&
        Array.isArray(profile.skills) &&
        profile.skills.length > 0 &&
        Array.isArray(profile.interests) &&
        profile.interests.length > 0
      );
    }
    if (role === "creator") {
      return (
        profile.bio &&
        profile.bio.trim().length > 0 &&
        Array.isArray(profile.skills) &&
        profile.skills.length > 0 &&
        profile.headline &&
        profile.headline.trim().length > 0 &&
        Array.isArray(profile.expertise) &&
        profile.expertise.length > 0
      );
    }
    if (role === "expert") {
      return (
        profile.bio &&
        profile.bio.trim().length > 0 &&
        Array.isArray(profile.skills) &&
        profile.skills.length > 0 &&
        profile.headline &&
        profile.headline.trim().length > 0 &&
        Array.isArray(profile.expertise) &&
        profile.expertise.length > 0 &&
        profile.hourlyRate > 0
      );
    }
    return true; // Admin/Default
  };

  const getCompletionMessage = () => {
    if (role === "learner") {
      return "Please click \"Edit Profile\" and fill in your biography, skills, and interests to complete your listing.";
    }
    if (role === "creator") {
      return "Please click \"Edit Profile\" and fill in your biography, skills, headline, and expertise areas to complete your listing.";
    }
    if (role === "expert") {
      return "Please click \"Edit Profile\" and fill in your biography, skills, headline, expertise areas, and hourly rate to complete your listing.";
    }
    return "Please click \"Edit Profile\" and complete all required fields.";
  };

  const isComplete = checkCompletion();

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
        month: "long",
        day: "numeric",
      })
    : "Recently Joined";

  const getRoleColors = (roleName) => {
    switch (roleName) {
      case "admin":
        return "bg-accent-emerald/10 text-accent-emerald border-accent-emerald/25";
      case "expert":
        return "bg-accent-orange/10 text-accent-orange border-accent-orange/25";
      case "creator":
        return "bg-accent-purple/10 text-accent-purple border-accent-purple/25";
      default:
        return "bg-accent-blue/10 text-accent-blue border-accent-blue/25";
    }
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-blue"></div>
      </div>
    );
  }

  return (
    <div className="relative z-10 space-y-6 text-left">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 glass-surface border-accent-blue/30 bg-bg-darker/95 px-5 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-300">
          <Info className="text-accent-blue shrink-0 animate-pulse" size={18} />
          <p className="text-xs font-semibold text-text-title">{toastMessage}</p>
        </div>
      )}

      {/* Completion Check Notification */}
      {!isComplete && role !== "admin" && (
        <div className="flex items-center gap-3 p-4 border border-rose-500/20 bg-rose-500/5 rounded-2xl text-left">
          <Info className="text-rose-400 shrink-0 animate-bounce" size={18} />
          <div>
            <h4 className="text-xs font-bold text-text-title">Your Profile is Incomplete</h4>
            <p className="text-[10px] text-text-muted mt-0.5">
              {getCompletionMessage()}
            </p>
          </div>
        </div>
      )}

      {isComplete && role !== "admin" && (
        <div className="flex items-center gap-3 p-4 border border-accent-emerald/20 bg-accent-emerald/5 rounded-2xl text-left">
          <Info className="text-accent-emerald shrink-0" size={18} />
          <div>
            <h4 className="text-xs font-bold text-text-title text-accent-emerald">Profile Completed</h4>
            <p className="text-[10px] text-text-muted mt-0.5">
              Your profile has all required details and is discoverable!
            </p>
          </div>
        </div>
      )}

      <SpotlightCard className="border border-glass-border/70 p-6 sm:p-8 bg-gradient-to-br from-purple-600/10 via-indigo-600/5 to-transparent dark:from-[#1E114A] dark:via-[#0F072D] dark:to-[#020512] dark:border-purple-500/20 shadow-2xl relative overflow-hidden" glowColor="rgba(124, 58, 237, 0.12)">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
            {/* Avatar */}
            <div className="group/avatar h-20 w-20 rounded-2xl bg-gradient-accent p-[1.5px] shadow-lg overflow-hidden shrink-0 transition-all duration-300">
              {user?.profilePicture ? (
                 <img src={user.profilePicture} alt={user.name} className="h-full w-full rounded-2xl object-cover" />
              ) : (
                <div className={`flex h-full w-full items-center justify-center rounded-2xl text-2xl font-extrabold text-white uppercase bg-gradient-to-br ${
                  role === "admin" ? "from-accent-emerald to-accent-cyan" :
                  role === "creator" ? "from-accent-purple to-accent-magenta" :
                  role === "expert" ? "from-accent-orange to-accent-amber" :
                  "from-accent-blue to-accent-indigo"
                }`}>
                  {user?.name ? user.name[0] : <UserIcon size={24} />}
                </div>
              )}
            </div>

            {/* Core info */}
            <div className="text-center sm:text-left space-y-3 flex-grow">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h1 className="text-2xl font-extrabold text-text-title leading-none">{user?.name || "Member"}</h1>
                <span className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${getRoleColors(role)}`}>
                  {role}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-text-muted font-semibold">
                <div className="flex items-center gap-1.5">
                  <Mail size={13} className="text-text-muted" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-text-muted" />
                  <span>Member since {formattedDate}</span>
                </div>
              </div>
            </div>
          </div>

          <Button onClick={() => {
            if (editMode) {
              handleCancelEdit();
            } else {
              setEditMode(true);
            }
          }} className="flex items-center gap-2 text-xs py-2 px-4 shrink-0">
            {editMode ? (
              <>
                <X size={13} /> Cancel
              </>
            ) : (
              <>
                <Edit2 size={13} /> Edit Profile
              </>
            )}
          </Button>
        </div>
      </SpotlightCard>

      {/* Profile forms Split view */}
      {editMode ? (
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <SpotlightCard className="md:col-span-12 p-6 bg-glass-card border border-glass-border rounded-2xl space-y-6 text-left" glowColor="rgba(59, 130, 246, 0.04)">
            <h3 className="text-md font-bold text-text-title border-b border-glass-border/30 pb-3 mb-4">
              Edit Your Profile Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              
              {role !== "admin" && (
                <>
                  {/* Biography */}
                  <div className="sm:col-span-2 space-y-2">
                    <label className="font-bold text-text-muted uppercase tracking-wider">Biography</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself, your background, and goals..."
                      rows={4}
                      className="w-full form-input rounded-xl p-3"
                    />
                  </div>

                  {role === "creator" || role === "expert" ? (
                    <div className="space-y-2">
                      <label className="font-bold text-text-muted uppercase tracking-wider">Headline</label>
                      <input
                        type="text"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        placeholder="e.g. Senior Frontend Instructor"
                        className="w-full form-input rounded-xl p-3"
                      />
                    </div>
                  ) : null}

                  <div className="space-y-2">
                    <label className="font-bold text-text-muted uppercase tracking-wider">Skills (comma-separated)</label>
                    <input
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="e.g. React, Node.js, Mongoose"
                      className="w-full form-input rounded-xl p-3"
                    />
                  </div>

                  {role === "learner" && (
                    <>
                      <div className="space-y-2">
                        <label className="font-bold text-text-muted uppercase tracking-wider">Interests (comma-separated)</label>
                        <input
                          type="text"
                          value={interests}
                          onChange={(e) => setInterests(e.target.value)}
                          placeholder="e.g. Machine Learning, Cloud Systems"
                          className="w-full form-input rounded-xl p-3"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="font-bold text-text-muted uppercase tracking-wider">Learning Goals (comma-separated)</label>
                        <input
                          type="text"
                          value={learningGoals}
                          onChange={(e) => setLearningGoals(e.target.value)}
                          placeholder="e.g. Deploy React to production"
                          className="w-full form-input rounded-xl p-3"
                        />
                      </div>
                    </>
                  )}

                  {role === "creator" || role === "expert" ? (
                    <>
                      <div className="space-y-2">
                        <label className="font-bold text-text-muted uppercase tracking-wider">Expertise Areas (comma-separated)</label>
                        <input
                          type="text"
                          value={expertise}
                          onChange={(e) => setExpertise(e.target.value)}
                          placeholder="e.g. Backend Architecture, DevOps"
                          className="w-full form-input rounded-xl p-3"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="font-bold text-text-muted uppercase tracking-wider">Years of Experience</label>
                        <input
                          type="number"
                          value={experience}
                          onChange={(e) => setExperience(e.target.value)}
                          min="0"
                          className="w-full form-input rounded-xl p-3"
                        />
                      </div>
                    </>
                  ) : null}

                  <div className="space-y-2">
                    <label className="font-bold text-text-muted uppercase tracking-wider">Education</label>
                    <input
                      type="text"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      placeholder="e.g. University of Computer Science"
                      className="w-full form-input rounded-xl p-3"
                    />
                  </div>

                  {role === "learner" && (
                    <div className="space-y-2">
                      <label className="font-bold text-text-muted uppercase tracking-wider">Location</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. San Francisco, CA"
                        className="w-full form-input rounded-xl p-3"
                      />
                    </div>
                  )}

                  {role === "creator" && (
                    <div className="space-y-2">
                      <label className="font-bold text-text-muted uppercase tracking-wider">Website URL</label>
                      <input
                        type="text"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://mycreatorwebsite.com"
                        className="w-full form-input rounded-xl p-3"
                      />
                    </div>
                  )}

                  {role === "expert" && (
                    <>
                      <div className="space-y-2">
                        <label className="font-bold text-text-muted uppercase tracking-wider">Qualifications (comma-separated)</label>
                        <input
                          type="text"
                          value={qualifications}
                          onChange={(e) => setQualifications(e.target.value)}
                          placeholder="e.g. AWS Solutions Architect"
                          className="w-full form-input rounded-xl p-3"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="font-bold text-text-muted uppercase tracking-wider">Languages (comma-separated)</label>
                        <input
                          type="text"
                          value={languages}
                          onChange={(e) => setLanguages(e.target.value)}
                          placeholder="e.g. English, Spanish"
                          className="w-full form-input rounded-xl p-3"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="font-bold text-text-muted uppercase tracking-wider">Hourly Consultation Rate ($)</label>
                        <input
                          type="number"
                          value={hourlyRate}
                          onChange={(e) => setHourlyRate(e.target.value)}
                          min="0"
                          className="w-full form-input rounded-xl p-3"
                        />
                      </div>
                      <div className="flex items-center space-x-3 pt-6">
                        <input
                          type="checkbox"
                          id="isAvailable"
                          checked={isAvailable}
                          onChange={(e) => setIsAvailable(e.target.checked)}
                          className="h-4 w-4 rounded border-glass-border bg-bg-darker"
                        />
                        <label htmlFor="isAvailable" className="font-bold text-text-muted uppercase tracking-wider cursor-pointer">
                          Available for mentorship calls
                        </label>
                      </div>
                    </>
                  )}

                  {/* Social Links Sub-section */}
                  <div className="sm:col-span-2 border-t border-glass-border/30 pt-4 mt-2">
                    <h4 className="font-bold text-text-title uppercase tracking-wider mb-3">Social Links</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="font-semibold text-text-muted">LinkedIn URL</label>
                        <input
                          type="text"
                          value={linkedinLink}
                          onChange={(e) => setLinkedinLink(e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full form-input rounded-xl p-3"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="font-semibold text-text-muted">GitHub URL</label>
                        <input
                          type="text"
                          value={githubLink}
                          onChange={(e) => setGithubLink(e.target.value)}
                          placeholder="https://github.com/username"
                          className="w-full form-input rounded-xl p-3"
                        />
                      </div>
                      {role === "creator" && (
                        <div className="space-y-2">
                          <label className="font-semibold text-text-muted">Twitter URL</label>
                          <input
                            type="text"
                            value={twitterLink}
                            onChange={(e) => setTwitterLink(e.target.value)}
                            placeholder="https://twitter.com/username"
                            className="w-full form-input rounded-xl p-3"
                          />
                        </div>
                      )}
                      {(role === "learner" || role === "expert") && (
                        <div className="space-y-2">
                          <label className="font-semibold text-text-muted">Website URL</label>
                          <input
                            type="text"
                            value={websiteLink}
                            onChange={(e) => setWebsiteLink(e.target.value)}
                            placeholder="https://mywebsite.com"
                            className="w-full form-input rounded-xl p-3"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Admin configuration */}
              {role === "admin" && (
                <>
                  <div className="space-y-2">
                    <label className="font-bold text-text-muted uppercase tracking-wider">Department</label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Administration"
                      className="w-full form-input rounded-xl p-3"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-bold text-text-muted uppercase tracking-wider">Permissions (comma-separated)</label>
                    <input
                      type="text"
                      value={permissions}
                      onChange={(e) => setPermissions(e.target.value)}
                      placeholder="e.g. manage_users, view_analytics"
                      className="w-full form-input rounded-xl p-3"
                    />
                  </div>
                </>
              )}

            </div>

            <div className="flex items-center justify-end gap-3 border-t border-glass-border/30 pt-4 mt-6">
              <Button type="button" variant="secondary" onClick={handleCancelEdit} className="text-xs py-2 px-4">
                Cancel
              </Button>
              <Button type="submit" className="flex items-center gap-2 text-xs py-2.5 px-6">
                <Save size={13} /> Save Profile
              </Button>
            </div>
          </SpotlightCard>
        </form>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (Bio, Skills) (lg:4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {role !== "admin" && (
              <>
                {/* Biography */}
                <SpotlightCard className="p-6 card-tint-purple rounded-2xl text-left" glowColor="rgba(124, 58, 237, 0.12)">
                  <div className="flex items-center gap-2 border-b border-glass-border/30 pb-3 mb-4">
                    <BookOpen size={14} className="text-accent-purple" />
                    <h3 className="text-[10px] font-bold tracking-wider text-text-title uppercase">Biography</h3>
                  </div>
                  {profile?.bio ? (
                    <p className="text-xs text-text-main leading-relaxed font-medium">
                      {profile.bio}
                    </p>
                  ) : (
                    <div className="text-center py-4 space-y-3">
                      <p className="text-xs text-text-muted italic">No biography added yet.</p>
                      <Button onClick={() => setEditMode(true)} className="text-[10px] py-1.5 px-3">
                        Add Bio
                      </Button>
                    </div>
                  )}
                </SpotlightCard>

                {/* Skills & Focus */}
                <SpotlightCard className="p-6 card-tint-blue rounded-2xl text-left" glowColor="rgba(59, 130, 246, 0.12)">
                  <div className="flex items-center gap-2 border-b border-glass-border/30 pb-3 mb-4">
                    <Heart size={14} className="text-accent-blue" />
                    <h3 className="text-[10px] font-bold tracking-wider text-text-title uppercase">Skills & Focus</h3>
                  </div>

                  <div className="space-y-4 text-xs font-semibold">
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Expertise / Skills</h4>
                      {profile?.skills && profile.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {profile.skills.map((s, idx) => (
                            <span key={idx} className="bg-bg-dark border border-glass-border px-2.5 py-1 rounded-lg text-text-main">
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-text-muted italic">No skills listed.</p>
                      )}
                    </div>
                    
                    {role === "learner" && (
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Focus Interests</h4>
                        {profile?.interests && profile.interests.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {profile.interests.map((int, idx) => (
                              <span key={idx} className="bg-bg-darker border border-glass-border px-2.5 py-1 rounded-lg text-text-muted">
                                {int}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-text-muted italic">No focus interests listed.</p>
                        )}
                      </div>
                    )}
                  </div>
                </SpotlightCard>

                {/* Social Links Panel */}
                {profile?.socialLinks && (linkedinLink || githubLink || twitterLink || websiteLink) && (
                  <SpotlightCard className="p-6 bg-glass-card border border-glass-border rounded-2xl text-left" glowColor="rgba(59, 130, 246, 0.05)">
                    <div className="flex items-center gap-2 border-b border-glass-border/30 pb-3 mb-4">
                      <LinkIcon size={14} className="text-accent-blue" />
                      <h3 className="text-[10px] font-bold tracking-wider text-text-title uppercase">Social Links</h3>
                    </div>

                    <div className="space-y-3 text-xs font-semibold text-text-muted">
                      {linkedinLink && (
                        <a href={linkedinLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-text-title">
                          LinkedIn: <span className="text-accent-blue truncate">{linkedinLink}</span>
                        </a>
                      )}
                      {githubLink && (
                        <a href={githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-text-title">
                          GitHub: <span className="text-accent-blue truncate">{githubLink}</span>
                        </a>
                      )}
                      {twitterLink && (
                        <a href={twitterLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-text-title">
                          Twitter: <span className="text-accent-blue truncate">{twitterLink}</span>
                        </a>
                      )}
                      {websiteLink && (
                        <a href={websiteLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-text-title">
                          Website: <span className="text-accent-blue truncate">{websiteLink}</span>
                        </a>
                      )}
                    </div>
                  </SpotlightCard>
                )}
              </>
            )}

            {role === "admin" && (
              <SpotlightCard className="p-6 bg-glass-card border border-glass-border rounded-2xl text-left" glowColor="rgba(16, 185, 129, 0.06)">
                <div className="flex items-center gap-2 border-b border-glass-border/30 pb-3 mb-4">
                  <Shield size={14} className="text-accent-emerald" />
                  <h3 className="text-[10px] font-bold tracking-wider text-text-title uppercase">Admin Authorization</h3>
                </div>
                <div className="space-y-2 text-xs font-semibold text-text-muted">
                  <div>Department: <span className="text-text-title">{profile?.department || "Administration"}</span></div>
                  <div>Permissions:</div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {profile?.permissions?.map((p, idx) => (
                      <span key={idx} className="bg-bg-dark border border-glass-border px-2 py-0.5 rounded text-[10px]">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </SpotlightCard>
            )}

          </div>

          {/* Right Column (lg:8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. LEARNER VIEW */}
            {role === "learner" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SpotlightCard className="p-5 card-tint-mint rounded-xl text-center py-8">
                    <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Education</h4>
                    <p className="text-sm text-text-title mt-2 font-semibold">
                      {profile?.education || "Not specified"}
                    </p>
                  </SpotlightCard>
                  
                  <SpotlightCard className="p-5 card-tint-pink rounded-xl text-center py-8">
                    <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Location</h4>
                    <p className="text-sm text-text-title mt-2 font-semibold">
                      {profile?.location || "Not specified"}
                    </p>
                  </SpotlightCard>
                </div>

                <SpotlightCard className="p-6 card-tint-peach rounded-2xl">
                  <div className="flex items-center justify-between pb-3 border-b border-glass-border/30 mb-4">
                    <h3 className="text-[10px] font-bold text-text-title uppercase tracking-widest font-display">Learning Goals</h3>
                  </div>
                  {profile?.learningGoals && profile.learningGoals.length > 0 ? (
                    <ul className="list-disc pl-5 text-xs text-text-main space-y-2 font-semibold">
                      {profile.learningGoals.map((g, idx) => (
                        <li key={idx}>{g}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="py-6 text-center text-xs text-text-muted">
                      No learning goals listed.
                    </div>
                  )}
                </SpotlightCard>
              </div>
            )}

            {/* 2. CREATOR VIEW */}
            {role === "creator" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <SpotlightCard className="p-5 card-tint-mint text-center">
                    <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Experience</h4>
                    <p className="text-lg font-extrabold text-accent-emerald mt-1">
                      {profile?.experience || 0} years
                    </p>
                  </SpotlightCard>
                  <SpotlightCard className="p-5 card-tint-pink text-center">
                    <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Education</h4>
                    <p className="text-sm font-semibold text-text-title mt-2 truncate">
                      {profile?.education || "Not specified"}
                    </p>
                  </SpotlightCard>
                  <SpotlightCard className="p-5 card-tint-blue text-center">
                    <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Website</h4>
                    <p className="text-sm font-semibold text-text-title mt-2 truncate">
                      {profile?.website ? (
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-accent-blue">
                          Link
                        </a>
                      ) : "None"}
                    </p>
                  </SpotlightCard>
                </div>

                <SpotlightCard className="p-6 card-tint-peach rounded-2xl">
                  <div className="flex items-center justify-between pb-3 border-b border-glass-border/30 mb-4">
                    <h3 className="text-[10px] font-bold text-text-title uppercase tracking-widest">Expertise Areas</h3>
                  </div>
                  {profile?.expertise && profile.expertise.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {profile.expertise.map((exp, idx) => (
                        <span key={idx} className="bg-bg-dark/40 border border-glass-border px-2.5 py-1 rounded-lg text-xs text-text-main font-semibold">
                          {exp}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-text-muted">
                      No expertise areas listed.
                    </div>
                  )}
                </SpotlightCard>
              </div>
            )}

            {/* 3. EXPERT VIEW */}
            {role === "expert" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <SpotlightCard className="p-5 card-tint-pink text-center">
                    <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Hourly Rate</h4>
                    <p className="text-lg font-extrabold text-accent-pink mt-1">
                      ${profile?.hourlyRate || 0} / hr
                    </p>
                  </SpotlightCard>
                  <SpotlightCard className="p-5 card-tint-mint text-center">
                    <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Experience</h4>
                    <p className="text-lg font-extrabold text-accent-emerald mt-1">
                      {profile?.experience || 0} years
                    </p>
                  </SpotlightCard>
                  <SpotlightCard className="p-5 card-tint-peach text-center">
                    <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Availability</h4>
                    <p className="text-sm font-semibold mt-2">
                      {profile?.isAvailable ? (
                        <span className="text-accent-emerald">Available</span>
                      ) : (
                        <span className="text-rose-500 font-bold">Unavailable</span>
                      )}
                    </p>
                  </SpotlightCard>
                </div>

                <SpotlightCard className="p-6 card-tint-purple rounded-2xl">
                  <div className="flex items-center justify-between pb-3 border-b border-glass-border/30 mb-4">
                    <h3 className="text-[10px] font-bold text-text-title uppercase tracking-widest">Qualifications</h3>
                  </div>
                  {profile?.qualifications && profile.qualifications.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {profile.qualifications.map((q, idx) => (
                        <span key={idx} className="bg-bg-dark/40 border border-glass-border px-2.5 py-1 rounded-lg text-xs text-text-main font-semibold">
                          {q}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-text-muted">
                      No qualifications listed.
                    </div>
                  )}
                </SpotlightCard>
              </div>
            )}

            {/* 4. ADMIN VIEW */}
            {role === "admin" && (
              <SpotlightCard className="p-6 bg-glass-card border border-glass-border rounded-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-glass-border/30 mb-4">
                  <h3 className="text-[10px] font-bold text-text-title uppercase tracking-widest">System Administrator</h3>
                </div>
                <div className="py-6 text-center text-xs text-text-muted">
                  Department permissions active. Manage platform configurations directly from your dashboard.
                </div>
              </SpotlightCard>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
