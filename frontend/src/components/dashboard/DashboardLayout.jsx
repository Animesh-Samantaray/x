import React from "react";

const DashboardLayout = ({ children, title, subtitle, actions }) => {
  return (
    <div className="w-full space-y-6 text-left">
      {(title || subtitle || actions) && (
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-glass-border/40 pb-5 mb-6 gap-4">
          <div>
            {title && (
              <h1 className="hero-heading text-2xl sm:text-3xl font-extrabold text-text-title">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-xs text-text-muted font-semibold mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default DashboardLayout;
