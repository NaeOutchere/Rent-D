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

  // Sample data
  const sampleUsers = [
    {
      id: 1,
      name: "John Doe",
      role: "ceo",
      department: "Executive",
      avatar: "JD",
      color: "#EF4444",
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "cto",
      department: "Technology",
      avatar: "JS",
      color: "#10B981",
    },
    {
      id: 3,
      name: "Mike Johnson",
      role: "developer",
      department: "Development",
      avatar: "MJ",
      color: "#8B5CF6",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      role: "designer",
      department: "Design",
      avatar: "SW",
      color: "#F59E0B",
    },
    {
      id: 5,
      name: "David Brown",
      role: "admin",
      department: "Operations",
      avatar: "DB",
      color: "#06B6D4",
    },
    {
      id: 6,
      name: "Emily Chen",
      role: "support",
      department: "Support",
      avatar: "EC",
      color: "#F97316",
    },
    {
      id: 7,
      name: "Alex Rivera",
      role: "developer",
      department: "Development",
      avatar: "AR",
      color: "#EC4899",
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
      title: "Payment processing failed for customer",
      description:
        "Customer reports payment failure with error code 500. Need immediate attention as this affects multiple users.",
      priority: "high",
      type: "issue",
      status: "in-progress",
      boardId: "customer-service",
      assignee: 6,
      reporter: 1,
      dueDate: "2024-02-15",
      createdAt: new Date("2024-02-10"),
      updatedAt: new Date("2024-02-12"),
      tags: ["payment", "urgent", "backend"],
      attachments: ["error_logs.txt"],
      comments: [
        {
          id: 1,
          userId: 6,
          text: "Investigating the payment gateway integration",
          timestamp: new Date("2024-02-10 10:30:00"),
        },
        {
          id: 2,
          userId: 2,
          text: "Check the API response from Stripe",
          timestamp: new Date("2024-02-10 11:15:00"),
        },
      ],
    },
    {
      id: "TI-001",
      title: "Mobile app crashes on iOS 17",
      description:
        "App crashes immediately after launch on iOS 17.2. Stack trace points to memory allocation issue.",
      priority: "critical",
      type: "bug",
      status: "todo",
      boardId: "tech-issues",
      assignee: 3,
      reporter: 5,
      dueDate: "2024-02-20",
      createdAt: new Date("2024-02-11"),
      updatedAt: new Date("2024-02-11"),
      tags: ["ios", "mobile", "crash"],
      attachments: ["crash_report.ips"],
      comments: [],
    },
    {
      id: "FR-001",
      title: "Dark mode implementation",
      description:
        "Users requesting dark mode theme for better nighttime usage.",
      priority: "low",
      type: "enhancement",
      status: "under-review",
      boardId: "feature-requests",
      assignee: 4,
      reporter: 2,
      dueDate: "2024-03-01",
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date("2024-02-05"),
      tags: ["ui", "feature", "design"],
      attachments: ["design_mockup.pdf"],
      comments: [
        {
          id: 1,
          userId: 4,
          text: "Initial design mockups ready for review",
          timestamp: new Date("2024-02-05 14:20:00"),
        },
      ],
    },
    {
      id: "CS-002",
      title: "Password reset not working",
      description:
        "Customer cannot reset password - reset email never arrives.",
      priority: "medium",
      type: "issue",
      status: "backlog",
      boardId: "customer-service",
      assignee: null,
      reporter: 6,
      dueDate: "2024-02-25",
      createdAt: new Date("2024-02-12"),
      updatedAt: new Date("2024-02-12"),
      tags: ["authentication", "email"],
      attachments: [],
      comments: [],
    },
    {
      id: "TI-002",
      title: "Database connection timeout",
      description: "Random database connection timeouts during peak hours.",
      priority: "high",
      type: "bug",
      status: "in-progress",
      boardId: "tech-issues",
      assignee: 7,
      reporter: 3,
      dueDate: "2024-02-18",
      createdAt: new Date("2024-02-08"),
      updatedAt: new Date("2024-02-12"),
      tags: ["database", "performance", "backend"],
      attachments: ["db_logs.sql"],
      comments: [
        {
          id: 1,
          userId: 7,
          text: "Monitoring connection pool settings",
          timestamp: new Date("2024-02-09 09:45:00"),
        },
        {
          id: 2,
          userId: 2,
          text: "Consider increasing connection timeout limit",
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
      color: "#6B7280",
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
        className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 cursor-move mb-3"
      >
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm font-mono text-gray-500">{ticket.id}</span>
          <div className="flex space-x-1">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                ticket.priority
              )}`}
            >
              {ticket.priority}
            </span>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(
                ticket.type
              )}`}
            >
              {ticket.type}
            </span>
          </div>
        </div>

        <h4 className="font-semibold text-gray-900 mb-2 text-sm leading-tight">
          {ticket.title}
        </h4>

        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
          {ticket.description}
        </p>

        {ticket.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {ticket.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            {assignee ? (
              <div className="flex items-center space-x-1">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: assignee.color }}
                >
                  {assignee.avatar}
                </div>
                <span>{assignee.name.split(" ")[0]}</span>
              </div>
            ) : (
              <span className="text-gray-400">Unassigned</span>
            )}
          </div>

          {ticket.dueDate && (
            <span
              className={
                new Date(ticket.dueDate) < new Date()
                  ? "text-red-500 font-medium"
                  : ""
              }
            >
              {formatDate(ticket.dueDate)}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            {formatDate(ticket.updatedAt)}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setEditingTicket(ticket)}
              className="text-blue-500 hover:text-blue-700 text-xs"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteTicket(ticket.id)}
              className="text-red-500 hover:text-red-700 text-xs"
            >
              Delete
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">
              {isEditing ? "Edit Ticket" : "Create New Ticket"}
            </h3>
          </div>

          <form
            onSubmit={isEditing ? handleUpdateTicket : handleCreateTicket}
            className="p-6 overflow-y-auto max-h-[70vh]"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the issue or request..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="bug">Bug</option>
                    <option value="issue">Issue</option>
                    <option value="enhancement">Enhancement</option>
                    <option value="feature">Feature</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {isEditing && ticket.comments && ticket.comments.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comments
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {ticket.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-gray-50 rounded-lg p-3"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-sm">
                            {getUserById(comment.userId)?.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(comment.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.text}</p>
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
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      id="new-comment"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() =>
                  isEditing ? setEditingTicket(null) : setShowTicketModal(false)
                }
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
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
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kanban Boards</h1>
            <p className="text-gray-600 mt-2">
              Manage customer service tickets and technical issues
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowBoardModal(true)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              New Board
            </button>
            <button
              onClick={() => setShowTicketModal(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              New Ticket
            </button>
          </div>
        </div>

        {/* Board Selection */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {boards.map((board) => (
            <button
              key={board.id}
              onClick={() => setActiveBoard(board.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeBoard === board.id
                  ? "bg-white shadow-sm border border-gray-200"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <span className="text-lg">{board.icon}</span>
              <span className="font-medium">{board.name}</span>
              <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                {tickets.filter((t) => t.boardId === board.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {getColumnHeaders().map((column) => (
            <div
              key={column}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column)}
              className="bg-gray-100 rounded-lg p-4 min-h-[600px]"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-700">
                  {getColumnTitle(column)}
                </h3>
                <span className="bg-white text-gray-600 text-sm px-2 py-1 rounded-full">
                  {getTicketsByStatus(column).length}
                </span>
              </div>
              <div className="space-y-3">
                {getTicketsByStatus(column).map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
                {getTicketsByStatus(column).length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <p>No tickets</p>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What's this board for?"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowBoardModal(false)}
                  className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
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
