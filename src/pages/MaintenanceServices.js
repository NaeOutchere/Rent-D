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
  const [propertiesLoading, setPropertiesLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchUserProperties();
    fetchServiceRequests();
  }, []);

  useEffect(() => {
    if (selectedProperty && isValidObjectId(selectedProperty)) {
      fetchServiceProviders(selectedProperty);
    } else {
      setServiceProviders([]);
    }
  }, [selectedProperty]);

  // Helper function to validate MongoDB ObjectId
  const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  };

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
      setPropertiesLoading(true);
      console.log("Fetching user properties...");

      const response = await fetch(
        "http://localhost:5000/api/properties/user/my-properties",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Properties API response:", data);

        if (data.properties && data.properties.length > 0) {
          // Filter out any properties with invalid IDs
          const validProperties = data.properties.filter(
            (property) => property._id && isValidObjectId(property._id)
          );

          if (validProperties.length > 0) {
            setProperties(validProperties);
            setSelectedProperty(validProperties[0]._id);
            setFormData((prev) => ({
              ...prev,
              propertyId: validProperties[0]._id,
            }));
            console.log("Set valid properties:", validProperties);
          } else {
            console.log("No valid properties found");
            setProperties([]);
          }
        } else {
          console.log("No properties found in response");
          setProperties([]);
        }
      } else {
        console.error("Failed to fetch properties. Status:", response.status);
        const errorText = await response.text();
        console.error("Error response:", errorText);
        setProperties([]);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      setProperties([]);
    } finally {
      setPropertiesLoading(false);
    }
  };

  const fetchServiceProviders = async (propertyId) => {
    // Only fetch if propertyId is valid
    if (!propertyId || !isValidObjectId(propertyId)) {
      console.log(
        "Skipping service providers fetch - invalid property ID:",
        propertyId
      );
      setServiceProviders([]);
      return;
    }

    try {
      console.log("Fetching service providers for property:", propertyId);
      const response = await servicesAPI.getPropertyProviders(propertyId);
      setServiceProviders(response.data.availableProviders || []);
    } catch (error) {
      console.error("Error fetching service providers:", error);
      setServiceProviders([]);
    }
  };

  const fetchServiceRequests = async () => {
    try {
      const response = await servicesAPI.getRequests();
      setRequests(response.data.requests || []);
    } catch (error) {
      console.error("Error fetching service requests:", error);
      setRequests([]);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();

    // Validate property ID
    if (!formData.propertyId || !isValidObjectId(formData.propertyId)) {
      alert(
        "Please select a valid property. The property ID format is invalid."
      );
      return;
    }

    // Validate required fields
    if (!formData.category || !formData.title || !formData.description) {
      alert(
        "Please fill in all required fields: Service Type, Issue Title, and Description."
      );
      return;
    }

    setIsLoading(true);

    try {
      console.log("Submitting service request with data:", formData);
      await servicesAPI.submitRequest(formData);
      alert("Service request submitted successfully!");
      // Reset form but keep the selected property
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
      alert(
        "Failed to submit service request: " +
          (error.message || "Please check if you have access to this property")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePropertyChange = (e) => {
    const propertyId = e.target.value;
    if (isValidObjectId(propertyId)) {
      setSelectedProperty(propertyId);
      setFormData({
        ...formData,
        propertyId: propertyId,
      });
    } else {
      console.error("Invalid property ID selected:", propertyId);
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

          {propertiesLoading ? (
            <div className="text-center py-8">
              <div className="text-xl">Loading properties...</div>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🏠</div>
              <p className="text-gray-600 mb-4">No properties found</p>
              <p className="text-sm text-gray-500 mb-4">
                You need to be assigned to a property to submit service
                requests. Please contact your landlord or administrator.
              </p>
              <button
                onClick={fetchUserProperties}
                className="px-4 py-2 bg-[#2b4354] text-white rounded-lg hover:bg-[#3c5a6a] transition-colors"
              >
                Retry Loading Properties
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitRequest} className="space-y-6">
              {/* Property Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Property *
                </label>
                <select
                  name="propertyId"
                  value={formData.propertyId}
                  onChange={handlePropertyChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b4354] bg-white text-gray-900"
                >
                  <option value="">Choose a property</option>
                  {properties.map((property) => (
                    <option key={property._id} value={property._id}>
                      {property.address || `Property ${property._id}`}
                    </option>
                  ))}
                </select>
                {formData.propertyId &&
                  !isValidObjectId(formData.propertyId) && (
                    <p className="text-red-500 text-sm mt-1">
                      Invalid property selected. Please choose a valid property.
                    </p>
                  )}
              </div>

              {/* Rest of your form remains the same */}
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
                        key={provider.serviceProvider?._id}
                        value={provider.serviceProvider?._id}
                      >
                        {provider.serviceProvider?.name} -{" "}
                        {provider.serviceProvider?.company} ({provider.category}
                        )
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
                disabled={isLoading || !isValidObjectId(formData.propertyId)}
                className="w-full md:w-auto px-6 py-3 bg-[#2b4354] text-white rounded-xl hover:bg-[#3c5a6a] focus:outline-none focus:ring-2 focus:ring-[#2b4354] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Submitting Request..." : "Submit Service Request"}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Request History Tab - unchanged */}
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
