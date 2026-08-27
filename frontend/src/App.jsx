import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
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
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
         
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Landing />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            
            
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="resources/:id"
              element={
                <ProtectedRoute>
                  <ResourceDetail />
                </ProtectedRoute>
              }
            />
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
            <Route
              path="courses"
              element={
                <ProtectedRoute>
                  <ExploreCourses />
                </ProtectedRoute>
              }
            />
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
            <Route
              path="courses/:id"
              element={
                <ProtectedRoute>
                  <CourseDetail />
                </ProtectedRoute>
              }
            />
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
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
