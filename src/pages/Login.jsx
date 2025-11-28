import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffError, setStaffError] = useState("");

  const { login, staffLogin } = useAuth();
  const navigate = useNavigate();

  // Regular login for tenants & landlords
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      // Navigation handled by protected routes
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Staff login for admin/tech/support roles
  const handleStaffLogin = async (e) => {
    e.preventDefault();
    setStaffLoading(true);
    setStaffError("");

    try {
      await staffLogin(staffEmail, staffPassword);
      setShowStaffModal(false);
      // Navigation handled by protected routes
    } catch (err) {
      setStaffError(
        err.message || "Staff login failed. Please check your credentials."
      );
    } finally {
      setStaffLoading(false);
    }
  };

  // Developer demo accounts (hidden from regular users)
  const handleDemoLogin = (role) => {
    const demoAccounts = {
      admin: { email: "admin@rentd.com", password: "demo123" },
      landlord: { email: "alice@example.com", password: "demo123" },
      tenant: { email: "bob@example.com", password: "demo123" },
      support: { email: "support@rentd.com", password: "demo123" },
      tech_support: { email: "tech@rentd.com", password: "demo123" },
      tech_admin: { email: "techadmin@rentd.com", password: "demo123" },
      ceo: { email: "ceo@rentd.com", password: "demo123" },
    };

    const account = demoAccounts[role];
    if (account) {
      // Auto-fill based on role type
      if (["tenant", "landlord"].includes(role)) {
        setEmail(account.email);
        setPassword(account.password);
      } else {
        setStaffEmail(account.email);
        setStaffPassword(account.password);
        setShowStaffModal(true);
      }
    }
  };

  const staffRoles = [
    {
      role: "ceo",
      title: "CEO / Executive",
      description: "Executive dashboard and company overview",
      icon: "👑",
    },
    {
      role: "admin",
      title: "Administrator",
      description: "Full system access and user management",
      icon: "⚙️",
    },
    {
      role: "tech_admin",
      title: "Tech Administrator",
      description: "Technical system administration",
      icon: "💻",
    },
    {
      role: "tech_support",
      title: "Tech Support",
      description: "Technical support and ticket management",
      icon: "🔧",
    },
    {
      role: "support",
      title: "Customer Support",
      description: "Customer service and support tickets",
      icon: "🎯",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-main-dark-bg bg-main-bg p-4 relative">
      {/* Staff Portal Button - Top Right Corner */}
      <div className="absolute top-6 right-6">
        <button
          onClick={() => setShowStaffModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          <span className="text-sm">👨‍💼</span>
          <span className="text-sm font-medium">Staff Portal</span>
        </button>
      </div>

      <div className="max-w-md w-full">
        {/* Header with Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Rent'D
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to your tenant or landlord account
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white dark:bg-secondary-dark-bg rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-red-700 dark:text-red-300 text-sm">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Sign in</span>
                </>
              )}
            </button>

            {/* Developer Demo Section - Hidden in production */}
            {process.env.NODE_ENV === "development" && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Developer Demo Accounts:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin("tenant")}
                    className="px-3 py-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg text-xs font-medium transition-colors"
                  >
                    Tenant
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin("landlord")}
                    className="px-3 py-2 bg-pink-100 hover:bg-pink-200 dark:bg-pink-900/30 dark:hover:bg-pink-900/50 text-pink-700 dark:text-pink-300 rounded-lg text-xs font-medium transition-colors"
                  >
                    Landlord
                  </button>
                </div>
              </div>
            )}

            {/* Sign Up Link */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-medium transition-colors"
                >
                  Sign up
                </Link>
              </span>
            </div>
          </form>
        </div>

        {/* Security Notice */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            🔒 Secure login with encrypted credentials
          </p>
        </div>
      </div>

      {/* Staff Login Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Staff Portal Login
                </h3>
                <button
                  onClick={() => setShowStaffModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Access your staff dashboard
              </p>
            </div>

            {/* Staff Login Form */}
            <form onSubmit={handleStaffLogin} className="p-6">
              {/* Staff Error Message */}
              {staffError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 text-red-700 dark:text-red-300 text-sm">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{staffError}</span>
                  </div>
                </div>
              )}

              {/* Staff Email Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Staff Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                  placeholder="staff@rentd.com"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                />
              </div>

              {/* Staff Password Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                  placeholder="Your password"
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                />
              </div>

              {/* Staff Login Button */}
              <button
                type="submit"
                disabled={staffLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
              >
                {staffLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Accessing Staff Portal...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 17l5-5m0 0l-5-5m5 5H3"
                      />
                    </svg>
                    <span>Access Staff Portal</span>
                  </>
                )}
              </button>

              {/* Staff Role Information */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-2">
                  Authorized Staff Roles:
                </p>
                <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <p>• Administrators & System Admins</p>
                  <p>• Technical Support Team</p>
                  <p>• Customer Support Staff</p>
                  <p>• Executive Team</p>
                </div>
              </div>

              {/* Developer Demo - Hidden in production */}
              {process.env.NODE_ENV === "development" && (
                <div className="mt-4 border-t pt-4">
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Developer Staff Demo:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {staffRoles.map((staff) => (
                      <button
                        key={staff.role}
                        type="button"
                        onClick={() => handleDemoLogin(staff.role)}
                        className="px-2 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-xs font-medium transition-colors flex items-center justify-center space-x-1"
                      >
                        <span>{staff.icon}</span>
                        <span>{staff.role.split("_")[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Overlay to close modal */}
      {showStaffModal && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowStaffModal(false)}
        />
      )}
    </div>
  );
};

export default Login;
