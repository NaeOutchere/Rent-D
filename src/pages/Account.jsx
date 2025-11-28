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

  // Role-specific configurations
  const roleConfigs = {
    tenant: {
      color: "green",
      displayName: "Tenant",
      stats: [
        { label: "Current Rent", value: "$1,200", icon: "💰" },
        { label: "Lease Ends", value: "Jun 2024", icon: "📅" },
        { label: "Maintenance Requests", value: "2", icon: "🔧" },
        { label: "Properties Rented", value: "1", icon: "🏠" },
      ],
      tabs: [
        { id: "profile", label: "Profile", icon: "👤" },
        { id: "lease", label: "Lease Info", icon: "📝" },
        { id: "wallet", label: "Payment Wallet", icon: "💳" },
        { id: "maintenance", label: "Maintenance", icon: "🔧" },
        { id: "security", label: "Security", icon: "🔒" },
      ],
    },
    landlord: {
      color: "blue",
      displayName: "Landlord",
      stats: [
        { label: "Properties", value: "8", icon: "🏠" },
        { label: "Active Tenants", value: "12", icon: "👥" },
        { label: "Monthly Revenue", value: "$15,400", icon: "💰" },
        { label: "Vacant Units", value: "2", icon: "🔑" },
      ],
      tabs: [
        { id: "profile", label: "Profile", icon: "👤" },
        { id: "portfolio", label: "Portfolio", icon: "📊" },
        { id: "financial", label: "Financial", icon: "💰" },
        { id: "security", label: "Security", icon: "🔒" },
      ],
    },
    admin: {
      color: "purple",
      displayName: "Administrator",
      stats: [
        { label: "Total Users", value: "156", icon: "👥" },
        { label: "Active Properties", value: "89", icon: "🏠" },
        { label: "Pending Approvals", value: "12", icon: "⏳" },
        { label: "System Health", value: "100%", icon: "💚" },
      ],
      tabs: [
        { id: "profile", label: "Profile", icon: "👤" },
        { id: "dashboard", label: "Dashboard", icon: "📊" },
        { id: "users", label: "User Management", icon: "👥" },
        { id: "reports", label: "Reports", icon: "📈" },
        { id: "security", label: "Security", icon: "🔒" },
      ],
    },
    tech_support: {
      color: "orange",
      displayName: "Tech Support",
      stats: [
        { label: "Assigned Tickets", value: "8", icon: "📋" },
        { label: "Resolved Issues", value: "24", icon: "✅" },
        { label: "Active Systems", value: "15", icon: "🖥️" },
        { label: "Satisfaction Rate", value: "98%", icon: "⭐" },
      ],
      tabs: [
        { id: "profile", label: "Profile", icon: "👤" },
        { id: "tickets", label: "Support Tickets", icon: "📋" },
        { id: "systems", label: "Systems", icon: "🖥️" },
        { id: "reports", label: "Reports", icon: "📊" },
        { id: "security", label: "Security", icon: "🔒" },
      ],
    },
    tech_admin: {
      color: "red",
      displayName: "Tech Admin",
      stats: [
        { label: "Managed Systems", value: "25", icon: "🖥️" },
        { label: "Active Users", value: "1,234", icon: "👥" },
        { label: "System Uptime", value: "99.9%", icon: "📈" },
        { label: "Security Score", value: "A+", icon: "🛡️" },
      ],
      tabs: [
        { id: "profile", label: "Profile", icon: "👤" },
        { id: "systems", label: "Systems", icon: "🖥️" },
        { id: "security", label: "Security", icon: "🛡️" },
        { id: "analytics", label: "Analytics", icon: "📊" },
        { id: "settings", label: "Settings", icon: "⚙️" },
      ],
    },
    ceo: {
      color: "gold",
      displayName: "CEO",
      stats: [
        { label: "Total Revenue", value: "$2.8M", icon: "💰" },
        { label: "Company Growth", value: "+24%", icon: "📈" },
        { label: "Team Members", value: "45", icon: "👥" },
        { label: "Client Satisfaction", value: "96%", icon: "⭐" },
      ],
      tabs: [
        { id: "profile", label: "Profile", icon: "👤" },
        { id: "overview", label: "Company Overview", icon: "🏢" },
        { id: "financial", label: "Financial", icon: "💰" },
        { id: "team", label: "Team Management", icon: "👥" },
        { id: "strategy", label: "Strategy", icon: "🎯" },
      ],
    },
    support: {
      color: "teal",
      displayName: "Support Staff",
      stats: [
        { label: "Open Tickets", value: "15", icon: "📋" },
        { label: "Resolved Today", value: "8", icon: "✅" },
        { label: "Customer Rating", value: "4.8/5", icon: "⭐" },
        { label: "Response Time", value: "2.3h", icon: "⏱️" },
      ],
      tabs: [
        { id: "profile", label: "Profile", icon: "👤" },
        { id: "tickets", label: "Support Tickets", icon: "📋" },
        { id: "customers", label: "Customers", icon: "👥" },
        { id: "reports", label: "Reports", icon: "📊" },
        { id: "security", label: "Security", icon: "🔒" },
      ],
    },
  };

  // Mock data for different sections
  const mockLeaseData = {
    document: "https://example.com/lease-agreement.pdf",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    rentAmount: 1200,
    securityDeposit: 1200,
    status: "Active",
  };

  const mockWalletData = {
    cards: [
      { id: 1, last4: "4242", brand: "Visa", expiry: "12/25", isDefault: true },
      {
        id: 2,
        last4: "8888",
        brand: "Mastercard",
        expiry: "08/24",
        isDefault: false,
      },
    ],
    transactions: [
      {
        id: 1,
        date: "2024-01-15",
        amount: 1200,
        description: "January Rent",
        status: "Completed",
      },
      {
        id: 2,
        date: "2024-01-10",
        amount: 150,
        description: "Maintenance Fee",
        status: "Completed",
      },
    ],
  };

  const mockMaintenanceRequests = [
    {
      id: 1,
      date: "2024-01-15",
      issue: "Leaky Faucet",
      status: "Completed",
      priority: "Medium",
    },
    {
      id: 2,
      date: "2024-01-10",
      issue: "AC Not Working",
      status: "In Progress",
      priority: "High",
    },
    {
      id: 3,
      date: "2024-01-05",
      issue: "Broken Lock",
      status: "Completed",
      priority: "High",
    },
  ];

  const mockPortfolioData = {
    properties: [
      {
        id: 1,
        address: "123 Main St",
        tenants: 3,
        occupancy: "100%",
        monthlyRent: 3600,
      },
      {
        id: 2,
        address: "456 Oak Ave",
        tenants: 2,
        occupancy: "100%",
        monthlyRent: 2800,
      },
      {
        id: 3,
        address: "789 Pine Rd",
        tenants: 0,
        occupancy: "0%",
        monthlyRent: 2200,
      },
    ],
    financials: {
      expectedMonthly: 15400,
      actualMonthly: 14800,
      expectedYearly: 184800,
      actualYearly: 165600,
    },
  };

  const mockSupportTickets = [
    {
      id: 1,
      title: "Login Issue",
      status: "Open",
      priority: "High",
      assignedTo: "You",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      title: "Payment Processing",
      status: "In Progress",
      priority: "Medium",
      assignedTo: "Team",
      createdAt: "2024-01-14",
    },
    {
      id: 3,
      title: "System Slow",
      status: "Resolved",
      priority: "Low",
      assignedTo: "You",
      createdAt: "2024-01-10",
    },
  ];

  const mockSystemData = {
    servers: [
      { name: "Web Server", status: "Online", cpu: "45%", memory: "62%" },
      { name: "Database", status: "Online", cpu: "28%", memory: "78%" },
      { name: "API Gateway", status: "Online", cpu: "32%", memory: "45%" },
    ],
    performance: {
      uptime: "99.9%",
      responseTime: "128ms",
      errorRate: "0.2%",
    },
  };

  // Get current role config
  const getRoleConfig = () => {
    if (!user || !user.role) {
      return roleConfigs.tenant;
    }

    const role = user.role.toLowerCase();
    return roleConfigs[role] || roleConfigs.tenant;
  };

  const currentConfig = getRoleConfig();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
        bio: user.bio || getDefaultBio(),
        role: user.role || "",
        company: user.company || getDefaultCompany(),
        emergencyContact: user.emergencyContact || "",
        emergencyPhone: user.emergencyPhone || "",
      });
      setProfileImage(
        user.avatar ||
          user.profileImage ||
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
      );
    }
  }, [user]);

  const getDefaultBio = () => {
    switch (user?.role?.toLowerCase()) {
      case "landlord":
        return "Property owner with extensive experience in real estate management.";
      case "admin":
        return "System administrator with full platform management capabilities.";
      case "tech_support":
        return "Technical support specialist providing system assistance and troubleshooting.";
      case "tech_admin":
        return "Technical administrator managing system infrastructure and security.";
      case "ceo":
        return "Chief Executive Officer leading company strategy and operations.";
      case "support":
        return "Customer support specialist dedicated to client satisfaction.";
      default:
        return "Responsible tenant with excellent rental history.";
    }
  };

  const getDefaultCompany = () => {
    switch (user?.role?.toLowerCase()) {
      case "landlord":
        return "Elite Properties Group";
      case "admin":
      case "tech_admin":
      case "ceo":
      case "support":
      case "tech_support":
        return "RentEase Platform";
      default:
        return "N/A";
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSecurityChange = (e) => {
    setSecurityData({ ...securityData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsEditing(false);
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSecurityData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        twoFactorEnabled: securityData.twoFactorEnabled,
      });
    } catch (error) {
      console.error("Error updating security settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Please log in to view your account</div>
      </div>
    );
  }

  const getRoleBadge = () => {
    const colorClasses = {
      tenant: "bg-green-100 text-green-800 border-green-200",
      landlord: "bg-blue-100 text-blue-800 border-blue-200",
      admin: "bg-purple-100 text-purple-800 border-purple-200",
      tech_support: "bg-orange-100 text-orange-800 border-orange-200",
      tech_admin: "bg-red-100 text-red-800 border-red-200",
      ceo: "bg-yellow-100 text-yellow-800 border-yellow-200",
      support: "bg-teal-100 text-teal-800 border-teal-200",
    };

    const role = user?.role?.toLowerCase() || "tenant";
    return colorClasses[role] || colorClasses.tenant;
  };

  const getRoleDisplayName = () =>
    currentConfig.displayName || user.role || "User";

  // Render specific tab content based on role and active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "lease":
        return <LeaseInfoSection data={mockLeaseData} />;
      case "wallet":
        return <WalletSection data={mockWalletData} />;
      case "maintenance":
        return <MaintenanceSection data={mockMaintenanceRequests} />;
      case "portfolio":
        return <PortfolioSection data={mockPortfolioData} />;
      case "financial":
        return <FinancialSection data={mockPortfolioData.financials} />;
      case "tickets":
        return <SupportTicketsSection data={mockSupportTickets} />;
      case "systems":
        return <SystemsSection data={mockSystemData} />;
      case "reports":
        return <ReportsSection role={user.role} />;
      case "dashboard":
        return <AdminDashboardSection />;
      case "users":
        return <UserManagementSection />;
      case "overview":
        return <CompanyOverviewSection />;
      case "team":
        return <TeamManagementSection />;
      case "strategy":
        return <StrategySection />;
      case "analytics":
        return <AnalyticsSection />;
      case "settings":
        return <SystemSettingsSection />;
      case "customers":
        return <CustomersSection />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadge()}`}
        >
          {getRoleDisplayName()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-8">
            {/* Profile Summary */}
            <div className="text-center mb-6">
              <div className="relative inline-block mb-4">
                <img
                  className="w-20 h-20 rounded-full mx-auto border-4 border-white shadow-lg"
                  src={profileImage}
                  alt="Profile"
                />
                <button
                  onClick={triggerFileInput}
                  className="absolute bottom-0 right-0 bg-[#2b4354] text-white p-2 rounded-full shadow-lg hover:bg-[#3c5a6a] transition-colors"
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
              <h3 className="font-semibold text-gray-900">{formData.name}</h3>
              <p className="text-sm text-gray-500">{getRoleDisplayName()}</p>
              <p className="text-xs text-gray-400 mt-1">{formData.company}</p>
              <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                {user.isVerified ? "Verified" : "Active"}
              </div>
            </div>

            {/* Role-specific Stats */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Quick Stats
              </h4>
              <div className="space-y-3">
                {currentConfig.stats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{stat.icon}</span>
                      <span className="text-xs text-gray-600">
                        {stat.label}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Role-specific Navigation */}
            <nav className="space-y-2">
              {currentConfig.tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center space-x-3 ${
                    activeTab === tab.id
                      ? "bg-[#2b4354] text-white"
                      : "text-gray-600 hover:bg-gray-50"
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
            <div className="bg-white rounded-2xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {getRoleDisplayName()} Profile
                  </h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 bg-[#2b4354] text-white rounded-xl hover:bg-[#3c5a6a] transition-colors shadow-sm"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
              <ProfileForm
                formData={formData}
                isEditing={isEditing}
                isLoading={isLoading}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                setIsEditing={setIsEditing}
                user={user}
              />
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="bg-white rounded-2xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Security Settings
                </h2>
              </div>
              <SecurityForm
                securityData={securityData}
                isLoading={isLoading}
                handleSecurityChange={handleSecurityChange}
                handleSecuritySubmit={handleSecuritySubmit}
              />
            </div>
          )}

          {/* Role-specific Tabs */}
          {!["profile", "security"].includes(activeTab) && renderTabContent()}
        </div>
      </div>
    </div>
  );
};

// Component for Profile Form
const ProfileForm = ({
  formData,
  isEditing,
  isLoading,
  handleChange,
  handleSubmit,
  setIsEditing,
  user,
}) => (
  <form onSubmit={handleSubmit} className="p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b4354] bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b4354] bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b4354] bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>
      {user?.role?.toLowerCase() !== "tenant" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b4354] bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
      )}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b4354] bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          City
        </label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b4354] bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          State
        </label>
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b4354] bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ZIP Code
        </label>
        <input
          type="text"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b4354] bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>
    </div>
    {user?.role?.toLowerCase() === "tenant" && (
      <div className="mb-6 p-4 bg-blue-50 rounded-xl">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Emergency Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Contact Name
            </label>
            <input
              type="text"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b4354] bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Contact Phone
            </label>
            <input
              type="tel"
              name="emergencyPhone"
              value={formData.emergencyPhone}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b4354] bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    )}
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {user?.role?.toLowerCase() === "tenant"
          ? "Personal Bio"
          : "Professional Bio"}
      </label>
      <textarea
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        disabled={!isEditing}
        rows="4"
        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b4354] bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
        placeholder={
          user?.role?.toLowerCase() === "tenant"
            ? "Tell us about yourself..."
            : "Describe your professional background..."
        }
      />
    </div>
    {isEditing && (
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-[#2b4354] text-white rounded-xl hover:bg-[#3c5a6a] focus:outline-none focus:ring-2 focus:ring-[#2b4354] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    )}
  </form>
);

// Component for Security Form
const SecurityForm = ({
  securityData,
  isLoading,
  handleSecurityChange,
  handleSecuritySubmit,
}) => (
  <div className="p-6">
    <form onSubmit={handleSecuritySubmit} className="space-y-6 max-w-md">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Password
        </label>
        <input
          type="password"
          name="currentPassword"
          value={securityData.currentPassword}
          onChange={handleSecurityChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b4354] bg-white text-gray-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          New Password
        </label>
        <input
          type="password"
          name="newPassword"
          value={securityData.newPassword}
          onChange={handleSecurityChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b4354] bg-white text-gray-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm New Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={securityData.confirmPassword}
          onChange={handleSecurityChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b4354] bg-white text-gray-900"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="px-6 py-2 bg-[#2b4354] text-white rounded-xl hover:bg-[#3c5a6a] focus:outline-none focus:ring-2 focus:ring-[#2b4354] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "Updating..." : "Update Password"}
      </button>
    </form>
  </div>
);

// Tenant Components
const LeaseInfoSection = ({ data }) => (
  <div className="bg-white rounded-2xl border border-gray-200">
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900">Lease Agreement</h2>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-blue-50 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-2">Lease Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Start Date:</span>
              <span className="font-medium">{data.startDate}</span>
            </div>
            <div className="flex justify-between">
              <span>End Date:</span>
              <span className="font-medium">{data.endDate}</span>
            </div>
            <div className="flex justify-between">
              <span>Monthly Rent:</span>
              <span className="font-medium">${data.rentAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Security Deposit:</span>
              <span className="font-medium">${data.securityDeposit}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-medium text-green-600">{data.status}</span>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-4">Lease Document</h3>
          <div className="text-center">
            <div className="text-4xl mb-2">📄</div>
            <p className="text-sm text-gray-600 mb-4">
              Your lease agreement is ready for review
            </p>
            <a
              href={data.document}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-[#2b4354] text-white rounded-lg hover:bg-[#3c5a6a] transition-colors"
            >
              View Lease Agreement
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const WalletSection = ({ data }) => (
  <div className="bg-white rounded-2xl border border-gray-200">
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900">Payment Wallet</h2>
    </div>
    <div className="p-6">
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Payment Methods
        </h3>
        <div className="space-y-4">
          {data.cards.map((card) => (
            <div
              key={card.id}
              className="p-4 border border-gray-200 rounded-xl flex justify-between items-center"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                  {card.brand === "Visa" ? "💳" : "🏦"}
                </div>
                <div>
                  <p className="font-medium">
                    {card.brand} •••• {card.last4}
                  </p>
                  <p className="text-sm text-gray-500">Expires {card.expiry}</p>
                </div>
              </div>
              {card.isDefault && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                  Default
                </span>
              )}
            </div>
          ))}
        </div>
        <button className="mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          + Add Payment Method
        </button>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Transactions
        </h3>
        <div className="space-y-3">
          {data.transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex justify-between items-center p-3 border border-gray-200 rounded-lg"
            >
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-gray-500">{transaction.date}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${transaction.amount}</p>
                <p className="text-sm text-green-600">{transaction.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const MaintenanceSection = ({ data }) => (
  <div className="bg-white rounded-2xl border border-gray-200">
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900">
        Maintenance History
      </h2>
    </div>
    <div className="p-6">
      <div className="space-y-4">
        {data.map((request) => (
          <div
            key={request.id}
            className="p-4 border border-gray-200 rounded-xl"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900">{request.issue}</h3>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  request.status === "Completed"
                    ? "bg-green-100 text-green-800"
                    : request.status === "In Progress"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {request.status}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Submitted: {request.date}</span>
              <span>
                Priority:{" "}
                <span
                  className={
                    request.priority === "High"
                      ? "text-red-600"
                      : request.priority === "Medium"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }
                >
                  {request.priority}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Landlord Components
const PortfolioSection = ({ data }) => (
  <div className="bg-white rounded-2xl border border-gray-200">
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900">
        Property Portfolio
      </h2>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-4 bg-blue-50 rounded-xl text-center">
          <div className="text-2xl font-bold text-blue-600">
            {data.properties.length}
          </div>
          <div className="text-sm text-gray-600">Total Properties</div>
        </div>
        <div className="p-4 bg-green-50 rounded-xl text-center">
          <div className="text-2xl font-bold text-green-600">
            ${data.financials.expectedMonthly.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Expected Monthly</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-xl text-center">
          <div className="text-2xl font-bold text-purple-600">83%</div>
          <div className="text-sm text-gray-600">Portfolio Occupancy</div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Property Details
      </h3>
      <div className="space-y-4">
        {data.properties.map((property) => (
          <div
            key={property.id}
            className="p-4 border border-gray-200 rounded-xl"
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold">{property.address}</h4>
                <p className="text-sm text-gray-600">
                  {property.tenants} tenants • ${property.monthlyRent}/month
                </p>
              </div>
              <div className="text-right">
                <div
                  className={`px-2 py-1 rounded text-xs ${
                    property.occupancy === "100%"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {property.occupancy} Occupied
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const FinancialSection = ({ data }) => (
  <div className="bg-white rounded-2xl border border-gray-200">
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900">
        Financial Overview
      </h2>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-4 bg-green-50 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-2">Monthly Revenue</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Expected:</span>
              <span className="font-medium text-green-600">
                ${data.expectedMonthly.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Actual:</span>
              <span className="font-medium text-blue-600">
                ${data.actualMonthly.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Difference:</span>
              <span
                className={`font-medium ${
                  data.actualMonthly >= data.expectedMonthly
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                ${(data.actualMonthly - data.expectedMonthly).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <div className="p-4 bg-blue-50 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-2">Yearly Revenue</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Expected:</span>
              <span className="font-medium text-green-600">
                ${data.expectedYearly.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Actual:</span>
              <span className="font-medium text-blue-600">
                ${data.actualYearly.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-xl">
        <h3 className="font-semibold text-gray-900 mb-4">Revenue Trend</h3>
        <div className="h-32 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500">
          Revenue Chart Visualization
        </div>
      </div>
    </div>
  </div>
);

// Tech/Support Components
const SupportTicketsSection = ({ data }) => (
  <div className="bg-white rounded-2xl border border-gray-200">
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900">Support Tickets</h2>
    </div>
    <div className="p-6">
      <div className="space-y-4">
        {data.map((ticket) => (
          <div
            key={ticket.id}
            className="p-4 border border-gray-200 rounded-xl"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900">{ticket.title}</h3>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  ticket.status === "Open"
                    ? "bg-red-100 text-red-800"
                    : ticket.status === "In Progress"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {ticket.status}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                Priority:{" "}
                <span
                  className={
                    ticket.priority === "High"
                      ? "text-red-600"
                      : ticket.priority === "Medium"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }
                >
                  {ticket.priority}
                </span>
              </span>
              <span>Assigned to: {ticket.assignedTo}</span>
              <span>Created: {ticket.createdAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SystemsSection = ({ data }) => (
  <div className="bg-white rounded-2xl border border-gray-200">
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900">System Status</h2>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-green-50 rounded-xl text-center">
          <div className="text-2xl font-bold text-green-600">
            {data.performance.uptime}
          </div>
          <div className="text-sm text-gray-600">Uptime</div>
        </div>
        <div className="p-4 bg-blue-50 rounded-xl text-center">
          <div className="text-2xl font-bold text-blue-600">
            {data.performance.responseTime}
          </div>
          <div className="text-sm text-gray-600">Avg Response Time</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-xl text-center">
          <div className="text-2xl font-bold text-purple-600">
            {data.performance.errorRate}
          </div>
          <div className="text-sm text-gray-600">Error Rate</div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Server Status
      </h3>
      <div className="space-y-3">
        {data.servers.map((server) => (
          <div
            key={server.name}
            className="p-4 border border-gray-200 rounded-xl"
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold">{server.name}</h4>
                <p className="text-sm text-gray-600">
                  CPU: {server.cpu} • Memory: {server.memory}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  server.status === "Online"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {server.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Placeholder components for other sections
const ReportsSection = ({ role }) => (
  <div className="bg-white rounded-2xl border border-gray-200">
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900">
        Reports & Analytics
      </h2>
    </div>
    <div className="p-6">
      <div className="text-center py-8">
        <div className="text-4xl mb-4">📊</div>
        <p className="text-gray-600">
          Comprehensive reports and analytics for {role} role
        </p>
      </div>
    </div>
  </div>
);

const AdminDashboardSection = () => (
  <div className="bg-white rounded-2xl border border-gray-200">
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900">Admin Dashboard</h2>
    </div>
    <div className="p-6">
      <div className="text-center py-8">
        <div className="text-4xl mb-4">👥</div>
        <p className="text-gray-600">
          Administrative controls and system overview
        </p>
      </div>
    </div>
  </div>
);

const UserManagementSection = () => (
  <div className="bg-white rounded-2xl border border-gray-200">
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
    </div>
    <div className="p-6">
      <div className="text-center py-8">
        <div className="text-4xl mb-4">🔧</div>
        <p className="text-gray-600">User account management and permissions</p>
      </div>
    </div>
  </div>
);

// Add other placeholder components similarly...
const CompanyOverviewSection = () => (
  <PlaceholderSection title="Company Overview" icon="🏢" />
);
const TeamManagementSection = () => (
  <PlaceholderSection title="Team Management" icon="👥" />
);
const StrategySection = () => <PlaceholderSection title="Strategy" icon="🎯" />;
const AnalyticsSection = () => (
  <PlaceholderSection title="Analytics" icon="📈" />
);
const SystemSettingsSection = () => (
  <PlaceholderSection title="System Settings" icon="⚙️" />
);
const CustomersSection = () => (
  <PlaceholderSection title="Customers" icon="👥" />
);

const PlaceholderSection = ({ title, icon }) => (
  <div className="bg-white rounded-2xl border border-gray-200">
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
    </div>
    <div className="p-6">
      <div className="text-center py-8">
        <div className="text-4xl mb-4">{icon}</div>
        <p className="text-gray-600">{title} content and functionality</p>
      </div>
    </div>
  </div>
);

export default Account;
