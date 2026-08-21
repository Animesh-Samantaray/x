import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Mail, KeyRound, AlertCircle, Eye, EyeOff, Sparkles, Share2, ShieldCheck, GraduationCap, Users, ShieldAlert } from "lucide-react";
import GlassCard from "../components/GlassCard";
import Button from "../components/Button";

const Signup = () => {
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminAccessToken: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setError("");
  };

  const validateForm = () => {
    if (selectedRole !== "admin") {
      if (!formData.name.trim()) {
        setError("Full name is required");
        return false;
      }
      if (formData.name.trim().length < 3) {
        setError("Name must be at least 3 characters");
        return false;
      }
    }
    
    if (!formData.email.trim()) {
      setError("Email address is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (selectedRole === "admin") {
      if (!formData.adminAccessToken.trim()) {
        setError("Admin Access Token is required");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      setError("Please select a role first");
      return;
    }
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError("");

      const result = await signup(
        selectedRole === "admin" ? "System Admin" : formData.name.trim(),
        formData.email.trim(),
        formData.password,
        selectedRole,
        selectedRole === "admin" ? formData.adminAccessToken.trim() : undefined
      );

      if (result.success) {
        navigate("/");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Registration failed due to a connection error.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    if (!selectedRole) {
      setError("Please select a role first");
      return;
    }
    if (selectedRole === "admin") {
      setError("Google signup is not allowed for Admin role");
      return;
    }
    setLoading(true);
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google?role=${selectedRole}`;
  };

  return (
    <div className="h-screen w-screen min-h-screen grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-bg-deep select-none relative z-10">
      
      {/* Background radial glow */}
      <div className="absolute top-[20%] left-[55%] h-[350px] w-[350px] rounded-full ambient-glow-purple opacity-20 pointer-events-none z-0"></div>

      {/* LEFT PANEL: Branding & Visual Representation (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:col-span-4 bg-slate-950/20 border-r border-glass-border/30 flex-col justify-between p-10 relative overflow-hidden h-full">
        {/* Dot grid inside left panel */}
        <div className="absolute inset-0 dot-grid pointer-events-none opacity-40"></div>
        
        {/* Top Branding Logo */}
        <Link to="/" className="flex items-center gap-2 text-md font-bold text-white tracking-wider relative z-10">
          <span className="h-2 w-2 rounded bg-gradient-accent"></span>
          CKM
        </Link>

        {/* Center Copy & Visual Mockup */}
        <div className="my-auto space-y-6 relative z-10">
          <div className="space-y-4 max-w-sm">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-glass-border bg-slate-900/60 px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Sparkles size={10} className="text-accent-purple" />
              <span>Connect & Grow</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white leading-tight">
              Knowledge becomes <br />
              <span className="text-gradient-accent">more valuable.</span>
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Join a modern ecosystem built for packaging resources and scheduling video mentoring calls. Learn faster together.
            </p>
          </div>

          {/* Connected Network CSS graphics */}
          <div className="relative h-40 w-full max-w-[280px] bg-slate-900/25 border border-glass-border/40 rounded-2xl p-4 shadow-2xl flex items-center justify-center">
            {/* Center Node */}
            <div className="h-10 w-10 rounded-xl bg-gradient-accent p-[1px] relative z-20 shadow-lg animate-float">
              <div className="flex h-full w-full items-center justify-center rounded-xl bg-bg-deep text-white">
                <Share2 size={16} />
              </div>
            </div>
            {/* Outer Nodes */}
            <div className="absolute top-[12%] left-[12%] h-7 w-7 rounded-lg bg-slate-900 border border-glass-border flex items-center justify-center text-[9px] text-slate-400 font-bold z-10">
              PDF
            </div>
            <div className="absolute bottom-[12%] left-[15%] h-7 w-7 rounded-lg bg-slate-900 border border-glass-border flex items-center justify-center text-[9px] text-slate-400 font-bold z-10">
              1:1
            </div>
            <div className="absolute top-[20%] right-[12%] h-7 w-7 rounded-lg bg-slate-900 border border-glass-border flex items-center justify-center text-[9px] text-slate-400 font-bold z-10">
              ZIP
            </div>
            {/* Decorative Connecting Lines */}
            <svg className="absolute inset-0 h-full w-full text-slate-800 pointer-events-none" fill="none" viewBox="0 0 280 160">
              <line x1="68" y1="36" x2="140" y2="80" stroke="currentColor" strokeWidth={1} strokeDasharray="3 3" />
              <line x1="72" y1="124" x2="140" y2="80" stroke="currentColor" strokeWidth={1} strokeDasharray="3 3" />
              <line x1="240" y1="44" x2="140" y2="80" stroke="currentColor" strokeWidth={1} strokeDasharray="3 3" />
            </svg>
          </div>
        </div>

        {/* Footer Credit */}
        <p className="text-[10px] text-slate-600 relative z-10 font-medium">
          &copy; {new Date().getFullYear()} Collaborative Knowledge Marketplace.
        </p>
      </div>

      {/* RIGHT PANEL: Side-by-side horizontal split card */}
      <div className="col-span-1 lg:col-span-8 flex flex-col justify-center px-6 sm:px-12 py-8 relative z-10 h-full overflow-y-auto lg:overflow-hidden">
        <div className="w-full max-w-4xl mx-auto space-y-4">
          
          {/* Header Mobile Branding */}
          <div className="text-center lg:text-left space-y-1">
            <Link to="/" className="inline-flex lg:hidden items-center gap-2 text-md font-bold text-white tracking-wider mb-2">
              <span className="h-2 w-2 rounded bg-gradient-accent"></span>
              CKM
            </Link>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Create your account</h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Choose your role and enter your registration details to start sharing or learning.
            </p>
          </div>

          <GlassCard hoverEffect={false} className="border border-glass-border p-5 bg-slate-950/20 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:divide-x divide-glass-border">
              
              {/* COLUMN 1: 4 ROLE SELECTION CATEGORIES */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1 border-b border-glass-border/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-indigo"></span>
                  <h3 className="text-xs font-extrabold tracking-wider uppercase text-slate-200">1. Select Your Role</h3>
                </div>

                <div className="space-y-2.5">
                  {/* Learner Card */}
                  <div
                    onClick={() => handleRoleSelect("learner")}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition duration-300 ${
                      selectedRole === "learner"
                        ? "bg-accent-indigo/10 border-accent-indigo shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                        : "bg-slate-950/40 border-glass-border hover:border-slate-700 hover:bg-slate-950/60"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${selectedRole === "learner" ? "bg-accent-indigo text-white" : "bg-slate-900 text-slate-400"}`}>
                      <GraduationCap size={15} />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-xs font-bold text-white leading-normal">Learner</h4>
                      <p className="text-[9px] text-slate-400 leading-normal mt-0.5">Learn from creators and experts.</p>
                    </div>
                    {selectedRole === "learner" && (
                      <div className="h-4 w-4 rounded-full bg-accent-indigo flex items-center justify-center text-white text-[9px] font-bold">
                        ✓
                      </div>
                    )}
                  </div>

                  {/* Creator Card */}
                  <div
                    onClick={() => handleRoleSelect("creator")}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition duration-300 ${
                      selectedRole === "creator"
                        ? "bg-accent-indigo/10 border-accent-indigo shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                        : "bg-slate-950/40 border-glass-border hover:border-slate-700 hover:bg-slate-950/60"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${selectedRole === "creator" ? "bg-accent-indigo text-white" : "bg-slate-900 text-slate-400"}`}>
                      <Users size={15} />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-xs font-bold text-white leading-normal">Creator</h4>
                      <p className="text-[9px] text-slate-400 leading-normal mt-0.5">Share knowledge and build your audience.</p>
                    </div>
                    {selectedRole === "creator" && (
                      <div className="h-4 w-4 rounded-full bg-accent-indigo flex items-center justify-center text-white text-[9px] font-bold">
                        ✓
                      </div>
                    )}
                  </div>

                  {/* Expert Card */}
                  <div
                    onClick={() => handleRoleSelect("expert")}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition duration-300 ${
                      selectedRole === "expert"
                        ? "bg-accent-indigo/10 border-accent-indigo shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                        : "bg-slate-950/40 border-glass-border hover:border-slate-700 hover:bg-slate-950/60"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${selectedRole === "expert" ? "bg-accent-indigo text-white" : "bg-slate-900 text-slate-400"}`}>
                      <ShieldCheck size={15} />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-xs font-bold text-white leading-normal">Expert</h4>
                      <p className="text-[9px] text-slate-400 leading-normal mt-0.5">Teach, mentor and guide learners.</p>
                    </div>
                    {selectedRole === "expert" && (
                      <div className="h-4 w-4 rounded-full bg-accent-indigo flex items-center justify-center text-white text-[9px] font-bold">
                        ✓
                      </div>
                    )}
                  </div>

                  {/* Admin Card */}
                  <div
                    onClick={() => handleRoleSelect("admin")}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition duration-300 ${
                      selectedRole === "admin"
                        ? "bg-accent-purple/10 border-accent-purple shadow-[0_0_15px_rgba(139,92,246,0.1)]"
                        : "bg-slate-950/40 border-glass-border hover:border-slate-700 hover:bg-slate-950/60"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${selectedRole === "admin" ? "bg-accent-purple text-white" : "bg-slate-900 text-slate-400"}`}>
                      <ShieldAlert size={15} />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-xs font-bold text-white leading-normal">Administrator</h4>
                      <p className="text-[9px] text-slate-400 leading-normal mt-0.5">Manage the platform resources.</p>
                    </div>
                    {selectedRole === "admin" && (
                      <div className="h-4 w-4 rounded-full bg-accent-purple flex items-center justify-center text-white text-[9px] font-bold">
                        ✓
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* COLUMN 2: DYNAMIC REGISTRATION FORM */}
              <div className="space-y-4 md:pl-8 relative min-h-[340px] flex flex-col justify-between">
                
                <div>
                  <div className="flex items-center gap-2 pb-1 border-b border-glass-border/30 mb-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-purple"></span>
                    <h3 className="text-xs font-extrabold tracking-wider uppercase text-slate-200">
                      2. Register Credentials
                    </h3>
                  </div>

                  {error && (
                    <div className="mb-3 flex items-start gap-2.5 rounded-xl bg-rose-500/5 border border-rose-500/20 p-2.5 text-[10px] text-rose-300">
                      <AlertCircle className="shrink-0 mt-0.5" size={13} />
                      <span className="leading-normal">{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-2.5">
                    {/* Full Name - Hidden/Unused for Admin */}
                    {selectedRole !== "admin" && (
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                            <User size={13} />
                          </span>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="w-full rounded-xl bg-slate-950/60 border border-glass-border py-1.5 pl-9 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition duration-200"
                            disabled={loading}
                          />
                        </div>
                      </div>
                    )}

                    {/* Email Address */}
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                          <Mail size={13} />
                        </span>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder={selectedRole === "admin" ? "admin@domain.com" : "name@domain.com"}
                          className="w-full rounded-xl bg-slate-950/60 border border-glass-border py-1.5 pl-9 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition duration-200"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                          <KeyRound size={13} />
                        </span>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="w-full rounded-xl bg-slate-950/60 border border-glass-border py-1.5 pl-9 pr-9 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition duration-200"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-white cursor-pointer"
                        >
                          {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                          <KeyRound size={13} />
                        </span>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="w-full rounded-xl bg-slate-950/60 border border-glass-border py-1.5 pl-9 pr-9 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition duration-200"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-white cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      </div>
                    </div>

                    {/* Admin Access Token - Only Shown for Admin */}
                    {selectedRole === "admin" && (
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Admin Access Token
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                            <KeyRound size={13} className="text-accent-purple" />
                          </span>
                          <input
                            type="password"
                            name="adminAccessToken"
                            value={formData.adminAccessToken}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full rounded-xl bg-slate-950/60 border border-glass-border py-1.5 pl-9 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition duration-200"
                            disabled={loading}
                          />
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      className={`w-full py-2 font-bold text-xs mt-2 ${selectedRole === "admin" ? "bg-gradient-to-r from-accent-indigo to-accent-purple" : ""}`}
                      disabled={loading || !selectedRole}
                      loading={loading}
                    >
                      Create Account
                    </Button>
                  </form>

                  {/* Google OAuth signup - Hidden for Admin */}
                  {selectedRole !== "admin" && (
                    <>
                      <div className="relative flex py-2.5 items-center">
                        <div className="flex-grow border-t border-glass-border"></div>
                        <span className="flex-shrink mx-2.5 text-[9px] font-bold uppercase tracking-widest text-slate-500">OR</span>
                        <div className="flex-grow border-t border-glass-border"></div>
                      </div>

                      <button
                        type="button"
                        onClick={handleGoogleSignup}
                        disabled={loading || !selectedRole}
                        className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-glass-border bg-slate-950/40 hover:bg-slate-950/80 px-4 py-2 text-xs font-semibold text-slate-200 transition duration-200 hover:border-slate-500 cursor-pointer disabled:opacity-50"
                      >
                        <svg className="h-4 w-4 text-white" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Continue with Google
                      </button>
                    </>
                  )}
                </div>

                {/* Lock Overlay if no role selected */}
                {!selectedRole && (
                  <div className="absolute inset-0 bg-[#070a13]/85 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center rounded-xl p-4 text-center">
                    <ShieldAlert size={26} className="text-accent-indigo animate-pulse mb-1.5" />
                    <p className="text-xs font-bold text-slate-200">Registration Locked</p>
                    <p className="text-[10px] text-slate-400 max-w-[200px] mt-1">Please select a role on the left to unlock the registration forms.</p>
                  </div>
                )}

              </div>

            </div>

            <div className="mt-5 border-t border-glass-border pt-4 text-center text-xs text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="text-accent-indigo hover:text-accent-purple font-semibold transition ml-1">
                Sign in
              </Link>
            </div>
          </GlassCard>

        </div>
      </div>

    </div>
  );
};

export default Signup;
