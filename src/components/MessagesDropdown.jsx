import React, { useState } from "react";
import { TiMessages } from "react-icons/ti"; // Add this import

const MessagesDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const messages = [
    {
      id: 1,
      from: "John Doe",
      message: "Hello there!",
      time: "2 min ago",
      unread: true,
    },
    {
      id: 2,
      from: "Jane Smith",
      message: "Meeting reminder",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      from: "Mike Johnson",
      message: "Project update",
      time: "3 hours ago",
      unread: false,
    },
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
        <TiMessages />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-white dark:bg-secondary-dark-bg rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Messages
            </h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-600 ${
                  msg.unread ? "bg-blue-50 dark:bg-blue-900/20" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {msg.from}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {msg.time}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 truncate">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>

          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-600">
            <button className="w-full text-center text-blue-600 hover:text-blue-500 text-sm font-medium py-2">
              View All Messages
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

export default MessagesDropdown;
