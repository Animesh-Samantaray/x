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
    primary: "bg-btn-primary text-white hover:bg-btn-primary-hover hover:-translate-y-0.5 border border-accent-indigo/10 shadow-[0_2px_12px_rgba(124,58,237,0.15)] hover:shadow-[0_4px_18px_rgba(124,58,237,0.3)] transition-all duration-200",
    secondary: "bg-btn-secondary text-text-btn-secondary border border-glass-border hover:bg-btn-secondary-bg-hover hover:border-glass-border-hover hover:-translate-y-0.5 transition-all duration-200",
    text: "text-text-muted hover:text-text-title bg-transparent transition-colors duration-200",
    danger: "bg-rose-500/10 text-rose-600 border border-rose-500/25 dark:bg-rose-950/20 dark:text-rose-300 dark:border-rose-500/20 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-900 hover:-translate-y-0.5 transition-all duration-200",
    success: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-500/20 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-900 hover:-translate-y-0.5 transition-all duration-200",
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
