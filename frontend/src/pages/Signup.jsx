import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  KeyRound,
  AlertCircle,
  Eye,
  EyeOff,
  Share2,
  GraduationCap,
  Users,
  UserCheck,
  Settings,
  ShieldAlert,
  Check
} from "lucide-react";
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
      navigate("/dashboard");
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
        navigate("/dashboard");
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
    <div className="min-h-screen w-screen bg-transparent flex grid grid-cols-1 md:grid-cols-12 overflow-hidden relative select-none">
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none z-0"></div>
      
      <div className="hidden md:flex md:col-span-5 bg-bg-dark border-r border-glass-border/30 flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute inset-0 line-grid opacity-15 pointer-events-none"></div>
        <div className="glow-orb w-[300px] h-[300px] bg-accent-blue/5 top-[-50px] left-[-50px]"></div>
        <div className="glow-orb w-[280px] h-[280px] bg-accent-purple/5 bottom-[10%] right-[-50px]"></div>
        
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-text-title z-10 select-none hover:opacity-85 transition">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-accent p-[1px] shadow-[0_0_15px_rgba(59,130,246,0.25)]">
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-bg-deep">
              <Share2 size={14} className="text-accent-blue" />
            </div>
          </div>
          <span className="font-extrabold tracking-widest text-text-title text-base">CKM</span>
        </Link>

        {/* Copywriting */}
        <div className="my-auto space-y-6 z-10 text-left relative max-w-sm">
          <div className="space-y-2">
            <h1 className="hero-heading text-3xl font-extrabold text-text-title leading-tight">
              Join the marketplace
            </h1>
            <p className="text-xs text-accent-purple font-bold tracking-wider uppercase">
              Configure your workspace path.
            </p>
          </div>
          
          <p className="text-xs text-text-main leading-relaxed">
            Create an account to start sharing templates, reading production masterclasses, booking specialists, or auditing system activities.
          </p>

          <div className="space-y-3.5 border-t border-glass-border/30 pt-5">
            <div className="flex items-start gap-2.5">
              <div className="h-5 w-5 rounded-md bg-accent-blue/15 text-accent-blue flex items-center justify-center shrink-0 mt-0.5">
                <Check size={11} strokeWidth={3} />
              </div>
              <p className="text-[11px] text-text-muted leading-snug">
                <strong className="text-text-main font-bold">Vetted technical assets:</strong> Access zero-trust setups, Raft consensuses, and Next.js guides.
              </p>
            </div>
            
            <div className="flex items-start gap-2.5">
              <div className="h-5 w-5 rounded-md bg-accent-purple/15 text-accent-purple flex items-center justify-center shrink-0 mt-0.5">
                <Check size={11} strokeWidth={3} />
              </div>
              <p className="text-[11px] text-text-muted leading-snug">
                <strong className="text-text-main font-bold">Monetize experience:</strong> Publish guides or offer scheduled 1:1 consultation availability as a Creator or Expert.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 z-10 border-t border-glass-border/20 pt-4 text-left">
          <div>
            <span className="block text-md font-bold text-text-title">10K+</span>
            <span className="text-[9px] uppercase tracking-wider text-text-muted">Builders</span>
          </div>
          <div>
            <span className="block text-md font-bold text-text-title">500+</span>
            <span className="text-[9px] uppercase tracking-wider text-text-muted">Guides</span>
          </div>
          <div>
            <span className="block text-md font-bold text-text-title">99.9%</span>
            <span className="text-[9px] uppercase tracking-wider text-text-muted">Uptime</span>
          </div>
        </div>
      </div>

      <div className="col-span-1 md:col-span-7 flex flex-col justify-center px-6 sm:px-12 py-12 z-10 h-full overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto space-y-6">
          
          <div className="text-center md:text-left space-y-1">
            <Link to="/" className="inline-flex md:hidden items-center gap-2 text-md font-bold text-text-title tracking-wider mb-2">
              <span className="h-2 w-2 rounded bg-gradient-accent"></span>
              CKM
            </Link>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-title tracking-tight">Create account</h2>
            <p className="text-xs sm:text-sm text-text-muted font-medium">
              Choose your profile role to unlock specialized workspace layouts.
            </p>
          </div>

          <SpotlightCard className="p-6 bg-glass-card border border-glass-border rounded-2xl shadow-2xl relative" glowColor="rgba(59, 130, 246, 0.08)">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:divide-x lg:divide-glass-border">
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-glass-border/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-blue"></span>
                  <h3 className="text-xs font-bold tracking-wider uppercase text-text-title">1. Account Role</h3>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { id: "learner", title: "Learner", desc: "Access study masterclasses", icon: GraduationCap, color: "bg-accent-blue/15 text-accent-blue border-accent-blue/30" },
                    { id: "creator", title: "Creator", desc: "Publish assets and guides", icon: Users, color: "bg-accent-purple/15 text-accent-purple border-accent-purple/30" },
                    { id: "expert", title: "Expert", desc: "List schedules and consult", icon: UserCheck, color: "bg-accent-orange/15 text-accent-orange border-accent-orange/30" },
                    { id: "admin", title: "Admin", desc: "Audit and moderation actions", icon: Settings, color: "bg-accent-emerald/15 text-accent-emerald border-accent-emerald/30" }
                  ].map((role) => {
                    const Icon = role.icon;
                    const isActive = selectedRole === role.id;
                    return (
                      <div
                        key={role.id}
                        onClick={() => handleRoleSelect(role.id)}
                        className={`group flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
                          isActive
                            ? "bg-bg-darker/90 border-text-muted shadow-md"
                            : "bg-bg-dark/40 border-glass-border hover:border-glass-border-hover"
                        }`}
                      >
                        <div className={`p-2 rounded-xl transition duration-150 group-hover:scale-105 ${isActive ? role.color : "bg-bg-deep text-text-muted"}`}>
                          <Icon size={14} />
                        </div>
                        <div className="flex-grow text-left leading-tight">
                          <h4 className="text-xs font-extrabold text-text-title">{role.title}</h4>
                          <p className="text-[10px] text-text-muted mt-0.5 leading-normal">{role.desc}</p>
                        </div>
                        {isActive && (
                          <div className="h-4 w-4 rounded-full bg-accent-blue flex items-center justify-center text-white text-[8px] font-bold">
                            ✓
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-7 lg:pl-8 space-y-4 text-left">
                <div className="flex items-center gap-2 pb-2 border-b border-glass-border/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-blue"></span>
                  <h3 className="text-xs font-bold tracking-wider uppercase text-text-title">2. Details</h3>
                </div>

                {error && (
                  <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs px-3.5 py-2.5 rounded-xl">
                    <AlertCircle size={14} className="shrink-0" />
                    <span className="font-semibold text-left">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {selectedRole !== "admin" && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Full name</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          required
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full form-input text-xs rounded-xl pl-9.5 pr-4 py-2.5"
                        />
                        <User size={14} className="absolute left-3.5 top-3 text-text-muted" />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Email address</label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full form-input text-xs rounded-xl pl-9.5 pr-4 py-2.5"
                      />
                      <Mail size={14} className="absolute left-3.5 top-3 text-text-muted" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          required
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full form-input text-xs rounded-xl pl-9.5 pr-10 py-2.5"
                        />
                        <KeyRound size={14} className="absolute left-3.5 top-3 text-text-muted" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-text-muted hover:text-text-title cursor-pointer"
                        >
                          {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Confirm</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          required
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full form-input text-xs rounded-xl pl-9.5 pr-10 py-2.5"
                        />
                        <KeyRound size={14} className="absolute left-3.5 top-3 text-text-muted" />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-2.5 text-text-muted hover:text-text-title cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {selectedRole === "admin" && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-accent-emerald uppercase tracking-widest flex items-center gap-1.5">
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
                          className="w-full bg-bg-dark border border-accent-emerald/30 text-text-main text-xs rounded-xl pl-9.5 pr-4 py-2.5 outline-none focus:border-accent-emerald/50 focus:ring-1 focus:ring-accent-emerald/10 transition"
                        />
                        <KeyRound size={14} className="absolute left-3.5 top-3.5 text-text-muted" />
                      </div>
                    </div>
                  )}

                  <Button type="submit" loading={loading} className="w-full py-3 text-xs font-bold rounded-xl mt-3">
                    Create Account
                  </Button>

                  {selectedRole !== "admin" && (
                    <>
                      <div className="flex items-center my-3.5">
                        <div className="flex-grow h-[1px] bg-glass-border" />
                        <span className="text-[8px] text-text-muted uppercase px-2.5 font-bold">Or register with</span>
                        <div className="flex-grow h-[1px] bg-glass-border" />
                      </div>

                      <button
                        type="button"
                        onClick={handleGoogleSignup}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-bg-darker border border-glass-border hover:bg-glass-border text-xs text-text-main hover:text-text-title font-bold py-3 px-4 rounded-xl transition cursor-pointer"
                      >
                        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                          <path
                            fill="#EA4335"
                            d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.111 4.114-3.478 0-6.3-2.822-6.3-6.3 0-3.478 2.822-6.3 6.3-6.3 1.63 0 3.11.63 4.23 1.64l3.15-3.15C19.29 2.45 15.98 1.1 12.24 1.1 6.13 1.1 1.1 6.13 1.1 12.24s5.03 11.14 11.14 11.14c6.19 0 11.23-5.04 11.23-11.24 0-.74-.08-1.46-.23-2.16H12.24z"
                          />
                        </svg>
                        Continue with Google
                      </button>
                    </>
                  )}

                </form>
              </div>

            </div>
          </SpotlightCard>

          <p className="text-center text-xs text-text-muted">
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
