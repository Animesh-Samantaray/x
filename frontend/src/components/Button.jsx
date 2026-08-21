import React from "react";

const Button = ({
  children,
  variant = "primary",
  type = "button",
  className = "",
  onClick,
  disabled = false,
  loading = false,
  ...props
}) => {
  const baseStyles = "relative inline-flex items-center justify-center font-medium rounded-xl px-5 py-2.5 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-accent-indigo disabled:opacity-50 disabled:pointer-events-none text-sm cursor-pointer select-none active:scale-[0.98]";
  
  const variants = {
    primary: "bg-gradient-accent text-white hover:bg-gradient-hover shadow-[0_1px_2px_rgba(0,0,0,0.4),0_0_20px_rgba(99,102,241,0.15)] hover:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_0_30px_rgba(99,102,241,0.3)] border border-accent-indigo/30",
    secondary: "bg-slate-900/60 text-slate-200 border border-glass-border hover:border-slate-600 hover:text-white hover:bg-slate-900/80 shadow-[0_1px_2px_rgba(0,0,0,0.3)]",
    text: "text-slate-400 hover:text-white bg-transparent",
    danger: "bg-rose-950/20 text-rose-300 border border-rose-500/20 hover:bg-rose-950/40 hover:border-rose-500/40 hover:text-white",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin -ml-1 mr-1.5 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Processing...
        </span>
      ) : children}
    </button>
  );
};

export default Button;
