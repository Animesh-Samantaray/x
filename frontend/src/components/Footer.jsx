import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-glass-border bg-bg-deep/90 py-14 relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6 lg:gap-12">
          {/* Logo & description column */}
          <div className="col-span-2 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-md font-bold text-white tracking-wider">
              <span className="h-2 w-2 rounded bg-gradient-accent"></span>
              CKM
            </Link>
            <p className="mt-4 text-xs text-slate-500 leading-relaxed max-w-xs">
              A premium, secure marketplace platform for learners, creators, and technical consultants. Package tutorials, book mentorship calls, and share practical knowledge.
            </p>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h4 className="text-[11px] font-bold tracking-wider text-slate-300 uppercase">
              Platform
            </h4>
            <ul className="mt-4 space-y-2.5 text-[12px] text-slate-500">
              <li><span className="hover:text-slate-300 cursor-not-allowed">Browse Guides</span></li>
              <li><span className="hover:text-slate-300 cursor-not-allowed">Mentorship Hub</span></li>
              <li><span className="hover:text-slate-300 cursor-not-allowed">For Creators</span></li>
              <li><span className="hover:text-slate-300 cursor-not-allowed">Pricing Plans</span></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="text-[11px] font-bold tracking-wider text-slate-300 uppercase">
              Resources
            </h4>
            <ul className="mt-4 space-y-2.5 text-[12px] text-slate-500">
              <li><span className="hover:text-slate-300 cursor-not-allowed">Documentation</span></li>
              <li><span className="hover:text-slate-300 cursor-not-allowed">Platform Blog</span></li>
              <li><span className="hover:text-slate-300 cursor-not-allowed">Support Desk</span></li>
              <li><span className="hover:text-slate-300 cursor-not-allowed">System Status</span></li>
            </ul>
          </div>

          {/* Column 4: Community */}
          <div>
            <h4 className="text-[11px] font-bold tracking-wider text-slate-300 uppercase">
              Community
            </h4>
            <ul className="mt-4 space-y-2.5 text-[12px] text-slate-500">
              <li><span className="hover:text-slate-300 cursor-not-allowed">Discussion Forum</span></li>
              <li><span className="hover:text-slate-300 cursor-not-allowed">Discord Community</span></li>
              <li><span className="hover:text-slate-300 cursor-not-allowed">Creator Guild</span></li>
              <li><span className="hover:text-slate-300 cursor-not-allowed">Code of Conduct</span></li>
            </ul>
          </div>

          {/* Column 5: Company */}
          <div>
            <h4 className="text-[11px] font-bold tracking-wider text-slate-300 uppercase">
              Company
            </h4>
            <ul className="mt-4 space-y-2.5 text-[12px] text-slate-500">
              <li><Link to="/" className="hover:text-slate-300 transition">About Us</Link></li>
              <li><span className="hover:text-slate-300 cursor-not-allowed">Careers</span></li>
              <li><span className="hover:text-slate-300 cursor-not-allowed">Privacy Policy</span></li>
              <li><span className="hover:text-slate-300 cursor-not-allowed">Terms of Use</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-glass-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>&copy; {new Date().getFullYear()} Collaborative Knowledge Marketplace. Designed for creators and builders.</p>
          <div className="flex gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-slate-300 transition">
              GitHub
            </a>
            <span className="text-glass-border">/</span>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-slate-300 transition">
              Twitter
            </a>
            <span className="text-glass-border">/</span>
            <a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-slate-300 transition">
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
