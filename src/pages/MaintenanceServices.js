import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { servicesAPI } from "../services/api";

const MaintenanceServices = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("request");
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [serviceProviders, setServiceProviders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    propertyId: "",
    category: "",
    title: "",
    description: "",
    urgency: "Medium",
    preferredProviderId: "",
    scheduledDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchUserProperties();
    fetchServiceRequests();
  }, []);

  useEffect(() => {
    if (selectedProperty) {
      fetchServiceProviders(selectedProperty);
    }
  }, [selectedProperty]);

  const fetchCategories = async () => {
    try {
      const response = await servicesAPI.getCategories();
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchUserProperties = async () => {
    try {
      // This would come from your properties API
      const mockProperties = [
        { _id: "1", address: "123 Main St, Apt 4B" },
        { _id: "2", address: "456 Oak Ave, Unit 2" },
      ];
      setProperties(mockProperties);
      if (mockProperties.length > 0) {
        setSelectedProperty(mockProperties[0]._id);
        setFormData((prev) => ({ ...prev, propertyId: mockProperties[0]._id }));
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const fetchServiceProviders = async (propertyId) => {
    try {
      const response = await servicesAPI.getPropertyProviders(propertyId);
      setServiceProviders(response.data.availableProviders);
    } catch (error) {
      console.error("Error fetching service providers:", error);
    }
  };

  const fetchServiceRequests = async () => {
    try {
      const response = await servicesAPI.getRequests();
      setRequests(response.data.requests);
    } catch (error) {
      console.error("Error fetching service requests:", error);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await servicesAPI.submitRequest(formData);
      alert("Service request submitted successfully!");
      setFormData({
        propertyId: selectedProperty,
        category: "",
        title: "",
        description: "",
        urgency: "Medium",
        preferredProviderId: "",
        scheduledDate: "",
      });
      fetchServiceRequests();
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Failed to submit service request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Maintenance Services
        </h1>
        <p className="text-gray-600 mt-2">
          Request maintenance services for your rental property
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("request")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "request"
                ? "border-[#2b4354] text-[#2b4354]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Request Service
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "history"
                ? "border-[#2b4354] text-[#2b4354]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Request History
          </button>
        </nav>
      </div>

      {/* Request Service Tab */}
      {activeTab === "request" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            New Service Request
          </h2>

          <form onSubmit={handleSubmitRequest} className="space-y-6">
            {/* Property Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Property *
              </label>
              <select
                name="propertyId"
                value={formData.propertyId}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b4354] bg-white text-gray-900"
              >
                <option value="">Choose a property</option>
                {properties.map((property) => (
                  <option key={property._id} value={property._id}>
                    {property.address}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Type *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, category: category.name })
                    }
                    className={`p-4 border-2 rounded-xl text-center transition-colors ${
                      formData.category === category.name
                        ? "border-[#2b4354] bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="font-medium text-gray-900">
                      {category.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {category.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Request Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Leaky kitchen faucet"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b4354] bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency Level *
                </label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b4354] bg-white text-gray-900"
                >
                  <option value="Low">Low - Can wait a few days</option>
                  <option value="Medium">
                    Medium - Should be addressed soon
                  </option>
                  <option value="High">
                    High - Needs attention within 24 hours
                  </option>
                  <option value="Emergency">
                    Emergency - Immediate attention required
                  </option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                placeholder="Please describe the issue in detail..."
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b4354] bg-white text-gray-900"
              />
            </div>

            {/* Preferred Provider */}
            {serviceProviders.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Service Provider (Optional)
                </label>
                <select
                  name="preferredProviderId"
                  value={formData.preferredProviderId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b4354] bg-white text-gray-900"
                >
                  <option value="">Landlord will assign a provider</option>
                  {serviceProviders.map((provider) => (
                    <option
                      key={provider.serviceProvider._id}
                      value={provider.serviceProvider._id}
                    >
                      {provider.serviceProvider.name} -{" "}
                      {provider.serviceProvider.company} ({provider.category})
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  These are trusted providers recommended by your landlord
                </p>
              </div>
            )}

            {/* Scheduled Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Service Date (Optional)
              </label>
              <input
                type="datetime-local"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b4354] bg-white text-gray-900"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto px-6 py-3 bg-[#2b4354] text-white rounded-xl hover:bg-[#3c5a6a] focus:outline-none focus:ring-2 focus:ring-[#2b4354] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Submitting Request..." : "Submit Service Request"}
            </button>
          </form>
        </div>
      )}

      {/* Request History Tab */}
      {activeTab === "history" && (
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Service Request History
            </h2>
          </div>

          <div className="p-6">
            {requests.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🔧</div>
                <p className="text-gray-600">No service requests yet</p>
                <button
                  onClick={() => setActiveTab("request")}
                  className="mt-4 px-4 py-2 bg-[#2b4354] text-white rounded-lg hover:bg-[#3c5a6a] transition-colors"
                >
                  Submit Your First Request
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
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

                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Category:</span>{" "}
                        {request.category}
                        {request.assignedProvider && (
                          <span className="ml-4">
                            <span className="font-medium">Assigned to:</span>{" "}
                            {request.assignedProvider.name}
                          </span>
                        )}
                      </div>
                      <div>
                        Submitted:{" "}
                        {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {request.landlordNotes && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Landlord Notes:</span>{" "}
                          {request.landlordNotes}
                        </p>
                      </div>
                    )}
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

export default MaintenanceServices;
