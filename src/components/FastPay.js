import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FastPay = () => {
  const [searchType, setSearchType] = useState("email");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("jmd");
  const [payerEmail, setPayerEmail] = useState("");
  const [payerName, setPayerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [paymentId, setPaymentId] = useState("");

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Search for tenant
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      setError("Please enter a search term");
      return;
    }

    setLoading(true);
    setError("");
    setSelectedTenant(null);
    setSearchResults([]);

    try {
      const response = await fetch(`${API_URL}/api/payments/search-tenant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          searchType,
          searchTerm: searchTerm.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Search failed");
      }

      if (data.data.length === 0) {
        setError("No matching accounts found.");
      } else {
        setSearchResults(data.data);
      }
    } catch (err) {
      setError(err.message || "An error occurred during search");
    } finally {
      setLoading(false);
    }
  };

  // Select tenant
  const handleSelectTenant = (tenant) => {
    setSelectedTenant(tenant);
    setSearchResults([]);
    setError("");
    setSuccess("");
    // Set amount to balance due or empty
    setAmount(tenant.balanceDue > 0 ? tenant.balanceDue.toString() : "");
  };

  // Submit payment
  const handleSubmitPayment = async (e) => {
    e.preventDefault();

    if (!selectedTenant) {
      setError("Please select a tenant first");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (!payerEmail || !payerEmail.includes("@")) {
      setError("Please enter a valid email for receipt");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/payments/guest-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency: currency,
          payerEmail: payerEmail,
          payerName: payerName || payerEmail.split("@")[0],
          propertyId: selectedTenant.propertyId,
          tenantEmail: selectedTenant.email,
          description: `Payment for ${selectedTenant.name} - ${selectedTenant.propertyTitle}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Payment creation failed");
      }

      setPaymentId(data.paymentId);
      setSuccess(
        `Payment created! Payment ID: ${data.paymentId}. A receipt will be sent to ${payerEmail}`
      );

      // Reset form after 5 seconds
      setTimeout(() => {
        setSelectedTenant(null);
        setSearchTerm("");
        setPayerEmail("");
        setPayerName("");
        setAmount("");
        setSuccess("");
        setPaymentId("");
      }, 5000);
    } catch (err) {
      setError(err.message || "An error occurred during payment");
    } finally {
      setSubmitting(false);
    }
  };

  // Resend receipt
  const handleResendReceipt = async () => {
    if (!paymentId || !payerEmail) return;

    try {
      const response = await fetch(`${API_URL}/api/payments/resend-receipt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentId: paymentId,
          email: payerEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend receipt");
      }

      setSuccess("Receipt has been resent to your email!");
    } catch (err) {
      setError(err.message || "Failed to resend receipt");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xl">$</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Fast Pay
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Make a payment without signing in
          </p>
        </div>

        {/* Back to Login */}
        <div className="mb-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors flex items-center justify-center space-x-2 mx-auto"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Login</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center space-x-2 text-red-700 dark:text-red-300">
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">{success}</span>
              </div>
              {paymentId && (
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={handleResendReceipt}
                    className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Resend Receipt
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTenant(null);
                      setSearchTerm("");
                      setPayerEmail("");
                      setPayerName("");
                      setAmount("");
                      setSuccess("");
                      setPaymentId("");
                    }}
                    className="text-sm bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                  >
                    New Payment
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Search Section */}
          {!selectedTenant && (
            <div className="space-y-4">
              {/* Search Tabs */}
              <div className="flex space-x-2">
                {["email", "name", "tenantId"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSearchType(type)}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                      searchType === type
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {type === "email" && "Email"}
                    {type === "name" && "Name"}
                    {type === "tenantId" && "Tenant ID"}
                  </button>
                ))}
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Search by {searchType}:
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={
                      searchType === "email"
                        ? "tenant@example.com"
                        : searchType === "name"
                        ? "John Doe"
                        : "TEN-20241204-1234"
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white py-3 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
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
                      <span>Search</span>
                    </>
                  )}
                </button>
              </form>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Tenant:
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {searchResults.map((tenant) => (
                      <div
                        key={tenant._id}
                        onClick={() => handleSelectTenant(tenant)}
                        className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {tenant.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {tenant.email}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {tenant.propertyTitle}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                              {currency === "usd" ? "$" : "J$"}
                              {tenant.balanceDue || "0.00"}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Balance Due
                            </div>
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          ID: {tenant.tenantId || "N/A"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Payment Form */}
          {selectedTenant && (
            <div className="space-y-4">
              {/* Selected Tenant Info */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-700 dark:text-gray-300">
                      Paying to:
                    </h3>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                      {selectedTenant.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedTenant.email}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedTenant.propertyTitle}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedTenant(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Payment Form */}
              <form onSubmit={handleSubmitPayment} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="jmd">JMD (J$)</option>
                      <option value="usd">USD ($)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Email (for receipt)
                  </label>
                  <input
                    type="email"
                    value={payerEmail}
                    onChange={(e) => setPayerEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Name (optional)
                  </label>
                  <input
                    type="text"
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="John Doe"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
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
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Submit Payment</span>
                    </>
                  )}
                </button>
              </form>

              {/* Info Note */}
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                <p>
                  Note: This is a demo payment system. No actual money will be
                  transferred.
                </p>
                <p>
                  A receipt will be logged in the console for testing purposes.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FastPay;
