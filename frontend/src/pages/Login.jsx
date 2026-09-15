import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  KeyRound,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import Button from "../components/Button";
import CosmicArt from "../components/CosmicArt";
import { sendResetPasswordOtp, verifyResetPasswordOtp, changePassword } from "../services/authService";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [authMode, setAuthMode] = useState("login");
  const [resetStep, setResetStep] = useState("email");
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
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

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

    setLoading(true);
    setError("");

    try {
      const response = await login(formData.email, formData.password);
      if (response.success) {
        if (response.requires2FA) {
          navigate(`/verify-2fa?email=${encodeURIComponent(formData.email)}`);
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(response.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to sign in. Please check network connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const apiBaseUrl = import.meta.env.DEV
      ? import.meta.env.VITE_API_URL || "http://localhost:5000/api"
      : "/api";
    window.location.href = `${apiBaseUrl}/auth/google`;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setError("Email address is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await sendResetPasswordOtp(resetEmail.trim());
      setResetStep("otp");
      setOtpValues(["", "", "", "", "", ""]);
      setTimer(600);
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
    <div className="w-screen min-h-screen bg-[#09061a] flex flex-col md:flex-row overflow-x-hidden text-white font-sans select-none">
      
      <div className="w-full md:w-5/12 lg:w-1/2 shrink-0">
        <CosmicArt
          title="SIGN IN TO YOUR"
          highlightText="ADVENTURE!"
          navLinkText="DON'T HAVE AN ACCOUNT?"
          navLinkPath="/signup"
          navActionText="SIGN UP"
        />
      </div>

      <div className="w-full md:w-7/12 lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-[#09061a] relative min-h-[500px]">
        
        <div className="hidden md:flex justify-end items-center text-xs tracking-wider uppercase font-semibold text-gray-400">
          <span>DON'T HAVE AN ACCOUNT?</span>
          <Link to="/signup" className="ml-2 font-extrabold text-white hover:text-cyan-400 transition">
            SIGN UP
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto my-auto space-y-6 pt-4 pb-8">
          
          {authMode === "login" ? (
            <div className="space-y-1 text-left">
              <h2 className="text-3xl sm:text-4xl font-black tracking-wider text-white uppercase font-display">
                SIGN IN
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 font-medium">
                Sign in with email address
              </p>
            </div>
          ) : (
            <div className="space-y-2 text-left">
              <button
                type="button"
                onClick={handleGoBackToLogin}
                className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-bold cursor-pointer transition"
              >
                <ArrowLeft size={13} /> Back to Sign In
              </button>
              <h2 className="text-2xl sm:text-3xl font-black tracking-wider text-white uppercase font-display">
                RESET PASSWORD
              </h2>
              <p className="text-xs text-gray-400 font-medium">
                Enter your details to verify and change password
              </p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2.5 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs px-4 py-3 rounded-xl">
              <AlertCircle size={15} className="shrink-0 text-rose-400" />
              <span className="font-semibold text-left">{error}</span>
            </div>
          )}

          {authMode === "login" && (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              
              <div className="space-y-1">
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Yourname@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#181335] border border-[#2e235a] focus:border-[#7c3aed] text-white text-xs sm:text-sm rounded-xl pl-11 pr-4 py-3.5 outline-none transition shadow-inner placeholder-gray-500"
                  />
                  <Mail size={16} className="absolute left-4 top-3.5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-[#181335] border border-[#2e235a] focus:border-[#7c3aed] text-white text-xs sm:text-sm rounded-xl pl-11 pr-11 py-3.5 outline-none transition shadow-inner placeholder-gray-500"
                  />
                  <KeyRound size={16} className="absolute left-4 top-3.5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="text-right pt-1">
                  <span
                    onClick={() => setAuthMode("forgot-password")}
                    className="text-[11px] text-purple-400 hover:text-purple-300 font-bold cursor-pointer hover:underline"
                  >
                    Forgot Password?
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-purple-950/50 transition cursor-pointer flex items-center justify-center"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <div className="relative flex py-3 items-center">
                <div className="flex-grow border-t border-[#2e235a]"></div>
                <span className="flex-shrink mx-4 text-[10px] uppercase font-bold text-gray-400 tracking-wider">Or continue with</span>
                <div className="flex-grow border-t border-[#2e235a]"></div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
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

            </form>
          )}

          {authMode === "forgot-password" && resetStep === "email" && (
            <form onSubmit={handleSendOTP} className="space-y-4 text-left">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Yourname@gmail.com"
                  value={resetEmail}
                  onChange={(e) => {
                    setResetEmail(e.target.value);
                    setError("");
                  }}
                  className="w-full bg-[#181335] border border-[#2e235a] focus:border-[#7c3aed] text-white text-xs sm:text-sm rounded-xl pl-11 pr-4 py-3.5 outline-none transition shadow-inner placeholder-gray-500"
                />
                <Mail size={16} className="absolute left-4 top-3.5 text-gray-400" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-purple-950/50 transition cursor-pointer flex items-center justify-center"
              >
                {loading ? "Sending Code..." : "Send Verification Code"}
              </button>
            </form>
          )}

          {authMode === "forgot-password" && resetStep === "otp" && (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <p className="text-xs text-gray-300 font-medium text-center">
                We sent a 6-digit verification code to <br />
                <span className="font-bold text-cyan-300">{resetEmail}</span>
              </p>

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
                    className="w-11 h-12 text-center text-lg font-extrabold bg-[#181335] border border-[#2e235a] focus:border-[#7c3aed] text-white rounded-xl outline-none"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-sm tracking-wide transition cursor-pointer"
              >
                {loading ? "Verifying..." : "Verify OTP Code"}
              </button>

              <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                {timer > 0 ? (
                  <span>Resend code in {formatTimer(timer)}</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendLoading}
                    className="text-purple-400 hover:text-purple-300 font-bold cursor-pointer"
                  >
                    {resendLoading ? "Sending..." : "Resend OTP Code"}
                  </button>
                )}
              </div>
            </form>
          )}

          {authMode === "forgot-password" && resetStep === "new-password" && (
            <form onSubmit={handleUpdatePassword} className="space-y-4 text-left">
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full bg-[#181335] border border-[#2e235a] focus:border-[#7c3aed] text-white text-xs sm:text-sm rounded-xl pl-11 pr-11 py-3.5 outline-none transition shadow-inner placeholder-gray-500"
                />
                <KeyRound size={16} className="absolute left-4 top-3.5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-white cursor-pointer"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full bg-[#181335] border border-[#2e235a] focus:border-[#7c3aed] text-white text-xs sm:text-sm rounded-xl pl-11 pr-11 py-3.5 outline-none transition shadow-inner placeholder-gray-500"
                />
                <KeyRound size={16} className="absolute left-4 top-3.5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-white cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-sm tracking-wide transition cursor-pointer"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}

          {authMode === "forgot-password" && resetStep === "success" && (
            <div className="text-center space-y-4 py-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Password Updated</h3>
              <p className="text-xs text-gray-400">
                Your password has been reset successfully.
              </p>
              <button
                onClick={handleGoBackToLogin}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-sm"
              >
                Sign in
              </button>
            </div>
          )}

        </div>

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

export default Login;
