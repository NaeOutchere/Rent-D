import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import { Navbar, Footer, Sidebar, ThemeSettings } from "./components";
import {
  Dashboard,
  RentReceipts,
  Calendar,
  Admins,
  Weekly,
  Monthly,
  Yearly,
  Rentees,
  Customers,
  Kanban,
  FAQ,
  Messages,
  Chat,
  Properties,
  Error404,
  Error500,
  ForgotPassword,
  Login,
  Signup,
} from "./pages";

// Import the new pages
import Account from "./pages/Account";

// Import the maintenance components (make sure these files exist)
import MaintenanceServices from "./pages/MaintenanceServices";
import LandlordServiceManagement from "./pages/LandlordServiceManagement";

import { ContextProvider, useStateContext } from "./contexts/ContextProvider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import "./App.css";

// Protected Route Component - FIXED VERSION
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component - FIXED VERSION
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

const AppContent = () => {
  const { activeMenu } = useStateContext();
  const { isAuthenticated, loading, user } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex relative dark:bg-main-dark-bg">
      <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
        <TooltipComponent content="Settings" position="Top">
          <button
            type="button"
            className="text-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray text-white"
            style={{ background: "#274254", borderRadius: "50%" }}
          >
            <FiSettings />
          </button>
        </TooltipComponent>
      </div>

      {/* Only show sidebar if authenticated */}
      {isAuthenticated && (
        <>
          {activeMenu ? (
            <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 dark:bg-secondary-dark-bg">
              <Sidebar />
            </div>
          )}
        </>
      )}

      <div
        className={`dark:bg-main-bg bg-main-bg min-h-screen w-full ${
          isAuthenticated && activeMenu ? "md:ml-72" : "flex-2"
        }`}
      >
        {/* Only show navbar if authenticated */}
        {isAuthenticated && (
          <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
            <Navbar />
          </div>
        )}

        <div>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />

            {/* Error Pages */}
            <Route path="/error404" element={<Error404 />} />
            <Route path="/error500" element={<Error500 />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* User Profile */}
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />

            {/* Maintenance Services */}
            <Route
              path="/maintenance"
              element={
                <ProtectedRoute>
                  <MaintenanceServices />
                </ProtectedRoute>
              }
            />

            <Route
              path="/service-management"
              element={
                <ProtectedRoute>
                  <LandlordServiceManagement />
                </ProtectedRoute>
              }
            />

            {/* Other Protected Routes */}
            <Route
              path="/rentreceipts"
              element={
                <ProtectedRoute>
                  <RentReceipts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rentees"
              element={
                <ProtectedRoute>
                  <Rentees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/properties"
              element={
                <ProtectedRoute>
                  <Properties />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <ProtectedRoute>
                  <Customers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admins"
              element={
                <ProtectedRoute>
                  <Admins />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kanban"
              element={
                <ProtectedRoute>
                  <Kanban />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faq"
              element={
                <ProtectedRoute>
                  <FAQ />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/weekly"
              element={
                <ProtectedRoute>
                  <Weekly />
                </ProtectedRoute>
              }
            />
            <Route
              path="/monthly"
              element={
                <ProtectedRoute>
                  <Monthly />
                </ProtectedRoute>
              }
            />
            <Route
              path="/yearly"
              element={
                <ProtectedRoute>
                  <Yearly />
                </ProtectedRoute>
              }
            />

            {/* Catch all route */}
            <Route
              path="*"
              element={
                <Navigate
                  to={isAuthenticated ? "/dashboard" : "/login"}
                  replace
                />
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

// Main App component
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ContextProvider>
          <AppContent />
        </ContextProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
