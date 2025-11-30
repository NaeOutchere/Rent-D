import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { servicesAPI } from "../services/api";

const LandlordServiceManagement = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("requests");
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [serviceRequests, setServiceRequests] = useState([]);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [newProvider, setNewProvider] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    services: [],
    hourlyRate: "",
  });

  useEffect(() => {
    fetchProperties();
    fetchServiceRequests();
  }, []);

  useEffect(() => {
    if (selectedProperty) {
      fetchPropertyProviders(selectedProperty);
    }
  }, [selectedProperty]);

  const fetchProperties = async () => {
    try {
      // This would come from your properties API
      const mockProperties = [
        { _id: "1", address: "123 Main St" },
        { _id: "2", address: "456 Oak Ave" },
        { _id: "3", address: "789 Pine Rd" },
      ];
      setProperties(mockProperties);
      if (mockProperties.length > 0) {
        setSelectedProperty(mockProperties[0]._id);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const fetchServiceRequests = async () => {
    try {
      const response = await servicesAPI.getRequests();
      setServiceRequests(response.data.requests);
    } catch (error) {
      console.error("Error fetching service requests:", error);
    }
  };

  const fetchPropertyProviders = async (propertyId) => {
    try {
      const response = await servicesAPI.getPropertyProviders(propertyId);
      setServiceProviders(response.data.availableProviders || []);
    } catch (error) {
      console.error("Error fetching property providers:", error);
    }
  };

  const handleUpdateRequestStatus = async (
    requestId,
    status,
    providerId = null
  ) => {
    try {
      await servicesAPI.updateRequestStatus(requestId, {
        status,
        assignedProviderId: providerId,
      });
      fetchServiceRequests();
    } catch (error) {
      console.error("Error updating request status:", error);
      alert("Failed to update request status");
    }
  };

  const handleAddProvider = async (e) => {
    e.preventDefault();
    try {
      await servicesAPI.addProviderToProperty(selectedProperty, newProvider);
      setShowAddProvider(false);
      setNewProvider({
        name: "",
        email: "",
        phone: "",
        company: "",
        services: [],
        hourlyRate: "",
      });
      fetchPropertyProviders(selectedProperty);
      alert("Service provider added successfully!");
    } catch (error) {
      console.error("Error adding provider:", error);
      alert("Failed to add service provider");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Assigned":
        return "bg-purple-100 text-purple-800";
      case "Submitted":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "Emergency":
        return "bg-red-100 text-red-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
        <p className="text-gray-600 mt-2">
          Manage maintenance services for your properties
        </p>
      </div>

      {/* Property Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Property
        </label>
        <select
          value={selectedProperty}
          onChange={(e) => setSelectedProperty(e.target.value)}
          className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b4354] bg-white text-gray-900"
        >
          {properties.map((property) => (
            <option key={property._id} value={property._id}>
              {property.address}
            </option>
          ))}
        </select>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("requests")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "requests"
                ? "border-[#2b4354] text-[#2b4354]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Service Requests
          </button>
          <button
            onClick={() => setActiveTab("providers")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "providers"
                ? "border-[#2b4354] text-[#2b4354]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Service Providers
          </button>
        </nav>
      </div>

      {/* Service Requests Tab */}
      {activeTab === "requests" && (
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Service Requests
            </h2>
          </div>

          <div className="p-6">
            {serviceRequests.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📋</div>
                <p className="text-gray-600">No service requests yet</p>
              </div>
            ) : (
              <div className="space-y-6">
                {serviceRequests.map((request) => (
                  <div
                    key={request._id}
                    className="p-4 border border-gray-200 rounded-xl"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {request.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {request.property?.address}
                        </p>
                        <p className="text-sm text-gray-500">
                          From: {request.tenant?.name || "Tenant"}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-2 py-1 rounded text-xs ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                        <span
                          className={`ml-2 px-2 py-1 rounded text-xs ${getUrgencyColor(
                            request.urgency
                          )}`}
                        >
                          {request.urgency}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3">{request.description}</p>

                    <div className="flex justify-between items-center mb-3">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Category:</span>{" "}
                        {request.category}
                        {request.assignedProvider && (
                          <span className="ml-4">
                            <span className="font-medium">Assigned to:</span>{" "}
                            {request.assignedProvider.name}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {request.status === "Submitted" && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleUpdateRequestStatus(request._id, "Assigned")
                          }
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                        >
                          Assign Provider
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateRequestStatus(
                              request._id,
                              "In Progress"
                            )
                          }
                          className="px-3 py-1 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 transition-colors"
                        >
                          Start Work
                        </button>
                      </div>
                    )}

                    {request.status === "In Progress" && (
                      <button
                        onClick={() =>
                          handleUpdateRequestStatus(request._id, "Completed")
                        }
                        className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Service Providers Tab */}
      {activeTab === "providers" && (
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Service Providers
            </h2>
            <button
              onClick={() => setShowAddProvider(true)}
              className="px-4 py-2 bg-[#2b4354] text-white rounded-lg hover:bg-[#3c5a6a] transition-colors"
            >
              Add Provider
            </button>
          </div>

          <div className="p-6">
            {/* Add Provider Form */}
            {showAddProvider && (
              <div className="mb-6 p-4 border border-gray-200 rounded-xl bg-gray-50">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Add New Service Provider
                </h3>
                <form onSubmit={handleAddProvider} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={newProvider.name}
                        onChange={(e) =>
                          setNewProvider({
                            ...newProvider,
                            name: e.target.value,
                          })
                        }
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b4354]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        value={newProvider.company}
                        onChange={(e) =>
                          setNewProvider({
                            ...newProvider,
                            company: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b4354]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={newProvider.email}
                        onChange={(e) =>
                          setNewProvider({
                            ...newProvider,
                            email: e.target.value,
                          })
                        }
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b4354]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        value={newProvider.phone}
                        onChange={(e) =>
                          setNewProvider({
                            ...newProvider,
                            phone: e.target.value,
                          })
                        }
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b4354]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Services *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Plumbing",
                        "Electrical",
                        "HVAC",
                        "Carpentry",
                        "Pest Control",
                        "Cleaning",
                        "Appliance Repair",
                        "General Maintenance",
                      ].map((service) => (
                        <label
                          key={service}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={newProvider.services.includes(service)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewProvider({
                                  ...newProvider,
                                  services: [...newProvider.services, service],
                                });
                              } else {
                                setNewProvider({
                                  ...newProvider,
                                  services: newProvider.services.filter(
                                    (s) => s !== service
                                  ),
                                });
                              }
                            }}
                            className="rounded border-gray-300 text-[#2b4354] focus:ring-[#2b4354]"
                          />
                          <span className="text-sm">{service}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hourly Rate ($)
                    </label>
                    <input
                      type="number"
                      value={newProvider.hourlyRate}
                      onChange={(e) =>
                        setNewProvider({
                          ...newProvider,
                          hourlyRate: e.target.value,
                        })
                      }
                      className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b4354]"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#2b4354] text-white rounded-lg hover:bg-[#3c5a6a] transition-colors"
                    >
                      Add Provider
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddProvider(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Providers List */}
            {serviceProviders.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">👷</div>
                <p className="text-gray-600">No service providers added yet</p>
                <button
                  onClick={() => setShowAddProvider(true)}
                  className="mt-4 px-4 py-2 bg-[#2b4354] text-white rounded-lg hover:bg-[#3c5a6a] transition-colors"
                >
                  Add Your First Provider
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceProviders.map((provider) => (
                  <div
                    key={provider.serviceProvider._id}
                    className="p-4 border border-gray-200 rounded-xl"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {provider.serviceProvider.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {provider.serviceProvider.company}
                        </p>
                      </div>
                      {provider.isPreferred && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          Preferred
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <p>📧 {provider.serviceProvider.email}</p>
                      <p>📞 {provider.serviceProvider.phone}</p>
                      {provider.serviceProvider.hourlyRate && (
                        <p>💰 ${provider.serviceProvider.hourlyRate}/hour</p>
                      )}
                    </div>

                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Services:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {provider.serviceProvider.services.map((service) => (
                          <span
                            key={service}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordServiceManagement;
