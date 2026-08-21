import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, LogOut, User, Compass } from "lucide-react";
import Button from "./Button";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/explore", soon: true },
    { name: "Mentors", path: "/mentors", soon: true },
    { name: "Community", path: "/community", soon: true },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-glass-border bg-bg-deep/75 backdrop-blur-[20px]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo with network icon */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5 text-lg font-bold text-white tracking-tight">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-accent p-[1px] shadow-[0_0_15px_rgba(99,102,241,0.25)]">
                <div className="flex h-full w-full items-center justify-center rounded-lg bg-bg-deep">
                  <svg className="h-4.5 w-4.5 text-accent-indigo" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94-3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
              </div>
              <span className="font-extrabold tracking-widest text-slate-100 text-base">CKM</span>
              <div className="h-4 w-[1px] bg-glass-border hidden sm:block"></div>
              <span className="hidden sm:inline text-[11px] font-medium text-slate-500 uppercase tracking-widest">
                Knowledge Network
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-7">
            {navLinks.map((link, idx) => (
              <div key={idx} className="relative group">
                {link.soon ? (
                  <span className="text-[13px] font-medium text-slate-500 hover:text-slate-400 cursor-not-allowed flex items-center gap-1 py-1 select-none">
                    {link.name}
                    <span className="text-[9px] bg-accent-indigo/10 text-accent-indigo/90 border border-accent-indigo/25 px-1 py-0.2 rounded font-bold uppercase tracking-wide scale-90">
                      Soon
                    </span>
                  </span>
                ) : (
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `text-[13px] font-medium transition py-1 relative ${
                        isActive
                          ? "text-white"
                          : "text-slate-400 hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span>{link.name}</span>
                        {isActive && (
                          <span className="absolute bottom-[-18px] left-0 right-0 h-[2px] bg-gradient-accent rounded-full"></span>
                        )}
                      </>
                    )}
                  </NavLink>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 rounded-xl border border-glass-border bg-slate-900/30 hover:bg-slate-900/60 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:border-slate-500 hover:text-white transition duration-200"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-accent p-[1px] shadow-sm">
                    {user?.profilePicture ? (
                      <img src={user.profilePicture} alt={user.name} className="h-full w-full rounded-md object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-md bg-bg-deep text-[10px] font-extrabold text-white uppercase">
                        {user?.name ? user.name[0] : <User size={10} />}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="leading-tight text-white font-bold">{user?.name?.split(" ")[0] || "Profile"}</span>
                    <span className="text-[9px] text-slate-400 font-medium capitalize mt-0.5">{user?.role}</span>
                  </div>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-500/5 transition cursor-pointer"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link to="/login">
                  <Button variant="text" className="px-3.5">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" className="py-2 px-4.5">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900/50 focus:outline-none cursor-pointer"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden glass-panel border-t border-glass-border absolute top-16 left-0 right-0 py-6 px-4 space-y-4 shadow-2xl animate-fade-in">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link, idx) => (
              <div key={idx}>
                {link.soon ? (
                  <span className="block text-sm font-medium text-slate-500 py-2 cursor-not-allowed select-none">
                    {link.name}
                    <span className="text-[9px] bg-accent-indigo/10 text-accent-indigo/90 border border-accent-indigo/25 px-1 py-0.2 rounded font-bold uppercase tracking-wide ml-1.5 inline-block">
                      Soon
                    </span>
                  </span>
                ) : (
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="block text-sm font-medium text-slate-300 hover:text-white py-2 transition"
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-glass-border pt-4">
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 py-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-accent p-[1px]">
                    {user?.profilePicture ? (
                      <img src={user.profilePicture} alt={user.name} className="h-full w-full rounded-lg object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-lg bg-bg-deep text-sm font-bold text-white uppercase">
                        {user?.name ? user.name[0] : <User size={14} />}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      {user?.name}
                      <span className="inline-block bg-accent-indigo/15 text-accent-indigo text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border border-accent-indigo/20">
                        {user?.role}
                      </span>
                    </p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[200px] mt-0.5">{user?.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/profile" onClick={() => setIsOpen(false)}>
                    <Button variant="secondary" className="w-full text-xs py-2">
                      Profile
                    </Button>
                  </Link>
                  <Button variant="danger" onClick={handleLogout} className="w-full text-xs py-2">
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="secondary" className="w-full text-xs py-2">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setIsOpen(false)}>
                  <Button variant="primary" className="w-full text-xs py-2">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
