import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";
import { initSocket, disconnectSocket } from "../services/socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getCurrentUser = async () => {
    try {
      setLoading(true);
      const data = await authService.getMe();
      if (data.success && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        const token = data.token || localStorage.getItem("token");
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        initSocket(token);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      if (data.success && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        const token = data.token || localStorage.getItem("token");
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        initSocket(token);
        return { success: true };
      }
      return { success: false, message: data.message || "Login failed" };
    } catch (error) {
      const message = error.response?.data?.message || "Invalid credentials or network error";
      return { success: false, message };
    }
  };

  const signup = async (name, email, password, role, adminAccessToken) => {
    try {
      const data = await authService.register(name, email, password, role, adminAccessToken);
      if (data.success && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        const token = data.token || localStorage.getItem("token");
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        initSocket(token);
        return { success: true };
      }
      return { success: false, message: data.message || "Registration failed" };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed. Try again.";
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      localStorage.removeItem("token");
      disconnectSocket();
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        signup,
        logout,
        getCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
