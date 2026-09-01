import React from "react";

const LoadingSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse text-left w-full">
     
      <div className="border-b border-glass-border/40 pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <div className="h-7 w-56 bg-glass-border/60 rounded-lg"></div>
          <div className="h-4 w-72 bg-glass-border/40 rounded-lg"></div>
        </div>
        <div className="h-10 w-44 bg-glass-border/60 rounded-xl"></div>
      </div>

    
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-glass-border/40 rounded-2xl p-5 space-y-3">
            <div className="h-4 w-24 bg-glass-border/60 rounded"></div>
            <div className="h-7 w-16 bg-glass-border/80 rounded"></div>
          </div>
        ))}
      </div>

    
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="h-48 bg-glass-border/40 rounded-2xl"></div>
          <div className="h-64 bg-glass-border/40 rounded-2xl"></div>
        </div>
        <div className="lg:col-span-4 space-y-6">
          <div className="h-48 bg-glass-border/40 rounded-2xl"></div>
          <div className="h-48 bg-glass-border/40 rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
