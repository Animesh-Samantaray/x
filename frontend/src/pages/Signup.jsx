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
  GraduationCap,
  Users,
  UserCheck,
  Settings,
  ShieldAlert,
} from "lucide-react";
import CosmicArt from "../components/CosmicArt";

const Signup = () => {
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("learner");
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

  const roles = [
    { id: "learner", title: "Learner", icon: GraduationCap },
    { id: "creator", title: "Creator", icon: Users },
    { id: "expert", title: "Expert", icon: UserCheck },
    { id: "admin", title: "Admin", icon: Settings },
  ];

  return (
    <div className="w-screen min-h-screen bg-[#09061a] flex flex-col md:flex-row overflow-x-hidden text-white font-sans select-none">
      
      {/* Left Column: Cosmic Space Banner */}
      <div className="w-full md:w-5/12 lg:w-1/2 shrink-0">
        <CosmicArt
          title="JOIN THE"
          highlightText="ADVENTURE!"
          navLinkText="HAVE AN ACCOUNT?"
          navLinkPath="/login"
          navActionText="SIGN IN"
        />
      </div>

      {/* Right Column: Dark Cosmic Auth Form */}
      <div className="w-full md:w-7/12 lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-[#09061a] relative min-h-[550px]">
        
        {/* Top Header Navigation for Desktop */}
        <div className="hidden md:flex justify-end items-center text-xs tracking-wider uppercase font-semibold text-gray-400">
          <span>HAVE AN ACCOUNT?</span>
          <Link to="/login" className="ml-2 font-extrabold text-white hover:text-cyan-400 transition">
            SIGN IN
          </Link>
        </div>

        {/* Center Container */}
        <div className="w-full max-w-md mx-auto my-auto space-y-5 pt-4 pb-6">
          
          {/* Section Titles */}
          <div className="space-y-1 text-left">
            <h2 className="text-3xl sm:text-4xl font-black tracking-wider text-white uppercase font-display">
              SIGN UP
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-medium">
              Create an account to start your learning path
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Select Workspace Role
            </label>
            <div className="grid grid-cols-4 gap-2">
              {roles.map((r) => {
                const Icon = r.icon;
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleSelect(r.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      isSelected
                        ? "bg-[#281b5c] border-[#7c3aed] text-white shadow-md shadow-purple-950/50"
                        : "bg-[#140f2e] border-[#2e235a] text-gray-400 hover:border-gray-500 hover:text-gray-200"
                    }`}
                  >
                    <Icon size={16} className={isSelected ? "text-cyan-300" : "text-gray-400"} />
                    <span className="mt-1 text-[11px]">{r.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-2.5 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs px-4 py-3 rounded-xl">
              <AlertCircle size={15} className="shrink-0 text-rose-400" />
              <span className="font-semibold text-left">{error}</span>
            </div>
          )}

          {/* SIGNUP FORM */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
            
            {/* Full Name Input (Not for admin) */}
            {selectedRole !== "admin" && (
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#181335] border border-[#2e235a] focus:border-[#7c3aed] text-white text-xs sm:text-sm rounded-xl pl-11 pr-4 py-3 outline-none transition shadow-inner placeholder-gray-500"
                />
                <User size={16} className="absolute left-4 top-3.5 text-gray-400" />
              </div>
            )}

            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                placeholder="Yourname@gmail.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#181335] border border-[#2e235a] focus:border-[#7c3aed] text-white text-xs sm:text-sm rounded-xl pl-11 pr-4 py-3 outline-none transition shadow-inner placeholder-gray-500"
              />
              <Mail size={16} className="absolute left-4 top-3.5 text-gray-400" />
            </div>

            {/* Password & Confirm Password Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#181335] border border-[#2e235a] focus:border-[#7c3aed] text-white text-xs rounded-xl pl-11 pr-10 py-3 outline-none transition shadow-inner placeholder-gray-500"
                />
                <KeyRound size={16} className="absolute left-4 top-3.5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-[#181335] border border-[#2e235a] focus:border-[#7c3aed] text-white text-xs rounded-xl pl-11 pr-10 py-3 outline-none transition shadow-inner placeholder-gray-500"
                />
                <KeyRound size={16} className="absolute left-4 top-3.5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-white cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Admin Token (if admin role) */}
            {selectedRole === "admin" && (
              <div className="relative">
                <input
                  type="password"
                  name="adminAccessToken"
                  required
                  placeholder="Admin Access Token"
                  value={formData.adminAccessToken}
                  onChange={handleChange}
                  className="w-full bg-[#181335] border border-amber-500/40 focus:border-amber-400 text-white text-xs sm:text-sm rounded-xl pl-11 pr-4 py-3 outline-none transition shadow-inner placeholder-gray-500"
                />
                <ShieldAlert size={16} className="absolute left-4 top-3.5 text-amber-400" />
              </div>
            )}

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-purple-950/50 transition cursor-pointer flex items-center justify-center mt-2"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>

            {/* Separator */}
            {selectedRole !== "admin" && (
              <>
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-[#2e235a]"></div>
                  <span className="flex-shrink mx-4 text-[10px] uppercase font-bold text-gray-400 tracking-wider">Or continue with</span>
                  <div className="flex-grow border-t border-[#2e235a]"></div>
                </div>

                {/* Social Login Button */}
                <div>
                  <button
                    type="button"
                    onClick={handleGoogleSignup}
                    disabled={loading}
                    className="w-full bg-[#1c1540] hover:bg-[#271d57] border border-[#2e235a] text-white text-xs sm:text-sm font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2.5 cursor-pointer transition"
                  >
                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.111 4.114-3.478 0-6.3-2.822-6.3-6.3 0-3.478 2.822-6.3 6.3-6.3 1.63 0 3.11.63 4.23 1.64l3.15-3.15C19.29 2.45 15.98 1.1 12.24 1.1 6.13 1.1 1.1 6.13 1.1 12.24s5.03 11.14 11.14 11.14c6.19 0 11.23-5.04 11.23-11.24 0-.74-.08-1.46-.23-2.16H12.24z"
                      />
                    </svg>
                    Continue with Google
                  </button>
                </div>
              </>
            )}

          </form>

        </div>

        {/* Bottom Disclaimer */}
        <div className="text-center pt-6 pb-2 text-[11px] text-gray-400 font-medium">
          By registering you with our{" "}
          <Link to="/" className="text-purple-400 hover:text-purple-300 font-bold underline">
            Terms and Conditions
          </Link>
        </div>

      </div>

    </div>
  );
};

export default Signup;
