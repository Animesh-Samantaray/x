import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { resend2FA } from "../services/authService";
import {
  ShieldCheck,
  Share2,
  ArrowLeft,
  AlertCircle,
  Clock,
  RefreshCw,
  CheckCircle2,
  Lock
} from "lucide-react";
import SpotlightCard from "../components/SpotlightCard";
import Button from "../components/Button";
import toast from "react-hot-toast";

const Verify2FA = () => {
  const { verify2FA, isAuthenticated, getCurrentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();


  const emailFromState = location.state?.email;
  const emailFromQuery = searchParams.get("email");
  const email = emailFromState || emailFromQuery || "";

  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  

  const [expirationTimer, setExpirationTimer] = useState(600);
  

  const [cooldownTimer, setCooldownTimer] = useState(30);

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

 
  useEffect(() => {
    if (!email) {
      toast.error("Please sign in first to access two-factor authentication.");
      navigate("/login", { replace: true });
    }
  }, [email, navigate]);


  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);


  useEffect(() => {
    if (email && inputRefs[0]?.current) {
      inputRefs[0].current.focus();
    }
  }, [email]);


  useEffect(() => {
    let interval = null;
    if (expirationTimer > 0) {
      interval = setInterval(() => {
        setExpirationTimer((prev) => prev - 1);
      }, 1000);
    } else if (expirationTimer === 0) {
      setError("Verification code has expired. Please request a new code.");
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [expirationTimer]);


  useEffect(() => {
    let interval = null;
    if (cooldownTimer > 0) {
      interval = setInterval(() => {
        setCooldownTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cooldownTimer]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const maskEmail = (str) => {
    if (!str || !str.includes("@")) return str;
    const [local, domain] = str.split("@");
    if (local.length <= 2) {
      return `${local[0]}***@${domain}`;
    }
    return `${local[0]}${"*".repeat(local.length - 2)}${local[local.length - 1]}@${domain}`;
  };

  const handleOtpChange = (e, index) => {
    const val = e.target.value.slice(-1);
    if (val && !/^\d$/.test(val)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = val;
    setOtpValues(newOtpValues);
    setError("");

    if (val && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtpValues = [...otpValues];
      if (!otpValues[index] && index > 0) {
        newOtpValues[index - 1] = "";
        setOtpValues(newOtpValues);
        inputRefs[index - 1].current?.focus();
      } else {
        newOtpValues[index] = "";
        setOtpValues(newOtpValues);
      }
      setError("");
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtpValues(digits);
      setError("");
      inputRefs[5].current?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otpValues.join("");

    if (otpString.length < 6) {
      setError("Please enter all 6 digits of the verification code.");
      return;
    }

    if (expirationTimer === 0) {
      setError("Verification code has expired. Click resend to receive a new code.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await verify2FA(email, otpString);

      if (result.success) {
        toast.success("Two-Factor Authentication successful!");
        await getCurrentUser();
        navigate("/dashboard", { replace: true });
      } else {
        setError(result.message || "Invalid verification code. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldownTimer > 0 || resendLoading) return;

    try {
      setResendLoading(true);
      setError("");

      const result = await resend2FA(email);

      if (result.success) {
        toast.success("A new verification code has been sent to your email.");
        setOtpValues(["", "", "", "", "", ""]);
        setExpirationTimer(600); // Restart 10-min expiration
        setCooldownTimer(30);   // Restart 30-sec cooldown
        setTimeout(() => {
          inputRefs[0].current?.focus();
        }, 50);
      } else {
        setError(result.message || "Failed to resend verification code.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend verification code.");
    } finally {
      setResendLoading(false);
    }
  };

  const isOtpComplete = otpValues.join("").length === 6;

  if (!email) return null;

  return (
    <div className="min-h-screen w-screen bg-transparent flex items-center justify-center p-4 sm:p-6 relative select-none overflow-hidden">
      
      {/* Background grid pattern */}
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none z-0"></div>
      <div className="glow-orb w-[400px] h-[400px] bg-accent-blue/10 top-[-100px] left-[-100px] pointer-events-none"></div>
      <div className="glow-orb w-[350px] h-[350px] bg-accent-cyan/10 bottom-[-50px] right-[-50px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10 space-y-6">
        
        {/* Top Header / Branding */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-text-title transition hover:opacity-85">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-accent p-[1px] shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <div className="flex h-full w-full items-center justify-center rounded-xl bg-bg-deep">
                <Share2 size={14} className="text-accent-blue" />
              </div>
            </div>
            <span className="font-extrabold tracking-widest text-text-title text-base">CKM</span>
          </Link>

          <Link
            to="/login"
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-title transition font-bold"
          >
            <ArrowLeft size={13} /> Back to Sign in
          </Link>
        </div>

        {/* Security Card */}
        <SpotlightCard
          className="p-6 sm:p-8 bg-glass-card border border-glass-border rounded-2xl shadow-2xl relative text-left"
          glowColor="rgba(59, 130, 246, 0.12)"
        >
          {/* Security Header Icon */}
          <div className="flex flex-col items-center text-center space-y-3 mb-6">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-accent-blue/20 via-accent-cyan/15 to-transparent border border-accent-blue/30 flex items-center justify-center text-accent-blue shadow-lg shadow-accent-blue/10">
              <ShieldCheck size={28} />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-text-title tracking-tight">
                Two-Factor Authentication
              </h2>
              <p className="text-xs text-text-muted font-medium leading-relaxed max-w-xs mx-auto">
                We sent a 6-digit security code to
              </p>
              <div className="inline-flex items-center gap-1.5 bg-bg-darker border border-glass-border px-3 py-1 rounded-full mt-1">
                <Lock size={11} className="text-accent-cyan" />
                <span className="text-xs font-bold text-text-title font-mono">
                  {maskEmail(email)}
                </span>
              </div>
            </div>
          </div>

          {/* Error Message Area */}
          {error && (
            <div className="mb-5 flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs px-3.5 py-2.5 rounded-xl">
              <AlertCircle size={14} className="shrink-0 text-rose-400" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {/* OTP Verification Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 6-Digit Inputs */}
            <div className="space-y-2">
              <label className="block text-center text-[10px] font-bold text-text-muted uppercase tracking-widest">
                Enter 6-Digit Code
              </label>
              
              <div className="flex justify-between gap-1.5 sm:gap-2 max-w-[320px] mx-auto">
                {otpValues.map((val, idx) => (
                  <input
                    key={idx}
                    ref={inputRefs[idx]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleOtpChange(e, idx)}
                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                    onPaste={idx === 0 ? handleOtpPaste : undefined}
                    disabled={loading}
                    className={`w-11 h-12 text-center text-lg font-extrabold form-input rounded-xl transition duration-150 ${
                      val ? "border-accent-blue bg-accent-blue/5 text-text-title" : ""
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Countdown Timers */}
            <div className="flex items-center justify-between text-xs text-text-muted border-t border-b border-glass-border/30 py-3">
              <div className="flex items-center gap-1.5">
                <Clock size={13} className={expirationTimer > 0 ? "text-accent-cyan" : "text-rose-400"} />
                <span className="font-medium">
                  {expirationTimer > 0 ? (
                    <>Expires in <strong className="text-text-title font-mono">{formatTimer(expirationTimer)}</strong></>
                  ) : (
                    <strong className="text-rose-400 font-semibold">OTP Expired</strong>
                  )}
                </span>
              </div>

              {cooldownTimer > 0 ? (
                <span className="text-[11px] font-semibold text-text-muted">
                  Resend in {cooldownTimer}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="flex items-center gap-1 text-accent-blue hover:text-accent-cyan font-bold transition cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw size={12} className={resendLoading ? "animate-spin" : ""} />
                  {resendLoading ? "Sending..." : "Resend Code"}
                </button>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              loading={loading}
              disabled={!isOtpComplete || expirationTimer === 0 || loading}
              className="w-full py-3.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={15} />
              Verify & Proceed
            </Button>
          </form>

        </SpotlightCard>

        {/* Cancel navigation */}
        <p className="text-center text-xs text-text-muted">
          Having trouble?{" "}
          <Link to="/login" className="text-accent-blue hover:underline font-bold">
            Sign in with a different account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Verify2FA;
