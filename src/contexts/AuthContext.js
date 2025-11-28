import React, { createContext, useState, useContext } from "react";
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

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { token, data } = response;

      console.log("=== REGULAR LOGIN SUCCESS ===");
      console.log("User role:", data.user?.role);

      localStorage.setItem("token", token);
      setToken(token);
      setUser(data.user);

      return response;
    } catch (error) {
      throw error;
    }
  };

  const staffLogin = async (email, password) => {
    try {
      const response = await authAPI.staffLogin(email, password);
      const { token, data } = response;

      console.log("=== STAFF LOGIN SUCCESS ===");
      console.log("Staff role:", data.user?.role);

      localStorage.setItem("token", token);
      setToken(token);
      setUser(data.user);

      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token, data } = response;

      localStorage.setItem("token", token);
      setToken(token);
      setUser(data.user);

      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    staffLogin,
    register,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
