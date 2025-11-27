import React, { useState, useEffect } from "react";

const Rentees = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterProperty, setFilterProperty] = useState("");
  const [editingTenant, setEditingTenant] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [viewingTenant, setViewingTenant] = useState(null);
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [showRentAdjustment, setShowRentAdjustment] = useState(false);
  const [selectedTenantForRentAdjustment, setSelectedTenantForRentAdjustment] =
    useState(null);
  const [rentAdjustmentForm, setRentAdjustmentForm] = useState({
    type: "increase",
    amount: "",
    percentage: "",
    effectiveDate: new Date().toISOString().split("T")[0],
    reason: "",
    freeMonths: 1,
    freeMonthDescription: "",
  });

  const [newTenant, setNewTenant] = useState({
    name: "",
    email: "",
    phone: "",
    property: "",
    unit: "",
    rentAmount: "",
    leaseStart: new Date().toISOString().split("T")[0],
    leaseEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      .toISOString()
      .split("T")[0],
    status: "Active",
    dateOfBirth: "",
    ssn: "",
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
      email: "",
    },
    employment: {
      employer: "",
      position: "",
      salary: "",
      startDate: "",
    },
    coSigner: {
      name: "",
      email: "",
      phone: "",
      relationship: "",
    },
    pets: [],
    vehicles: [],
    notes: "",
  });

  const [userRole, setUserRole] = useState("landlord");

  // Mock data for tenants
  const mockTenants = [
    {
      id: 1,
      tenantId: "T-001",
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      phone: "+1 (555) 123-4567",
      property: "Sunset Apartments",
      unit: "A101",
      rentAmount: 2500,
      leaseStart: "2024-01-01",
      leaseEnd: "2024-12-31",
      status: "Active",
      dateOfBirth: "1985-05-15",
      ssn: "XXX-XX-1234",
      emergencyContact: {
        name: "Bob Johnson",
        relationship: "Spouse",
        phone: "+1 (555) 123-4568",
        email: "bob.johnson@example.com",
      },
      employment: {
        employer: "Tech Corp",
        position: "Software Engineer",
        salary: "85000",
        startDate: "2020-03-01",
      },
      coSigner: {
        name: "",
        email: "",
        phone: "",
        relationship: "",
      },
      pets: [
        {
          name: "Max",
          type: "Dog",
          breed: "Golden Retriever",
          weight: "70 lbs",
        },
      ],
      vehicles: [
        {
          make: "Toyota",
          model: "Camry",
          year: "2020",
          color: "Blue",
          licensePlate: "ABC123",
        },
      ],
      notes: "Excellent tenant, always pays on time",
      documents: [
        {
          id: 1,
          name: "Lease Agreement.pdf",
          type: "lease",
          uploadDate: "2024-01-01",
          size: "2.4 MB",
        },
        {
          id: 2,
          name: "ID Verification.pdf",
          type: "id",
          uploadDate: "2023-12-20",
          size: "1.8 MB",
        },
        {
          id: 3,
          name: "Income Verification.pdf",
          type: "income",
          uploadDate: "2023-12-15",
          size: "2.1 MB",
        },
      ],
      paymentHistory: [
        {
          month: "January 2024",
          amount: 2500,
          status: "Paid",
          date: "2024-01-01",
        },
        {
          month: "February 2024",
          amount: 2500,
          status: "Paid",
          date: "2024-02-01",
        },
        {
          month: "March 2024",
          amount: 2500,
          status: "Paid",
          date: "2024-03-01",
        },
      ],
      avatar: "AJ",
    },
    {
      id: 2,
      tenantId: "T-002",
      name: "Michael Chen",
      email: "michael.chen@example.com",
      phone: "+1 (555) 234-5678",
      property: "Sunset Apartments",
      unit: "A102",
      rentAmount: 2400,
      leaseStart: "2024-02-01",
      leaseEnd: "2025-01-31",
      status: "Active",
      dateOfBirth: "1990-08-22",
      ssn: "XXX-XX-5678",
      emergencyContact: {
        name: "Sarah Chen",
        relationship: "Spouse",
        phone: "+1 (555) 234-5679",
        email: "sarah.chen@example.com",
      },
      employment: {
        employer: "Finance Corp",
        position: "Analyst",
        salary: "75000",
        startDate: "2019-06-15",
      },
      coSigner: {
        name: "",
        email: "",
        phone: "",
        relationship: "",
      },
      pets: [],
      vehicles: [
        {
          make: "Honda",
          model: "Civic",
          year: "2019",
          color: "White",
          licensePlate: "DEF456",
        },
      ],
      notes: "Quiet tenant, no issues",
      documents: [
        {
          id: 1,
          name: "Lease Agreement.pdf",
          type: "lease",
          uploadDate: "2024-02-01",
          size: "2.3 MB",
        },
        {
          id: 2,
          name: "ID Verification.pdf",
          type: "id",
          uploadDate: "2024-01-25",
          size: "1.9 MB",
        },
      ],
      paymentHistory: [
        {
          month: "February 2024",
          amount: 2400,
          status: "Paid",
          date: "2024-02-01",
        },
        {
          month: "March 2024",
          amount: 2400,
          status: "Paid",
          date: "2024-03-01",
        },
      ],
      avatar: "MC",
    },
    {
      id: 3,
      tenantId: "T-003",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@example.com",
      phone: "+1 (555) 345-6789",
      property: "Garden Villas",
      unit: "B201",
      rentAmount: 2800,
      leaseStart: "2023-11-01",
      leaseEnd: "2024-10-31",
      status: "Active",
      dateOfBirth: "1988-12-03",
      ssn: "XXX-XX-9012",
      emergencyContact: {
        name: "Carlos Rodriguez",
        relationship: "Spouse",
        phone: "+1 (555) 345-6790",
        email: "carlos.rodriguez@example.com",
      },
      employment: {
        employer: "Design Studio",
        position: "Creative Director",
        salary: "95000",
        startDate: "2018-09-10",
      },
      coSigner: {
        name: "Maria Rodriguez",
        email: "maria.rodriguez@example.com",
        phone: "+1 (555) 345-6791",
        relationship: "Mother",
      },
      pets: [{ name: "Luna", type: "Cat", breed: "Siamese", weight: "8 lbs" }],
      vehicles: [
        {
          make: "BMW",
          model: "X3",
          year: "2021",
          color: "Black",
          licensePlate: "GHI789",
        },
      ],
      notes: "Has one cat, responsible pet owner",
      documents: [
        {
          id: 1,
          name: "Lease Agreement.pdf",
          type: "lease",
          uploadDate: "2023-11-01",
          size: "2.5 MB",
        },
        {
          id: 2,
          name: "ID Verification.pdf",
          type: "id",
          uploadDate: "2023-10-25",
          size: "2.0 MB",
        },
        {
          id: 3,
          name: "Income Verification.pdf",
          type: "income",
          uploadDate: "2023-10-20",
          size: "2.2 MB",
        },
        {
          id: 4,
          name: "Pet Agreement.pdf",
          type: "pet",
          uploadDate: "2023-11-05",
          size: "1.5 MB",
        },
      ],
      paymentHistory: [
        {
          month: "November 2023",
          amount: 2800,
          status: "Paid",
          date: "2023-11-01",
        },
        {
          month: "December 2023",
          amount: 2800,
          status: "Paid",
          date: "2023-12-01",
        },
        {
          month: "January 2024",
          amount: 2800,
          status: "Paid",
          date: "2024-01-01",
        },
        {
          month: "February 2024",
          amount: 2800,
          status: "Paid",
          date: "2024-02-01",
        },
        {
          month: "March 2024",
          amount: 2800,
          status: "Paid",
          date: "2024-03-01",
        },
      ],
      avatar: "ER",
    },
  ];

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true);
        setTimeout(() => {
          setTenants(mockTenants);
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Error fetching tenants:", error);
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Filter tenants function
  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.tenantId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !filterStatus || tenant.status === filterStatus;
    const matchesProperty =
      !filterProperty || tenant.property === filterProperty;

    return matchesSearch && matchesStatus && matchesProperty;
  });

  // Get unique properties and statuses for filters
  const properties = [...new Set(tenants.map((tenant) => tenant.property))];
  const statuses = ["Active", "Pending", "Late", "Inactive"];

  // Edit modal functions
  const handleEdit = (tenant) => {
    setEditingTenant(tenant.id);
    setEditForm({
      ...tenant,
      emergencyContact: tenant.emergencyContact || {
        name: "",
        relationship: "",
        phone: "",
        email: "",
      },
      employment: tenant.employment || {
        employer: "",
        position: "",
        salary: "",
        startDate: "",
      },
      coSigner: tenant.coSigner || {
        name: "",
        email: "",
        phone: "",
        relationship: "",
      },
      pets: tenant.pets || [],
      vehicles: tenant.vehicles || [],
      notes: tenant.notes || "",
    });
  };

  const handleInputChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    setTenants(
      tenants.map((tenant) =>
        tenant.id === editingTenant ? { ...tenant, ...editForm } : tenant
      )
    );
    setEditingTenant(null);
    setEditForm({});
  };

  const handleCancel = () => {
    setEditingTenant(null);
    setEditForm({});
  };

  // Add tenant functions
  const handleAddTenant = () => {
    const newTen = {
      ...newTenant,
      id: tenants.length + 1,
      tenantId: `T-${String(tenants.length + 1).padStart(3, "0")}`,
      emergencyContact: newTenant.emergencyContact || {
        name: "",
        relationship: "",
        phone: "",
        email: "",
      },
      employment: newTenant.employment || {
        employer: "",
        position: "",
        salary: "",
        startDate: "",
      },
      coSigner: newTenant.coSigner || {
        name: "",
        email: "",
        phone: "",
        relationship: "",
      },
      pets: newTenant.pets || [],
      vehicles: newTenant.vehicles || [],
      documents: [],
      paymentHistory: [],
      avatar: newTenant.name
        .split(" ")
        .map((n) => n[0])
        .join(""),
      rentAmount: parseInt(newTenant.rentAmount),
    };

    setTenants([...tenants, newTen]);
    setShowAddTenant(false);
    setNewTenant({
      name: "",
      email: "",
      phone: "",
      property: "",
      unit: "",
      rentAmount: "",
      leaseStart: new Date().toISOString().split("T")[0],
      leaseEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split("T")[0],
      status: "Active",
      dateOfBirth: "",
      ssn: "",
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
        email: "",
      },
      employment: {
        employer: "",
        position: "",
        salary: "",
        startDate: "",
      },
      coSigner: {
        name: "",
        email: "",
        phone: "",
        relationship: "",
      },
      pets: [],
      vehicles: [],
      notes: "",
    });
  };

  // Rent adjustment functions
  const handleRentAdjustment = (tenant) => {
    setSelectedTenantForRentAdjustment(tenant);
    setRentAdjustmentForm({
      type: "increase",
      amount: "",
      percentage: "",
      effectiveDate: new Date().toISOString().split("T")[0],
      reason: "",
      freeMonths: 1,
      freeMonthDescription: "",
    });
    setShowRentAdjustment(true);
  };

  const handleRentAdjustmentSubmit = () => {
    if (!selectedTenantForRentAdjustment) return;

    const updatedTenants = tenants.map((tenant) => {
      if (tenant.id === selectedTenantForRentAdjustment.id) {
        let newRentAmount = tenant.rentAmount;
        let adjustmentNote = "";

        if (rentAdjustmentForm.type === "increase") {
          if (rentAdjustmentForm.amount) {
            newRentAmount = parseInt(rentAdjustmentForm.amount);
            adjustmentNote = `Rent increased to ${formatCurrency(
              newRentAmount
            )}`;
          } else if (rentAdjustmentForm.percentage) {
            const increase =
              tenant.rentAmount *
              (parseInt(rentAdjustmentForm.percentage) / 100);
            newRentAmount = tenant.rentAmount + increase;
            adjustmentNote = `Rent increased by ${
              rentAdjustmentForm.percentage
            }% to ${formatCurrency(newRentAmount)}`;
          }
        } else if (rentAdjustmentForm.type === "freeMonth") {
          adjustmentNote = `${rentAdjustmentForm.freeMonths} free month(s) granted: ${rentAdjustmentForm.freeMonthDescription}`;
        }

        // Add to payment history or notes
        const updatedPaymentHistory = [...tenant.paymentHistory];
        if (rentAdjustmentForm.type === "freeMonth") {
          for (let i = 0; i < rentAdjustmentForm.freeMonths; i++) {
            const freeMonthDate = new Date();
            freeMonthDate.setMonth(freeMonthDate.getMonth() + i);
            updatedPaymentHistory.push({
              month: freeMonthDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              }),
              amount: 0,
              status: "Free Month",
              date: freeMonthDate.toISOString().split("T")[0],
              note: rentAdjustmentForm.freeMonthDescription,
            });
          }
        }

        return {
          ...tenant,
          rentAmount: newRentAmount,
          paymentHistory: updatedPaymentHistory,
          notes: tenant.notes
            ? `${tenant.notes}\n${adjustmentNote} - ${formatDate(
                rentAdjustmentForm.effectiveDate
              )}`
            : adjustmentNote,
        };
      }
      return tenant;
    });

    setTenants(updatedTenants);
    setShowRentAdjustment(false);
    setSelectedTenantForRentAdjustment(null);
  };

  const handleDelete = (tenantId) => {
    if (window.confirm("Are you sure you want to delete this tenant?")) {
      setTenants(tenants.filter((tenant) => tenant.id !== tenantId));
    }
  };

  // File upload handler
  const handleFileUpload = (tenantId, files) => {
    const newDocuments = Array.from(files).map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      type: "other",
      uploadDate: new Date().toISOString().split("T")[0],
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    }));

    setTenants(
      tenants.map((tenant) =>
        tenant.id === tenantId
          ? { ...tenant, documents: [...tenant.documents, ...newDocuments] }
          : tenant
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Late":
        return "bg-red-100 text-red-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Late":
        return "bg-red-100 text-red-800";
      case "Free Month":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // If user is not a landlord, show access denied
  if (userRole !== "landlord") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            This page is only accessible to landlords.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-main-orange rounded-full animate-spin"></div>
        <p className="text-gray-600">Loading tenant data...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Tenant Management
              </h1>
              <p className="text-gray-600">
                Manage your tenants, leases, and rental payments
              </p>
            </div>
            <button
              onClick={() => setShowAddTenant(true)}
              className="bg-main-orange hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <span>+</span> Add Tenant
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-xl">👥</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Tenants
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {tenants.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-xl">✅</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    tenants.filter((tenant) => tenant.status === "Active")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-xl">💰</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Monthly Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    tenants.reduce((acc, tenant) => acc + tenant.rentAmount, 0)
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 text-xl">⚠️</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Late Payments
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {tenants.filter((tenant) => tenant.status === "Late").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search tenants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none transition-all"
              />
            </div>

            {/* Property Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🏢</span>
              </div>
              <select
                value={filterProperty}
                onChange={(e) => setFilterProperty(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none appearance-none bg-white"
              >
                <option value="">All Properties</option>
                {properties.map((property) => (
                  <option key={property} value={property}>
                    {property}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">📈</span>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none appearance-none bg-white"
              >
                <option value="">All Status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="text-gray-600 text-sm md:text-right">
              {filteredTenants.length} tenant(s) found
            </div>
          </div>
        </div>

        {/* Tenants Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tenant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property & Unit
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lease Information
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rent & Payments
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documents
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTenants.map((tenant) => (
                  <tr
                    key={tenant.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Tenant Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-main-orange rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {tenant.avatar}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {tenant.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {tenant.tenantId}
                          </div>
                          <div className="text-sm text-gray-500">
                            {tenant.email}
                          </div>
                          <div className="text-xs text-gray-500">
                            {tenant.phone}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Property & Unit */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {tenant.property}
                      </div>
                      <div className="text-sm text-gray-500">
                        Unit {tenant.unit}
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(
                          tenant.status
                        )}`}
                      >
                        {tenant.status}
                      </span>
                    </td>

                    {/* Lease Information */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="text-gray-900">
                          Start: {formatDate(tenant.leaseStart)}
                        </div>
                        <div className="text-gray-900">
                          End: {formatDate(tenant.leaseEnd)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {tenant.documents.length} document(s)
                        </div>
                      </div>
                    </td>

                    {/* Rent & Payments */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(tenant.rentAmount)}
                      </div>
                      <div className="text-xs text-gray-500">Monthly</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Last Payment:{" "}
                        {tenant.paymentHistory.length > 0
                          ? formatDate(
                              tenant.paymentHistory[
                                tenant.paymentHistory.length - 1
                              ].date
                            )
                          : "N/A"}
                      </div>
                      {tenant.paymentHistory.length > 0 && (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${getPaymentStatusColor(
                            tenant.paymentHistory[
                              tenant.paymentHistory.length - 1
                            ].status
                          )}`}
                        >
                          {
                            tenant.paymentHistory[
                              tenant.paymentHistory.length - 1
                            ].status
                          }
                        </span>
                      )}
                    </td>

                    {/* Documents */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-2">
                        <div className="text-sm text-gray-900">
                          {tenant.documents.length} files
                        </div>
                        <input
                          type="file"
                          multiple
                          onChange={(e) =>
                            handleFileUpload(tenant.id, e.target.files)
                          }
                          className="text-xs text-gray-500"
                        />
                        <div className="text-xs text-gray-500">
                          Upload new documents
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => setViewingTenant(tenant)}
                          className="text-main-orange hover:text-orange-700 transition-colors text-left"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleEdit(tenant)}
                          className="text-blue-600 hover:text-blue-800 transition-colors text-left"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleRentAdjustment(tenant)}
                          className="text-purple-600 hover:text-purple-800 transition-colors text-left"
                        >
                          Adjust Rent
                        </button>
                        <button
                          onClick={() => handleDelete(tenant.id)}
                          className="text-red-600 hover:text-red-800 transition-colors text-left"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTenants.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No tenants found
              </h3>
              <p className="text-gray-500">
                {searchTerm || filterStatus || filterProperty
                  ? "Try adjusting your search filters"
                  : "No tenants found in the system"}
              </p>
            </div>
          )}
        </div>

        {/* View Tenant Details Modal */}
        {viewingTenant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Tenant Details - {viewingTenant.name}
                </h3>
                <button
                  onClick={() => setViewingTenant(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">
                      Personal Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <p className="text-gray-900">{viewingTenant.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <p className="text-gray-900">{viewingTenant.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <p className="text-gray-900">{viewingTenant.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Tenant ID
                        </label>
                        <p className="text-gray-900">
                          {viewingTenant.tenantId}
                        </p>
                      </div>
                      {viewingTenant.dateOfBirth && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Date of Birth
                          </label>
                          <p className="text-gray-900">
                            {formatDate(viewingTenant.dateOfBirth)}
                          </p>
                        </div>
                      )}
                      {viewingTenant.ssn && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            SSN (Last 4)
                          </label>
                          <p className="text-gray-900">{viewingTenant.ssn}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Lease Information */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">
                      Lease Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Property
                        </label>
                        <p className="text-gray-900">
                          {viewingTenant.property}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Unit
                        </label>
                        <p className="text-gray-900">{viewingTenant.unit}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Lease Start
                        </label>
                        <p className="text-gray-900">
                          {formatDate(viewingTenant.leaseStart)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Lease End
                        </label>
                        <p className="text-gray-900">
                          {formatDate(viewingTenant.leaseEnd)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Financial Information */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">
                      Financial Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Monthly Rent
                        </label>
                        <p className="text-gray-900 text-xl font-bold">
                          {formatCurrency(viewingTenant.rentAmount)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            viewingTenant.status
                          )}`}
                        >
                          {viewingTenant.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">
                      Emergency Contact
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <p className="text-gray-900">
                          {viewingTenant.emergencyContact?.name || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Relationship
                        </label>
                        <p className="text-gray-900">
                          {viewingTenant.emergencyContact?.relationship ||
                            "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <p className="text-gray-900">
                          {viewingTenant.emergencyContact?.phone || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Employment Information */}
                  {viewingTenant.employment?.employer && (
                    <div>
                      <h4 className="text-lg font-semibold mb-4">
                        Employment Information
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Employer
                          </label>
                          <p className="text-gray-900">
                            {viewingTenant.employment.employer}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Position
                          </label>
                          <p className="text-gray-900">
                            {viewingTenant.employment.position}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Salary
                          </label>
                          <p className="text-gray-900">
                            {formatCurrency(viewingTenant.employment.salary)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {viewingTenant.notes && (
                    <div className="md:col-span-2">
                      <h4 className="text-lg font-semibold mb-4">Notes</h4>
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {viewingTenant.notes}
                      </p>
                    </div>
                  )}

                  {/* Documents */}
                  <div className="md:col-span-2">
                    <h4 className="text-lg font-semibold mb-4">Documents</h4>
                    <div className="space-y-2">
                      {viewingTenant.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div>
                            <div className="font-medium text-gray-900">
                              {doc.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Uploaded {formatDate(doc.uploadDate)} • {doc.size}
                            </div>
                          </div>
                          <button className="text-main-orange hover:text-orange-700">
                            Download
                          </button>
                        </div>
                      ))}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          multiple
                          onChange={(e) =>
                            handleFileUpload(viewingTenant.id, e.target.files)
                          }
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer text-main-orange hover:text-orange-700"
                        >
                          + Upload New Documents
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Payment History */}
                  <div className="md:col-span-2">
                    <h4 className="text-lg font-semibold mb-4">
                      Payment History
                    </h4>
                    <div className="space-y-2">
                      {viewingTenant.paymentHistory.map((payment, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div>
                            <div className="font-medium text-gray-900">
                              {payment.month}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatCurrency(payment.amount)} •{" "}
                              {formatDate(payment.date)}
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(
                              payment.status
                            )}`}
                          >
                            {payment.status}
                          </span>
                        </div>
                      ))}
                      {viewingTenant.paymentHistory.length === 0 && (
                        <p className="text-gray-500 text-center py-4">
                          No payment history available
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setViewingTenant(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Edit Tenant Modal */}
        {editingTenant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Edit Tenant
                </h3>
              </div>
              <div className="px-6 py-4 space-y-6">
                {/* Personal Information */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editForm.name || ""}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editForm.email || ""}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        value={editForm.phone || ""}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={editForm.dateOfBirth || ""}
                        onChange={(e) =>
                          handleInputChange("dateOfBirth", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SSN (Last 4)
                      </label>
                      <input
                        type="text"
                        value={editForm.ssn || ""}
                        onChange={(e) =>
                          handleInputChange("ssn", e.target.value)
                        }
                        placeholder="XXX-XX-1234"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Lease Information */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">
                    Lease Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Property
                      </label>
                      <input
                        type="text"
                        value={editForm.property || ""}
                        onChange={(e) =>
                          handleInputChange("property", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit
                      </label>
                      <input
                        type="text"
                        value={editForm.unit || ""}
                        onChange={(e) =>
                          handleInputChange("unit", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monthly Rent
                      </label>
                      <input
                        type="number"
                        value={editForm.rentAmount || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "rentAmount",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={editForm.status || ""}
                        onChange={(e) =>
                          handleInputChange("status", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Late">Late</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lease Start
                      </label>
                      <input
                        type="date"
                        value={editForm.leaseStart || ""}
                        onChange={(e) =>
                          handleInputChange("leaseStart", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lease End
                      </label>
                      <input
                        type="date"
                        value={editForm.leaseEnd || ""}
                        onChange={(e) =>
                          handleInputChange("leaseEnd", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">
                    Emergency Contact
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={editForm.emergencyContact?.name || ""}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "emergencyContact",
                            "name",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Relationship
                      </label>
                      <input
                        type="text"
                        value={editForm.emergencyContact?.relationship || ""}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "emergencyContact",
                            "relationship",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        value={editForm.emergencyContact?.phone || ""}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "emergencyContact",
                            "phone",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editForm.emergencyContact?.email || ""}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "emergencyContact",
                            "email",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Employment Information */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">
                    Employment Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Employer
                      </label>
                      <input
                        type="text"
                        value={editForm.employment?.employer || ""}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "employment",
                            "employer",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Position
                      </label>
                      <input
                        type="text"
                        value={editForm.employment?.position || ""}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "employment",
                            "position",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Salary
                      </label>
                      <input
                        type="number"
                        value={editForm.employment?.salary || ""}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "employment",
                            "salary",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={editForm.employment?.startDate || ""}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "employment",
                            "startDate",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Notes</h4>
                  <textarea
                    value={editForm.notes || ""}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                    placeholder="Additional notes about the tenant..."
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-main-orange border border-transparent rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Add Tenant Modal */}
        {showAddTenant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Add New Tenant
                </h3>
              </div>
              <div className="px-6 py-4 space-y-6">
                {/* Personal Information */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={newTenant.name}
                        onChange={(e) =>
                          setNewTenant({ ...newTenant, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={newTenant.email}
                        onChange={(e) =>
                          setNewTenant({ ...newTenant, email: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone *
                      </label>
                      <input
                        type="text"
                        value={newTenant.phone}
                        onChange={(e) =>
                          setNewTenant({ ...newTenant, phone: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={newTenant.dateOfBirth}
                        onChange={(e) =>
                          setNewTenant({
                            ...newTenant,
                            dateOfBirth: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SSN (Last 4)
                      </label>
                      <input
                        type="text"
                        value={newTenant.ssn}
                        onChange={(e) =>
                          setNewTenant({ ...newTenant, ssn: e.target.value })
                        }
                        placeholder="XXX-XX-1234"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Lease Information */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">
                    Lease Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Property *
                      </label>
                      <input
                        type="text"
                        value={newTenant.property}
                        onChange={(e) =>
                          setNewTenant({
                            ...newTenant,
                            property: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit *
                      </label>
                      <input
                        type="text"
                        value={newTenant.unit}
                        onChange={(e) =>
                          setNewTenant({ ...newTenant, unit: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monthly Rent *
                      </label>
                      <input
                        type="number"
                        value={newTenant.rentAmount}
                        onChange={(e) =>
                          setNewTenant({
                            ...newTenant,
                            rentAmount: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={newTenant.status}
                        onChange={(e) =>
                          setNewTenant({ ...newTenant, status: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lease Start *
                      </label>
                      <input
                        type="date"
                        value={newTenant.leaseStart}
                        onChange={(e) =>
                          setNewTenant({
                            ...newTenant,
                            leaseStart: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lease End *
                      </label>
                      <input
                        type="date"
                        value={newTenant.leaseEnd}
                        onChange={(e) =>
                          setNewTenant({
                            ...newTenant,
                            leaseEnd: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">
                    Emergency Contact
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={newTenant.emergencyContact.name}
                        onChange={(e) =>
                          setNewTenant({
                            ...newTenant,
                            emergencyContact: {
                              ...newTenant.emergencyContact,
                              name: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Relationship
                      </label>
                      <input
                        type="text"
                        value={newTenant.emergencyContact.relationship}
                        onChange={(e) =>
                          setNewTenant({
                            ...newTenant,
                            emergencyContact: {
                              ...newTenant.emergencyContact,
                              relationship: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        value={newTenant.emergencyContact.phone}
                        onChange={(e) =>
                          setNewTenant({
                            ...newTenant,
                            emergencyContact: {
                              ...newTenant.emergencyContact,
                              phone: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={newTenant.emergencyContact.email}
                        onChange={(e) =>
                          setNewTenant({
                            ...newTenant,
                            emergencyContact: {
                              ...newTenant.emergencyContact,
                              email: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Employment Information */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">
                    Employment Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Employer
                      </label>
                      <input
                        type="text"
                        value={newTenant.employment.employer}
                        onChange={(e) =>
                          setNewTenant({
                            ...newTenant,
                            employment: {
                              ...newTenant.employment,
                              employer: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Position
                      </label>
                      <input
                        type="text"
                        value={newTenant.employment.position}
                        onChange={(e) =>
                          setNewTenant({
                            ...newTenant,
                            employment: {
                              ...newTenant.employment,
                              position: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Salary
                      </label>
                      <input
                        type="number"
                        value={newTenant.employment.salary}
                        onChange={(e) =>
                          setNewTenant({
                            ...newTenant,
                            employment: {
                              ...newTenant.employment,
                              salary: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={newTenant.employment.startDate}
                        onChange={(e) =>
                          setNewTenant({
                            ...newTenant,
                            employment: {
                              ...newTenant.employment,
                              startDate: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Notes</h4>
                  <textarea
                    value={newTenant.notes}
                    onChange={(e) =>
                      setNewTenant({ ...newTenant, notes: e.target.value })
                    }
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                    placeholder="Additional notes about the tenant..."
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddTenant(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTenant}
                  className="px-4 py-2 text-sm font-medium text-white bg-main-orange border border-transparent rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Add Tenant
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rent Adjustment Modal */}
        {showRentAdjustment && selectedTenantForRentAdjustment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Rent Adjustment - {selectedTenantForRentAdjustment.name}
                </h3>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adjustment Type
                  </label>
                  <select
                    value={rentAdjustmentForm.type}
                    onChange={(e) =>
                      setRentAdjustmentForm({
                        ...rentAdjustmentForm,
                        type: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                  >
                    <option value="increase">Rent Increase</option>
                    <option value="freeMonth">Free Month(s)</option>
                  </select>
                </div>

                {rentAdjustmentForm.type === "increase" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Amount ($)
                        </label>
                        <input
                          type="number"
                          value={rentAdjustmentForm.amount}
                          onChange={(e) =>
                            setRentAdjustmentForm({
                              ...rentAdjustmentForm,
                              amount: e.target.value,
                            })
                          }
                          placeholder={
                            selectedTenantForRentAdjustment.rentAmount
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Or Percentage (%)
                        </label>
                        <input
                          type="number"
                          value={rentAdjustmentForm.percentage}
                          onChange={(e) =>
                            setRentAdjustmentForm({
                              ...rentAdjustmentForm,
                              percentage: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                {rentAdjustmentForm.type === "freeMonth" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Free Months
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={rentAdjustmentForm.freeMonths}
                        onChange={(e) =>
                          setRentAdjustmentForm({
                            ...rentAdjustmentForm,
                            freeMonths: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description/Reason
                      </label>
                      <input
                        type="text"
                        value={rentAdjustmentForm.freeMonthDescription}
                        onChange={(e) =>
                          setRentAdjustmentForm({
                            ...rentAdjustmentForm,
                            freeMonthDescription: e.target.value,
                          })
                        }
                        placeholder="Reason for free months..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Effective Date
                  </label>
                  <input
                    type="date"
                    value={rentAdjustmentForm.effectiveDate}
                    onChange={(e) =>
                      setRentAdjustmentForm({
                        ...rentAdjustmentForm,
                        effectiveDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason
                  </label>
                  <textarea
                    value={rentAdjustmentForm.reason}
                    onChange={(e) =>
                      setRentAdjustmentForm({
                        ...rentAdjustmentForm,
                        reason: e.target.value,
                      })
                    }
                    placeholder="Enter reason for adjustment..."
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowRentAdjustment(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRentAdjustmentSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-main-orange border border-transparent rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Apply Adjustment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rentees;
