import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Mail, KeyRound, AlertCircle, Eye, EyeOff, Sparkles, Share2, GraduationCap, Users, UserCheck, Settings, ShieldAlert, BadgeCheck } from "lucide-react";
import SpotlightCard from "../components/SpotlightCard";
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
    <div className="min-h-screen w-screen bg-transparent flex grid grid-cols-1 lg:grid-cols-12 overflow-hidden relative select-none">
      
      {/* Background visual details */}
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none z-0"></div>
      
      {/* Left panel branding visual composition */}
      <div className="hidden lg:flex lg:col-span-4 bg-[#050811]/60 border-r border-glass-border/30 flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute inset-0 line-grid opacity-20 pointer-events-none"></div>
        <div className="glow-orb w-[300px] h-[300px] bg-accent-blue/10 top-[-50px] left-[-50px] animate-glow"></div>
        <div className="glow-orb w-[280px] h-[280px] bg-accent-purple/5 bottom-[10%] right-[-50px] animate-glow" style={{ animationDelay: "-3s" }}></div>
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-white z-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-accent p-[1px] shadow-[0_0_15px_rgba(59,130,246,0.25)]">
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-bg-deep">
              <Share2 size={14} className="text-accent-blue" />
            </div>
          </div>
          <span className="font-extrabold tracking-widest text-slate-100 text-base">CKM</span>
        </Link>

        {/* Dynamic graphics and stickers */}
        <div className="my-auto space-y-7 z-10 text-left relative">
          <div className="sticker sticker-purple rotate-[-2deg] mb-2">
            <Sparkles size={11} className="text-accent-purple" />
            <span>EXCHANGE PLATFORM v2.0</span>
          </div>
          
          <h1 className="hero-heading text-4xl leading-tight">
            Share and <br />
            package <span className="text-gradient-cyan">expertise.</span>
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            Access compiled developer guides, system templates, and live consultation scheduler listings.
          </p>

          <div className="relative h-44 w-full max-w-[280px] bg-[#03050c] border border-glass-border rounded-2xl p-4 shadow-2xl flex items-center justify-center">
            <div className="h-10 w-10 rounded-xl bg-gradient-accent p-[1.5px] z-20 shadow-lg animate-float">
              <div className="h-full w-full rounded-xl bg-[#02040a] flex items-center justify-center text-white">
                <Share2 size={16} />
              </div>
            </div>
            
            {/* Inner nodes */}
            <div className="absolute top-[12%] left-[12%] h-8 w-8 rounded-lg bg-[#050811] border border-glass-border flex items-center justify-center text-[9px] text-slate-400 font-bold z-10">
              PDF
            </div>
            <div className="absolute bottom-[12%] left-[15%] h-8 w-8 rounded-lg bg-[#050811] border border-glass-border flex items-center justify-center text-[9px] text-slate-400 font-bold z-10">
              1:1
            </div>
            <div className="absolute top-[20%] right-[12%] h-8 w-8 rounded-lg bg-[#050811] border border-glass-border flex items-center justify-center text-[9px] text-slate-400 font-bold z-10">
              ZIP
            </div>
            
            <svg className="absolute inset-0 h-full w-full text-slate-800 pointer-events-none" fill="none" viewBox="0 0 280 176">
              <line x1="68" y1="40" x2="140" y2="88" stroke="currentColor" strokeWidth={1.5} strokeDasharray="3 3" />
              <line x1="80" y1="135" x2="140" y2="88" stroke="currentColor" strokeWidth={1.5} strokeDasharray="3 3" />
              <line x1="220" y1="50" x2="140" y2="88" stroke="currentColor" strokeWidth={1.5} strokeDasharray="3 3" />
            </svg>
          </div>
          
          {/* Floating Sticker */}
          <div className="absolute top-2 right-2 sticker sticker-blue rotate-[4deg]">
            <span>10K+ Builders</span>
          </div>
        </div>

        <p className="text-[10px] text-slate-600 font-medium z-10">
          &copy; {new Date().getFullYear()} Collaborative Knowledge Marketplace.
        </p>
      </div>

      {/* Right panel layout split form */}
      <div className="col-span-1 lg:col-span-8 flex flex-col justify-center px-6 sm:px-12 py-12 z-10 h-full overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto space-y-6">
          
          <div className="text-center lg:text-left space-y-1">
            <Link to="/" className="inline-flex lg:hidden items-center gap-2 text-md font-bold text-white tracking-wider mb-2">
              <span className="h-2 w-2 rounded bg-gradient-accent"></span>
              CKM
            </Link>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Choose your path</h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Select one of the four roles below to configure your custom workspace account.
            </p>
          </div>

          <SpotlightCard className="p-6 bg-[#050811]/50 border border-glass-border rounded-2xl shadow-2xl relative" glowColor="rgba(59, 130, 246, 0.12)">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:divide-x lg:divide-glass-border">
              
              {/* Column 1: FOUR role selector experiences */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-glass-border/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-blue"></span>
                  <h3 className="text-xs font-bold tracking-wider uppercase text-slate-300">1. Account Role</h3>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { id: "learner", title: "Learner", desc: "Learn new skills", icon: GraduationCap, color: "bg-accent-blue/15 text-accent-blue border-accent-blue/30", glow: "hover:border-accent-blue/40 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]" },
                    { id: "creator", title: "Creator", desc: "Share your knowledge", icon: Users, color: "bg-accent-purple/15 text-accent-purple border-accent-purple/30", glow: "hover:border-accent-purple/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]" },
                    { id: "expert", title: "Expert", desc: "Mentor others", icon: UserCheck, color: "bg-accent-orange/15 text-accent-orange border-accent-orange/30", glow: "hover:border-accent-orange/40 hover:shadow-[0_0_15px_rgba(249,115,22,0.15)]" },
                    { id: "admin", title: "Admin", desc: "Manage the platform", icon: Settings, color: "bg-accent-emerald/15 text-accent-emerald border-accent-emerald/30", glow: "hover:border-accent-emerald/40 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]" }
                  ].map((role) => {
                    const Icon = role.icon;
                    const isActive = selectedRole === role.id;
                    return (
                      <div
                        key={role.id}
                        onClick={() => handleRoleSelect(role.id)}
                        className={`group flex items-center gap-3.5 p-3 rounded-xl border cursor-pointer transition-all duration-300 hover:translate-y-[-2px] hover:scale-[1.01] ${
                          isActive
                            ? "bg-slate-900/90 border-slate-700 shadow-lg " + role.glow
                            : "bg-[#03050c]/80 border-glass-border " + role.glow
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl transition-all duration-300 group-hover:scale-[1.08] group-hover:rotate-[3deg] ${isActive ? role.color : "bg-[#050811] text-slate-500"}`}>
                          <Icon size={15} />
                        </div>
                        <div className="flex-grow text-left">
                          <h4 className="text-xs font-extrabold text-white leading-none">{role.title}</h4>
                          <p className="text-[10px] text-slate-500 group-hover:text-slate-300 transition-colors mt-1 leading-normal">{role.desc}</p>
                        </div>
                        {isActive && (
                          <div className="h-4.5 w-4.5 rounded-full bg-accent-blue flex items-center justify-center text-white text-[9px] font-bold shadow-[0_0_8px_rgba(59,130,246,0.5)]">
                            ✓
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Column 2: Inputs */}
              <div className="lg:col-span-7 lg:pl-8 space-y-4 text-left">
                <div className="flex items-center gap-2 pb-2 border-b border-glass-border/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-blue"></span>
                  <h3 className="text-xs font-bold tracking-wider uppercase text-slate-300">2. Register details</h3>
                </div>

                {error && (
                  <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs px-3.5 py-2.5 rounded-xl animate-shake">
                    <AlertCircle size={14} className="shrink-0" />
                    <span className="font-semibold">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Dynamic conditional name block (Admin does not require name since backend defaults it) */}
                  {selectedRole !== "admin" && (
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Full name</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          required
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full bg-[#03050c] border border-glass-border text-slate-200 text-xs rounded-xl pl-9.5 pr-4 py-3 outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/30 transition"
                        />
                        <User size={14} className="absolute left-3.5 top-3.5 text-slate-500" />
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Email address</label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-[#03050c] border border-glass-border text-slate-200 text-xs rounded-xl pl-9.5 pr-4 py-3 outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/30 transition"
                      />
                      <Mail size={14} className="absolute left-3.5 top-3.5 text-slate-500" />
                    </div>
                  </div>

                  {/* Password Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          required
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full bg-[#03050c] border border-glass-border text-slate-200 text-xs rounded-xl pl-9.5 pr-10 py-3 outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/30 transition"
                        />
                        <KeyRound size={14} className="absolute left-3.5 top-3.5 text-slate-500" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-500 hover:text-white"
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Confirm</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          required
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full bg-[#03050c] border border-glass-border text-slate-200 text-xs rounded-xl pl-9.5 pr-10 py-3 outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/30 transition"
                        />
                        <KeyRound size={14} className="absolute left-3.5 top-3.5 text-slate-500" />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3 text-slate-500 hover:text-white"
                        >
                          {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Admin Access Token Field */}
                  {selectedRole === "admin" && (
                    <div className="space-y-1.5 animate-fade-in">
                      <label className="text-[11px] font-bold text-accent-emerald uppercase tracking-widest flex items-center gap-1.5">
                        <ShieldAlert size={12} />
                        Admin Access Token
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          name="adminAccessToken"
                          required
                          placeholder="Enter admin token"
                          value={formData.adminAccessToken}
                          onChange={handleChange}
                          className="w-full bg-[#03050c] border border-accent-emerald/30 text-slate-200 text-xs rounded-xl pl-9.5 pr-4 py-3 outline-none focus:border-accent-emerald/50 focus:ring-1 focus:ring-accent-emerald/20 transition"
                        />
                        <KeyRound size={14} className="absolute left-3.5 top-3.5 text-slate-500" />
                      </div>
                    </div>
                  )}

                  {/* Submit */}
                  <Button type="submit" loading={loading} className="w-full py-3.5 text-xs font-bold rounded-xl mt-4">
                    Create Account
                  </Button>

                  {/* Google OAuth signup (disable if admin) */}
                  {selectedRole !== "admin" && (
                    <>
                      <div className="flex items-center my-4">
                        <div className="flex-grow h-[1px] bg-glass-border" />
                        <span className="text-[9px] text-slate-500 uppercase px-2.5 font-bold">Or register with</span>
                        <div className="flex-grow h-[1px] bg-glass-border" />
                      </div>

                      <button
                        type="button"
                        onClick={handleGoogleSignup}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-slate-950 border border-glass-border hover:bg-slate-900 text-xs text-slate-200 font-bold py-3.5 px-4 rounded-xl transition"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                          <path
                            fill="#EA4335"
                            d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.111 4.114-3.478 0-6.3-2.822-6.3-6.3 0-3.478 2.822-6.3 6.3-6.3 1.63 0 3.11.63 4.23 1.64l3.15-3.15C19.29 2.45 15.98 1.1 12.24 1.1 6.13 1.1 1.1 6.13 1.1 12.24s5.03 11.14 11.14 11.14c6.19 0 11.23-5.04 11.23-11.24 0-.74-.08-1.46-.23-2.16H12.24z"
                          />
                        </svg>
                        Register with Google
                      </button>
                    </>
                  )}

                </form>
              </div>

            </div>
          </SpotlightCard>

          {/* Footer Navigation */}
          <p className="text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-accent-blue hover:underline font-bold">
              Sign in
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
};

export default Signup;
