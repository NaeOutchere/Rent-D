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
  const [showChannelInfo, setShowChannelInfo] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDescription, setNewChannelDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [attachments, setAttachments] = useState([]);

  // Video Call States
  const [videoCall, setVideoCall] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [callParticipants, setCallParticipants] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callHistory, setCallHistory] = useState([]);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callTimer, setCallTimer] = useState(0);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const callTimerRef = useRef(null);

  // Modern icon set
  const icons = {
    search: "🔍",
    add: "➕",
    channel: "💬",
    video: "📹",
    call: "📞",
    endCall: "📞",
    mute: "🎤",
    unmute: "🔇",
    videoOn: "📹",
    videoOff: "📷",
    screenShare: "🖥️",
    attach: "📎",
    emoji: "😊",
    user: "👤",
    group: "👥",
    lock: "🔒",
    unlock: "🔓",
    info: "ℹ️",
    send: "➡️",
    online: "🟢",
    away: "🟡",
    busy: "🔴",
    offline: "⚫",
    check: "✅",
    cross: "❌",
    menu: "⋮",
    download: "📥",
    history: "🕒",
    schedule: "📅",
    format: "🔠",
  };

  // Enhanced sample data
  const sampleUsers = [
    {
      id: 1,
      name: "John Doe",
      role: "ceo",
      email: "john@rentd.com",
      avatar: "JD",
      color: "#EF4444",
      status: "online",
      lastActive: new Date(),
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
      lastActive: new Date(),
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
      lastActive: new Date(),
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
      lastActive: new Date(Date.now() - 300000),
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
      lastActive: new Date(),
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
      lastActive: new Date(),
      department: "Customer",
    },
    {
      id: 7,
      name: "Bob Wilson",
      role: "tenant",
      email: "bob@example.com",
      avatar: "BW",
      color: "#84CC16",
      status: "online",
      lastActive: new Date(),
      department: "Customer",
    },
    {
      id: 8,
      name: "Emily Chen",
      role: "support",
      email: "emily@rentd.com",
      avatar: "EC",
      color: "#F97316",
      status: "online",
      lastActive: new Date(),
      department: "Support",
    },
  ];

  const sampleChannels = [
    {
      id: "general",
      name: "general",
      description: "Company-wide announcements and work-based matters",
      createdBy: 1,
      createdAt: new Date("2024-01-01"),
      memberCount: 8,
      isPrivate: false,
    },
    {
      id: "tech-team",
      name: "tech-team",
      description:
        "Technical discussions, code reviews, and development updates",
      createdBy: 2,
      createdAt: new Date("2024-01-02"),
      memberCount: 3,
      isPrivate: true,
    },
    {
      id: "design",
      name: "design",
      description: "Design discussions, feedback, and asset sharing",
      createdBy: 4,
      createdAt: new Date("2024-01-03"),
      memberCount: 2,
      isPrivate: true,
    },
    {
      id: "random",
      name: "random",
      description: "Non-work banter and water cooler conversation",
      createdBy: 3,
      createdAt: new Date("2024-01-04"),
      memberCount: 6,
      isPrivate: false,
    },
    {
      id: "support-requests",
      name: "support-requests",
      description: "Customer support tickets, issues, and service requests",
      createdBy: 5,
      createdAt: new Date("2024-01-05"),
      memberCount: 8,
      isPrivate: false,
    },
    {
      id: "executive",
      name: "executive",
      description: "Executive discussions and strategic planning",
      createdBy: 1,
      createdAt: new Date("2024-01-06"),
      memberCount: 2,
      isPrivate: true,
    },
  ];

  const sampleMessages = [
    {
      id: 1,
      text: "Welcome to Rent-D Chat! 👋 This is where our team collaborates and supports our customers.",
      userId: 1,
      channelId: "general",
      timestamp: new Date(Date.now() - 3600000),
      type: "message",
      reactions: { "👋": [2, 3] },
    },
    {
      id: 2,
      text: "We just deployed the new payment integration feature! 🚀 Check it out and let me know if you find any issues.",
      userId: 2,
      channelId: "tech-team",
      timestamp: new Date(Date.now() - 1800000),
      type: "message",
      reactions: { "🚀": [1, 3, 4], "👍": [5] },
    },
    {
      id: 3,
      text: 'Having issues with my rent payment - it keeps showing "processing" but not going through. Can someone help?',
      userId: 7,
      channelId: "support-requests",
      timestamp: new Date(Date.now() - 900000),
      type: "message",
      attachments: ["payment-issue.jpg"],
    },
    {
      id: 4,
      text: "Hi Bob! I can help you with that. Can you share your tenant ID and the exact error message you are seeing?",
      userId: 8,
      channelId: "support-requests",
      timestamp: new Date(Date.now() - 800000),
      type: "message",
      thread: {
        parentId: 3,
        replies: 1,
      },
    },
    {
      id: 5,
      text: "The new dashboard design is ready for review. Looking forward to your feedback!",
      userId: 4,
      channelId: "design",
      timestamp: new Date(Date.now() - 700000),
      type: "message",
      attachments: ["dashboard-design.pdf"],
    },
  ];

  // Initialize data
  useEffect(() => {
    setUsers(sampleUsers);
    setChannels(sampleChannels);
    setMessages(sampleMessages);
    setCurrentUser(sampleUsers[0]);

    // Sample call history
    setCallHistory([
      {
        id: 1,
        type: "video",
        participants: [1, 2, 3],
        duration: 1245,
        timestamp: new Date(Date.now() - 86400000),
        initiatedBy: 1,
      },
      {
        id: 2,
        type: "video",
        participants: [1, 4],
        duration: 634,
        timestamp: new Date(Date.now() - 172800000),
        initiatedBy: 4,
      },
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (newMessage) {
      setIsTyping(true);
      setTypingUser(currentUser);
      const typingTimeout = setTimeout(() => {
        setIsTyping(false);
        setTypingUser(null);
      }, 1000);
      return () => clearTimeout(typingTimeout);
    }
  }, [newMessage]);

  const canAccessChannel = (channelId) => {
    if (["tenant", "landlord"].includes(currentUser?.role)) {
      return ["general", "support-requests"].includes(channelId);
    }
    return true;
  };

  // Search functionality
  const filteredChannels = channels.filter(
    (channel) =>
      canAccessChannel(channel.id) &&
      channel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(
    (user) =>
      user.id !== currentUser?.id &&
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMessages = messages.filter(
    (message) =>
      message.channelId === activeChannel &&
      message.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Video Call Functions
  const startVideoCall = (userIds = null) => {
    const participants = userIds
      ? users.filter((user) => userIds.includes(user.id))
      : [currentUser];

    const call = {
      id: Date.now(),
      type: "video",
      participants: participants,
      startTime: new Date(),
      status: "active",
      initiatedBy: currentUser.id,
    };

    setVideoCall(call);
    setCallParticipants(participants);
    setShowVideoModal(true);
    setCallTimer(0);

    // Start call timer
    callTimerRef.current = setInterval(() => {
      setCallTimer((prev) => prev + 1);
    }, 1000);

    // Add call start message to chat
    const callMessage = {
      id: Date.now(),
      text: `Started a video call with ${participants
        .map((p) => p.name)
        .join(", ")}`,
      userId: currentUser.id,
      channelId: activeChannel,
      timestamp: new Date(),
      type: "system",
      callId: call.id,
    };

    setMessages((prev) => [...prev, callMessage]);
  };

  const endVideoCall = () => {
    if (videoCall) {
      // Stop timer
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }

      // Add call to history
      const completedCall = {
        ...videoCall,
        endTime: new Date(),
        duration: callTimer,
        status: "completed",
      };

      setCallHistory((prev) => [completedCall, ...prev]);

      // Add call end message to chat
      const callMessage = {
        id: Date.now(),
        text: `Video call ended after ${formatCallDuration(callTimer)}`,
        userId: currentUser.id,
        channelId: activeChannel,
        timestamp: new Date(),
        type: "system",
        callId: videoCall.id,
      };

      setMessages((prev) => [...prev, callMessage]);
    }

    setVideoCall(null);
    setShowVideoModal(false);
    setCallTimer(0);
    setIsMuted(false);
    setIsVideoOff(false);
    setIsScreenSharing(false);
  };

  const inviteToCall = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (user && videoCall) {
      setCallParticipants((prev) => [...prev, user]);

      // Simulate incoming call for invited user
      if (user.id !== currentUser.id) {
        setIncomingCall({
          from: currentUser,
          callId: videoCall.id,
          timestamp: new Date(),
        });
      }
    }
  };

  const handleIncomingCall = (accept = false) => {
    if (accept && incomingCall) {
      setCallParticipants((prev) => [...prev, currentUser]);
      setShowVideoModal(true);
    }
    setIncomingCall(null);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  const formatCallDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const canStartVideoCall = () => {
    return ["ceo", "cto", "developer", "designer", "admin", "support"].includes(
      currentUser?.role
    );
  };

  const canJoinVideoCall = () => {
    return ["ceo", "cto", "developer", "designer", "admin", "support"].includes(
      currentUser?.role
    );
  };

  // Message Functions
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() && attachments.length === 0) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      userId: currentUser.id,
      channelId: activeChannel,
      timestamp: new Date(),
      type: "message",
      reactions: {},
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
    setAttachments([]);
    setIsTyping(false);
    setShowEmojiPicker(false);
  };

  const handleCreateChannel = (e) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    const newChannel = {
      id: newChannelName.toLowerCase().replace(/\s+/g, "-"),
      name: newChannelName.toLowerCase().replace(/\s+/g, "-"),
      description:
        newChannelDescription || "New channel for team collaboration",
      createdBy: currentUser.id,
      createdAt: new Date(),
      memberCount: 1,
      isPrivate: false,
    };

    setChannels((prev) => [...prev, newChannel]);
    setActiveChannel(newChannel.id);
    setNewChannelName("");
    setNewChannelDescription("");
    setShowChannelModal(false);
  };

  const addReaction = (messageId, emoji) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const reactions = { ...msg.reactions };
          if (reactions[emoji]) {
            if (reactions[emoji].includes(currentUser.id)) {
              reactions[emoji] = reactions[emoji].filter(
                (id) => id !== currentUser.id
              );
              if (reactions[emoji].length === 0) {
                delete reactions[emoji];
              }
            } else {
              reactions[emoji].push(currentUser.id);
            }
          } else {
            reactions[emoji] = [currentUser.id];
          }
          return { ...msg, reactions };
        }
        return msg;
      })
    );
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
    setShowAttachmentModal(false);
  };

  const removeAttachment = (attachmentId) => {
    setAttachments((prev) => prev.filter((att) => att.id !== attachmentId));
  };

  const addEmoji = (emoji) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const canCreateChannel = () => {
    return ["ceo", "cto", "admin", "support"].includes(currentUser?.role);
  };

  

  const canSendMessage = (channelId) => {
    if (["tenant", "landlord"].includes(currentUser?.role)) {
      return ["support-requests"].includes(channelId);
    }
    return true;
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

  const getChannelMessages = () => {
    return searchTerm
      ? filteredMessages
      : messages.filter((msg) => msg.channelId === activeChannel);
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

  const getUserById = (userId) => {
    return users.find((user) => user.id === userId) || users[0];
  };

  const getChannelById = (channelId) => {
    return channels.find((channel) => channel.id === channelId);
  };

  const renderMessage = (message, index, allMessages) => {
    const user = getUserById(message.userId);
    const isCurrentUser = user.id === currentUser.id;
    const showDate =
      index === 0 ||
      formatDate(message.timestamp) !==
        formatDate(allMessages[index - 1]?.timestamp);

    return (
      <div key={message.id}>
        {showDate && (
          <div className="flex justify-center my-6">
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-1 rounded-full text-xs text-gray-600 dark:text-gray-400 font-medium">
              {formatDate(message.timestamp)}
            </div>
          </div>
        )}

        <div
          className={`flex space-x-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 px-4 py-1 rounded-lg transition-colors ${
            isCurrentUser ? "flex-row-reverse space-x-reverse" : ""
          }`}
        >
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm ${
              isCurrentUser ? "order-2" : ""
            }`}
            style={{ backgroundColor: user.color }}
          >
            {user.avatar}
          </div>

          <div
            className={`flex-1 min-w-0 ${isCurrentUser ? "text-right" : ""}`}
          >
            <div
              className={`flex items-baseline space-x-2 ${
                isCurrentUser ? "justify-end" : ""
              }`}
            >
              <span className="font-semibold text-gray-900 dark:text-white text-sm">
                {user.name}
              </span>
              {getRoleBadge(user.role)}
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatTime(message.timestamp)}
              </span>
            </div>

            <div
              className={`mt-1 px-4 py-2 rounded-2xl max-w-2xl ${
                isCurrentUser
                  ? "bg-orange-500 text-white rounded-br-none shadow-sm"
                  : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none border border-gray-200 dark:border-gray-600 shadow-sm"
              }`}
            >
              {message.type === "system" && message.callId ? (
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{icons.video}</span>
                  <span>{message.text}</span>
                  {videoCall?.id === message.callId ? (
                    <button
                      onClick={() => setShowVideoModal(true)}
                      className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600 transition-colors"
                    >
                      Join Call
                    </button>
                  ) : (
                    <button
                      onClick={() => startVideoCall()}
                      className="px-3 py-1 bg-orange-500 text-white rounded-lg text-xs hover:bg-orange-600 transition-colors"
                    >
                      Start New Call
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-sm leading-relaxed">{message.text}</p>
              )}

              {message.attachments && (
                <div className="mt-2 space-y-2">
                  {message.attachments.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2 p-2 bg-black/10 dark:bg-white/10 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-gray-400 rounded flex items-center justify-center">
                        <span className="text-white text-xs">
                          {icons.attach}
                        </span>
                      </div>
                      <span className="text-sm">{file}</span>
                      <button className="text-blue-500 hover:text-blue-600 text-xs">
                        {icons.download}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {message.reactions && Object.keys(message.reactions).length > 0 && (
              <div
                className={`flex flex-wrap gap-1 mt-2 ${
                  isCurrentUser ? "justify-end" : ""
                }`}
              >
                {Object.entries(message.reactions).map(([emoji, users]) => (
                  <button
                    key={emoji}
                    onClick={() => addReaction(message.id, emoji)}
                    className={`flex items-center space-x-1 px-2 py-1 rounded-full border text-xs transition-colors ${
                      users.includes(currentUser.id)
                        ? "bg-blue-50 border-blue-200 text-blue-700"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span>{emoji}</span>
                    <span>{users.length}</span>
                  </button>
                ))}
              </div>
            )}

            {message.thread && (
              <button
                className={`text-xs text-blue-500 hover:text-blue-600 mt-2 flex items-center space-x-1 ${
                  isCurrentUser ? "justify-end" : ""
                }`}
              >
                <span>{icons.channel}</span>
                <span>
                  {message.thread.replies} reply
                  {message.thread.replies !== 1 ? "ies" : ""}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Emoji Picker Component
  const EmojiPicker = () => (
    <div className="absolute bottom-16 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 z-10">
      <div className="grid grid-cols-8 gap-1">
        {[
          "😀",
          "😃",
          "😄",
          "😁",
          "😅",
          "😂",
          "🤣",
          "😊",
          "😇",
          "🙂",
          "🙃",
          "😉",
          "😌",
          "😍",
          "🥰",
          "😘",
          "😗",
          "😙",
          "😚",
          "😋",
          "😛",
          "😝",
          "😜",
          "🤪",
          "🤨",
          "🧐",
          "🤓",
          "😎",
          "🤩",
          "🥳",
        ].map((emoji) => (
          <button
            key={emoji}
            onClick={() => addEmoji(emoji)}
            className="w-8 h-8 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-lg"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );

  // Video Call Modal Component
  const renderVideoCallModal = () => {
    if (!showVideoModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
        <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
          {/* Call Header */}
          <div className="p-6 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {icons.video}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Team Video Call
                </h3>
                <div className="flex items-center space-x-2 text-gray-300">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      videoCall ? "bg-green-500" : "bg-gray-500"
                    }`}
                  ></div>
                  <span>
                    {videoCall
                      ? `Call in progress - ${formatCallDuration(callTimer)}`
                      : "Starting call..."}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">
                {callParticipants.length} participant
                {callParticipants.length !== 1 ? "s" : ""}
              </span>
              <button
                onClick={endVideoCall}
                className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <span className="text-white text-lg">{icons.endCall}</span>
              </button>
            </div>
          </div>

          {/* Video Grid */}
          <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
            {/* Current User Video */}
            <div className="bg-gray-800 rounded-xl overflow-hidden relative">
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
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-4xl mb-2">{icons.videoOn}</div>
                      <p className="text-sm">Video Feed</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 rounded-full px-3 py-1">
                <span className="text-white text-sm">
                  {currentUser.name} (You)
                </span>
                {isMuted && (
                  <span className="text-red-400 ml-2">{icons.unmute}</span>
                )}
              </div>
            </div>

            {/* Other Participants */}
            {callParticipants
              .filter((participant) => participant.id !== currentUser.id)
              .map((participant) => (
                <div
                  key={participant.id}
                  className="bg-gray-800 rounded-xl overflow-hidden relative"
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
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 rounded-full px-3 py-1">
                    <span className="text-white text-sm">
                      {participant.name}
                    </span>
                  </div>
                </div>
              ))}

            {/* Invite More Button */}
            {canStartVideoCall() && (
              <div className="bg-gray-800 rounded-xl border-2 border-dashed border-gray-600 flex items-center justify-center cursor-pointer hover:border-orange-500 transition-colors">
                <button
                  onClick={() =>
                    document.getElementById("invite-modal").showModal()
                  }
                  className="text-center p-6"
                >
                  <div className="text-4xl text-gray-400 mb-2">
                    {icons.group}
                  </div>
                  <p className="text-gray-300 font-medium">Invite People</p>
                  <p className="text-gray-500 text-sm">Add more participants</p>
                </button>
              </div>
            )}
          </div>

          {/* Call Controls */}
          <div className="p-6 border-t border-gray-700">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={toggleMute}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  isMuted
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                <span className="text-white text-xl">
                  {isMuted ? icons.unmute : icons.mute}
                </span>
              </button>

              <button
                onClick={toggleVideo}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  isVideoOff
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                <span className="text-white text-xl">
                  {isVideoOff ? icons.videoOff : icons.videoOn}
                </span>
              </button>

              <button
                onClick={toggleScreenShare}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  isScreenSharing
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                <span className="text-white text-xl">{icons.screenShare}</span>
              </button>

              <button className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                <span className="text-white text-xl">{icons.emoji}</span>
              </button>

              <button
                onClick={endVideoCall}
                className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <span className="text-white text-xl">{icons.endCall}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Invite Modal */}
        <dialog id="invite-modal" className="modal">
          <div className="modal-box bg-gray-800 border border-gray-700">
            <h3 className="font-bold text-lg text-white mb-4">
              Invite to Call
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {users
                .filter(
                  (user) =>
                    user.id !== currentUser.id &&
                    !callParticipants.find((p) => p.id === user.id) &&
                    canJoinVideoCall()
                )
                .map((user) => (
                  <button
                    key={user.id}
                    onClick={() => inviteToCall(user.id)}
                    className="w-full text-left p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors flex items-center space-x-3"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: user.color }}
                    >
                      {user.avatar}
                    </div>
                    <div>
                      <div className="text-white font-medium">{user.name}</div>
                      <div className="text-gray-400 text-sm">{user.role}</div>
                    </div>
                  </button>
                ))}
            </div>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn bg-gray-700 text-white hover:bg-gray-600">
                  Close
                </button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    );
  };

  // Incoming Call Notification
  const renderIncomingCall = () => {
    if (!incomingCall) return null;

    return (
      <div className="fixed top-4 right-4 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-6 z-50 min-w-80">
        <div className="flex items-center space-x-4 mb-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: incomingCall.from.color }}
          >
            {incomingCall.from.avatar}
          </div>
          <div>
            <div className="text-white font-semibold">
              {incomingCall.from.name}
            </div>
            <div className="text-gray-400 text-sm">Incoming video call...</div>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => handleIncomingCall(true)}
            className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            {icons.check} Accept
          </button>
          <button
            onClick={() => handleIncomingCall(false)}
            className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            {icons.cross} Decline
          </button>
        </div>
      </div>
    );
  };

  // Attachment Preview
  const renderAttachments = () => {
    if (attachments.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mb-3">
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2"
          >
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {attachment.name}
            </span>
            <button
              onClick={() => removeAttachment(attachment.id)}
              className="text-red-500 hover:text-red-700"
            >
              {icons.cross}
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-gray-900 dark:text-white text-lg">
                Rent'D Workspace
              </h1>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {currentUser?.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Video Call Quick Actions */}
        {canStartVideoCall() && (
          <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              <button
                onClick={() => startVideoCall()}
                className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <span>{icons.video}</span>
                <span>Start Video Call</span>
              </button>
              <button
                onClick={() =>
                  document.getElementById("call-history-modal").showModal()
                }
                className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm flex items-center justify-center space-x-2"
              >
                <span>{icons.history}</span>
                <span>Call History</span>
              </button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <input
              type="text"
              placeholder="Search messages, files, people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">{icons.search}</span>
            </div>
          </div>
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Channels
              </h2>
              {canCreateChannel() && (
                <button
                  onClick={() => setShowChannelModal(true)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 w-6 h-6 rounded flex items-center justify-center transition-colors"
                >
                  {icons.add}
                </button>
              )}
            </div>
            <div className="space-y-1">
              {filteredChannels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannel(channel.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between group ${
                    activeChannel === channel.id
                      ? "bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-100 border border-orange-200 dark:border-orange-800"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span
                      className={
                        channel.isPrivate ? "text-gray-400" : "text-gray-500"
                      }
                    >
                      {channel.isPrivate ? icons.lock : icons.channel}
                    </span>
                    <span className="font-medium">{channel.name}</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowChannelInfo(true);
                      }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {icons.info}
                    </button>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Direct Messages */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Direct Messages
              </h2>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                {icons.add}
              </button>
            </div>
            <div className="space-y-1">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3 group"
                >
                  <div className="relative">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
                      style={{ backgroundColor: user.color }}
                    >
                      {user.avatar}
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                        user.status === "online"
                          ? "bg-green-500"
                          : user.status === "away"
                          ? "bg-yellow-500"
                          : user.status === "busy"
                          ? "bg-red-500"
                          : "bg-gray-500"
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium truncate">{user.name}</span>
                      {getRoleBadge(user.role)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.department}
                    </div>
                  </div>
                  {canStartVideoCall() && user.status === "online" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startVideoCall([user.id]);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-orange-500 hover:text-orange-600 transition-opacity"
                      title="Start video call"
                    >
                      {icons.video}
                    </button>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <button
            onClick={() => setShowUserModal(true)}
            className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="relative">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
                style={{ backgroundColor: currentUser?.color }}
              >
                {currentUser?.avatar}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 bg-green-500"></div>
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {currentUser?.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {currentUser?.email}
              </div>
              <div className="mt-1">{getRoleBadge(currentUser?.role)}</div>
            </div>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Channel Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {getChannelById(activeChannel)?.isPrivate
                    ? icons.lock
                    : icons.channel}{" "}
                  {getChannelById(activeChannel)?.name}
                </span>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {getChannelById(activeChannel)?.description}
                </span>
              </div>
              <button
                onClick={() => setShowChannelInfo(true)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg"
              >
                {icons.info}
              </button>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {
                    users.filter((u) =>
                      [
                        "ceo",
                        "cto",
                        "developer",
                        "designer",
                        "admin",
                        "support",
                      ].includes(u.role)
                    ).length
                  }{" "}
                  team members
                </span>
                <div className="flex -space-x-2">
                  {users.slice(0, 4).map((user) => (
                    <div
                      key={user.id}
                      className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 shadow-sm flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: user.color }}
                      title={user.name}
                    >
                      {user.avatar}
                    </div>
                  ))}
                  {users.length > 4 && (
                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-400 shadow-sm flex items-center justify-center text-white text-xs font-bold">
                      +{users.length - 4}
                    </div>
                  )}
                </div>
              </div>
              {canStartVideoCall() && (
                <button
                  onClick={() => startVideoCall()}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium flex items-center space-x-2"
                >
                  <span>{icons.video}</span>
                  <span>Start Call</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto py-6">
            {getChannelMessages().length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">{icons.channel}</div>
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No messages yet in #{getChannelById(activeChannel)?.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto">
                  This is the very beginning of the #
                  {getChannelById(activeChannel)?.name} channel.
                  {canSendMessage(activeChannel)
                    ? " Send the first message to start the conversation!"
                    : " You can view messages here but cannot send messages in this channel."}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {getChannelMessages().map((message, index, array) =>
                  renderMessage(message, index, array)
                )}

                {isTyping && typingUser && (
                  <div className="flex space-x-3 px-4 py-2">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
                      style={{ backgroundColor: typingUser.color }}
                    >
                      {typingUser.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline space-x-2">
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">
                          {typingUser.name}
                        </span>
                        {getRoleBadge(typingUser.role)}
                      </div>
                      <div className="mt-1 px-4 py-2 rounded-2xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm max-w-xs">
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
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
          {canSendMessage(activeChannel) ? (
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
              {renderAttachments()}
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <div className="relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={`Message #${
                        getChannelById(activeChannel)?.name
                      }`}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white pr-32"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowAttachmentModal(true)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {icons.attach}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {icons.emoji}
                      </button>
                    </div>
                  </div>

                  {showEmojiPicker && <EmojiPicker />}

                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Press Enter to send • Shift+Enter for new line
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center space-x-1"
                      >
                        <span>{icons.format}</span>
                        <span>Formatting</span>
                      </button>
                      <button
                        type="button"
                        className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center space-x-1"
                      >
                        <span>{icons.schedule}</span>
                        <span>Schedule</span>
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!newMessage.trim() && attachments.length === 0}
                  className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-2"
                >
                  <span>Send</span>
                  <span>{icons.send}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="max-w-4xl mx-auto text-center py-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-yellow-800 dark:text-yellow-200">
                  {currentUser?.role === "tenant" ||
                  currentUser?.role === "landlord"
                    ? `${icons.channel} You can only send messages in the #support-requests channel for customer service inquiries`
                    : `${icons.lock} You do not have permission to send messages in this channel`}
                </p>
                {(currentUser?.role === "tenant" ||
                  currentUser?.role === "landlord") && (
                  <button
                    onClick={() => setActiveChannel("support-requests")}
                    className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                  >
                    Go to Support Channel
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Call Modal */}
      {renderVideoCallModal()}

      {/* Incoming Call Notification */}
      {renderIncomingCall()}

      {/* Call History Modal */}
      <dialog id="call-history-modal" className="modal">
        <div className="modal-box bg-white dark:bg-gray-800 max-w-2xl">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
            Call History
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {callHistory.map((call) => (
              <div
                key={call.id}
                className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 dark:text-orange-400 text-xl">
                    {icons.video}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Video Call
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatCallDuration(call.duration)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    With{" "}
                    {call.participants
                      .map((id) => getUserById(id).name)
                      .join(", ")}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {formatDate(call.timestamp)} at {formatTime(call.timestamp)}
                  </div>
                </div>
                <button
                  onClick={() => startVideoCall(call.participants)}
                  className="px-3 py-1 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors"
                >
                  Call Again
                </button>
              </div>
            ))}
            {callHistory.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-2">{icons.video}</div>
                <p>No call history yet</p>
                <p className="text-sm">
                  Start your first video call to see it here
                </p>
              </div>
            )}
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn bg-orange-500 text-white hover:bg-orange-600">
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Attachment Modal */}
      <dialog id="attachment-modal" className="modal">
        <div className="modal-box bg-white dark:bg-gray-800">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
            Upload Files
          </h3>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <div className="text-4xl mb-4 text-gray-400">{icons.attach}</div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Drag and drop files here or click to browse
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Browse Files
            </button>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn bg-gray-500 text-white hover:bg-gray-600">
                Cancel
              </button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Channel Creation Modal */}
      {showChannelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Create a New Channel
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Channels are where your team communicates. They're best when
                organized around a topic.
              </p>
            </div>
            <form onSubmit={handleCreateChannel} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Channel Name
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                      {icons.channel}
                    </span>
                    <input
                      type="text"
                      value={newChannelName}
                      onChange={(e) => setNewChannelName(e.target.value)}
                      placeholder="e.g., marketing, operations, releases"
                      className="flex-1 block w-full rounded-none rounded-r-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white px-3 py-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description{" "}
                    <span className="text-gray-500">(optional)</span>
                  </label>
                  <textarea
                    value={newChannelDescription}
                    onChange={(e) => setNewChannelDescription(e.target.value)}
                    rows="3"
                    placeholder="What's this channel about?"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowChannelModal(false)}
                  className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newChannelName.trim()}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Create Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Selection Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Switch Workspace Role
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Select your role to test different permissions and features
              </p>
            </div>
            <div className="overflow-y-auto max-h-96">
              <div className="grid grid-cols-1 gap-3 p-6">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      setCurrentUser(user);
                      setShowUserModal(false);
                    }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      currentUser?.id === user.id
                        ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-sm"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
                        style={{ backgroundColor: user.color }}
                      >
                        {user.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="font-semibold text-gray-900 dark:text-white text-lg">
                            {user.name}
                          </div>
                          {getRoleBadge(user.role)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {user.email}
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>{user.department}</span>
                          <span>•</span>
                          {getStatusBadge(user.status)}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Current role:{" "}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {currentUser?.name}
                  </span>
                </div>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attachment Modal Trigger */}
      {showAttachmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Upload Files
              </h3>
            </div>
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <div className="text-4xl mb-4 text-gray-400">
                  {icons.attach}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Drag and drop files here or click to browse
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Browse Files
                </button>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setShowAttachmentModal(false)}
                className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
