// services/api.js
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error ||
          errorData.message ||
          `Login failed: ${response.status}`
      );
    }

    return response.json();
  },

  staffLogin: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/staff-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error ||
          errorData.message ||
          `Staff login failed: ${response.status}`
      );
    }

    return response.json();
  },

  register: async (userData) => {
    // Determine the endpoint based on role
    const endpoint =
      userData.role === "landlord"
        ? "/auth/register/landlord"
        : "/auth/register/tenant";

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error ||
          errorData.message ||
          `Registration failed: ${response.status}`
      );
    }

    return response.json();
  },
};
