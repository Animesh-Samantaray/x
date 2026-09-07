import React from "react";
import { Share2 } from "lucide-react";

const Loading = ({ fullScreen = true, message = "Loading CKM..." }) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-5 select-none">
      {/* Polished Multi-Ring Glowing Orb Loader */}
      <div className="relative flex items-center justify-center w-20 h-20">
        {/* Ambient Outer Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#7757F5]/30 to-[#00F2FF]/30 blur-xl animate-pulse" />

        {/* Outer Spinning Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#00F2FF] border-r-[#7757F5] animate-spin [animation-duration:1.2s]" />

        {/* Counter-Spinning Inner Ring */}
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-[#7757F5] border-l-[#00F2FF] animate-spin [animation-duration:1.8s] [animation-direction:reverse]" />

        {/* Center CKM Badge */}
        <div className="w-10 h-10 rounded-xl bg-[#181824] border border-white/10 flex items-center justify-center shadow-lg shadow-purple-950/40 z-10">
          <Share2 size={18} className="text-[#00F2FF] animate-pulse" />
        </div>
      </div>

      {/* Message & Shimmer Bar */}
      <div className="flex flex-col items-center space-y-2 text-center">
        <p className="text-xs font-black tracking-widest text-[#F5F5FA] uppercase">
          {message}
        </p>
        <div className="h-1 w-24 bg-[#181824] rounded-full overflow-hidden border border-white/5">
          <div className="h-full w-full bg-gradient-to-r from-[#7757F5] via-[#00F2FF] to-[#7757F5] rounded-full animate-shimmer" />
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F0F17]/80 backdrop-blur-xl">
        {content}
      </div>
    );
  }

  return <div className="py-12 flex items-center justify-center w-full">{content}</div>;
};

export default Loading;
