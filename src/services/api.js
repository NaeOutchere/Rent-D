// services/api.js
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Helper function for API calls
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error ||
        errorData.message ||
        `Request failed: ${response.status}`
    );
  }

  return response.json();
};

export const authAPI = {
  login: async (email, password) => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: { email, password },
    });
  },

  staffLogin: async (email, password) => {
    return apiRequest("/auth/staff-login", {
      method: "POST",
      body: { email, password },
    });
  },

  register: async (userData) => {
    const endpoint =
      userData.role === "landlord"
        ? "/auth/register/landlord"
        : "/auth/register/tenant";

    return apiRequest(endpoint, {
      method: "POST",
      body: userData,
    });
  },
};

// Maintenance Services API
export const servicesAPI = {
  // Get service categories
  getCategories: async () => {
    return apiRequest("/services/categories");
  },

  // Get service providers for a property
  getPropertyProviders: async (propertyId) => {
    return apiRequest(`/services/property/${propertyId}/providers`);
  },

  // Submit service request
  submitRequest: async (data) => {
    return apiRequest("/services/request", {
      method: "POST",
      body: data,
    });
  },

  // Get service requests for user
  getRequests: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/services/requests?${queryString}`);
  },

  // Update service request status (landlord only)
  updateRequestStatus: async (requestId, data) => {
    return apiRequest(`/services/request/${requestId}/status`, {
      method: "PATCH",
      body: data,
    });
  },

  // Add service provider to property (landlord only)
  addProviderToProperty: async (propertyId, data) => {
    return apiRequest(`/services/property/${propertyId}/providers`, {
      method: "POST",
      body: data,
    });
  },

  // Get properties for current user
  getProperties: async () => {
    return apiRequest("/services/properties");
  },
};

// Properties API (if you don't have one already)
export const propertiesAPI = {
  getMyProperties: async () => {
    return apiRequest("/properties/my-properties");
  },

  createProperty: async (data) => {
    return apiRequest("/properties", {
      method: "POST",
      body: data,
    });
  },

  updateProperty: async (propertyId, data) => {
    return apiRequest(`/properties/${propertyId}`, {
      method: "PUT",
      body: data,
    });
  },
};
