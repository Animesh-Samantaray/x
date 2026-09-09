import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Verify2FA from "./pages/Verify2FA";
import Profile from "./pages/Profile";
import Resources from "./pages/Resources";
import MyResources from "./pages/MyResources";
import ResourceDetail from "./pages/ResourceDetail";
import CreateResource from "./pages/CreateResource";
import EditResource from "./pages/EditResource";
import Categories from "./pages/Categories";
import ExploreCourses from "./pages/courses/ExploreCourses";
import CourseDetail from "./pages/courses/CourseDetail";
import CreateCourse from "./pages/courses/CreateCourse";
import EditCourse from "./pages/courses/EditCourse";
import MyCourses from "./pages/courses/MyCourses";
import CourseManage from "./pages/courses/CourseManage";
import CourseLearn from "./pages/courses/CourseLearn";
import MyBookmarks from "./pages/MyBookmarks";
import LearnerMyLearning from "./pages/LearnerMyLearning";
import SessionsPage from "./pages/sessions/SessionsPage";
import Chat from "./pages/Chat";
import PaymentHistory from "./pages/PaymentHistory";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

import LearnerDashboard from "./pages/dashboards/LearnerDashboard";
import CreatorDashboard from "./pages/dashboards/CreatorDashboard";
import ExpertDashboard from "./pages/dashboards/ExpertDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import AdminPaymentsPage from "./pages/AdminPaymentsPage";
import DashboardRedirect from "./pages/dashboards/DashboardRedirect";
import MyReports from "./pages/MyReports";
import ReportsManagement from "./pages/admin/ReportsManagement";

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Landing />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="verify-2fa" element={<Verify2FA />} />

            {/* General & Role-Based Dashboard Routes */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRedirect />
                </ProtectedRoute>
              }
            />
            <Route
              path="learner/dashboard"
              element={
                <ProtectedRoute role="learner">
                  <LearnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="creator/dashboard"
              element={
                <ProtectedRoute role="creator">
                  <CreatorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="expert/dashboard"
              element={
                <ProtectedRoute role="expert">
                  <ExpertDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/dashboard"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/payments"
              element={
                <ProtectedRoute role="admin">
                  <AdminPaymentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/reports"
              element={
                <ProtectedRoute role="admin">
                  <ReportsManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="reports"
              element={
                <ProtectedRoute>
                  <MyReports />
                </ProtectedRoute>
              }
            />

            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="resources" element={<Resources />} />
            <Route
              path="my-resources"
              element={
                <ProtectedRoute>
                  <MyResources />
                </ProtectedRoute>
              }
            />
            <Route path="resources/:id" element={<ResourceDetail />} />
            <Route
              path="resources/new"
              element={
                <ProtectedRoute>
                  <CreateResource />
                </ProtectedRoute>
              }
            />
            <Route
              path="resources/edit/:id"
              element={
                <ProtectedRoute>
                  <EditResource />
                </ProtectedRoute>
              }
            />
            <Route
              path="categories"
              element={
                <ProtectedRoute>
                  <Categories />
                </ProtectedRoute>
              }
            />
            <Route path="courses" element={<ExploreCourses />} />
            <Route
              path="courses/new"
              element={
                <ProtectedRoute>
                  <CreateCourse />
                </ProtectedRoute>
              }
            />
            <Route
              path="courses/edit/:id"
              element={
                <ProtectedRoute>
                  <EditCourse />
                </ProtectedRoute>
              }
            />
            <Route path="courses/:id" element={<CourseDetail />} />

            <Route
              path="courses/:id/manage"
              element={
                <ProtectedRoute>
                  <CourseManage />
                </ProtectedRoute>
              }
            />
            <Route
              path="courses/:id/learn"
              element={
                <ProtectedRoute>
                  <CourseLearn />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-courses"
              element={
                <ProtectedRoute>
                  <MyCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-learning"
              element={
                <ProtectedRoute>
                  <LearnerMyLearning />
                </ProtectedRoute>
              }
            />
            <Route
              path="bookmarks"
              element={
                <ProtectedRoute>
                  <MyBookmarks />
                </ProtectedRoute>
              }
            />
            <Route
              path="sessions"
              element={
                <ProtectedRoute>
                  <SessionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="sessions/:id"
              element={
                <ProtectedRoute>
                  <SessionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-payments"
              element={
                <ProtectedRoute>
                  <PaymentHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="payments"
              element={
                <ProtectedRoute>
                  <PaymentHistory />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
