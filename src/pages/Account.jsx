import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const Account = () => {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    bio: "",
    role: "",
    company: "",
    emergencyContact: "",
    emergencyPhone: "",
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
  });

  const [profileImage, setProfileImage] = useState("");

  // Mock activity data specific to rent management
  const [activityLog] = useState([
    {
      id: 1,
      action: "Rent payment received - Property #123",
      date: "2024-01-15 14:30",
      type: "payment",
    },
    {
      id: 2,
      action: "Maintenance request submitted - Unit 4B",
      date: "2024-01-14 11:15",
      type: "maintenance",
    },
    {
      id: 3,
      action: "Lease agreement signed - New tenant",
      date: "2024-01-10 09:45",
      type: "lease",
    },
    {
      id: 4,
      action: "Property inspection completed - 123 Main St",
      date: "2024-01-08 16:20",
      type: "inspection",
    },
    {
      id: 5,
      action: "Rent receipt generated - January 2024",
      date: "2024-01-05 13:10",
      type: "receipt",
    },
  ]);

  // Initialize form data with user info from AuthContext
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "Denaé",
        email: user.email || "user@example.com",
        phone: user.phone || "+1 (555) 123-4567",
        address: user.address || "123 Main Street, Apt 4B",
        city: user.city || "New York",
        state: user.state || "NY",
        zipCode: user.zipCode || "10001",
        bio:
          user.bio ||
          "Property manager with 5+ years of experience in residential property management.",
        role: user.role || "Property Manager",
        company: user.company || "Prime Properties Management",
        emergencyContact: user.emergencyContact || "John Smith",
        emergencyPhone: user.emergencyPhone || "+1 (555) 987-6543",
      });
      setProfileImage(
        user.profileImage ||
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
      );
      setSecurityData((prev) => ({
        ...prev,
        twoFactorEnabled: user.twoFactorEnabled || false,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSecurityChange = (e) => {
    setSecurityData({
      ...securityData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        // In a real app, you would upload this to your server
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await updateProfile(formData);
      setIsEditing(false);
      // Show success message
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Handle password change logic
      setSecurityData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        twoFactorEnabled: securityData.twoFactorEnabled,
      });
      // Show success message
    } catch (error) {
      console.error("Error updating security settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTwoFactor = () => {
    setSecurityData((prev) => ({
      ...prev,
      twoFactorEnabled: !prev.twoFactorEnabled,
    }));
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "activity", label: "Activity", icon: "📊" },
  ];

  // Rent management specific stats
  const userStats = [
    { label: "Managed Properties", value: "12", icon: "🏠" },
    { label: "Active Tenants", value: "45", icon: "👥" },
    { label: "This Month's Rent", value: "$28,500", icon: "💰" },
    { label: "Maintenance Requests", value: "3", icon: "🔧" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Account Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your property management account and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-secondary-dark-bg rounded-lg shadow-md p-6 sticky top-8">
              {/* Profile Summary */}
              <div className="text-center mb-6">
                <div className="relative inline-block mb-4">
                  <img
                    className="w-20 h-20 rounded-full mx-auto border-4 border-white dark:border-gray-800 shadow-lg"
                    src={profileImage}
                    alt="Profile"
                  />
                  <button
                    onClick={triggerFileInput}
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {formData.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formData.role}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {formData.company}
                </p>
                <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Active
                </div>
              </div>

              {/* Rent Management Stats */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Quick Stats
                </h4>
                <div className="space-y-3">
                  {userStats.map((stat, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{stat.icon}</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {stat.label}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white dark:bg-secondary-dark-bg rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Property Manager Profile
                    </h2>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Role
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                      >
                        <option value="Property Manager">
                          Property Manager
                        </option>
                        <option value="Landlord">Landlord</option>
                        <option value="Real Estate Agent">
                          Real Estate Agent
                        </option>
                        <option value="Administrator">Administrator</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Emergency Contact Section */}
                  <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Emergency Contact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Emergency Contact Name
                        </label>
                        <input
                          type="text"
                          name="emergencyContact"
                          value={formData.emergencyContact}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Emergency Contact Phone
                        </label>
                        <input
                          type="tel"
                          name="emergencyPhone"
                          value={formData.emergencyPhone}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Professional Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                      placeholder="Describe your property management experience and specialties..."
                    />
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isLoading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Security Tab - Same as before but with rent management context */}
            {activeTab === "security" && (
              <div className="bg-white dark:bg-secondary-dark-bg rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200 dark:border-gray-600">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Security Settings
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Protect your property management account and sensitive data
                  </p>
                </div>

                <div className="p-6">
                  {/* Password Change */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Change Password
                    </h3>
                    <form
                      onSubmit={handleSecuritySubmit}
                      className="space-y-4 max-w-md"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={securityData.currentPassword}
                          onChange={handleSecurityChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={securityData.newPassword}
                          onChange={handleSecurityChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={securityData.confirmPassword}
                          onChange={handleSecurityChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isLoading ? "Updating..." : "Update Password"}
                      </button>
                    </form>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          Two-Factor Authentication
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Add an extra layer of security to protect tenant and
                          property data
                        </p>
                      </div>
                      <button
                        onClick={toggleTwoFactor}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          securityData.twoFactorEnabled
                            ? "bg-blue-600"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            securityData.twoFactorEnabled
                              ? "translate-x-5"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Tab - Rent management specific activities */}
            {activeTab === "activity" && (
              <div className="bg-white dark:bg-secondary-dark-bg rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200 dark:border-gray-600">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Property Management Activity
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Recent actions and events in your property management
                    account
                  </p>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {activityLog.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            activity.type === "payment"
                              ? "bg-green-100 dark:bg-green-900"
                              : activity.type === "maintenance"
                              ? "bg-yellow-100 dark:bg-yellow-900"
                              : activity.type === "lease"
                              ? "bg-blue-100 dark:bg-blue-900"
                              : activity.type === "inspection"
                              ? "bg-purple-100 dark:bg-purple-900"
                              : "bg-gray-100 dark:bg-gray-900"
                          }`}
                        >
                          <span className="text-sm">
                            {activity.type === "payment"
                              ? "💰"
                              : activity.type === "maintenance"
                              ? "🔧"
                              : activity.type === "lease"
                              ? "📝"
                              : activity.type === "inspection"
                              ? "🔍"
                              : "🧾"}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {activity.action}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {activity.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
