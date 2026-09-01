import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/Loading";

const DashboardRedirect = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const roleRoutes = {
    learner: "/learner/dashboard",
    creator: "/creator/dashboard",
    expert: "/expert/dashboard",
    admin: "/admin/dashboard",
  };

  const targetPath = roleRoutes[user?.role] || "/learner/dashboard";

  return <Navigate to={targetPath} replace />;
};

export default DashboardRedirect;
