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
  const baseStyles = "relative inline-flex items-center justify-center font-semibold rounded-xl px-5 py-2.5 transition-all duration-200 ease-out focus:outline-none focus:ring-1 focus:ring-accent-indigo disabled:opacity-50 disabled:pointer-events-none text-sm cursor-pointer select-none active:scale-[0.98]";
  
  const variants = {
    primary: "bg-btn-primary text-white hover:bg-btn-primary-hover hover:-translate-y-0.5 border border-accent-indigo/10 shadow-[0_2px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_18px_rgba(99,102,241,0.2)] transition-all",
    secondary: "bg-btn-secondary text-text-btn-secondary border border-glass-border hover:bg-btn-secondary-bg-hover hover:border-glass-border-hover hover:-translate-y-0.5 transition-all",
    text: "text-text-muted hover:text-text-title bg-transparent transition-colors",
    danger: "bg-rose-500/10 text-rose-600 border border-rose-500/25 dark:bg-rose-950/20 dark:text-rose-300 dark:border-rose-500/20 hover:bg-rose-500/20 hover:-translate-y-0.5 dark:hover:bg-rose-950/40 transition-all",
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
