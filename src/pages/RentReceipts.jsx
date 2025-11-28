import React, { useState, useEffect } from "react";

const RentReceipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [error, setError] = useState("");

  // Mock data
  const mockReceipts = [
    {
      id: 1,
      receiptNumber: "RCP-001",
      propertyAddress: "123 Main St, Apt 4B, Kingston",
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
      propertyAddress: "123 Main St, Apt 4B, Kingston",
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
      propertyAddress: "123 Main St, Apt 4B, Kingston",
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
    setTimeout(() => {
      setReceipts(mockReceipts);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const filteredReceipts = receipts.filter((r) => {
    const matchesSearch =
      r.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = !filterYear || r.period.includes(filterYear);
    return matchesSearch && matchesYear;
  });

  const generateReceiptPDF = (receipt) => {
    const receiptContent = `
RENT RECEIPT
----------------------------------------
Receipt #: ${receipt.receiptNumber}
Date: ${formatDate(receipt.paymentDate)}

Received from: ${receipt.tenantName}
Property: ${receipt.propertyAddress}
Period: ${receipt.period}
Amount: $${receipt.amount.toLocaleString()}
Payment Method: ${receipt.paymentMethod}

Paid to: ${receipt.landlordName}
Status: ${receipt.status.toUpperCase()}
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
        <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-400 rounded-full animate-spin"></div>
        <p className="text-gray-600">Loading receipts...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Rent Receipts</h1>
      <p className="text-gray-600 mb-6">
        View and download your paid rent receipts
      </p>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 rounded-lg p-4 bg-gray-50 shadow-sm">
        <input
          type="text"
          placeholder="Search by period or receipt #"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          <option value="">All Years</option>
          {years.map((y) => (
            <option key={y} value={y.toString()}>
              {y}
            </option>
          ))}
        </select>
        <div className="text-gray-600 self-center">
          {filteredReceipts.length} receipt(s) found
        </div>
      </div>

      {/* Receipts Grid */}
      {filteredReceipts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No receipts found
          </h3>
          <p className="text-gray-500">
            {searchTerm || filterYear
              ? "Try adjusting your filters"
              : "No rent receipts available yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReceipts.map((receipt) => (
            <div
              key={receipt.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:shadow-orange-300 transition-all duration-300 flex flex-col"
            >
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
                  {receipt.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-4 mb-6 flex-1">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Property
                  </label>
                  <p className="text-gray-900 text-sm">
                    {receipt.propertyAddress}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Amount Paid
                  </label>
                  <p className="text-orange-500 text-2xl font-bold">
                    ${receipt.amount.toLocaleString()}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                      Payment Date
                    </label>
                    <p className="text-gray-900 text-sm">
                      {formatDate(receipt.paymentDate)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                      Method
                    </label>
                    <p className="text-gray-900 text-sm">
                      {receipt.paymentMethod}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => previewReceipt(receipt)}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  title="Preview"
                >
                  👁
                </button>

                <button
                  onClick={() => generateReceiptPDF(receipt)}
                  className="flex-1 bg-[#2b4354] hover:bg-[#3c5a6a] text-white py-2.5 px-4 rounded-full font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg"
                >
                  ⬇ Download
                </button>

                <button
                  onClick={() => generateReceiptPDF(receipt)}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  title="Download PDF"
                >
                  📄
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RentReceipts;
