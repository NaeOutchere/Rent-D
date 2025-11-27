import React from "react";
import { Weekly, Monthly, Yearly, Button } from "../components";
import { earningData } from "../data/dummy";
import { useAuth } from "../contexts/AuthContext";
import { useStateContext } from "../contexts/ContextProvider";

// Simple SVG icons as React components
const PdfIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
      clipRule="evenodd"
    />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { currentMode } = useStateContext();

  // Debug - check what user data we have
  console.log("=== DASHBOARD DEBUG ===");
  console.log("Full user object from useAuth:", user);
  console.log("User role:", user?.role);

  // Role detection
  const userRole = user?.role || "tenant";
  const isLandlord = userRole === "landlord" || userRole === "admin";

  console.log("Detected role:", userRole);
  console.log("Is landlord:", isLandlord);

  // Mock data for Landlord view
  const landlordData = [
    {
      id: 1,
      tenant: "John Smith",
      location: "Kingston 6",
      balanceDue: 50000,
      paid: true,
    },
    {
      id: 2,
      tenant: "Sarah Johnson",
      location: "Montego Bay",
      balanceDue: 75000,
      paid: false,
    },
    {
      id: 3,
      tenant: "Mike Brown",
      location: "Ocho Rios",
      balanceDue: 0,
      paid: true,
    },
    {
      id: 4,
      tenant: "Lisa Davis",
      location: "Portmore",
      balanceDue: 25000,
      paid: false,
    },
  ];

  // Mock data for Tenant view
  const tenantData = [
    {
      id: 1,
      date: "2024-01-15",
      service: "Rent",
      amountDue: 50000,
      paid: true,
    },
    {
      id: 2,
      date: "2024-01-10",
      service: "Maintenance",
      amountDue: 15000,
      paid: false,
    },
    {
      id: 3,
      date: "2023-12-15",
      service: "Rent",
      amountDue: 50000,
      paid: true,
    },
    {
      id: 4,
      date: "2023-12-05",
      service: "Maintenance",
      amountDue: 8000,
      paid: true,
    },
  ];

  // Calculate total due for tenant
  const totalDue = tenantData
    .filter((item) => !item.paid)
    .reduce((sum, item) => sum + item.amountDue, 0);

  const hasDueBills = totalDue > 0;

  // Function to generate PDF receipt
  const generateReceipt = (data, isLandlord = false) => {
    console.log("Generating receipt for:", data);
    alert(`Receipt generated for ${isLandlord ? data.tenant : data.service}`);
  };

  // Function to handle payment
  const handlePayment = () => {
    console.log("Processing payment for amount:", totalDue);
    alert(
      `Redirecting to payment gateway for $${totalDue.toLocaleString()} JMD`
    );
  };

  // Function to toggle paid status
  const togglePaidStatus = (id, isLandlord = false) => {
    console.log(
      `Toggling paid status for ${isLandlord ? "landlord" : "tenant"} record:`,
      id
    );
  };

  return (
    <div className="mt-12">
      <div className="flex flex-wrap lg:flex-nowrap justify-center">
        {/* Revenue Card - Only show for landlords */}
        {isLandlord && (
          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
            <div className="flex justify-between items center">
              <div>
                <p className="font-bold text-gray-400">Revenue</p>
                <p className="text-2xl text-main-blue">$150,000.80 JMD</p>
              </div>
            </div>

            <div className="mt-6">
              <Button
                color="white"
                bgColor="#e07229"
                text="Download"
                borderRadius="10px"
                size="md"
              />
            </div>
          </div>
        )}

        {/* Bill Due Card - Only show for tenants with due bills */}
        {!isLandlord && hasDueBills && (
          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
            <div className="flex justify-between items-center">
              <div className="w-full">
                <p className="font-bold text-gray-400">BILL DUE</p>
                <p className="text-2xl text-red-600">
                  ${totalDue.toLocaleString()} JMD
                </p>
                <p className="text-sm text-gray-500 mt-2">Due immediately</p>
              </div>
            </div>

            <div className="mt-6 flex justify-start">
              {" "}
              {/* Changed to justify-start for left alignment */}
              <button
                onClick={handlePayment}
                className="bg-[#e07229] hover:bg-[#d1651f] text-white font-medium py-3 px-8 rounded-lg transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105" /* Added shadow and hover effects */
              >
                Pay Now
              </button>
            </div>
          </div>
        )}

        {/* No Due Bills Card - Show for tenants with no due bills */}
        {!isLandlord && !hasDueBills && (
          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
            <div className="flex justify-between items-center">
              <div className="w-full">
                <p className="font-bold text-gray-400">ACCOUNT STATUS</p>
                <p className="text-2xl text-green-600">All Caught Up!</p>
                <p className="text-sm text-gray-500 mt-2">
                  No pending payments
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-start">
              {" "}
              {/* Changed to justify-start for left alignment */}
              <button
                className="bg-[#4CAF50] hover:bg-[#45a049] text-white font-medium py-3 px-8 rounded-lg transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105" /* Added shadow and hover effects */
              >
                View History
              </button>
            </div>
          </div>
        )}

        {/* Earnings Data - Only show for landlords */}
        {isLandlord && (
          <div className="flex m-3 flex-wrap justify-center gap-1 items-center">
            {earningData.map((item) => (
              <div
                key={item.title}
                className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl"
              >
                <button
                  type="button"
                  style={{
                    color: item.iconColor,
                    backgroundColor: item.iconBg,
                  }}
                  className="text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl"
                >
                  {item.icon}
                </button>
                <p className="mt-3">
                  <span className="text-lg font-semibold">${item.amount}</span>
                  <span className={`text-sm text-${item.pcColor} ml-2`}>
                    {item.percentage}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Table Section */}
      <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-xl font-semibold dark:text-white">
              {isLandlord ? "Tenant Management" : "Payment History"}
            </p>
            <p className="text-gray-400 dark:text-gray-300">
              {isLandlord
                ? "Overview of all tenants and payments"
                : "Your payment and service history"}
            </p>
          </div>
        </div>

        {/* Landlord View */}
        {isLandlord && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tenants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Balance Due (JMD)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Paid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Receipt
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-secondary-dark-bg divide-y divide-gray-200 dark:divide-gray-600">
                {landlordData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {item.tenant}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {item.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ${item.balanceDue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <button
                        onClick={() => togglePaidStatus(item.id, true)}
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                          item.paid
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-300 dark:border-gray-600 text-transparent"
                        }`}
                      >
                        <CheckIcon />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <button
                        onClick={() => generateReceipt(item, true)}
                        className="flex items-center gap-2 text-main-orange hover:text-orange-600 transition duration-200"
                      >
                        <PdfIcon />
                        Generate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tenant View */}
        {!isLandlord && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Services
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount Due (JMD)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Paid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Receipt
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-secondary-dark-bg divide-y divide-gray-200 dark:divide-gray-600">
                {tenantData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {item.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {item.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ${item.amountDue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <button
                        onClick={() => togglePaidStatus(item.id, false)}
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                          item.paid
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-300 dark:border-gray-600 text-transparent"
                        }`}
                      >
                        <CheckIcon />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <button
                        onClick={() => generateReceipt(item, false)}
                        className="flex items-center gap-2 text-main-orange hover:text-orange-600 transition duration-200"
                      >
                        <PdfIcon />
                        Generate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
