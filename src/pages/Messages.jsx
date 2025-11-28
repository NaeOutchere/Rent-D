import React, { useState, useEffect, useRef } from "react";

const Messages = ({ currentUser }) => {
  const messagesEndRef = useRef(null);

  // Mock currentUser if not provided
  const user = currentUser || {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    type: "tenant",
  };

  const [conversations, setConversations] = useState([
    {
      id: "conv-1",
      property: {
        id: "prop-1",
        address: "123 Main Street, Kingston",
        image:
          "https://images.unsplash.com/photo-1560184897-6b2d3c5f276c?auto=format&fit=crop&w=500&q=60",
      },
      participants: ["user-1", "landlord-1"],
      lastMessage: "Hi, is this property still available?",
      lastMessageTime: new Date(),
      unreadCount: 2,
      messages: [
        {
          id: "msg-1",
          senderId: "user-1",
          text: "Hi, is this property still available?",
          timestamp: new Date(),
          read: false,
        },
        {
          id: "msg-2",
          senderId: "landlord-1",
          text: "Yes, it is! Would you like to schedule a viewing?",
          timestamp: new Date(),
          read: true,
        },
      ],
    },
    {
      id: "conv-2",
      property: {
        id: "prop-2",
        address: "45 Ocean Drive, Montego Bay",
        image:
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=500&q=60",
      },
      participants: ["user-1", "landlord-2"],
      lastMessage: "Can we schedule a viewing this weekend?",
      lastMessageTime: new Date(),
      unreadCount: 0,
      messages: [
        {
          id: "msg-3",
          senderId: "user-1",
          text: "Can we schedule a viewing this weekend?",
          timestamp: new Date(),
          read: true,
        },
        {
          id: "msg-4",
          senderId: "landlord-2",
          text: "Absolutely! Saturday at 2 PM works for me.",
          timestamp: new Date(),
          read: true,
        },
      ],
    },
    {
      id: "conv-3",
      property: {
        id: "prop-3",
        address: "78 Hillside Avenue, Ocho Rios",
        image:
          "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=500&q=60",
      },
      participants: ["user-1", "landlord-3"],
      lastMessage: "What's the monthly utility cost?",
      lastMessageTime: new Date(Date.now() - 86400000), // Yesterday
      unreadCount: 1,
      messages: [
        {
          id: "msg-5",
          senderId: "user-1",
          text: "What's the monthly utility cost?",
          timestamp: new Date(Date.now() - 86400000),
          read: false,
        },
      ],
    },
  ]);

  const [activeConversation, setActiveConversation] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation, conversations]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeConversation) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      text: messageInput,
      timestamp: new Date(),
      read: false,
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversation.id
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: messageInput,
              lastMessageTime: new Date(),
              unreadCount: 0,
            }
          : conv
      )
    );

    setActiveConversation((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      lastMessage: messageInput,
      lastMessageTime: new Date(),
    }));

    setMessageInput("");

    // Simulate typing response
    if (activeConversation.participants.find((p) => p !== user.id)) {
      setIsTyping(true);
      setTimeout(() => {
        const responseMessage = {
          id: `msg-${Date.now() + 1}`,
          senderId: activeConversation.participants.find((p) => p !== user.id),
          text: "Thanks for your message! I'll get back to you soon.",
          timestamp: new Date(Date.now() + 2000),
          read: false,
        };

        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === activeConversation.id
              ? {
                  ...conv,
                  messages: [...conv.messages, responseMessage],
                  lastMessage: responseMessage.text,
                  lastMessageTime: new Date(),
                  unreadCount: conv.unreadCount + 1,
                }
              : conv
          )
        );

        setActiveConversation((prev) => ({
          ...prev,
          messages: [...prev.messages, responseMessage],
          lastMessage: responseMessage.text,
          lastMessageTime: new Date(),
        }));

        setIsTyping(false);
      }, 2000);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const now = new Date();
    const diffInHours = (now - d) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return d.toLocaleDateString();
    }
  };

  const formatMessageTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Logged in as: <span className="font-semibold">{user.name}</span>
        </div>
      </div>

      {!activeConversation ? (
        <div className="space-y-4">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 cursor-pointer hover:shadow-lg hover:shadow-orange-300 transition-all duration-300"
              onClick={() => setActiveConversation(conv)}
            >
              <div className="flex items-start space-x-6">
                {conv.property.image && (
                  <img
                    src={conv.property.image}
                    alt={conv.property.address}
                    className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="font-semibold text-xl text-gray-900">
                      {conv.property.address}
                    </h2>
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-400 text-sm">
                        {formatDate(conv.lastMessageTime)}
                      </span>
                      {conv.unreadCount > 0 && (
                        <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold min-w-8 h-8 flex items-center justify-center">
                          {conv.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {conv.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col h-[75vh] bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center p-6 border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => setActiveConversation(null)}
              className="mr-4 p-2 hover:bg-gray-200 rounded-full transition"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            {activeConversation.property.image && (
              <img
                src={activeConversation.property.image}
                alt={activeConversation.property.address}
                className="w-16 h-16 object-cover rounded-xl mr-4"
              />
            )}
            <div className="flex-1">
              <h2 className="font-semibold text-xl text-gray-900">
                {activeConversation.property.address}
              </h2>
              <p className="text-gray-400 text-sm">Active conversation</p>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
            {activeConversation.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.senderId === user.id ? "justify-end" : "justify-start"
                }`}
              >
                <div className="max-w-2xl">
                  <div
                    className={`px-6 py-4 rounded-2xl break-words ${
                      msg.senderId === user.id
                        ? "bg-[#2b4354] text-white rounded-br-none"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                    }`}
                  >
                    <p className="text-base leading-relaxed">{msg.text}</p>
                    <p
                      className={`text-sm mt-2 ${
                        msg.senderId === user.id
                          ? "text-gray-300"
                          : "text-gray-500"
                      } text-right`}
                    >
                      {formatMessageTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-2xl">
                  <div className="bg-white border border-gray-200 text-gray-800 px-6 py-4 rounded-2xl rounded-bl-none">
                    <div className="flex space-x-2 items-center">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <span className="text-sm text-gray-500 ml-2">
                        Typing...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-gray-200 bg-white">
            <div className="flex space-x-4">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-2xl px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className="bg-[#2b4354] text-white px-8 rounded-2xl hover:bg-[#3c5a6a] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 text-base font-medium"
              >
                <span>Send</span>
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
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
