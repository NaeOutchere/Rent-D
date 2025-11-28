import React, { useState, useEffect, useRef } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState("general");
  const [users, setUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState([]);

  // Video Call States
  const [videoCall, setVideoCall] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [callParticipants, setCallParticipants] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Modern SVG Icons
  const Icons = {
    search: (
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
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
    add: (
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
          d="M12 4v16m8-8H4"
        />
      </svg>
    ),
    channel: (
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
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    ),
    video: (
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
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
    call: (
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
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
    send: (
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
          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
        />
      </svg>
    ),
    attach: (
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
          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
        />
      </svg>
    ),
    emoji: (
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
          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    user: (
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
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    lock: (
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
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
    info: (
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
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    menu: (
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
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    ),
    mute: (
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
          d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
        />
      </svg>
    ),
    unmute: (
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
          d="M15.536 8.464a5 5 0 010 7.072M12 6a9 9 0 010 12m-4.5-9.5L12 3v18l-4.5-4.5H4a1 1 0 01-1-1v-7a1 1 0 011-1h3.5z"
        />
      </svg>
    ),
    videoOn: (
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
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
    videoOff: (
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
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14m-6 0l-4 2.276A1 1 0 013 15.382V8.618a1 1 0 011.447-.894L9 10m0 4v4m0 0H5a2 2 0 01-2-2v-1"
        />
      </svg>
    ),
    endCall: (
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
          d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M6 18L4 4.5a.5.5 0 01.5-.5h15a.5.5 0 01.5.5L18 18a2 2 0 01-2 2H8a2 2 0 01-2-2z"
        />
      </svg>
    ),
    message: (
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
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  };

  // Sample data
  const sampleUsers = [
    {
      id: 1,
      name: "John Doe",
      role: "ceo",
      email: "john@rentd.com",
      avatar: "JD",
      color: "#2b4354",
      status: "online",
      department: "Executive",
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "cto",
      email: "jane@rentd.com",
      avatar: "JS",
      color: "#2b4354",
      status: "online",
      department: "Technology",
    },
    {
      id: 3,
      name: "Mike Johnson",
      role: "developer",
      email: "mike@rentd.com",
      avatar: "MJ",
      color: "#2b4354",
      status: "online",
      department: "Development",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      role: "designer",
      email: "sarah@rentd.com",
      avatar: "SW",
      color: "#2b4354",
      status: "away",
      department: "Design",
    },
    {
      id: 5,
      name: "David Brown",
      role: "admin",
      email: "david@rentd.com",
      avatar: "DB",
      color: "#2b4354",
      status: "online",
      department: "Operations",
    },
  ];

  const sampleChannels = [
    {
      id: "general",
      name: "general",
      description: "Company-wide announcements and work-based matters",
      createdBy: 1,
      memberCount: 8,
      isPrivate: false,
    },
    {
      id: "tech-team",
      name: "tech-team",
      description: "Technical discussions and development updates",
      createdBy: 2,
      memberCount: 3,
      isPrivate: true,
    },
    {
      id: "design",
      name: "design",
      description: "Design discussions and feedback",
      createdBy: 4,
      memberCount: 2,
      isPrivate: true,
    },
  ];

  const sampleMessages = [
    {
      id: 1,
      text: "Welcome to Rent-D Chat! 👋 This is where our team collaborates.",
      userId: 1,
      channelId: "general",
      timestamp: new Date(Date.now() - 3600000),
      type: "message",
    },
    {
      id: 2,
      text: "We just deployed the new payment integration feature! 🚀",
      userId: 2,
      channelId: "tech-team",
      timestamp: new Date(Date.now() - 1800000),
      type: "message",
    },
    {
      id: 3,
      text: "The new dashboard design is ready for review. Looking forward to your feedback!",
      userId: 4,
      channelId: "design",
      timestamp: new Date(Date.now() - 900000),
      type: "message",
    },
  ];

  // Initialize data
  useEffect(() => {
    setUsers(sampleUsers);
    setChannels(sampleChannels);
    setMessages(sampleMessages);
    setCurrentUser(sampleUsers[0]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      userId: currentUser.id,
      channelId: activeChannel,
      timestamp: new Date(),
      type: "message",
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    // Simulate typing response after 2 seconds
    setIsTyping(true);
    setTimeout(() => {
      const channel = getChannelById(activeChannel);
      const otherUsers = users.filter(
        (user) =>
          user.id !== currentUser.id && channel?.members?.includes(user.id)
      );

      if (otherUsers.length > 0) {
        const randomUser =
          otherUsers[Math.floor(Math.random() * otherUsers.length)];
        const responses = [
          "Thanks for the update!",
          "That's great to hear!",
          "I'll take a look at that.",
          "Perfect timing!",
          "Let me review this and get back to you.",
        ];

        const responseMessage = {
          id: Date.now() + 1,
          text: responses[Math.floor(Math.random() * responses.length)],
          userId: randomUser.id,
          channelId: activeChannel,
          timestamp: new Date(),
          type: "message",
        };

        setMessages((prev) => [...prev, responseMessage]);
      }
      setIsTyping(false);
    }, 2000);
  };

  const startVideoCall = (userIds = null) => {
    // Fix: Ensure userIds is always an array
    const participants = userIds
      ? users.filter((user) =>
          Array.isArray(userIds)
            ? userIds.includes(user.id)
            : userIds === user.id
        )
      : [currentUser];

    const call = {
      id: Date.now(),
      type: "video",
      participants: participants,
      startTime: new Date(),
      status: "active",
    };

    setVideoCall(call);
    setCallParticipants(participants);
    setShowVideoModal(true);
  };

  const endVideoCall = () => {
    setVideoCall(null);
    setShowVideoModal(false);
    setIsMuted(false);
    setIsVideoOff(false);
  };

  const handleCreateChannel = (e) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    const newChannel = {
      id: newChannelName.toLowerCase().replace(/\s+/g, "-"),
      name: newChannelName.toLowerCase().replace(/\s+/g, "-"),
      description: "New channel for team collaboration",
      createdBy: currentUser.id,
      createdAt: new Date(),
      memberCount: 1,
      isPrivate: false,
    };

    setChannels((prev) => [...prev, newChannel]);
    setActiveChannel(newChannel.id);
    setNewChannelName("");
    setShowChannelModal(false);
  };

  const startDirectMessage = (user) => {
    const dmChannel = {
      id: `dm-${user.id}`,
      name: user.name.toLowerCase().replace(/\s+/g, "-"),
      description: `Direct message with ${user.name}`,
      createdBy: currentUser.id,
      memberCount: 2,
      isPrivate: true,
      isDM: true,
      members: [currentUser.id, user.id],
    };

    // Check if DM channel already exists
    const existingChannel = channels.find(
      (channel) => channel.isDM && channel.members?.includes(user.id)
    );

    if (existingChannel) {
      setActiveChannel(existingChannel.id);
    } else {
      setChannels((prev) => [...prev, dmChannel]);
      setActiveChannel(dmChannel.id);
    }

    setShowNewChatModal(false);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (attachmentId) => {
    setAttachments((prev) => prev.filter((att) => att.id !== attachmentId));
  };

  const getChannelById = (channelId) => {
    return channels.find((channel) => channel.id === channelId);
  };

  const getUserById = (userId) => {
    return users.find((user) => user.id === userId) || users[0];
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getChannelMessages = () => {
    return messages.filter((msg) => msg.channelId === activeChannel);
  };

  const renderMessage = (message) => {
    const user = getUserById(message.userId);
    const isCurrentUser = user.id === currentUser.id;

    return (
      <div
        key={message.id}
        className={`flex space-x-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors ${
          isCurrentUser ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${
            isCurrentUser ? "order-2" : ""
          }`}
          style={{ backgroundColor: user.color }}
        >
          {user.avatar}
        </div>

        <div className={`flex-1 min-w-0 ${isCurrentUser ? "text-right" : ""}`}>
          <div
            className={`flex items-baseline space-x-2 ${
              isCurrentUser ? "justify-end" : ""
            }`}
          >
            <span className="font-semibold text-gray-900 text-sm">
              {user.name}
            </span>
            <span className="text-xs text-gray-500">
              {formatTime(message.timestamp)}
            </span>
          </div>

          <div
            className={`mt-1 px-4 py-3 rounded-2xl max-w-2xl ${
              isCurrentUser
                ? "bg-[#2b4354] text-white rounded-br-none shadow-sm"
                : "bg-white text-gray-900 rounded-bl-none border border-gray-200 shadow-sm"
            }`}
          >
            <p className="text-sm leading-relaxed">{message.text}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderAttachments = () => {
    if (attachments.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mb-3">
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2"
          >
            <span className="text-sm text-gray-700">{attachment.name}</span>
            <button
              onClick={() => removeAttachment(attachment.id)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-gray-900 text-lg">Rent'D Chat</h1>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 truncate">
                  {currentUser?.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => setShowNewChatModal(true)}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-2xl hover:shadow-lg transition-all font-medium flex items-center justify-center space-x-2 shadow-sm"
          >
            {Icons.message}
            <span>Start New Chat</span>
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search messages, files, people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 text-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {Icons.search}
            </div>
          </div>
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Channels
              </h2>
              <button
                onClick={() => setShowChannelModal(true)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
              >
                {Icons.add}
              </button>
            </div>
            <div className="space-y-1">
              {channels
                .filter((channel) => !channel.isDM)
                .map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setActiveChannel(channel.id)}
                    className={`w-full text-left px-4 py-3 rounded-2xl text-sm transition-all flex items-center space-x-3 group ${
                      activeChannel === channel.id
                        ? "bg-orange-50 text-orange-900 border border-orange-200 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:shadow-sm"
                    }`}
                  >
                    <div
                      className={`${
                        channel.isPrivate ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {channel.isPrivate ? Icons.lock : Icons.channel}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">#{channel.name}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {channel.description}
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>

          {/* Direct Messages */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Direct Messages
              </h2>
            </div>
            <div className="space-y-1">
              {channels
                .filter((channel) => channel.isDM)
                .map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setActiveChannel(channel.id)}
                    className={`w-full text-left px-4 py-3 rounded-2xl text-sm transition-all flex items-center space-x-3 group ${
                      activeChannel === channel.id
                        ? "bg-orange-50 text-orange-900 border border-orange-200 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:shadow-sm"
                    }`}
                  >
                    <div className="text-gray-500">{Icons.user}</div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{channel.name}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {channel.description}
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => setShowUserModal(true)}
            className="flex items-center space-x-3 w-full p-3 rounded-2xl hover:bg-white hover:shadow-sm transition-all"
          >
            <div className="relative">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
                style={{ backgroundColor: currentUser?.color }}
              >
                {currentUser?.avatar}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white bg-green-500"></div>
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="font-medium text-gray-900 truncate">
                {currentUser?.name}
              </div>
              <div className="text-sm text-gray-600 truncate">
                {currentUser?.email}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Channel Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <span className="text-xl font-bold text-gray-900">
                  {getChannelById(activeChannel)?.isPrivate
                    ? Icons.lock
                    : Icons.channel}{" "}
                  {getChannelById(activeChannel)?.name}
                </span>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span className="text-gray-600">
                  {getChannelById(activeChannel)?.description}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => startVideoCall()} // Fixed: removed userIds parameter
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl hover:shadow-lg transition-all font-medium flex items-center space-x-2 shadow-sm"
              >
                {Icons.video}
                <span>Start Call</span>
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-4xl mx-auto py-6">
            {getChannelMessages().length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 text-gray-300">
                  {Icons.channel}
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No messages yet
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {getChannelById(activeChannel)?.isDM
                    ? `Start a conversation with ${
                        getChannelById(activeChannel)?.name
                      }`
                    : `Send the first message in #${
                        getChannelById(activeChannel)?.name
                      }`}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {getChannelMessages().map((message) => renderMessage(message))}

                {isTyping && (
                  <div className="flex space-x-3 px-4 py-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
                      style={{ backgroundColor: "#2b4354" }}
                    >
                      {getChannelById(activeChannel)?.isDM
                        ? getChannelById(activeChannel)?.name?.charAt(0)
                        : "T"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline space-x-2">
                        <span className="font-semibold text-gray-900 text-sm">
                          {getChannelById(activeChannel)?.isDM
                            ? getChannelById(activeChannel)?.name
                            : "Team Member"}
                        </span>
                      </div>
                      <div className="mt-1 px-4 py-3 rounded-2xl bg-white border border-gray-200 shadow-sm max-w-xs">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-6">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
            {renderAttachments()}
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <div className="relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Message ${
                      getChannelById(activeChannel)?.isDM
                        ? getChannelById(activeChannel)?.name
                        : "#" + getChannelById(activeChannel)?.name
                    }`}
                    className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 pr-32"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                    >
                      {Icons.attach}
                    </button>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                    >
                      {Icons.emoji}
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    multiple
                    className="hidden"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-8 py-4 bg-gradient-to-r from-[#2b4354] to-[#3c5a6a] text-white rounded-2xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center space-x-2 shadow-sm"
              >
                <span>Send</span>
                {Icons.send}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Start New Chat
              </h3>
              <p className="text-gray-600 mt-1">
                Select a team member to start chatting
              </p>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <div className="p-4 space-y-2">
                {users
                  .filter((user) => user.id !== currentUser.id)
                  .map((user) => (
                    <button
                      key={user.id}
                      onClick={() => startDirectMessage(user)}
                      className="w-full text-left p-4 rounded-2xl hover:bg-gray-50 transition-all flex items-center space-x-3 group"
                    >
                      <div className="relative">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
                          style={{ backgroundColor: user.color }}
                        >
                          {user.avatar}
                        </div>
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                            user.status === "online"
                              ? "bg-green-500"
                              : user.status === "away"
                              ? "bg-yellow-500"
                              : "bg-gray-400"
                          }`}
                        ></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-600 truncate">
                          {user.department}
                        </div>
                      </div>
                      <div className="text-gray-400 group-hover:text-gray-600">
                        {Icons.message}
                      </div>
                    </button>
                  ))}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowNewChatModal(false)}
                className="w-full px-6 py-3 text-gray-700 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Channel Modal */}
      {showChannelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Create New Channel
              </h3>
              <p className="text-gray-600 mt-1">
                Create a new channel for team collaboration
              </p>
            </div>
            <form onSubmit={handleCreateChannel} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Channel Name
                  </label>
                  <input
                    type="text"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    placeholder="e.g., marketing, operations"
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowChannelModal(false)}
                  className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newChannelName.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                >
                  Create Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Call Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
            {/* Call Header */}
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center">
                  {Icons.video}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Video Call
                  </h3>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Call in progress</span>
                  </div>
                </div>
              </div>
              <button
                onClick={endVideoCall}
                className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
              >
                {Icons.endCall}
              </button>
            </div>

            {/* Video Grid */}
            <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
              {/* Current User Video */}
              <div className="bg-gray-800 rounded-2xl overflow-hidden relative">
                <div className="aspect-video bg-gray-700 flex items-center justify-center">
                  {isVideoOff ? (
                    <div className="text-center">
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-2"
                        style={{ backgroundColor: currentUser.color }}
                      >
                        {currentUser.avatar}
                      </div>
                      <p className="text-gray-300">{currentUser.name}</p>
                      <p className="text-gray-500 text-sm">Video is off</p>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center rounded-2xl">
                      <div className="text-white text-center">
                        <div className="text-4xl mb-2">{Icons.videoOn}</div>
                        <p className="text-sm">Your Video</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 rounded-full px-4 py-2">
                  <span className="text-white text-sm">
                    {currentUser.name} (You)
                  </span>
                  {isMuted && (
                    <span className="text-red-400 ml-2">{Icons.mute}</span>
                  )}
                </div>
              </div>

              {/* Other Participants */}
              {callParticipants
                .filter((participant) => participant.id !== currentUser.id)
                .map((participant) => (
                  <div
                    key={participant.id}
                    className="bg-gray-800 rounded-2xl overflow-hidden relative"
                  >
                    <div className="aspect-video bg-gray-700 flex items-center justify-center">
                      <div className="text-center">
                        <div
                          className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-2"
                          style={{ backgroundColor: participant.color }}
                        >
                          {participant.avatar}
                        </div>
                        <p className="text-gray-300">{participant.name}</p>
                        <p className="text-gray-500 text-sm">Connecting...</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Call Controls */}
            <div className="p-6 border-t border-gray-700">
              <div className="flex items-center justify-center space-x-6">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                    isMuted
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  <span className="text-white">
                    {isMuted ? Icons.mute : Icons.unmute}
                  </span>
                </button>

                <button
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                    isVideoOff
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  <span className="text-white">
                    {isVideoOff ? Icons.videoOff : Icons.videoOn}
                  </span>
                </button>

                <button
                  onClick={endVideoCall}
                  className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center hover:bg-red-600 transition-all shadow-lg"
                >
                  <span className="text-white">{Icons.endCall}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
