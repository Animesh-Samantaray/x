import React from "react";
import { Link } from "react-router-dom";
import { Share2 } from "lucide-react";

const CosmicArt = ({ title = "SIGN IN TO YOUR", highlightText = "ADVENTURE!", navLinkText = "HAVE AN ACCOUNT?", navLinkPath = "/login", navActionText = "SIGN IN" }) => {
  return (
    <div className="relative w-full h-full min-h-[360px] md:min-h-screen bg-[#0b0726] flex flex-col justify-between p-6 sm:p-10 overflow-hidden select-none">
      {/* Background Deep Cosmic Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0c082b] via-[#120836] to-[#08041d] z-0"></div>

      {/* SVG Cosmic Illustrations (Planets, Orbital Rings, Meteor Streaks, Stars) */}
      <svg
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1000 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Cyan Planet Gradient */}
          <radialGradient id="cyanPlanet" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="45%" stopColor="#06b6d4" />
            <stop offset="75%" stopColor="#0891b2" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>

          {/* Cyan Ring Gradient */}
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a5f3fc" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
          </linearGradient>

          {/* Purple Planet Gradient */}
          <radialGradient id="purplePlanet" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="50%" stopColor="#9333ea" />
            <stop offset="85%" stopColor="#581c87" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </radialGradient>

          {/* Meteor Line Trail Gradient */}
          <linearGradient id="meteorTrail" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#a5f3fc" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>

          {/* Purple Glow Filter */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Nebula Glow Orbs */}
        <circle cx="200" cy="200" r="280" fill="#06b6d4" opacity="0.15" filter="url(#glow)" />
        <circle cx="600" cy="450" r="240" fill="#a855f7" opacity="0.18" filter="url(#glow)" />
        <circle cx="150" cy="750" r="320" fill="#3b82f6" opacity="0.12" filter="url(#glow)" />

        {/* Stars Scatter */}
        <circle cx="120" cy="80" r="1.5" fill="#fff" opacity="0.9" />
        <circle cx="280" cy="140" r="2" fill="#fff" opacity="0.7" />
        <circle cx="450" cy="90" r="1" fill="#fff" opacity="0.8" />
        <circle cx="700" cy="120" r="2.5" fill="#a5f3fc" opacity="0.9" />
        <circle cx="850" cy="220" r="1.5" fill="#fff" opacity="0.6" />
        <circle cx="100" cy="350" r="2" fill="#c084fc" opacity="0.8" />
        <circle cx="300" cy="580" r="1.5" fill="#fff" opacity="0.9" />
        <circle cx="480" cy="780" r="2" fill="#a5f3fc" opacity="0.8" />
        <circle cx="220" cy="880" r="1" fill="#fff" opacity="0.7" />

        {/* Large Top Cyan Planet with Rings */}
        <g transform="translate(180, 120)">
          {/* Planet Body */}
          <circle cx="0" cy="0" r="220" fill="url(#cyanPlanet)" />
          {/* Planet Surface Wavy Texture Overlay */}
          <path
            d="M -200 -30 Q -100 40 0 -30 T 200 -30 A 220 220 0 0 1 -200 -30 Z"
            fill="#0284c7"
            opacity="0.25"
          />
          <path
            d="M -210 60 Q -90 120 20 50 T 210 60 A 220 220 0 0 1 -210 60 Z"
            fill="#0369a1"
            opacity="0.3"
          />
          {/* Outer Orbital Ring (Behind Planet back half) */}
          <ellipse
            cx="0"
            cy="10"
            rx="340"
            ry="75"
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="14"
            transform="rotate(-18)"
            opacity="0.5"
          />
          <ellipse
            cx="0"
            cy="10"
            rx="390"
            ry="90"
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="6"
            transform="rotate(-18)"
            opacity="0.3"
          />
        </g>

        {/* Secondary Purple Floating Planet */}
        <g transform="translate(560, 420)">
          <circle cx="0" cy="0" r="95" fill="url(#purplePlanet)" filter="url(#glow)" opacity="0.9" />
          <circle cx="0" cy="0" r="95" fill="url(#purplePlanet)" />
          {/* Crescent shadow */}
          <path
            d="M -85 -30 A 95 95 0 0 0 60 80 A 95 95 0 0 1 -85 -30 Z"
            fill="#2e1065"
            opacity="0.6"
          />
        </g>

        {/* Shooting Stars / Meteor Trails */}
        <g transform="translate(420, 260) rotate(-42)">
          <rect x="0" y="0" width="160" height="2" rx="1" fill="url(#meteorTrail)" />
          <circle cx="0" cy="1" r="2.5" fill="#fff" />
        </g>
        <g transform="translate(580, 180) rotate(-42)">
          <rect x="0" y="0" width="220" height="2.5" rx="1.2" fill="url(#meteorTrail)" />
          <circle cx="0" cy="1.25" r="3" fill="#fff" />
        </g>
        <g transform="translate(320, 620) rotate(-42)">
          <rect x="0" y="0" width="190" height="2" rx="1" fill="url(#meteorTrail)" />
          <circle cx="0" cy="1" r="2" fill="#fff" />
        </g>
      </svg>

      {/* Header: Logo & Mobile Nav */}
      <div className="relative z-10 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1.5px] shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#09061a]">
              <Share2 size={16} className="text-cyan-400 group-hover:scale-110 transition-transform duration-200" />
            </div>
          </div>
          <span className="font-extrabold tracking-wider text-white text-lg font-display">CKM</span>
        </Link>

        {/* Mobile Header Link */}
        <div className="flex md:hidden items-center text-xs font-semibold tracking-wider text-gray-300">
          <span>{navLinkText}</span>
          <Link to={navLinkPath} className="ml-1.5 font-bold text-white uppercase hover:text-cyan-300 underline">
            {navActionText}
          </Link>
        </div>
      </div>

      {/* Bottom Bold Headline */}
      <div className="relative z-10 mt-auto pt-16 text-left space-y-1">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-none uppercase font-display">
          {title}
        </h1>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300 leading-tight uppercase font-display">
          {highlightText}
        </h1>
        <p className="text-xs text-purple-200/70 pt-2 font-medium max-w-sm">
          Collaborative Knowledge Marketplace — platform for masterclasses, expert mentorship, and vetted assets.
        </p>
      </div>
    </div>
  );
};

export default CosmicArt;
