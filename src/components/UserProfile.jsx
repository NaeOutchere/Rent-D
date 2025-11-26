import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { MdKeyboardArrowDown } from "react-icons/md";
import avatar from "../data/Denae.png"; // Add this import

const UserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const menuItems = [
    { label: "Account", icon: "👤" },
    { label: "Payment", icon: "💳" },
    { label: "Settings", icon: "⚙️" },
    { label: "Documents", icon: "📄" },
    { label: "Logout", icon: "🚪", action: logout, isLast: true },
  ];

  return (
    <div className="relative">
      {/* User Avatar/Button - Using your original styling */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
      >
        <img className="rounded-full w-8 h-8" src={avatar} />
        <p>
          <span className="text-gray-400 text-14">Hi, </span>{" "}
          <span className="text-gray-400 font-bold ml-1 text-14">
            {user?.name || "Denaé"}
          </span>
        </p>
        <MdKeyboardArrowDown className="text-gray-400 text-14" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-48 bg-white dark:bg-secondary-dark-bg rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.name || "Denaé"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email || "user@example.com"}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {menuItems.map((item, index) => (
              <button
                key={item.label}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  }
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 transition duration-200 ${
                  item.isLast
                    ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                } ${
                  item.isLast &&
                  "border-t border-gray-200 dark:border-gray-600 mt-1"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Overlay to close when clicking outside */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default UserProfile;
