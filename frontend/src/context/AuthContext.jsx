import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";
import { initSocket, disconnectSocket } from "../services/socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const connectSocket = async () => {
    try {
      const data = await authService.getSocketToken();
      if (data.success && data.token) {
        initSocket(data.token);
      }
    } catch {
      console.error("Socket authentication unavailable");
    }
  };

  const getCurrentUser = async () => {
    try {
      setLoading(true);

      const data = await authService.getMe();
      if (data.success && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        await connectSocket();
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
      if (data.success && data.requires2FA) {
        return { success: true, requires2FA: true, message: data.message };
      }
      if (data.success && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        await connectSocket();
        return { success: true, requires2FA: false };
      }
      return { success: false, message: data.message || "Login failed" };
    } catch (error) {
      const message = error.response?.data?.message || "Invalid credentials or network error";
      return { success: false, message };
    }
  };

  const verify2FA = async (email, otp) => {
    try {
      const data = await authService.verify2FA(email, otp);
      if (data.success && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        await connectSocket();
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || "2FA verification failed" };
    } catch (error) {
      const message = error.response?.data?.message || "Verification failed. Please try again.";
      return { success: false, message };
    }
  };

  const signup = async (name, email, password, role, adminAccessToken) => {
    try {
      const data = await authService.register(name, email, password, role, adminAccessToken);
      if (data.success && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        initSocket();
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
        verify2FA,
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
