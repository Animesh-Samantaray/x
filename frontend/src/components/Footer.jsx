import React from "react";
import { Link } from "react-router-dom";
import { Share2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-glass-border bg-[#020617] py-14 relative z-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-10">
          
          {/* Logo Column */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-white select-none">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-accent p-[1px] shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-bg-deep">
                  <Share2 size={14} className="text-accent-blue" />
                </div>
              </div>
              <span className="font-black tracking-widest text-slate-100 text-base">CKM</span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              A premium, secure marketplace platform for learners, creators, and technical consultants. Package tutorials, book mentorship calls, and share practical knowledge.
            </p>
          </div>

          {/* Links Column 1: Explore */}
          <div>
            <h4 className="text-[11px] font-bold tracking-wider text-slate-300 uppercase">Explore</h4>
            <ul className="mt-4 space-y-2.5 text-[12px] text-slate-500">
              <li><a href="/#explore" className="hover:text-slate-300 transition">Guides & Notes</a></li>
              <li><a href="/#courses" className="hover:text-slate-300 transition">Premium Courses</a></li>
              <li><a href="/#experts" className="hover:text-slate-300 transition">Find Experts</a></li>
            </ul>
          </div>

          {/* Links Column 2: Resources */}
          <div>
            <h4 className="text-[11px] font-bold tracking-wider text-slate-300 uppercase">Resources</h4>
            <ul className="mt-4 space-y-2.5 text-[12px] text-slate-500">
              <li><span className="hover:text-slate-300 cursor-not-allowed transition">Documentation</span></li>
              <li><span className="hover:text-slate-300 cursor-not-allowed transition">Help Center</span></li>
              <li><span className="hover:text-slate-300 cursor-not-allowed transition">API Status</span></li>
            </ul>
          </div>

          {/* Links Column 3: Community */}
          <div>
            <h4 className="text-[11px] font-bold tracking-wider text-slate-300 uppercase">Community</h4>
            <ul className="mt-4 space-y-2.5 text-[12px] text-slate-500">
              <li><a href="/#community" className="hover:text-slate-300 transition">Discussions</a></li>
              <li><span className="hover:text-slate-300 cursor-not-allowed transition">Creator Guild</span></li>
              <li><span className="hover:text-slate-300 cursor-not-allowed transition">Discord Server</span></li>
            </ul>
          </div>

          {/* Links Column 4: Legal */}
          <div>
            <h4 className="text-[11px] font-bold tracking-wider text-slate-300 uppercase">Legal</h4>
            <ul className="mt-4 space-y-2.5 text-[12px] text-slate-500">
              <li><span className="hover:text-slate-300 cursor-not-allowed transition">Privacy Policy</span></li>
              <li><span className="hover:text-slate-300 cursor-not-allowed transition">Terms of Service</span></li>
              <li><span className="hover:text-slate-300 cursor-not-allowed transition">Refund Policy</span></li>
            </ul>
          </div>

        </div>

        <div className="mt-12 border-t border-glass-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-600">
          <p>&copy; {new Date().getFullYear()} Collaborative Knowledge Marketplace (CKM). All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">GitHub</span>
            <span className="text-glass-border">/</span>
            <span className="hover:text-slate-400 cursor-pointer">Twitter</span>
            <span className="text-glass-border">/</span>
            <span className="hover:text-slate-400 cursor-pointer">Discord</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
