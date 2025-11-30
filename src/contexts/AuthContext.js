import React, { createContext, useState, useContext, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true); // ✅ ADD THIS

  // ✅ ADD THIS: Check if user is authenticated on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        try {
          // Verify token is valid by making an API call
          // Or decode the token to get user info
          // For now, we'll just set loading to false
          // You can add actual token verification here later
          setToken(storedToken);
          // Note: You might want to fetch user data here
        } catch (error) {
          console.error("Token verification failed:", error);
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      }

      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true); // ✅ ADD THIS
      const response = await authAPI.login(email, password);
      const { token, data } = response;

      console.log("=== REGULAR LOGIN SUCCESS ===");
      console.log("User role:", data.user?.role);

      localStorage.setItem("token", token);
      setToken(token);
      setUser(data.user);

      return response;
    } catch (error) {
      setLoading(false); // ✅ ADD THIS
      throw error;
    } finally {
      setLoading(false); // ✅ ADD THIS
    }
  };

  const staffLogin = async (email, password) => {
    try {
      setLoading(true); // ✅ ADD THIS
      const response = await authAPI.staffLogin(email, password);
      const { token, data } = response;

      console.log("=== STAFF LOGIN SUCCESS ===");
      console.log("Staff role:", data.user?.role);

      localStorage.setItem("token", token);
      setToken(token);
      setUser(data.user);

      return response;
    } catch (error) {
      setLoading(false); // ✅ ADD THIS
      throw error;
    } finally {
      setLoading(false); // ✅ ADD THIS
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true); // ✅ ADD THIS
      const response = await authAPI.register(userData);
      const { token, data } = response;

      localStorage.setItem("token", token);
      setToken(token);
      setUser(data.user);

      return response;
    } catch (error) {
      setLoading(false); // ✅ ADD THIS
      throw error;
    } finally {
      setLoading(false); // ✅ ADD THIS
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setLoading(false); // ✅ ADD THIS
  };

  const value = {
    user,
    token,
    login,
    staffLogin,
    register,
    logout,
    isAuthenticated: !!token,
    loading, // ✅ ADD THIS - This is what your App.js is looking for
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
