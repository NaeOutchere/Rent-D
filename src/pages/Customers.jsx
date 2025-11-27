import React, { useState } from "react";

// Simple SVG icons as React components
const DocumentIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
      clipRule="evenodd"
    />
  </svg>
);

const FilterIcon = () => (
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
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
    />
  </svg>
);

const SearchIcon = () => (
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
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const Customers = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    status: "all",
    subscription: "all",
    payment: "all",
    verification: "all",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for customers
  const customersData = [
    {
      id: 1,
      name: "John Smith",
      type: "Landlord",
      email: "john@example.com",
      properties: 5,
      tenants: 8,
      active: true,
      subscription: "Monthly",
      subscriptionPaid: true,
      documents: [
        { type: "National ID", verified: true },
        { type: "TRN", verified: true },
        { type: "Proof of Address", verified: false },
      ],
    },
    {
      id: 2,
      name: "Sarah Johnson",
      type: "Landlord",
      email: "sarah@example.com",
      properties: 12,
      tenants: 15,
      active: true,
      subscription: "Yearly",
      subscriptionPaid: true,
      documents: [
        { type: "National ID", verified: true },
        { type: "TRN", verified: true },
        { type: "Proof of Address", verified: true },
      ],
    },
    {
      id: 3,
      name: "Mike Brown",
      type: "Tenant",
      email: "mike@example.com",
      properties: 0,
      tenants: 0,
      active: true,
      subscription: "Monthly",
      subscriptionPaid: false,
      documents: [
        { type: "National ID", verified: true },
        { type: "TRN", verified: false },
        { type: "Proof of Address", verified: true },
      ],
    },
    {
      id: 4,
      name: "Lisa Davis",
      type: "Tenant",
      email: "lisa@example.com",
      properties: 0,
      tenants: 0,
      active: false,
      subscription: "Monthly",
      subscriptionPaid: true,
      documents: [
        { type: "National ID", verified: false },
        { type: "TRN", verified: false },
        { type: "Proof of Address", verified: false },
      ],
    },
    {
      id: 5,
      name: "Robert Wilson",
      type: "Landlord",
      email: "robert@example.com",
      properties: 3,
      tenants: 3,
      active: true,
      subscription: "Yearly",
      subscriptionPaid: false,
      documents: [
        { type: "National ID", verified: true },
        { type: "TRN", verified: true },
        { type: "Proof of Address", verified: true },
      ],
    },
  ];

  // Filter customers based on all active filters
  const filteredCustomers = customersData.filter((customer) => {
    // Search filter
    const matchesSearch =
      filters.search === "" ||
      customer.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      customer.email.toLowerCase().includes(filters.search.toLowerCase());

    // Type filter
    const matchesType =
      filters.type === "all" || customer.type === filters.type;

    // Status filter
    const matchesStatus =
      filters.status === "all" ||
      (filters.status === "active" && customer.active) ||
      (filters.status === "inactive" && !customer.active);

    // Subscription filter
    const matchesSubscription =
      filters.subscription === "all" ||
      customer.subscription === filters.subscription;

    // Payment filter
    const matchesPayment =
      filters.payment === "all" ||
      (filters.payment === "paid" && customer.subscriptionPaid) ||
      (filters.payment === "due" && !customer.subscriptionPaid);

    // Verification filter
    const matchesVerification =
      filters.verification === "all" ||
      (filters.verification === "verified" &&
        customer.documents.every((doc) => doc.verified)) ||
      (filters.verification === "pending" &&
        customer.documents.some((doc) => !doc.verified));

    return (
      matchesSearch &&
      matchesType &&
      matchesStatus &&
      matchesSubscription &&
      matchesPayment &&
      matchesVerification
    );
  });

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      search: "",
      type: "all",
      status: "all",
      subscription: "all",
      payment: "all",
      verification: "all",
    });
  };

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(
    (value) => value !== "all" && value !== ""
  ).length;

  // Function to handle document view
  const handleViewDocuments = (customer) => {
    setSelectedCustomer(customer);
  };

  // Function to close document view
  const handleCloseDocuments = () => {
    setSelectedCustomer(null);
  };

  // Function to toggle verification status
  const toggleVerification = (docType) => {
    if (!selectedCustomer) return;

    const updatedCustomer = {
      ...selectedCustomer,
      documents: selectedCustomer.documents.map((doc) =>
        doc.type === docType ? { ...doc, verified: !doc.verified } : doc
      ),
    };
    setSelectedCustomer(updatedCustomer);
  };

  return (
    <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-2xl font-semibold dark:text-white">
            Customer Management
          </p>
          <p className="text-gray-400 dark:text-gray-300 mt-2">
            Overview of all landlords and tenants
          </p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-main-blue text-white rounded-lg hover:bg-blue-700 transition duration-200">
            Export Report
          </button>
          <button className="px-4 py-2 bg-main-orange text-white rounded-lg hover:bg-orange-600 transition duration-200">
            Add Customer
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-8">
        {/* Search Input */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search customers by name or email..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-main-orange focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition duration-200 ${
              showFilters || activeFilterCount > 0
                ? "border-main-orange bg-orange-50 dark:bg-orange-900/20 text-main-orange"
                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            <FilterIcon />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-main-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition duration-200"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
            {/* Customer Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Customer Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-main-orange focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="Landlord">Landlords</option>
                <option value="Tenant">Tenants</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-main-orange focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Subscription Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subscription
              </label>
              <select
                value={filters.subscription}
                onChange={(e) =>
                  handleFilterChange("subscription", e.target.value)
                }
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-main-orange focus:border-transparent"
              >
                <option value="all">All Subscriptions</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>

            {/* Payment Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment
              </label>
              <select
                value={filters.payment}
                onChange={(e) => handleFilterChange("payment", e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-main-orange focus:border-transparent"
              >
                <option value="all">All Payments</option>
                <option value="paid">Paid</option>
                <option value="due">Due</option>
              </select>
            </div>

            {/* Verification Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Verification
              </label>
              <select
                value={filters.verification}
                onChange={(e) =>
                  handleFilterChange("verification", e.target.value)
                }
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-main-orange focus:border-transparent"
              >
                <option value="all">All Verification</option>
                <option value="verified">Fully Verified</option>
                <option value="pending">Pending Verification</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600 dark:text-gray-400">
          Showing {filteredCustomers.length} of {customersData.length} customers
          {activeFilterCount > 0 && " (filtered)"}
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
            Total Customers
          </p>
          <p className="text-2xl font-bold dark:text-white">
            {filteredCustomers.length}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <p className="text-green-600 dark:text-green-400 text-sm font-medium">
            Active Customers
          </p>
          <p className="text-2xl font-bold dark:text-white">
            {filteredCustomers.filter((c) => c.active).length}
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">
            Landlords
          </p>
          <p className="text-2xl font-bold dark:text-white">
            {filteredCustomers.filter((c) => c.type === "Landlord").length}
          </p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">
            Pending Verifications
          </p>
          <p className="text-2xl font-bold dark:text-white">
            {
              filteredCustomers.filter((c) =>
                c.documents.some((d) => !d.verified)
              ).length
            }
          </p>
        </div>
      </div>

      {/* Customers Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Customers
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Number of Properties
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Number of Tenants
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Documents
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Active Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Subscription
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Payment Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-secondary-dark-bg divide-y divide-gray-200 dark:divide-gray-600">
            {filteredCustomers.map((customer) => (
              <tr
                key={customer.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {/* Customer Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {customer.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {customer.email}
                    </p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        customer.type === "Landlord"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }`}
                    >
                      {customer.type}
                    </span>
                  </div>
                </td>

                {/* Properties */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {customer.properties}
                </td>

                {/* Tenants */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {customer.tenants}
                </td>

                {/* Documents */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  <button
                    onClick={() => handleViewDocuments(customer)}
                    className="flex items-center gap-2 text-main-orange hover:text-orange-600 transition duration-200"
                  >
                    <DocumentIcon />
                    View ({customer.documents.filter((d) => d.verified).length}/
                    {customer.documents.length})
                  </button>
                </td>

                {/* Active Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        customer.active ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        customer.active
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {customer.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </td>

                {/* Subscription */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {customer.subscription}
                </td>

                {/* Payment Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.subscriptionPaid
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {customer.subscriptionPaid ? "Paid" : "Due"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* No Results Message */}
        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No customers found matching your filters
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-4 px-4 py-2 bg-main-orange text-white rounded-lg hover:bg-orange-600 transition duration-200"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Documents Modal (same as before) */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-secondary-dark-bg rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-semibold dark:text-white">
                    Documents - {selectedCustomer.name}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {selectedCustomer.type} • {selectedCustomer.email}
                  </p>
                </div>
                <button
                  onClick={handleCloseDocuments}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Documents List */}
              <div className="space-y-4">
                {selectedCustomer.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <DocumentIcon />
                      <div>
                        <p className="font-medium dark:text-white">
                          {doc.type}
                        </p>
                        <p
                          className={`text-sm ${
                            doc.verified
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {doc.verified ? "Verified" : "Pending Verification"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-main-blue text-white rounded text-sm hover:bg-blue-700 transition duration-200">
                        View
                      </button>
                      <button
                        onClick={() => toggleVerification(doc.type)}
                        className={`px-3 py-1 rounded text-sm transition duration-200 ${
                          doc.verified
                            ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200"
                        }`}
                      >
                        {doc.verified ? "Unverify" : "Verify"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                <button className="flex-1 bg-main-orange text-white py-2 rounded-lg hover:bg-orange-600 transition duration-200">
                  Send Verification Reminder
                </button>
                <button className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200">
                  Download All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
