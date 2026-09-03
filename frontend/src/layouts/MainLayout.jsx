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
      <div className="min-h-screen bg-bg-deep flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-blue"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-bg-deep text-text-main font-sans selection:bg-accent-purple/30">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-y-auto flex flex-col">
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
