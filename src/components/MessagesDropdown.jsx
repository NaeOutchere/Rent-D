import React, { useState, useEffect } from "react";
import { TiMessages } from "react-icons/ti";
import { Link, useNavigate } from "react-router-dom";

const MessagesDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentMessages, setRecentMessages] = useState([]);
  const navigate = useNavigate();

  // Sample conversations data - in real app, this would come from your API/context
  const sampleConversations = [
    {
      id: "conv-1",
      participants: [6, 7], // Alice Cooper (landlord) and Bob Wilson (tenant)
      lastMessage: "I've scheduled the maintenance for tomorrow at 2 PM.",
      lastMessageTime: new Date(Date.now() - 300000), // 5 minutes ago
      unreadCount: 0,
      otherUser: {
        id: 6,
        name: "Alice Cooper",
        role: "landlord",
        avatar: "AC",
        color: "#EC4899",
      },
      property: {
        address: "123 Main St, Apt 4B",
      },
    },
    {
      id: "conv-2",
      participants: [5, 6], // David Brown (admin) and Alice Cooper (landlord)
      lastMessage: "The rent payment for this month has been processed.",
      lastMessageTime: new Date(Date.now() - 1800000), // 30 minutes ago
      unreadCount: 2,
      otherUser: {
        id: 5,
        name: "David Brown",
        role: "admin",
        avatar: "DB",
        color: "#06B6D4",
      },
      property: {
        address: "123 Main St, Apt 4B",
      },
    },
    {
      id: "conv-3",
      participants: [8, 7], // Emily Chen (support) and Bob Wilson (tenant)
      lastMessage: "We're looking into the heating issue you reported.",
      lastMessageTime: new Date(Date.now() - 3600000), // 1 hour ago
      unreadCount: 1,
      otherUser: {
        id: 8,
        name: "Emily Chen",
        role: "support",
        avatar: "EC",
        color: "#F97316",
      },
      property: {
        address: "123 Main St, Apt 4B",
      },
    },
  ];

  // Initialize data
  useEffect(() => {
    // Filter to show only conversations involving current user (in real app, get from context)
    const userConversations = sampleConversations.filter(
      (conv) => conv.participants.includes(1) // Assuming current user ID is 1 (CEO)
    );

    setRecentMessages(userConversations);

    // Calculate total unread count
    const totalUnread = userConversations.reduce(
      (total, conv) => total + conv.unreadCount,
      0
    );
    setUnreadCount(totalUnread);
  }, []);

  const formatTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return messageTime.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      ceo: { label: "CEO", color: "bg-red-100 text-red-800" },
      cto: { label: "CTO", color: "bg-green-100 text-green-800" },
      developer: { label: "Developer", color: "bg-purple-100 text-purple-800" },
      designer: { label: "Designer", color: "bg-yellow-100 text-yellow-800" },
      admin: { label: "Admin", color: "bg-blue-100 text-blue-800" },
      support: { label: "Support", color: "bg-orange-100 text-orange-800" },
      landlord: { label: "Landlord", color: "bg-pink-100 text-pink-800" },
      tenant: { label: "Tenant", color: "bg-lime-100 text-lime-800" },
    };

    const config = roleConfig[role] || {
      label: role,
      color: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const handleMessageClick = (conversationId) => {
    navigate(`/messages/${conversationId}`);
    setIsOpen(false);
  };

  const handleViewAll = () => {
    navigate("/messages");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-xl rounded-full p-3 hover:bg-light-gray text-[#e07229] transition-colors duration-200"
      >
        <TiMessages className="text-2xl" />
        {unreadCount > 0 && (
          <span
            style={{ background: "#274254" }}
            className="absolute inline-flex items-center justify-center rounded-full h-5 w-5 text-xs text-white font-medium right-1 top-1"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-14 w-96 bg-white dark:bg-secondary-dark-bg rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 py-2 z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Messages
              </h3>
              {unreadCount > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>
          </div>

          {/* Messages List */}
          <div className="max-h-96 overflow-y-auto">
            {recentMessages.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <div className="text-4xl text-gray-400 mb-2">💬</div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No messages yet
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                  Start a conversation with your team or customers
                </p>
              </div>
            ) : (
              recentMessages.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleMessageClick(conversation.id)}
                  className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-600 transition-colors duration-150 ${
                    conversation.unreadCount > 0
                      ? "bg-blue-50 dark:bg-blue-900/20"
                      : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm"
                        style={{
                          backgroundColor: conversation.otherUser.color,
                        }}
                      >
                        {conversation.otherUser.avatar}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-secondary-dark-bg"></div>
                    </div>

                    {/* Message Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900 dark:text-white text-sm truncate">
                            {conversation.otherUser.name}
                          </span>
                          {getRoleBadge(conversation.otherUser.role)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(conversation.lastMessageTime)}
                          </span>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-4 h-4 flex items-center justify-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate mb-1">
                        {conversation.lastMessage}
                      </p>

                      {conversation.property && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                          <span>🏠</span>
                          <span className="truncate">
                            {conversation.property.address}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
            <button
              onClick={handleViewAll}
              className="w-full text-center text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium py-2 transition-colors duration-200"
            >
              View All Messages
            </button>
          </div>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default MessagesDropdown;
