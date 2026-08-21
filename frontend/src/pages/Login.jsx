import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, KeyRound, AlertCircle, Eye, EyeOff, Sparkles, Share2, ArrowLeft, CheckCircle2 } from "lucide-react";
import GlassCard from "../components/GlassCard";
import Button from "../components/Button";
import { sendResetPasswordOtp, verifyResetPasswordOtp, changePassword } from "../services/authService";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Normal Login states
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
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
  const [successMessage, setSuccessMessage] = useState("");
  
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
      setTimer(600); // Reset timer
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
      setError("Passwords don't match.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const otpString = otpValues.join("");
      const result = await changePassword(resetEmail.trim(), otpString, newPassword);
      if (result.success) {
        setResetStep("success");
        setSuccessMessage("Your password has been changed. You can now sign in with your new password.");
      } else {
        setError(result.message || "Failed to update password.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setAuthMode("login");
    setResetStep("email");
    setResetEmail("");
    setOtpValues(["", "", "", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccessMessage("");
    setTimer(0);
  };

  return (
    <div className="h-screen w-screen min-h-screen grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-bg-deep select-none relative z-10">
      
      {/* Background Glow */}
      <div className="absolute top-[20%] left-[60%] h-[350px] w-[350px] rounded-full ambient-glow-indigo opacity-30 pointer-events-none z-0"></div>

      {/* Left branding visual */}
      <div className="hidden lg:flex lg:col-span-7 bg-slate-950/20 border-r border-glass-border/30 flex-col justify-between p-12 relative overflow-hidden h-full">
        <div className="absolute inset-0 dot-grid pointer-events-none opacity-40"></div>
        
        <Link to="/" className="flex items-center gap-2 text-md font-bold text-white tracking-wider relative z-10">
          <span className="h-2 w-2 rounded bg-gradient-accent"></span>
          CKM
        </Link>

        <div className="my-auto space-y-8 relative z-10">
          <div className="space-y-4 max-w-lg">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-glass-border bg-slate-900/60 px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Sparkles size={10} className="text-accent-indigo" />
              <span>Exchange Knowledge</span>
            </div>
            <h1 className="text-5xl font-extrabold text-white leading-tight">
              Knowledge is meant <br />
              <span className="text-gradient-accent">to move.</span>
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              Connect with creators packaging practical assets, book live consulting sessions, and master new concepts in an active workspace.
            </p>
          </div>

          <div className="relative h-48 w-[360px] bg-slate-900/25 border border-glass-border/40 rounded-2xl p-6 shadow-2xl flex items-center justify-center">
            <div className="h-12 w-12 rounded-xl bg-gradient-accent p-[1px] relative z-20 shadow-lg animate-float">
              <div className="flex h-full w-full items-center justify-center rounded-xl bg-bg-deep text-white">
                <Share2 size={18} />
              </div>
            </div>
            <div className="absolute top-[12%] left-[12%] h-8 w-8 rounded-lg bg-slate-900 border border-glass-border flex items-center justify-center text-[10px] text-slate-400 font-bold z-10 hover:border-slate-500 transition duration-300">
              PDF
            </div>
            <div className="absolute bottom-[12%] left-[15%] h-8 w-8 rounded-lg bg-slate-900 border border-glass-border flex items-center justify-center text-[10px] text-slate-400 font-bold z-10 hover:border-slate-500 transition duration-300">
              1:1
            </div>
            <div className="absolute top-[20%] right-[12%] h-8 w-8 rounded-lg bg-slate-900 border border-glass-border flex items-center justify-center text-[10px] text-slate-400 font-bold z-10 hover:border-slate-500 transition duration-300">
              ZIP
            </div>
            
            <svg className="absolute inset-0 h-full w-full text-slate-800 pointer-events-none" fill="none" viewBox="0 0 360 192">
              <line x1="88" y1="44" x2="180" y2="96" stroke="currentColor" strokeWidth={1.5} strokeDasharray="3 3" />
              <line x1="96" y1="148" x2="180" y2="96" stroke="currentColor" strokeWidth={1.5} strokeDasharray="3 3" />
              <line x1="310" y1="52" x2="180" y2="96" stroke="currentColor" strokeWidth={1.5} strokeDasharray="3 3" />
            </svg>
          </div>
        </div>

        <p className="text-[10px] text-slate-600 relative z-10 font-medium">
          &copy; {new Date().getFullYear()} Collaborative Knowledge Marketplace.
        </p>
      </div>

      {/* Right authentication panel */}
      <div className="col-span-1 lg:col-span-5 flex flex-col justify-center px-6 sm:px-12 py-12 relative z-10 h-full">
        <div className="w-full max-w-sm mx-auto space-y-6">
          
          <div className="text-center lg:text-left space-y-1">
            <Link to="/" className="inline-flex lg:hidden items-center gap-2 text-md font-bold text-white tracking-wider mb-2">
              <span className="h-2 w-2 rounded bg-gradient-accent"></span>
              CKM
            </Link>
            {authMode === "login" ? (
              <>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Welcome back</h2>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  Continue your learning journey.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Forgot Password</h2>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  Safely recover your marketplace account.
                </p>
              </>
            )}
          </div>

          <GlassCard hoverEffect={false} className="border border-glass-border p-7 bg-slate-950/20 shadow-2xl">
            {error && (
              <div className="mb-4.5 flex items-start gap-2.5 rounded-xl bg-rose-500/5 border border-rose-500/20 p-3 text-[11px] text-rose-300 animate-fade-in">
                <AlertCircle className="shrink-0 mt-0.5" size={14} />
                <span className="leading-normal">{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4.5 flex items-start gap-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-3 text-[11px] text-emerald-300 animate-fade-in">
                <CheckCircle2 className="shrink-0 mt-0.5" size={14} />
                <span className="leading-normal">{successMessage}</span>
              </div>
            )}

            {authMode === "login" ? (
              <div className="animate-fade-in">
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {/* Email Address */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                        <Mail size={14} />
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@domain.com"
                        className="w-full rounded-xl bg-slate-950/60 border border-glass-border py-2 pl-9 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition duration-200"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Password
                      </label>
                    </div>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                        <KeyRound size={14} />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full rounded-xl bg-slate-950/60 border border-glass-border py-2 pl-9 pr-9 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition duration-200"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-white cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    
                    {/* Forgot Password trigger */}
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode("forgot-password");
                          setResetStep("email");
                          setResetEmail(formData.email);
                          setError("");
                          setSuccessMessage("");
                        }}
                        className="text-[10px] text-slate-400 hover:text-white transition duration-200 cursor-pointer font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </div>

                  {/* Submit Action */}
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full py-2.5 font-bold text-xs"
                    loading={loading}
                    disabled={loading}
                  >
                    Sign In
                  </Button>
                </form>

                <div className="relative flex py-4.5 items-center">
                  <div className="flex-grow border-t border-glass-border"></div>
                  <span className="flex-shrink mx-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">OR</span>
                  <div className="flex-grow border-t border-glass-border"></div>
                </div>

                {/* Google Login Redirect */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-glass-border bg-slate-950/40 hover:bg-slate-950/80 px-4 py-2.5 text-xs font-semibold text-slate-200 transition duration-200 hover:border-slate-500 cursor-pointer disabled:opacity-50"
                >
                  <svg className="h-4.5 w-4.5 text-white" viewBox="0 0 24 24">
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

                <div className="mt-5 border-t border-glass-border pt-4 text-center text-xs text-slate-400">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-accent-indigo hover:text-accent-purple font-semibold transition ml-1">
                    Create account
                  </Link>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in">
                {/* STEP 1: EMAIL REQUEST */}
                {resetStep === "email" && (
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={handleBackToLogin}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition duration-200 cursor-pointer font-medium"
                    >
                      <ArrowLeft size={14} /> Back to Login
                    </button>
                    
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white tracking-tight">Forgot your password?</h3>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        Enter your email and we'll send you a verification code.
                      </p>
                    </div>

                    <form onSubmit={handleSendOTP} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Email Address
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                            <Mail size={14} />
                          </span>
                          <input
                            type="email"
                            value={resetEmail}
                            onChange={(e) => {
                              setResetEmail(e.target.value);
                              setError("");
                            }}
                            placeholder="Enter your email"
                            className="w-full rounded-xl bg-slate-950/60 border border-glass-border py-2 pl-9 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition duration-200"
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full py-2.5 font-bold text-xs"
                        loading={loading}
                        disabled={loading}
                      >
                        Send OTP
                      </Button>
                    </form>
                  </div>
                )}

                {/* STEP 2: OTP VERIFICATION */}
                {resetStep === "otp" && (
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={handleBackToLogin}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition duration-200 cursor-pointer font-medium"
                    >
                      <ArrowLeft size={14} /> Back to Login
                    </button>

                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white tracking-tight">Verification code</h3>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        We've sent a 6-digit code to: <span className="text-slate-200 font-semibold">{resetEmail}</span>
                      </p>
                    </div>

                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                      {/* Email field (read-only/disabled) */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Email Address
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-600">
                            <Mail size={14} />
                          </span>
                          <input
                            type="email"
                            value={resetEmail}
                            disabled
                            className="w-full rounded-xl bg-slate-950/20 border border-glass-border/30 py-2 pl-9 pr-4 text-xs text-slate-500 opacity-60 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* OTP Inputs */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Verification Code
                        </label>
                        <div className="flex gap-2.5 justify-between py-1" onPaste={handleOtpPaste}>
                          {otpValues.map((val, idx) => (
                            <input
                              key={idx}
                              id={`otp-input-${idx}`}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={val}
                              onChange={(e) => handleOtpChange(e, idx)}
                              onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                              onFocus={(e) => e.target.select()}
                              className="w-10 h-12 text-center text-lg font-bold rounded-xl bg-slate-950/60 border border-glass-border focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo text-white placeholder-slate-600 transition duration-200 outline-none focus:shadow-[0_0_8px_rgba(99,102,241,0.4)]"
                              disabled={loading || timer === 0}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Timer & Expiry */}
                      <div className="flex flex-col items-center gap-2 mt-1">
                        {timer > 0 ? (
                          <span className="text-[11px] text-slate-400 font-medium">
                            Code expires in {formatTimer(timer)}
                          </span>
                        ) : (
                          <div className="flex flex-col items-center gap-1.5 w-full">
                            <span className="text-[11px] text-rose-400 font-bold">Code expired</span>
                            <button
                              type="button"
                              onClick={handleResendOTP}
                              disabled={resendLoading}
                              className="text-[11px] text-accent-indigo hover:text-accent-purple font-bold transition cursor-pointer disabled:opacity-50"
                            >
                              Resend OTP
                            </button>
                          </div>
                        )}
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full py-2.5 font-bold text-xs"
                        loading={loading}
                        disabled={loading || timer === 0}
                      >
                        Verify OTP
                      </Button>
                    </form>
                  </div>
                )}

                {/* STEP 3: CREATE NEW PASSWORD */}
                {resetStep === "new-password" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                      <CheckCircle2 size={16} />
                      <span className="text-xs font-bold uppercase tracking-wider">OTP verified ✓</span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white tracking-tight">Create a new password</h3>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        Set a secure password for your account (min. 6 characters).
                      </p>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                      {/* New Password */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          New Password
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                            <KeyRound size={14} />
                          </span>
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => {
                              setNewPassword(e.target.value);
                              setError("");
                            }}
                            placeholder="••••••••"
                            className="w-full rounded-xl bg-slate-950/60 border border-glass-border py-2 pl-9 pr-9 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition duration-200"
                            disabled={loading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-white cursor-pointer"
                          >
                            {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                            <KeyRound size={14} />
                          </span>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              setError("");
                            }}
                            placeholder="••••••••"
                            className="w-full rounded-xl bg-slate-950/60 border border-glass-border py-2 pl-9 pr-9 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition duration-200"
                            disabled={loading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-white cursor-pointer"
                          >
                            {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full py-2.5 font-bold text-xs"
                        loading={loading}
                        disabled={loading}
                      >
                        Update Password
                      </Button>
                    </form>
                  </div>
                )}

                {/* STEP 4: SUCCESS */}
                {resetStep === "success" && (
                  <div className="space-y-4 text-center py-2 animate-fade-in">
                    <div className="flex justify-center text-emerald-500 mb-1">
                      <CheckCircle2 size={40} className="animate-pulse" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-white tracking-tight">✓ Password updated successfully</h3>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium max-w-[280px] mx-auto">
                        Your password has been changed. You can now sign in with your new password.
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="primary"
                      onClick={handleBackToLogin}
                      className="w-full py-2.5 font-bold text-xs"
                    >
                      Back to Login
                    </Button>
                  </div>
                )}
              </div>
            )}
          </GlassCard>

        </div>
      </div>

    </div>
  );
};

export default Login;
