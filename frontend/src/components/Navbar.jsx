import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Share2, Sun, Moon } from "lucide-react";
import Button from "./Button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  };

  const navLinks = [
    { name: "Explore", path: "/#explore" },
    { name: "Courses", path: "/#courses" },
    { name: "Experts", path: "/#experts" },
    { name: "Resources", path: "/#resources" },
  ];

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50 rounded-2xl border border-glass-border bg-nav-bg backdrop-blur-xl px-4 py-2 flex items-center justify-between shadow-lg shadow-purple-950/5 dark:shadow-[0_10px_35px_-10px_rgba(0,0,0,0.5)] transition-all duration-300">
      {/* Brand logo */}
      <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-text-title select-none transition-transform duration-200 hover:scale-[1.02]">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-accent p-[1px] shadow-[0_0_15px_rgba(124,58,237,0.2)]">
          <div className="flex h-full w-full items-center justify-center rounded-xl bg-bg-deep">
            <Share2 size={14} className="text-accent-violet" />
          </div>
        </div>
        <span className="font-black tracking-widest text-text-title text-base">CKM</span>
      </Link>

      {/* Desktop navigation */}
      <div className="hidden md:flex items-center space-x-2">
        {navLinks.map((link, idx) => (
          <a
            key={idx}
            href={link.path}
            className="text-[13px] font-bold text-text-muted hover:text-accent-purple hover:bg-accent-purple/10 dark:hover:text-white dark:hover:bg-white/5 px-4 py-2 rounded-xl transition-all duration-200"
          >
            {link.name}
          </a>
        ))}
      </div>

      {/* Desktop CTAs */}
      <div className="hidden md:flex items-center space-x-3.5">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-glass-border hover:bg-glass-border hover:text-text-title text-text-muted transition duration-200 cursor-pointer active:scale-95 flex items-center justify-center"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        <Link to="/login">
          <Button variant="text" className="text-text-main hover:text-text-title text-xs px-3">
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
          className="p-1.5 rounded-xl text-text-muted hover:text-text-title transition duration-200 hover:scale-105 active:scale-95"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 rounded-2xl border border-glass-border bg-bg-dark/95 backdrop-blur-2xl p-5 shadow-2xl md:hidden flex flex-col space-y-4">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className="text-sm font-bold text-text-muted hover:text-accent-purple hover:bg-accent-purple/10 dark:hover:text-white dark:hover:bg-white/5 px-3 py-2 rounded-xl transition-all duration-200 text-left"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="h-[1px] bg-glass-border" />
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-glass-border bg-bg-dark/40 text-text-muted hover:text-text-title flex items-center justify-center cursor-pointer active:scale-95"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>
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
