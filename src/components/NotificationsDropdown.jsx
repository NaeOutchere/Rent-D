import React, { useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5"; // Add this import

const NotificationsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      type: "success",
      message: "Rent payment received",
      time: "5 min ago",
    },
    {
      id: 2,
      type: "warning",
      message: "Maintenance scheduled",
      time: "1 hour ago",
    },
    {
      id: 3,
      type: "info",
      message: "New message from tenant",
      time: "2 hours ago",
    },
    { id: 4, type: "error", message: "Payment failed", time: "1 day ago" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-xl rounded-full p-3 hover:bg-light-gray text-[#e07229]"
      >
        <span
          style={{ background: "#274254" }}
          className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
        />
        <IoNotificationsOutline />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-white dark:bg-secondary-dark-bg rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notifications
            </h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-600"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      notif.type === "success"
                        ? "bg-green-500"
                        : notif.type === "warning"
                        ? "bg-yellow-500"
                        : notif.type === "error"
                        ? "bg-red-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {notif.message}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {notif.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-600">
            <button className="w-full text-center text-blue-600 hover:text-blue-500 text-sm font-medium py-2">
              Mark All as Read
            </button>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default NotificationsDropdown;
