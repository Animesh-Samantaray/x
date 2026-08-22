import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, KeyRound, AlertCircle, Eye, EyeOff, Sparkles, Share2, ArrowLeft, CheckCircle2, ShieldCheck, Heart } from "lucide-react";
import SpotlightCard from "../components/SpotlightCard";
import Button from "../components/Button";
import { sendResetPasswordOtp, verifyResetPasswordOtp, changePassword } from "../services/authService";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Normal Login states
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot Password states
  const [authMode, setAuthMode] = useState("login"); // "login" | "forgot-password"
  const [resetStep, setResetStep] = useState("email"); // "email" | "otp" | "new-password" | "success"
  const [resetEmail, setResetEmail] = useState("");
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timer, setTimer] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    const errParam = searchParams.get("error");
    if (errParam) {
      if (errParam === "google_auth_failed") {
        setError("Google authentication was cancelled or failed.");
      } else {
        setError(errParam);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Countdown timer for OTP
  useEffect(() => {
    let interval = null;
    if (authMode === "forgot-password" && resetStep === "otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [authMode, resetStep, timer]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validateForm = () => {
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
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError("");
      
      const result = await login(formData.email.trim(), formData.password);
      if (result.success) {
        navigate("/");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  // Forgot Password flow handlers
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setError("Email address is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await sendResetPasswordOtp(resetEmail.trim());
      setResetStep("otp");
      setOtpValues(["", "", "", "", "", ""]);
      setTimer(600); // 10 minutes count
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please check email address.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setResendLoading(true);
      setError("");
      await sendResetPasswordOtp(resetEmail.trim());
      setOtpValues(["", "", "", "", "", ""]);
      setTimer(600);
      setTimeout(() => {
        const firstInput = document.getElementById("otp-input-0");
        if (firstInput) firstInput.focus();
      }, 50);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleOtpChange = (e, index) => {
    const val = e.target.value.slice(-1);
    if (val && !/^\d$/.test(val)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = val;
    setOtpValues(newOtpValues);
    setError("");

    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtpValues = [...otpValues];
      
      if (!otpValues[index] && index > 0) {
        newOtpValues[index - 1] = "";
        setOtpValues(newOtpValues);
        const prevInput = document.getElementById(`otp-input-${index - 1}`);
        if (prevInput) {
          prevInput.focus();
        }
      } else {
        newOtpValues[index] = "";
        setOtpValues(newOtpValues);
      }
      setError("");
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtpValues(digits);
      setError("");
      const lastInput = document.getElementById("otp-input-5");
      if (lastInput) lastInput.focus();
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpString = otpValues.join("");
    if (otpString.length < 6) {
      setError("Please enter all 6 digits of the verification code.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const result = await verifyResetPasswordOtp(resetEmail.trim(), otpString);
      if (result.success) {
        setResetStep("new-password");
      } else {
        setError(result.message || "Invalid verification code. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      setError("Password is required");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const otpString = otpValues.join("");
    try {
      setLoading(true);
      setError("");
      const result = await changePassword(resetEmail.trim(), otpString, newPassword);
      if (result.success) {
        setResetStep("success");
      } else {
        setError(result.message || "Failed to reset password. Please restart flow.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBackToLogin = () => {
    setAuthMode("login");
    setResetStep("email");
    setError("");
  };

  return (
    <div className="min-h-screen w-screen bg-[#02040a] flex grid grid-cols-1 lg:grid-cols-12 overflow-hidden relative select-none">
      
      {/* Background grid */}
      <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none z-0"></div>
      
      {/* Left panel branding */}
      <div className="hidden lg:flex lg:col-span-5 bg-[#050811]/60 border-r border-glass-border/30 flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute inset-0 line-grid opacity-20 pointer-events-none"></div>
        <div className="glow-orb w-[300px] h-[300px] bg-accent-cyan/10 top-[-50px] left-[-50px] animate-glow"></div>
        <div className="glow-orb w-[280px] h-[280px] bg-accent-orange/5 bottom-[10%] right-[-50px] animate-glow" style={{ animationDelay: "-4s" }}></div>
        
        {/* Branding Title */}
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-white z-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-accent p-[1px] shadow-[0_0_15px_rgba(59,130,246,0.25)]">
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-bg-deep">
              <Share2 size={14} className="text-accent-blue" />
            </div>
          </div>
          <span className="font-extrabold tracking-widest text-slate-100 text-base">CKM</span>
        </Link>

        {/* Dynamic graphics */}
        <div className="my-auto space-y-7 z-10 text-left relative">
          <div className="flex flex-wrap gap-2 mb-2">
            <div className="sticker sticker-blue rotate-[-2deg]">
              <span>🎓 LEARN</span>
            </div>
            <div className="sticker sticker-orange rotate-[3deg]">
              <span>◈ CONNECT</span>
            </div>
            <div className="sticker sticker-purple rotate-[-1deg]">
              <span>✦ CREATE</span>
            </div>
            <div className="sticker sticker-pink rotate-[4deg]">
              <span>✦ SHARE</span>
            </div>
          </div>
          
          <h1 className="hero-heading text-4xl leading-tight">
            Exchange verified <br />
            technical <span className="text-gradient-cyan">knowledge.</span>
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            Access secure guides, notes, and private consultations curated by specialists.
          </p>

          <div className="relative h-44 w-full max-w-[280px] bg-[#03050c] border border-glass-border rounded-2xl p-4 shadow-2xl flex items-center justify-center">
            <div className="h-10 w-10 rounded-xl bg-gradient-accent p-[1.5px] z-20 shadow-lg animate-float">
              <div className="h-full w-full rounded-xl bg-[#02040a] flex items-center justify-center text-white">
                <Share2 size={16} />
              </div>
            </div>
            <svg className="absolute inset-0 h-full w-full text-slate-800 pointer-events-none" fill="none" viewBox="0 0 280 176">
              <line x1="68" y1="40" x2="140" y2="88" stroke="currentColor" strokeWidth={1.5} strokeDasharray="3 3" />
              <line x1="80" y1="135" x2="140" y2="88" stroke="currentColor" strokeWidth={1.5} strokeDasharray="3 3" />
              <line x1="220" y1="50" x2="140" y2="88" stroke="currentColor" strokeWidth={1.5} strokeDasharray="3 3" />
            </svg>
          </div>
        </div>

        <p className="text-[10px] text-slate-600 font-medium z-10">
          &copy; {new Date().getFullYear()} Collaborative Knowledge Marketplace.
        </p>
      </div>

      {/* Right panel interactive form */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-center px-6 sm:px-16 py-12 z-10 h-full overflow-y-auto">
        <div className="w-full max-w-md mx-auto space-y-6">
          
          {/* Header */}
          <div className="text-center lg:text-left space-y-2">
            <Link to="/" className="inline-flex lg:hidden items-center gap-2 text-md font-bold text-white tracking-wider mb-2">
              <span className="h-2 w-2 rounded bg-gradient-accent"></span>
              CKM
            </Link>
            
            {authMode === "login" ? (
              <>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Welcome back</h2>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  Enter your credentials below to log in.
                </p>
              </>
            ) : (
              <>
                <div
                  onClick={handleGoBackToLogin}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white cursor-pointer transition font-bold"
                >
                  <ArrowLeft size={13} /> Back to Login
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-3">Reset password</h2>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  Complete verification fields to set a new password.
                </p>
              </>
            )}
          </div>

          {/* Form surface */}
          <SpotlightCard className="p-6 sm:p-8 bg-[#050811]/50 border border-glass-border rounded-2xl shadow-2xl relative" glowColor="rgba(59, 130, 246, 0.12)">
            
            {/* Global Errors */}
            {error && (
              <div className="mb-5 flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs px-3.5 py-2.5 rounded-xl animate-shake">
                <AlertCircle size={14} className="shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {/* LOGIN STATE */}
            {authMode === "login" && (
              <form onSubmit={handleSubmit} className="space-y-4.5">
                {/* Email */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Email address</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-[#03050c] border border-glass-border text-slate-200 text-xs rounded-xl pl-9.5 pr-4 py-3 outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/30 transition duration-200"
                    />
                    <Mail size={14} className="absolute left-3.5 top-3.5 text-slate-500" />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
                    <span
                      onClick={() => setAuthMode("forgot-password")}
                      className="text-[11px] text-accent-blue hover:underline cursor-pointer font-bold"
                    >
                      Forgot password?
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-[#03050c] border border-glass-border text-slate-200 text-xs rounded-xl pl-9.5 pr-10 py-3 outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/30 transition duration-200"
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

                {/* Submit */}
                <Button type="submit" loading={loading} className="w-full py-3 text-xs font-bold rounded-xl shadow-lg mt-2">
                  Sign in to Account
                </Button>

                {/* Separator */}
                <div className="flex items-center my-5">
                  <div className="flex-grow h-[1px] bg-glass-border" />
                  <span className="text-[10px] text-slate-500 uppercase px-3 font-bold">Or continue with</span>
                  <div className="flex-grow h-[1px] bg-glass-border" />
                </div>

                {/* Google Sign In */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2.5 bg-slate-950 border border-glass-border hover:bg-slate-900 text-xs text-slate-200 font-bold py-3 px-4 rounded-xl transition duration-200"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.111 4.114-3.478 0-6.3-2.822-6.3-6.3 0-3.478 2.822-6.3 6.3-6.3 1.63 0 3.11.63 4.23 1.64l3.15-3.15C19.29 2.45 15.98 1.1 12.24 1.1 6.13 1.1 1.1 6.13 1.1 12.24s5.03 11.14 11.14 11.14c6.19 0 11.23-5.04 11.23-11.24 0-.74-.08-1.46-.23-2.16H12.24z"
                    />
                  </svg>
                  Sign in with Google
                </button>
              </form>
            )}

            {/* FORGOT PASSWORD: STEP 1 (EMAIL INPUT) */}
            {authMode === "forgot-password" && resetStep === "email" && (
              <form onSubmit={handleSendOTP} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Email address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={resetEmail}
                      onChange={(e) => {
                        setResetEmail(e.target.value);
                        setError("");
                      }}
                      className="w-full bg-[#03050c] border border-glass-border text-slate-200 text-xs rounded-xl pl-9.5 pr-4 py-3 outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/30 transition duration-200"
                    />
                    <Mail size={14} className="absolute left-3.5 top-3.5 text-slate-500" />
                  </div>
                </div>

                <Button type="submit" loading={loading} className="w-full py-3 text-xs font-bold rounded-xl mt-2">
                  Send Verification Code
                </Button>
              </form>
            )}

            {/* FORGOT PASSWORD: STEP 2 (OTP DIGITS INPUT) */}
            {authMode === "forgot-password" && resetStep === "otp" && (
              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <div className="text-center">
                  <p className="text-xs text-slate-400 font-semibold">
                    We sent a 6-digit verification code to <br />
                    <span className="font-bold text-slate-200">{resetEmail}</span>
                  </p>
                </div>

                {/* OTP Codes */}
                <div className="flex justify-between gap-2 max-w-[320px] mx-auto">
                  {otpValues.map((val, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={1}
                      pattern="\d*"
                      value={val}
                      onChange={(e) => handleOtpChange(e, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      onPaste={idx === 0 ? handleOtpPaste : undefined}
                      className="w-11 h-12 text-center text-md font-extrabold text-white bg-[#03050c] border border-glass-border focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/30 rounded-xl outline-none transition"
                    />
                  ))}
                </div>

                <Button type="submit" loading={loading} className="w-full py-3 text-xs font-bold rounded-xl">
                  Verify OTP Code
                </Button>

                {/* Resend Controls */}
                <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                  {timer > 0 ? (
                    <span>Resend code in {formatTimer(timer)}</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={resendLoading}
                      className="text-accent-blue hover:underline font-bold"
                    >
                      {resendLoading ? "Sending..." : "Resend OTP Code"}
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* FORGOT PASSWORD: STEP 3 (NEW PASSWORD CONFIGURE) */}
            {authMode === "forgot-password" && resetStep === "new-password" && (
              <form onSubmit={handleUpdatePassword} className="space-y-4 text-left">
                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">New password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setError("");
                      }}
                      className="w-full bg-[#03050c] border border-glass-border text-slate-200 text-xs rounded-xl pl-9.5 pr-10 py-3 outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/30 transition"
                    />
                    <KeyRound size={14} className="absolute left-3.5 top-3.5 text-slate-500" />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-white"
                    >
                      {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Confirm password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError("");
                      }}
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

                <Button type="submit" loading={loading} className="w-full py-3 text-xs font-bold rounded-xl mt-2">
                  Update Password
                </Button>
              </form>
            )}

            {/* FORGOT PASSWORD: STEP 4 (SUCCESS REDIRECT) */}
            {authMode === "forgot-password" && resetStep === "success" && (
              <div className="text-center space-y-5 py-4 animate-fade-in">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-md">
                  <CheckCircle2 size={20} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-md font-bold text-white">Password configured</h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Your password has been updated. You can now log in using your new credentials.
                  </p>
                </div>
                <Button onClick={handleGoBackToLogin} className="w-full py-3 text-xs font-bold rounded-xl">
                  Sign in
                </Button>
              </div>
            )}

          </SpotlightCard>

          {/* Footer Navigation */}
          {authMode === "login" && (
            <p className="text-center text-xs text-slate-500">
              Don't have an account?{" "}
              <Link to="/signup" className="text-accent-blue hover:underline font-bold">
                Create account
              </Link>
            </p>
          )}

        </div>
      </div>

    </div>
  );
};

export default Login;
