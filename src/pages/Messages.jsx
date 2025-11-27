import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [initialMessage, setInitialMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);
  const { conversationId } = useParams();
  const navigate = useNavigate();

  // Sample users data
  const sampleUsers = [
    {
      id: 1,
      name: "John Doe",
      role: "ceo",
      email: "john@rentd.com",
      avatar: "JD",
      color: "#EF4444",
      status: "online",
      department: "Executive",
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "cto",
      email: "jane@rentd.com",
      avatar: "JS",
      color: "#10B981",
      status: "online",
      department: "Technology",
    },
    {
      id: 3,
      name: "Mike Johnson",
      role: "developer",
      email: "mike@rentd.com",
      avatar: "MJ",
      color: "#8B5CF6",
      status: "online",
      department: "Development",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      role: "designer",
      email: "sarah@rentd.com",
      avatar: "SW",
      color: "#F59E0B",
      status: "away",
      department: "Design",
    },
    {
      id: 5,
      name: "David Brown",
      role: "admin",
      email: "david@rentd.com",
      avatar: "DB",
      color: "#06B6D4",
      status: "online",
      department: "Operations",
    },
    {
      id: 6,
      name: "Alice Cooper",
      role: "landlord",
      email: "alice@example.com",
      avatar: "AC",
      color: "#EC4899",
      status: "online",
      department: "Property Owner",
    },
    {
      id: 7,
      name: "Bob Wilson",
      role: "tenant",
      email: "bob@example.com",
      avatar: "BW",
      color: "#84CC16",
      status: "online",
      department: "Tenant",
    },
    {
      id: 8,
      name: "Emily Chen",
      role: "support",
      email: "emily@rentd.com",
      avatar: "EC",
      color: "#F97316",
      status: "online",
      department: "Support",
    },
    {
      id: 9,
      name: "Robert Garcia",
      role: "landlord",
      email: "robert@example.com",
      avatar: "RG",
      color: "#8B5CF6",
      status: "offline",
      department: "Property Owner",
    },
    {
      id: 10,
      name: "Lisa Thompson",
      role: "tenant",
      email: "lisa@example.com",
      avatar: "LT",
      color: "#F59E0B",
      status: "online",
      department: "Tenant",
    },
  ];

  // Sample conversations data
  const sampleConversations = [
    {
      id: "conv-1",
      participants: [6, 7], // Alice Cooper (landlord) and Bob Wilson (tenant)
      lastMessage: "I've scheduled the maintenance for tomorrow at 2 PM.",
      lastMessageTime: new Date(Date.now() - 300000), // 5 minutes ago
      unreadCount: 0,
      property: {
        id: "prop-1",
        address: "123 Main St, Apt 4B",
        rent: 2500,
      },
    },
    {
      id: "conv-2",
      participants: [5, 6], // David Brown (admin) and Alice Cooper (landlord)
      lastMessage: "The rent payment for this month has been processed.",
      lastMessageTime: new Date(Date.now() - 1800000), // 30 minutes ago
      unreadCount: 2,
      property: {
        id: "prop-1",
        address: "123 Main St, Apt 4B",
        rent: 2500,
      },
    },
    {
      id: "conv-3",
      participants: [8, 7], // Emily Chen (support) and Bob Wilson (tenant)
      lastMessage: "We're looking into the heating issue you reported.",
      lastMessageTime: new Date(Date.now() - 3600000), // 1 hour ago
      unreadCount: 1,
      property: {
        id: "prop-1",
        address: "123 Main St, Apt 4B",
        rent: 2500,
      },
    },
    {
      id: "conv-4",
      participants: [9, 10], // Robert Garcia (landlord) and Lisa Thompson (tenant)
      lastMessage: "When would be a good time for the inspection?",
      lastMessageTime: new Date(Date.now() - 86400000), // 1 day ago
      unreadCount: 0,
      property: {
        id: "prop-2",
        address: "456 Oak Ave, Unit 12",
        rent: 3200,
      },
    },
    {
      id: "conv-5",
      participants: [3, 9], // Mike Johnson (developer) and Robert Garcia (landlord)
      lastMessage: "The portal update is complete with the new features.",
      lastMessageTime: new Date(Date.now() - 172800000), // 2 days ago
      unreadCount: 0,
      property: {
        id: "prop-2",
        address: "456 Oak Ave, Unit 12",
        rent: 3200,
      },
    },
  ];

  // Sample messages data
  const sampleMessages = {
    "conv-1": [
      {
        id: 1,
        text: "Hi Bob, I wanted to let you know that we'll be doing some maintenance in the building tomorrow.",
        senderId: 6,
        timestamp: new Date(Date.now() - 3600000),
        read: true,
        type: "text",
      },
      {
        id: 2,
        text: "Thanks for letting me know Alice. What time will the maintenance occur?",
        senderId: 7,
        timestamp: new Date(Date.now() - 1800000),
        read: true,
        type: "text",
      },
      {
        id: 3,
        text: "I've scheduled the maintenance for tomorrow at 2 PM. It should only take a couple of hours.",
        senderId: 6,
        timestamp: new Date(Date.now() - 300000),
        read: true,
        type: "text",
      },
    ],
    "conv-2": [
      {
        id: 1,
        text: "Hello Alice, this is David from Rent-D admin. I'm following up on the rent payment.",
        senderId: 5,
        timestamp: new Date(Date.now() - 7200000),
        read: true,
        type: "text",
      },
      {
        id: 2,
        text: "Hi David, yes I made the payment on the 1st. Is there an issue?",
        senderId: 6,
        timestamp: new Date(Date.now() - 3600000),
        read: true,
        type: "text",
      },
      {
        id: 3,
        text: "The rent payment for this month has been processed. Everything looks good on our end.",
        senderId: 5,
        timestamp: new Date(Date.now() - 1800000),
        read: false,
        type: "text",
      },
    ],
    "conv-3": [
      {
        id: 1,
        text: "Hi Bob, this is Emily from support. I understand you're having issues with the heating?",
        senderId: 8,
        timestamp: new Date(Date.now() - 5400000),
        read: true,
        type: "text",
      },
      {
        id: 2,
        text: "Yes, the heating in the living room isn't working properly. It's been blowing cold air.",
        senderId: 7,
        timestamp: new Date(Date.now() - 4800000),
        read: true,
        type: "text",
      },
      {
        id: 3,
        text: "We're looking into the heating issue you reported. I've contacted a technician who will reach out to schedule a visit.",
        senderId: 8,
        timestamp: new Date(Date.now() - 3600000),
        read: false,
        type: "text",
      },
    ],
  };

  // Initialize data and set current user
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);

      // In a real app, you would get the current user from your auth context
      // For demo purposes, we'll use the first user (CEO)
      setCurrentUser(sampleUsers[0]);
      setUsers(sampleUsers);

      // Filter conversations to show only those involving the current user
      const userConversations = sampleConversations.filter((conv) =>
        conv.participants.includes(sampleUsers[0].id)
      );
      setConversations(userConversations);

      setLoading(false);
    };

    initializeData();
  }, []);

  // Handle URL parameter for conversation
  useEffect(() => {
    if (conversationId && conversations.length > 0) {
      const conversation = conversations.find(
        (conv) => conv.id === conversationId
      );
      if (conversation) {
        setActiveConversation(conversation);
        setMessages(sampleMessages[conversationId] || []);

        // Mark messages as read when conversation is opened
        if (sampleMessages[conversationId]) {
          const updatedMessages = sampleMessages[conversationId].map((msg) => ({
            ...msg,
            read: true,
          }));
          setMessages(updatedMessages);

          // Update unread count in conversations
          setConversations((prev) =>
            prev.map((conv) =>
              conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
            )
          );
        }
      }
    }
  }, [conversationId, conversations]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      senderId: currentUser.id,
      timestamp: new Date(),
      read: false,
      type: "text",
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    // Update conversation last message
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversation.id
          ? {
              ...conv,
              lastMessage: newMessage,
              lastMessageTime: new Date(),
              unreadCount: 0,
            }
          : conv
      )
    );
  };

  const handleStartConversation = (e) => {
    e.preventDefault();
    if (!selectedUser || !initialMessage.trim()) return;

    const otherUser = users.find((user) => user.id === parseInt(selectedUser));
    if (!otherUser) return;

    const newConversation = {
      id: `conv-${Date.now()}`,
      participants: [currentUser.id, otherUser.id],
      lastMessage: initialMessage,
      lastMessageTime: new Date(),
      unreadCount: 0,
      property: null, // Could be set based on context
    };

    const newMessageObj = {
      id: Date.now(),
      text: initialMessage,
      senderId: currentUser.id,
      timestamp: new Date(),
      read: false,
      type: "text",
    };

    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversation(newConversation);
    setMessages([newMessageObj]);
    setShowNewConversation(false);
    setSelectedUser("");
    setInitialMessage("");

    // Navigate to the new conversation
    navigate(`/messages/${newConversation.id}`);
  };

  const getUserById = (userId) => {
    return users.find((user) => user.id === userId) || users[0];
  };

  const getOtherParticipant = (conversation) => {
    const otherId = conversation.participants.find(
      (id) => id !== currentUser?.id
    );
    return getUserById(otherId);
  };

  const canMessageUser = (user) => {
    if (!currentUser) return false;

    // Admin/tech team can message anyone
    if (
      ["ceo", "cto", "developer", "designer", "admin", "support"].includes(
        currentUser.role
      )
    ) {
      return true;
    }

    // Landlords can message their tenants and admin/tech team
    if (currentUser.role === "landlord") {
      return [
        "tenant",
        "ceo",
        "cto",
        "developer",
        "designer",
        "admin",
        "support",
      ].includes(user.role);
    }

    // Tenants can message their landlords and admin/tech team
    if (currentUser.role === "tenant") {
      return [
        "landlord",
        "ceo",
        "cto",
        "developer",
        "designer",
        "admin",
        "support",
      ].includes(user.role);
    }

    return false;
  };

  const getAvailableUsers = () => {
    return users.filter(
      (user) =>
        user.id !== currentUser?.id &&
        canMessageUser(user) &&
        !conversations.some((conv) => conv.participants.includes(user.id))
    );
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      ceo: { label: "CEO", color: "bg-red-100 text-red-800 border-red-200" },
      cto: {
        label: "CTO",
        color: "bg-green-100 text-green-800 border-green-200",
      },
      developer: {
        label: "Developer",
        color: "bg-purple-100 text-purple-800 border-purple-200",
      },
      designer: {
        label: "Designer",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      admin: {
        label: "Admin",
        color: "bg-blue-100 text-blue-800 border-blue-200",
      },
      support: {
        label: "Support",
        color: "bg-orange-100 text-orange-800 border-orange-200",
      },
      landlord: {
        label: "Landlord",
        color: "bg-pink-100 text-pink-800 border-pink-200",
      },
      tenant: {
        label: "Tenant",
        color: "bg-lime-100 text-lime-800 border-lime-200",
      },
    };

    const config = roleConfig[role] || {
      label: role,
      color: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      online: { color: "bg-green-500", label: "Online" },
      away: { color: "bg-yellow-500", label: "Away" },
      busy: { color: "bg-red-500", label: "Busy" },
      offline: { color: "bg-gray-500", label: "Offline" },
    };
    const config = statusConfig[status] || statusConfig.offline;

    return (
      <div className="flex items-center space-x-1">
        <div className={`w-2 h-2 rounded-full ${config.color}`}></div>
        <span className="text-xs text-gray-500">{config.label}</span>
      </div>
    );
  };

  const filteredConversations = conversations.filter((conv) => {
    const otherUser = getOtherParticipant(conv);
    return (
      otherUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">
            Communicate with tenants, landlords, and team members
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex h-[calc(100vh-200px)]">
            {/* Conversations Sidebar */}
            <div className="w-96 border-r border-gray-200 flex flex-col">
              {/* Search and New Conversation */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex space-x-2 mb-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">🔍</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowNewConversation(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    New
                  </button>
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No conversations found</p>
                    <button
                      onClick={() => setShowNewConversation(true)}
                      className="mt-2 text-blue-500 hover:text-blue-600 font-medium"
                    >
                      Start a new conversation
                    </button>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => {
                    const otherUser = getOtherParticipant(conversation);
                    const isActive = activeConversation?.id === conversation.id;

                    return (
                      <button
                        key={conversation.id}
                        onClick={() => {
                          setActiveConversation(conversation);
                          setMessages(sampleMessages[conversation.id] || []);
                          navigate(`/messages/${conversation.id}`);
                        }}
                        className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          isActive ? "bg-blue-50 border-blue-200" : ""
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="relative">
                            <div
                              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
                              style={{ backgroundColor: otherUser.color }}
                            >
                              {otherUser.avatar}
                            </div>
                            <div
                              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                                otherUser.status === "online"
                                  ? "bg-green-500"
                                  : otherUser.status === "away"
                                  ? "bg-yellow-500"
                                  : otherUser.status === "busy"
                                  ? "bg-red-500"
                                  : "bg-gray-500"
                              }`}
                            ></div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-gray-900 truncate">
                                  {otherUser.name}
                                </span>
                                {getRoleBadge(otherUser.role)}
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">
                                  {formatTime(conversation.lastMessageTime)}
                                </span>
                                {conversation.unreadCount > 0 && (
                                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full min-w-5 h-5 flex items-center justify-center">
                                    {conversation.unreadCount}
                                  </span>
                                )}
                              </div>
                            </div>

                            <p className="text-sm text-gray-600 truncate mb-1">
                              {conversation.lastMessage}
                            </p>

                            {conversation.property && (
                              <div className="text-xs text-gray-500 flex items-center space-x-1">
                                <span>🏠</span>
                                <span>{conversation.property.address}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col">
              {activeConversation ? (
                <>
                  {/* Conversation Header */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
                          style={{
                            backgroundColor:
                              getOtherParticipant(activeConversation).color,
                          }}
                        >
                          {getOtherParticipant(activeConversation).avatar}
                        </div>
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border-2 border-white ${
                            getOtherParticipant(activeConversation).status ===
                            "online"
                              ? "bg-green-500"
                              : "bg-gray-500"
                          }`}
                        ></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">
                            {getOtherParticipant(activeConversation).name}
                          </h3>
                          {getRoleBadge(
                            getOtherParticipant(activeConversation).role
                          )}
                          {getStatusBadge(
                            getOtherParticipant(activeConversation).status
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {getOtherParticipant(activeConversation).email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    {messages.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>No messages yet</p>
                        <p className="text-sm">
                          Start the conversation by sending a message
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message, index) => {
                          const sender = getUserById(message.senderId);
                          const isCurrentUser = sender.id === currentUser.id;
                          const showDate =
                            index === 0 ||
                            formatDate(message.timestamp) !==
                              formatDate(messages[index - 1].timestamp);

                          return (
                            <div key={message.id}>
                              {showDate && (
                                <div className="flex justify-center my-4">
                                  <div className="bg-gray-200 px-3 py-1 rounded-full text-xs text-gray-600 font-medium">
                                    {formatDate(message.timestamp)}
                                  </div>
                                </div>
                              )}

                              <div
                                className={`flex space-x-3 ${
                                  isCurrentUser
                                    ? "flex-row-reverse space-x-reverse"
                                    : ""
                                }`}
                              >
                                {!isCurrentUser && (
                                  <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                    style={{ backgroundColor: sender.color }}
                                  >
                                    {sender.avatar}
                                  </div>
                                )}

                                <div
                                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                    isCurrentUser
                                      ? "bg-blue-500 text-white rounded-br-none"
                                      : "bg-white text-gray-900 rounded-bl-none border border-gray-200"
                                  }`}
                                >
                                  <p className="text-sm">{message.text}</p>
                                  <div
                                    className={`text-xs mt-1 ${
                                      isCurrentUser
                                        ? "text-blue-100"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {formatTime(message.timestamp)}
                                    {isCurrentUser && (
                                      <span className="ml-2">
                                        {message.read ? "✓✓" : "✓"}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <form
                      onSubmit={handleSendMessage}
                      className="flex space-x-4"
                    >
                      <div className="flex-1">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors font-medium"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-xl font-semibold mb-2">
                      No conversation selected
                    </h3>
                    <p>
                      Choose a conversation from the sidebar or start a new one
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Conversation Modal */}
      {showNewConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Start New Conversation
              </h3>
            </div>

            <form onSubmit={handleStartConversation} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select User
                  </label>
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose a user...</option>
                    {getAvailableUsers().map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.role}) - {user.department}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Message
                  </label>
                  <textarea
                    value={initialMessage}
                    onChange={(e) => setInitialMessage(e.target.value)}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Type your first message..."
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowNewConversation(false)}
                  className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Start Conversation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
