import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AppShell from "../components/AppShell";

const MainLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-deep flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-blue"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <AppShell />;
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
