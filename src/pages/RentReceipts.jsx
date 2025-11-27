import React, { useState, useEffect } from "react";

const RentReceipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [error, setError] = useState("");

  // Mock data - replace with actual API call
  const mockReceipts = [
    {
      id: 1,
      receiptNumber: "RCP-001",
      propertyAddress: "123 Main St, Apt 4B, New York, NY",
      landlordName: "John Smith",
      tenantName: "Alice Johnson",
      amount: 2500,
      period: "January 2024",
      paymentDate: "2024-01-01",
      paymentMethod: "Bank Transfer",
      status: "paid",
    },
    {
      id: 2,
      receiptNumber: "RCP-002",
      propertyAddress: "123 Main St, Apt 4B, New York, NY",
      landlordName: "John Smith",
      tenantName: "Alice Johnson",
      amount: 2500,
      period: "February 2024",
      paymentDate: "2024-02-01",
      paymentMethod: "Credit Card",
      status: "paid",
    },
    {
      id: 3,
      receiptNumber: "RCP-003",
      propertyAddress: "123 Main St, Apt 4B, New York, NY",
      landlordName: "John Smith",
      tenantName: "Alice Johnson",
      amount: 2500,
      period: "March 2024",
      paymentDate: "2024-03-01",
      paymentMethod: "Bank Transfer",
      status: "paid",
    },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchReceipts = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        setTimeout(() => {
          setReceipts(mockReceipts);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to load rent receipts");
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredReceipts = receipts.filter((receipt) => {
    const matchesSearch =
      receipt.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = !filterYear || receipt.period.includes(filterYear);
    return matchesSearch && matchesYear;
  });

  const generateReceiptPDF = (receipt) => {
    const receiptContent = `
RENT RECEIPT
----------------------------------------
Receipt Number: ${receipt.receiptNumber}
Date: ${formatDate(receipt.paymentDate)}

Received from: ${receipt.tenantName}
Property: ${receipt.propertyAddress}
Period: ${receipt.period}
Amount: $${receipt.amount.toLocaleString()}
Payment Method: ${receipt.paymentMethod}

Paid to: ${receipt.landlordName}
Status: ${receipt.status.toUpperCase()}

Thank you for your payment!
----------------------------------------
    `.trim();

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rent-receipt-${receipt.receiptNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const previewReceipt = (receipt) => {
    alert(
      `Receipt Preview:\n\nReceipt #: ${receipt.receiptNumber}\nPeriod: ${receipt.period}\nAmount: $${receipt.amount}\nProperty: ${receipt.propertyAddress}`
    );
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-main-orange rounded-full animate-spin"></div>
        <p className="text-gray-600">Loading receipts...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Rent Receipts
          </h1>
          <p className="text-gray-600">
            View and download your paid rent receipts
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search by period or receipt number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none transition-all"
              />
            </div>

            {/* Year Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">⏱</span>
              </div>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none appearance-none bg-white"
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="text-gray-600 text-sm md:text-right">
              {filteredReceipts.length} receipt(s) found
            </div>
          </div>
        </div>

        {/* Receipts List */}
        {filteredReceipts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No receipts found
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterYear
                ? "Try adjusting your search filters"
                : "No rent receipts available yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReceipts.map((receipt) => (
              <div
                key={receipt.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 flex flex-col"
              >
                {/* Receipt Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {receipt.period}
                    </h3>
                    <span className="text-gray-500 text-sm">
                      {receipt.receiptNumber}
                    </span>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full uppercase">
                    PAID
                  </span>
                </div>

                {/* Receipt Details */}
                <div className="space-y-4 mb-6 flex-1">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Property
                    </label>
                    <p className="text-gray-900 text-sm leading-relaxed">
                      {receipt.propertyAddress}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Amount Paid
                    </label>
                    <p className="text-main-orange text-2xl font-bold">
                      ${receipt.amount.toLocaleString()}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Payment Date
                      </label>
                      <p className="text-gray-900 text-sm">
                        {formatDate(receipt.paymentDate)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Method
                      </label>
                      <p className="text-gray-900 text-sm">
                        {receipt.paymentMethod}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => previewReceipt(receipt)}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    title="Preview Receipt"
                  >
                    <span className="text-lg">👁</span>
                  </button>

                  <button
                    onClick={() => generateReceiptPDF(receipt)}
                    className="flex-1 bg-main-orange hover:bg-orange-600 text-white py-2.5 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg"
                  >
                    <span>⬇</span>
                    Download
                  </button>

                  <button
                    onClick={() => generateReceiptPDF(receipt)}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    title="Download PDF"
                  >
                    <span className="text-lg">📄</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RentReceipts;
