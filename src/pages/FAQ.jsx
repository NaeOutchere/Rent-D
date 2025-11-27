import React, { useState, useEffect } from "react";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [editingFaq, setEditingFaq] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFaq, setNewFaq] = useState({
    question: "",
    answer: "",
    category: "general",
  });
  const [currentUser, setCurrentUser] = useState(null);

  // Sample users for demonstration
  const sampleUsers = [
    {
      id: 1,
      name: "John Doe",
      role: "admin",
      email: "john@rentd.com",
    },
    {
      id: 2,
      name: "Alice Cooper",
      role: "landlord",
      email: "alice@example.com",
    },
    {
      id: 3,
      name: "Bob Wilson",
      role: "tenant",
      email: "bob@example.com",
    },
  ];

  // Sample FAQ data
  const sampleFaqs = [
    {
      id: 1,
      question: "How do I pay my rent?",
      answer:
        "You can pay your rent through the Rent-D portal using credit card, debit card, or bank transfer. Log in to your account, go to the Payments section, and follow the instructions to make a payment.",
      category: "payments",
      createdBy: 1,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
      status: "published",
    },
    {
      id: 2,
      question: "What should I do if I have maintenance issues?",
      answer:
        "Report maintenance issues through the Rent-D app or website. Go to the Maintenance section, describe the issue, and submit photos if possible. Emergency issues are prioritized and addressed within 24 hours.",
      category: "maintenance",
      createdBy: 1,
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-20"),
      status: "published",
    },
    {
      id: 3,
      question: "How do I schedule a property viewing?",
      answer:
        "Property viewings can be scheduled through the Rent-D platform. Browse available properties, select a time slot that works for you, and our team will confirm the appointment. You'll receive a confirmation email with details.",
      category: "property-viewing",
      createdBy: 1,
      createdAt: new Date("2024-01-08"),
      updatedAt: new Date("2024-01-08"),
      status: "published",
    },
    {
      id: 4,
      question: "What is the pet policy?",
      answer:
        "Pet policies vary by property. Some properties allow pets with additional pet rent and security deposit. Check the specific property listing for pet policies or contact the property manager for details.",
      category: "policies",
      createdBy: 1,
      createdAt: new Date("2024-01-05"),
      updatedAt: new Date("2024-01-12"),
      status: "published",
    },
    {
      id: 5,
      question: "How do I report an emergency?",
      answer:
        "For emergencies like fire, flood, or gas leaks, call our 24/7 emergency hotline at 1-800-RENTD-911. For non-emergency issues, use the maintenance request system in the app.",
      category: "emergency",
      createdBy: 1,
      createdAt: new Date("2024-01-03"),
      updatedAt: new Date("2024-01-03"),
      status: "published",
    },
    {
      id: 6,
      question: "What utilities are included in the rent?",
      answer:
        "Utility inclusions vary by property. Typically, water and trash are included. Electricity, gas, and internet are usually the tenant's responsibility. Check your lease agreement for specific details.",
      category: "utilities",
      createdBy: 1,
      createdAt: new Date("2024-01-02"),
      updatedAt: new Date("2024-01-02"),
      status: "published",
    },
    {
      id: 7,
      question: "How do I renew my lease?",
      answer:
        "Lease renewal offers are sent 60 days before your lease expires. You can accept the renewal through the Rent-D portal. If you have questions about renewal terms, contact your property manager.",
      category: "lease",
      createdBy: 1,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      status: "published",
    },
    {
      id: 8,
      question: "What is the security deposit for?",
      answer:
        "The security deposit covers any damages beyond normal wear and tear, unpaid rent, or cleaning costs. It is refundable upon move-out after inspection, provided there are no deductions.",
      category: "deposits",
      createdBy: 1,
      createdAt: new Date("2023-12-28"),
      updatedAt: new Date("2023-12-28"),
      status: "published",
    },
  ];

  const categories = [
    { id: "all", name: "All Questions", count: sampleFaqs.length },
    {
      id: "payments",
      name: "Payments",
      count: sampleFaqs.filter((f) => f.category === "payments").length,
    },
    {
      id: "maintenance",
      name: "Maintenance",
      count: sampleFaqs.filter((f) => f.category === "maintenance").length,
    },
    {
      id: "property-viewing",
      name: "Property Viewing",
      count: sampleFaqs.filter((f) => f.category === "property-viewing").length,
    },
    {
      id: "policies",
      name: "Policies",
      count: sampleFaqs.filter((f) => f.category === "policies").length,
    },
    {
      id: "emergency",
      name: "Emergency",
      count: sampleFaqs.filter((f) => f.category === "emergency").length,
    },
    {
      id: "utilities",
      name: "Utilities",
      count: sampleFaqs.filter((f) => f.category === "utilities").length,
    },
    {
      id: "lease",
      name: "Lease",
      count: sampleFaqs.filter((f) => f.category === "lease").length,
    },
    {
      id: "deposits",
      name: "Deposits",
      count: sampleFaqs.filter((f) => f.category === "deposits").length,
    },
  ];

  // Initialize data
  useEffect(() => {
    // In a real app, you would get the current user from context or auth
    setCurrentUser(sampleUsers[0]); // Set as admin for demo
    setFaqs(sampleFaqs);
  }, []);

  const isAdmin = currentUser?.role === "admin";

  const handleAddFaq = (e) => {
    e.preventDefault();
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return;

    const faq = {
      id: Date.now(),
      ...newFaq,
      createdBy: currentUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "published",
    };

    setFaqs((prev) => [faq, ...prev]);
    setNewFaq({
      question: "",
      answer: "",
      category: "general",
    });
    setShowAddModal(false);
  };

  const handleUpdateFaq = (e) => {
    e.preventDefault();
    if (!editingFaq.question.trim() || !editingFaq.answer.trim()) return;

    setFaqs((prev) =>
      prev.map((faq) =>
        faq.id === editingFaq.id
          ? { ...editingFaq, updatedAt: new Date() }
          : faq
      )
    );
    setEditingFaq(null);
  };

  const handleDeleteFaq = (faqId) => {
    setFaqs((prev) => prev.filter((faq) => faq.id !== faqId));
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // FAQ Item Component
  const FaqItem = ({ faq }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-8">
                {faq.question}
              </h3>
              <div className="flex items-center space-x-3 mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {getCategoryName(faq.category)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Updated {formatDate(faq.updatedAt)}
                </span>
              </div>
            </div>
            <div className="flex-shrink-0 ml-4">
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                  isExpanded ? "transform rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </button>

        {isExpanded && (
          <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700 pt-4">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {faq.answer}
            </p>

            {isAdmin && (
              <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-600">
                <button
                  onClick={() => setEditingFaq(faq)}
                  className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteFaq(faq.id)}
                  className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Add/Edit Modal Component
  const FaqModal = () => {
    const faq = editingFaq || newFaq;
    const isEditing = !!editingFaq;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {isEditing ? "Edit FAQ" : "Add New FAQ"}
            </h3>
          </div>

          <form
            onSubmit={isEditing ? handleUpdateFaq : handleAddFaq}
            className="p-6 overflow-y-auto"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Question *
                </label>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) =>
                    isEditing
                      ? setEditingFaq({ ...faq, question: e.target.value })
                      : setNewFaq({ ...newFaq, question: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter the question..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Answer *
                </label>
                <textarea
                  value={faq.answer}
                  onChange={(e) =>
                    isEditing
                      ? setEditingFaq({ ...faq, answer: e.target.value })
                      : setNewFaq({ ...newFaq, answer: e.target.value })
                  }
                  rows="6"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter the answer..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={faq.category}
                  onChange={(e) =>
                    isEditing
                      ? setEditingFaq({ ...faq, category: e.target.value })
                      : setNewFaq({ ...newFaq, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="general">General</option>
                  <option value="payments">Payments</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="property-viewing">Property Viewing</option>
                  <option value="policies">Policies</option>
                  <option value="emergency">Emergency</option>
                  <option value="utilities">Utilities</option>
                  <option value="lease">Lease</option>
                  <option value="deposits">Deposits</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() =>
                  isEditing ? setEditingFaq(null) : setShowAddModal(false)
                }
                className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                {isEditing ? "Update FAQ" : "Add FAQ"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find answers to common questions about Rent-D, payments,
            maintenance, and more.
          </p>
        </div>

        {/* Search and Admin Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
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
                </div>
              </div>
            </div>

            {isAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center space-x-2"
              >
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
                <span>Add New FAQ</span>
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? "bg-blue-500 text-white shadow-sm"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
                }`}
              >
                {category.name}
                <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded-full text-xs">
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">❓</div>
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No FAQs found
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                {searchTerm
                  ? `No results found for "${searchTerm}". Try a different search term.`
                  : `No FAQs available in the ${getCategoryName(
                      activeCategory
                    )} category.`}
              </p>
              {isAdmin && !searchTerm && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Add the first FAQ
                </button>
              )}
            </div>
          ) : (
            filteredFaqs.map((faq) => <FaqItem key={faq.id} faq={faq} />)
          )}
        </div>

        {/* User Role Notice */}
        {!isAdmin && (
          <div className="mt-8 text-center">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 inline-block">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                💡 Need help with something not covered here? Contact our
                support team for assistance.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {(showAddModal || editingFaq) && <FaqModal />}
    </div>
  );
};

export default FAQ;
