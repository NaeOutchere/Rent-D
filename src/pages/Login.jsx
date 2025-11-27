import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      // Navigation will be handled by the protected route or app.js
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const demoAccounts = {
      admin: { email: "admin@rentd.com", password: "demo123" },
      landlord: { email: "alice@example.com", password: "demo123" },
      tenant: { email: "bob@example.com", password: "demo123" },
      support: { email: "emily@rentd.com", password: "demo123" },
    };

    const account = demoAccounts[role];
    if (account) {
      setEmail(account.email);
      setPassword(account.password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-main-dark-bg bg-main-bg p-4">
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
            Sign in to your account
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

            {/* Demo Accounts Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                Try demo accounts:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin("admin")}
                  className="px-3 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium transition-colors"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("landlord")}
                  className="px-3 py-2 bg-pink-100 hover:bg-pink-200 dark:bg-pink-900/30 dark:hover:bg-pink-900/50 text-pink-700 dark:text-pink-300 rounded-lg text-xs font-medium transition-colors"
                >
                  Landlord
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("tenant")}
                  className="px-3 py-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg text-xs font-medium transition-colors"
                >
                  Tenant
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("support")}
                  className="px-3 py-2 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded-lg text-xs font-medium transition-colors"
                >
                  Support
                </button>
              </div>
            </div>

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
    </div>
  );
};

export default Login;
