import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/layout/Sidebar";

const MainLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-500/30 relative overflow-x-hidden">
        {/* Ambient Multi-Color Glowing Mesh Orbs */}
        <div className="fixed top-[-10%] left-[-5%] h-[550px] w-[550px] rounded-full bg-gradient-to-tr from-cyan-600/20 via-blue-600/10 to-transparent blur-[140px] pointer-events-none z-0" />
        <div className="fixed top-[20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-purple-600/20 via-pink-600/15 to-transparent blur-[160px] pointer-events-none z-0" />
        <div className="fixed bottom-[-10%] left-[20%] h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-indigo-600/15 via-cyan-500/10 to-transparent blur-[130px] pointer-events-none z-0" />

        {/* Persistent Collapsible Left Sidebar */}
        <Sidebar />

        {/* Main Bento Canvas Area with proper sidebar offsets */}
        <main className="flex-1 min-w-0 lg:ml-[260px] flex flex-col min-h-screen z-10">
          {location.pathname === "/chat" ? (
            <Outlet />
          ) : (
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex-1">
              <Outlet />
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-deep flex flex-col relative transition-colors duration-200">
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-accent-blue/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-accent-purple/5 blur-[150px] pointer-events-none"></div>
      
      <Navbar />
      
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;
