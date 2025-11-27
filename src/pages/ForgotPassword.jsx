import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic email validation
    if (!email) {
      setError("Please enter your email address");
      setIsLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call to send reset password email
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real application, you would make an API call here:
      // const response = await fetch('/api/auth/forgot-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });

      // if (!response.ok) throw new Error('Failed to send reset email');

      setIsSubmitted(true);
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              Rent'D
            </span>
          </Link>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isSubmitted
              ? "Check your email for reset instructions"
              : "Enter your email and we'll send you reset instructions"}
          </p>
        </div>

        {/* Success Message */}
        {isSubmitted ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Check your email
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We've sent a password reset link to{" "}
              <strong className="text-gray-900 dark:text-white">{email}</strong>
            </p>

            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-left">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 text-sm mb-2 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Didn't receive the email?
                </h4>
                <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
                  <li>• Check your spam folder</li>
                  <li>• Make sure you entered the correct email</li>
                  <li>• Wait a few minutes and try again</li>
                </ul>
              </div>

              <button
                onClick={handleBackToLogin}
                className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-sm hover:shadow-md"
              >
                Back to Login
              </button>

              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Try another email
              </button>
            </div>
          </div>
        ) : (
          /* Reset Form */
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-red-700 dark:text-red-300">
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
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* Help Text */}
              <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We'll send you a link to reset your password. This link will
                  expire in 1 hour for security reasons.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed transition-colors font-medium shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
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
                        d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Send Reset Link</span>
                  </>
                )}
              </button>

              {/* Back to Login */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-medium text-sm transition-colors flex items-center justify-center space-x-1 mx-auto"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  <span>Back to login</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Support Link */}
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Still having trouble?{" "}
            <Link
              to="/contact"
              className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-medium transition-colors"
            >
              Contact support
            </Link>
          </p>
        </div>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            🔒 Your security is important to us. We'll never share your email or
            personal information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
