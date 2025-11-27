import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* Animated 404 Graphic */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-gray-300 dark:text-gray-600 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl font-bold text-gray-700 dark:text-gray-300 animate-bounce">
              🏠
            </div>
          </div>
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-orange-500 rounded-full animate-ping"></div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-500 rounded-full animate-pulse"></div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Page Not Found
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Oops! It looks like the property you're looking for has been
              rented out or doesn't exist. Let's find you a better place to
              explore.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
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

            <Link
              to="/"
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
            </Link>
          </div>

          {/* Quick Links */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Popular destinations you might be looking for:
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Link
                to="/properties"
                className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 transition-colors group"
              >
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                  <span>🏘️</span>
                  <span>Properties</span>
                </div>
              </Link>
              <Link
                to="/dashboard"
                className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 transition-colors group"
              >
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                  <span>📊</span>
                  <span>Dashboard</span>
                </div>
              </Link>
              <Link
                to="/messages"
                className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 transition-colors group"
              >
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                  <span>💬</span>
                  <span>Messages</span>
                </div>
              </Link>
              <Link
                to="/support"
                className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 transition-colors group"
              >
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                  <span>🛟</span>
                  <span>Support</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Help Text */}
          <div className="pt-4">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Still lost?{" "}
              <Link
                to="/contact"
                className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 underline transition-colors"
              >
                Contact our support team
              </Link>{" "}
              for assistance.
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-8 left-8 opacity-10">
          <div className="text-6xl">🔑</div>
        </div>
        <div className="absolute top-8 right-8 opacity-10">
          <div className="text-6xl">🏢</div>
        </div>
        <div className="absolute top-1/4 left-1/4 opacity-5">
          <div className="text-4xl">💬</div>
        </div>
        <div className="absolute bottom-1/4 right-1/4 opacity-5">
          <div className="text-4xl">📊</div>
        </div>
      </div>
    </div>
  );
};

export default Error404;
