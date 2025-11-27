import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Error500 = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.location.reload();
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center">
        {/* Animated Error Graphic */}
        <div className="relative mb-8">
          <div className="text-8xl font-bold text-gray-200 dark:text-gray-700 select-none mb-4">
            500
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="text-6xl animate-bounce">🚧</div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-ping"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-orange-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Animated Tools */}
          <div className="flex justify-center space-x-4 mt-6 opacity-70">
            <div
              className="text-2xl animate-spin"
              style={{ animationDuration: "3s" }}
            >
              🔧
            </div>
            <div className="text-2xl animate-pulse">🛠️</div>
            <div
              className="text-2xl animate-bounce"
              style={{ animationDelay: "0.5s" }}
            >
              ⚡
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Server Maintenance in Progress
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Our technical team is working hard to fix an unexpected issue.
              This is usually temporary, and we appreciate your patience while
              we get things back to normal.
            </p>

            {/* Status Indicators */}
            <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center space-x-2 text-red-500">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Server</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Offline</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center space-x-2 text-yellow-500">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Database</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Maintenance</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center space-x-2 text-green-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Support</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Available</div>
              </div>
            </div>
          </div>

          {/* What You Can Do */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-left">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center">
              <span className="text-lg mr-2">💡</span>
              While we're working...
            </h3>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• Try refreshing the page in a few moments</li>
              <li>• Check our status page for updates</li>
              <li>• Contact support if the issue persists</li>
              <li>• Browse other sections of the site</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRefreshing ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300 rounded-full animate-spin"></div>
                  <span>Refreshing...</span>
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
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Try Again</span>
                </>
              )}
            </button>

            <button
              onClick={handleGoBack}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
            >
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Go Back</span>
            </button>

            <button
              onClick={handleGoHome}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
            >
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>Home Page</span>
            </button>
          </div>

          {/* Quick Links */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              These sections might still be accessible:
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Link
                to="/faq"
                className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 transition-colors group"
              >
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                  <span>❓</span>
                  <span>FAQ</span>
                </div>
              </Link>
              <Link
                to="/contact"
                className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 transition-colors group"
              >
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                  <span>📞</span>
                  <span>Contact</span>
                </div>
              </Link>
              <Link
                to="/status"
                className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 transition-colors group"
              >
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                  <span>📊</span>
                  <span>Status</span>
                </div>
              </Link>
              <Link
                to="/help"
                className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 transition-colors group"
              >
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                  <span>🛟</span>
                  <span>Help Center</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Support Information */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="text-blue-500 text-xl">👨‍💻</div>
              <div className="text-left">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 text-sm">
                  Need immediate assistance?
                </h4>
                <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                  Our support team is available 24/7 to help you with any urgent
                  issues.
                </p>
                <div className="flex space-x-3 mt-2">
                  <Link
                    to="/contact"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-medium underline"
                  >
                    Contact Support
                  </Link>
                  <a
                    href="mailto:support@rentd.com"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-medium underline"
                  >
                    Email Us
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Details (Collapsible) */}
          <details className="text-left bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 font-medium">
              Technical Details
            </summary>
            <div className="mt-3 space-y-2 text-xs text-gray-500 dark:text-gray-400">
              <p>
                <strong>Error Code:</strong> 500 - Internal Server Error
              </p>
              <p>
                <strong>Timestamp:</strong> {new Date().toLocaleString()}
              </p>
              <p>
                <strong>Reference ID:</strong> RENTD_{Date.now()}
              </p>
              <p>
                <strong>What happened:</strong> Our servers encountered an
                unexpected condition that prevented them from fulfilling your
                request.
              </p>
            </div>
          </details>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-8 left-8 opacity-10">
          <div className="text-6xl">⚡</div>
        </div>
        <div className="absolute top-8 right-8 opacity-10">
          <div className="text-6xl">🔧</div>
        </div>
        <div className="absolute top-1/4 left-1/4 opacity-5">
          <div className="text-4xl">🚧</div>
        </div>
        <div className="absolute bottom-1/4 right-1/4 opacity-5">
          <div className="text-4xl">🛠️</div>
        </div>
      </div>
    </div>
  );
};

export default Error500;
