import React, { useState, useEffect } from "react";

const Kanban = () => {
  // Board states
  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState("customer-service");
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [newBoardDescription, setNewBoardDescription] = useState("");

  // Ticket states
  const [tickets, setTickets] = useState([]);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterAssignee, setFilterAssignee] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Form states
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    priority: "medium",
    type: "bug",
    assignee: "",
    dueDate: "",
    tags: [],
    attachments: [],
  });

  // Modern SVG Icons
  const Icons = {
    board: (
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
          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
        />
      </svg>
    ),
    ticket: (
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
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
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
    filter: (
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
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
        />
      </svg>
    ),
    user: (
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
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    calendar: (
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
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    edit: (
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
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    ),
    delete: (
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
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    ),
    comment: (
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
      department: "Executive",
      avatar: "JD",
      color: "#2b4354",
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "cto",
      department: "Technology",
      avatar: "JS",
      color: "#2b4354",
    },
    {
      id: 3,
      name: "Mike Johnson",
      role: "developer",
      department: "Development",
      avatar: "MJ",
      color: "#2b4354",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      role: "designer",
      department: "Design",
      avatar: "SW",
      color: "#2b4354",
    },
    {
      id: 5,
      name: "David Brown",
      role: "admin",
      department: "Operations",
      avatar: "DB",
      color: "#2b4354",
    },
    {
      id: 6,
      name: "Emily Chen",
      role: "support",
      department: "Support",
      avatar: "EC",
      color: "#2b4354",
    },
    {
      id: 7,
      name: "Alex Rivera",
      role: "developer",
      department: "Development",
      avatar: "AR",
      color: "#2b4354",
    },
  ];

  const sampleBoards = [
    {
      id: "customer-service",
      name: "Customer Service",
      description: "Customer support tickets and inquiries",
      columns: ["backlog", "in-progress", "in-review", "resolved"],
      color: "#3B82F6",
      icon: "💬",
    },
    {
      id: "tech-issues",
      name: "Technical Issues",
      description: "Bug reports and technical problems",
      columns: ["backlog", "todo", "in-progress", "testing", "done"],
      color: "#EF4444",
      icon: "🐛",
    },
    {
      id: "feature-requests",
      name: "Feature Requests",
      description: "New feature suggestions and improvements",
      columns: [
        "backlog",
        "under-review",
        "planned",
        "in-development",
        "completed",
      ],
      color: "#10B981",
      icon: "💡",
    },
  ];

  const sampleTickets = [
    {
      id: "CS-001",
      title:
        "Payment processing failed for customer with multiple subscription services and recurring billing",
      description:
        "Customer reports payment failure with error code 500. Need immediate attention as this affects multiple users across different subscription tiers and payment methods.",
      priority: "high",
      type: "issue",
      status: "in-progress",
      boardId: "customer-service",
      assignee: 6,
      reporter: 1,
      dueDate: "2024-02-15",
      createdAt: new Date("2024-02-10"),
      updatedAt: new Date("2024-02-12"),
      tags: ["payment", "urgent", "backend", "subscription", "billing"],
      attachments: ["error_logs.txt"],
      comments: [
        {
          id: 1,
          userId: 6,
          text: "Investigating the payment gateway integration and API responses from multiple providers",
          timestamp: new Date("2024-02-10 10:30:00"),
        },
        {
          id: 2,
          userId: 2,
          text: "Check the API response from Stripe and PayPal integration endpoints",
          timestamp: new Date("2024-02-10 11:15:00"),
        },
      ],
    },
    {
      id: "TI-001",
      title: "Mobile app crashes on iOS 17 with specific user configurations",
      description:
        "App crashes immediately after launch on iOS 17.2. Stack trace points to memory allocation issue in the authentication module when users have multiple accounts linked.",
      priority: "critical",
      type: "bug",
      status: "todo",
      boardId: "tech-issues",
      assignee: 3,
      reporter: 5,
      dueDate: "2024-02-20",
      createdAt: new Date("2024-02-11"),
      updatedAt: new Date("2024-02-11"),
      tags: ["ios", "mobile", "crash", "authentication", "memory"],
      attachments: ["crash_report.ips"],
      comments: [],
    },
    {
      id: "FR-001",
      title: "Dark mode implementation with system-level theme detection",
      description:
        "Users requesting dark mode theme for better nighttime usage with automatic detection of system theme preferences and smooth transitions between light and dark modes.",
      priority: "low",
      type: "enhancement",
      status: "under-review",
      boardId: "feature-requests",
      assignee: 4,
      reporter: 2,
      dueDate: "2024-03-01",
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date("2024-02-05"),
      tags: ["ui", "feature", "design", "accessibility", "theme"],
      attachments: ["design_mockup.pdf"],
      comments: [
        {
          id: 1,
          userId: 4,
          text: "Initial design mockups ready for review including color schemes and transition animations",
          timestamp: new Date("2024-02-05 14:20:00"),
        },
      ],
    },
    {
      id: "CS-002",
      title:
        "Password reset not working for enterprise accounts with 2FA enabled",
      description:
        "Customer cannot reset password - reset email never arrives. Issue seems to affect only enterprise accounts with two-factor authentication enabled and custom domain emails.",
      priority: "medium",
      type: "issue",
      status: "backlog",
      boardId: "customer-service",
      assignee: null,
      reporter: 6,
      dueDate: "2024-02-25",
      createdAt: new Date("2024-02-12"),
      updatedAt: new Date("2024-02-12"),
      tags: ["authentication", "email", "enterprise", "2fa", "security"],
      attachments: [],
      comments: [],
    },
    {
      id: "TI-002",
      title:
        "Database connection timeout during peak traffic hours with concurrent users",
      description:
        "Random database connection timeouts during peak hours when concurrent user count exceeds 10,000. Issue affects read replicas and connection pooling.",
      priority: "high",
      type: "bug",
      status: "in-progress",
      boardId: "tech-issues",
      assignee: 7,
      reporter: 3,
      dueDate: "2024-02-18",
      createdAt: new Date("2024-02-08"),
      updatedAt: new Date("2024-02-12"),
      tags: [
        "database",
        "performance",
        "backend",
        "scaling",
        "connection-pool",
      ],
      attachments: ["db_logs.sql"],
      comments: [
        {
          id: 1,
          userId: 7,
          text: "Monitoring connection pool settings and database performance metrics during peak load",
          timestamp: new Date("2024-02-09 09:45:00"),
        },
        {
          id: 2,
          userId: 2,
          text: "Consider increasing connection timeout limit and optimizing query performance for high-traffic endpoints",
          timestamp: new Date("2024-02-10 16:20:00"),
        },
      ],
    },
  ];

  // Initialize data
  useEffect(() => {
    setBoards(sampleBoards);
    setTickets(sampleTickets);
  }, []);

  // Board management
  const handleCreateBoard = (e) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;

    const newBoard = {
      id: newBoardName.toLowerCase().replace(/\s+/g, "-"),
      name: newBoardName,
      description: newBoardDescription,
      columns: ["backlog", "todo", "in-progress", "done"],
      color: "#2b4354",
      icon: "📋",
    };

    setBoards((prev) => [...prev, newBoard]);
    setActiveBoard(newBoard.id);
    setNewBoardName("");
    setNewBoardDescription("");
    setShowBoardModal(false);
  };

  // Ticket management
  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!newTicket.title.trim()) return;

    const ticket = {
      id: `${activeBoard.toUpperCase().substring(0, 2)}-${String(
        tickets.length + 1
      ).padStart(3, "0")}`,
      ...newTicket,
      status: "backlog",
      boardId: activeBoard,
      reporter: 1, // Current user ID
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
    };

    setTickets((prev) => [...prev, ticket]);
    setNewTicket({
      title: "",
      description: "",
      priority: "medium",
      type: "bug",
      assignee: "",
      dueDate: "",
      tags: [],
      attachments: [],
    });
    setShowTicketModal(false);
  };

  const handleUpdateTicket = (e) => {
    e.preventDefault();
    if (!editingTicket.title.trim()) return;

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === editingTicket.id
          ? { ...editingTicket, updatedAt: new Date() }
          : ticket
      )
    );
    setEditingTicket(null);
  };

  const handleDeleteTicket = (ticketId) => {
    setTickets((prev) => prev.filter((ticket) => ticket.id !== ticketId));
  };

  const handleDragStart = (e, ticketId) => {
    e.dataTransfer.setData("ticketId", ticketId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    const ticketId = e.dataTransfer.getData("ticketId");

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, status, updatedAt: new Date() }
          : ticket
      )
    );
  };

  const addComment = (ticketId, text) => {
    if (!text.trim()) return;

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              comments: [
                ...ticket.comments,
                {
                  id: Date.now(),
                  userId: 1, // Current user
                  text,
                  timestamp: new Date(),
                },
              ],
              updatedAt: new Date(),
            }
          : ticket
      )
    );
  };

  // Filtering and searching
  const filteredTickets = tickets.filter((ticket) => {
    const matchesBoard = ticket.boardId === activeBoard;
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesPriority =
      filterPriority === "all" || ticket.priority === filterPriority;
    const matchesAssignee =
      filterAssignee === "all" ||
      ticket.assignee?.toString() === filterAssignee;
    const matchesStatus =
      filterStatus === "all" || ticket.status === filterStatus;

    return (
      matchesBoard &&
      matchesSearch &&
      matchesPriority &&
      matchesAssignee &&
      matchesStatus
    );
  });

  const getTicketsByStatus = (status) => {
    return filteredTickets.filter((ticket) => ticket.status === status);
  };

  const getUserById = (userId) => {
    return sampleUsers.find((user) => user.id === userId);
  };

  const getBoardById = (boardId) => {
    return boards.find((board) => board.id === boardId);
  };

  const getStatusColor = (status) => {
    const colors = {
      backlog: "bg-gray-100 text-gray-800 border-gray-300",
      todo: "bg-blue-100 text-blue-800 border-blue-300",
      "in-progress": "bg-yellow-100 text-yellow-800 border-yellow-300",
      testing: "bg-purple-100 text-purple-800 border-purple-300",
      review: "bg-orange-100 text-orange-800 border-orange-300",
      done: "bg-green-100 text-green-800 border-green-300",
      resolved: "bg-green-100 text-green-800 border-green-300",
      "under-review": "bg-orange-100 text-orange-800 border-orange-300",
      planned: "bg-indigo-100 text-indigo-800 border-indigo-300",
      "in-development": "bg-yellow-100 text-yellow-800 border-yellow-300",
      completed: "bg-green-100 text-green-800 border-green-300",
    };
    return colors[status] || colors.backlog;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "bg-green-100 text-green-800 border-green-300",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
      high: "bg-orange-100 text-orange-800 border-orange-300",
      critical: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[priority] || colors.medium;
  };

  const getTypeColor = (type) => {
    const colors = {
      bug: "bg-red-100 text-red-800 border-red-300",
      issue: "bg-blue-100 text-blue-800 border-blue-300",
      enhancement: "bg-green-100 text-green-800 border-green-300",
      feature: "bg-purple-100 text-purple-800 border-purple-300",
    };
    return colors[type] || colors.issue;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Column headers configuration
  const getColumnHeaders = () => {
    const board = getBoardById(activeBoard);
    return board?.columns || ["backlog", "todo", "in-progress", "done"];
  };

  const getColumnTitle = (column) => {
    const titles = {
      backlog: "Backlog",
      todo: "To Do",
      "in-progress": "In Progress",
      testing: "Testing",
      review: "Review",
      done: "Done",
      resolved: "Resolved",
      "under-review": "Under Review",
      planned: "Planned",
      "in-development": "In Development",
      completed: "Completed",
    };
    return titles[column] || column;
  };

  // Ticket Card Component
  const TicketCard = ({ ticket }) => {
    const assignee = ticket.assignee ? getUserById(ticket.assignee) : null;
    const reporter = getUserById(ticket.reporter);

    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, ticket.id)}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all p-4 cursor-move mb-3 group break-words"
      >
        <div className="flex justify-between items-start mb-3 gap-2">
          <span className="text-sm font-mono text-gray-500 font-medium flex-shrink-0">
            {ticket.id}
          </span>
          <div className="flex space-x-2 flex-shrink-0">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                ticket.priority
              )}`}
            >
              {ticket.priority}
            </span>
          </div>
        </div>

        <h4 className="font-semibold text-gray-900 mb-2 text-sm leading-tight break-words">
          {ticket.title}
        </h4>

        <p className="text-gray-600 text-xs mb-3 line-clamp-3 break-words leading-relaxed">
          {ticket.description}
        </p>

        {ticket.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {ticket.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-lg break-words max-w-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-2 min-w-0">
            {assignee ? (
              <div className="flex items-center space-x-2 min-w-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0"
                  style={{ backgroundColor: assignee.color }}
                >
                  {assignee.avatar}
                </div>
                <span className="font-medium truncate">
                  {assignee.name.split(" ")[0]}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-gray-400 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  {Icons.user}
                </div>
                <span className="truncate">Unassigned</span>
              </div>
            )}
          </div>

          {ticket.dueDate && (
            <div
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg flex-shrink-0 ${
                new Date(ticket.dueDate) < new Date()
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {Icons.calendar}
              <span className="font-medium whitespace-nowrap">
                {formatDate(ticket.dueDate)}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400 whitespace-nowrap">
            Updated {formatDate(ticket.updatedAt)}
          </span>
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <button
              onClick={() => setEditingTicket(ticket)}
              className="text-[#2b4354] hover:text-orange-500 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              title="Edit ticket"
            >
              {Icons.edit}
            </button>
            <button
              onClick={() => handleDeleteTicket(ticket.id)}
              className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              title="Delete ticket"
            >
              {Icons.delete}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Ticket Modal Component
  const TicketModal = () => {
    const ticket = editingTicket || newTicket;
    const isEditing = !!editingTicket;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 mx-auto">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#2b4354] to-[#3c5a6a]">
            <h3 className="text-xl font-semibold text-white break-words">
              {isEditing ? "Edit Ticket" : "Create New Ticket"}
            </h3>
            <p className="text-blue-100 mt-1 break-words">
              {getBoardById(activeBoard)?.name} Board
            </p>
          </div>

          <form
            onSubmit={isEditing ? handleUpdateTicket : handleCreateTicket}
            className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={ticket.title}
                  onChange={(e) =>
                    isEditing
                      ? setEditingTicket({ ...ticket, title: e.target.value })
                      : setNewTicket({ ...newTicket, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 break-words"
                  placeholder="Enter ticket title..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={ticket.description}
                  onChange={(e) =>
                    isEditing
                      ? setEditingTicket({
                          ...ticket,
                          description: e.target.value,
                        })
                      : setNewTicket({
                          ...newTicket,
                          description: e.target.value,
                        })
                  }
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 break-words resize-none"
                  placeholder="Describe the issue or request..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={ticket.priority}
                    onChange={(e) =>
                      isEditing
                        ? setEditingTicket({
                            ...ticket,
                            priority: e.target.value,
                          })
                        : setNewTicket({
                            ...newTicket,
                            priority: e.target.value,
                          })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={ticket.type}
                    onChange={(e) =>
                      isEditing
                        ? setEditingTicket({ ...ticket, type: e.target.value })
                        : setNewTicket({ ...newTicket, type: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50"
                  >
                    <option value="bug">Bug</option>
                    <option value="issue">Issue</option>
                    <option value="enhancement">Enhancement</option>
                    <option value="feature">Feature</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignee
                  </label>
                  <select
                    value={ticket.assignee}
                    onChange={(e) =>
                      isEditing
                        ? setEditingTicket({
                            ...ticket,
                            assignee: e.target.value
                              ? parseInt(e.target.value)
                              : "",
                          })
                        : setNewTicket({
                            ...newTicket,
                            assignee: e.target.value
                              ? parseInt(e.target.value)
                              : "",
                          })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50"
                  >
                    <option value="">Unassigned</option>
                    {sampleUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={ticket.dueDate}
                    onChange={(e) =>
                      isEditing
                        ? setEditingTicket({
                            ...ticket,
                            dueDate: e.target.value,
                          })
                        : setNewTicket({
                            ...newTicket,
                            dueDate: e.target.value,
                          })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50"
                  />
                </div>
              </div>

              {isEditing && ticket.comments && ticket.comments.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comments
                  </label>
                  <div className="space-y-3 max-h-32 overflow-y-auto">
                    {ticket.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-gray-50 rounded-2xl p-4 border border-gray-200 break-words"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                          <div className="flex items-center space-x-2 min-w-0">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                              style={{
                                backgroundColor: getUserById(comment.userId)
                                  ?.color,
                              }}
                            >
                              {getUserById(comment.userId)?.avatar}
                            </div>
                            <span className="font-medium text-sm truncate">
                              {getUserById(comment.userId)?.name}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                            {formatDate(comment.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 break-words">
                          {comment.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isEditing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Comment
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      id="new-comment"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 break-words"
                      placeholder="Add a comment..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById("new-comment");
                        if (input.value.trim()) {
                          addComment(ticket.id, input.value);
                          input.value = "";
                        }
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-[#2b4354] to-[#3c5a6a] text-white rounded-2xl hover:shadow-lg transition-all font-medium flex items-center justify-center space-x-2 whitespace-nowrap"
                    >
                      {Icons.comment}
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() =>
                  isEditing ? setEditingTicket(null) : setShowTicketModal(false)
                }
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all font-medium w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl hover:shadow-lg transition-all font-medium w-full sm:w-auto"
              >
                {isEditing ? "Update Ticket" : "Create Ticket"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 overflow-x-hidden">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
              Kanban Boards
            </h1>
            <p className="text-gray-600 mt-2 break-words">
              Manage customer service tickets and technical issues
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              onClick={() => setShowBoardModal(true)}
              className="px-4 sm:px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all font-medium flex items-center justify-center space-x-2 shadow-sm"
            >
              {Icons.board}
              <span className="whitespace-nowrap">New Board</span>
            </button>
            <button
              onClick={() => setShowTicketModal(true)}
              className="px-4 sm:px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl hover:shadow-lg transition-all font-medium flex items-center justify-center space-x-2 shadow-sm"
            >
              {Icons.ticket}
              <span className="whitespace-nowrap">New Ticket</span>
            </button>
          </div>
        </div>

        {/* Board Selection */}
        <div className="flex overflow-x-auto pb-4 mb-6 gap-3 scrollbar-hide">
          {boards.map((board) => (
            <button
              key={board.id}
              onClick={() => setActiveBoard(board.id)}
              className={`flex items-center space-x-3 px-4 sm:px-6 py-4 rounded-2xl transition-all whitespace-nowrap min-w-[280px] flex-shrink-0 ${
                activeBoard === board.id
                  ? "bg-gradient-to-r from-[#2b4354] to-[#3c5a6a] text-white shadow-lg"
                  : "bg-white text-gray-700 hover:shadow-lg border border-gray-200"
              }`}
            >
              <span className="text-2xl flex-shrink-0">{board.icon}</span>
              <div className="flex-1 text-left min-w-0">
                <div className="font-semibold truncate">{board.name}</div>
                <div
                  className={`text-sm truncate ${
                    activeBoard === board.id ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {board.description}
                </div>
              </div>
              <span
                className={`text-sm px-3 py-1 rounded-full flex-shrink-0 ${
                  activeBoard === board.id
                    ? "bg-white text-[#2b4354]"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {tickets.filter((t) => t.boardId === board.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex-1 w-full lg:min-w-64">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 break-words"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  {Icons.search}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              <div className="text-gray-400 hidden sm:block">
                {Icons.filter}
              </div>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="flex-1 lg:flex-none px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 min-w-[140px]"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              <select
                value={filterAssignee}
                onChange={(e) => setFilterAssignee(e.target.value)}
                className="flex-1 lg:flex-none px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 min-w-[140px]"
              >
                <option value="all">All Assignees</option>
                {sampleUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 lg:flex-none px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 min-w-[140px]"
              >
                <option value="all">All Statuses</option>
                {getColumnHeaders().map((column) => (
                  <option key={column} value={column}>
                    {getColumnTitle(column)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
          {getColumnHeaders().map((column) => (
            <div
              key={column}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column)}
              className="bg-gray-100 rounded-2xl p-4 sm:p-6 min-h-[500px]"
            >
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="font-semibold text-gray-700 text-base sm:text-lg break-words">
                  {getColumnTitle(column)}
                </h3>
                <span className="bg-white text-gray-600 text-sm px-2 sm:px-3 py-1 rounded-full font-medium shadow-sm flex-shrink-0">
                  {getTicketsByStatus(column).length}
                </span>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {getTicketsByStatus(column).map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
                {getTicketsByStatus(column).length === 0 && (
                  <div className="text-center py-8 sm:py-12 text-gray-400">
                    <div className="text-3xl sm:text-4xl mb-2">📋</div>
                    <p className="text-sm sm:text-base">No tickets</p>
                    <p className="text-xs sm:text-sm mt-1">Drag tickets here</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {(showTicketModal || editingTicket) && <TicketModal />}

      {/* Board Creation Modal */}
      {showBoardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-8 mx-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#2b4354] to-[#3c5a6a]">
              <h3 className="text-xl font-semibold text-white break-words">
                Create New Board
              </h3>
            </div>
            <form onSubmit={handleCreateBoard} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Board Name *
                  </label>
                  <input
                    type="text"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 break-words"
                    placeholder="e.g., Marketing, Operations"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newBoardDescription}
                    onChange={(e) => setNewBoardDescription(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 break-words resize-none"
                    placeholder="What's this board for?"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowBoardModal(false)}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all font-medium w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl hover:shadow-lg transition-all font-medium w-full sm:w-auto"
                >
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kanban;
