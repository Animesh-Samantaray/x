import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-dark/60 backdrop-blur-md">
      <div className="flex flex-col items-center space-y-4">
        {/* Outer Ring */}
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-accent-indigo/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-accent-indigo border-r-accent-purple animate-spin"></div>
        </div>
        <p className="text-sm font-medium tracking-widest text-slate-400 uppercase animate-pulse">
          Loading CKM...
        </p>
      </div>
    </div>
  );
};

export default Loading;
