import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Share2 } from "lucide-react";
import Button from "./Button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Explore", path: "/#explore" },
    { name: "Courses", path: "/#courses" },
    { name: "Experts", path: "/#experts" },
    { name: "Resources", path: "/#resources" },
  ];

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50 rounded-2xl border border-glass-border bg-bg-dark/60 backdrop-blur-xl px-4 py-2 flex items-center justify-between shadow-[0_10px_35px_-10px_rgba(0,0,0,0.7)] transition-all duration-300">
      {/* Brand logo */}
      <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-white select-none transition-transform duration-200 hover:scale-[1.02]">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-accent p-[1px] shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <div className="flex h-full w-full items-center justify-center rounded-xl bg-bg-deep">
            <Share2 size={14} className="text-accent-blue" />
          </div>
        </div>
        <span className="font-black tracking-widest text-slate-100 text-base">CKM</span>
      </Link>

      {/* Desktop navigation */}
      <div className="hidden md:flex items-center space-x-8">
        {navLinks.map((link, idx) => (
          <a
            key={idx}
            href={link.path}
            className="text-[13px] font-medium text-slate-400 hover:text-white transition-colors duration-250 relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-accent-cyan after:shadow-[0_0_8px_#06b6d4] after:transition-all after:duration-300 hover:after:w-full"
          >
            {link.name}
          </a>
        ))}
      </div>

      {/* Desktop CTAs */}
      <div className="hidden md:flex items-center space-x-3.5">
        <Link to="/login">
          <Button variant="text" className="text-slate-300 hover:text-white text-xs px-3">
            Log in
          </Button>
        </Link>
        <Link to="/signup">
          <Button variant="primary" className="py-2.5 px-4.5 rounded-xl text-xs">
            Get Started
          </Button>
        </Link>
      </div>

      {/* Mobile Drawer Trigger */}
      <div className="flex md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white transition duration-200 hover:scale-105 active:scale-95"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 rounded-2xl border border-glass-border bg-bg-dark/95 backdrop-blur-2xl p-5 shadow-2xl md:hidden flex flex-col space-y-4">
          <div className="flex flex-col space-y-3.5">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-slate-400 hover:text-white py-1 transition-all relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-accent-cyan after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="h-[1px] bg-glass-border" />
          <div className="flex items-center space-x-3 pt-2">
            <Link to="/login" onClick={() => setIsOpen(false)} className="flex-1">
              <Button variant="secondary" className="w-full text-xs">
                Log in
              </Button>
            </Link>
            <Link to="/signup" onClick={() => setIsOpen(false)} className="flex-1">
              <Button variant="primary" className="w-full text-xs">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
