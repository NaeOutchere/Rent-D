import React, { useState, useEffect } from "react";

const Admins = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [viewingEmployee, setViewingEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    position: "",
    department: "Development",
    phone: "",
    salary: "",
    startDate: new Date().toISOString().split("T")[0],
  });

  // Comprehensive mock data
  const mockEmployees = [
    {
      id: 1,
      employeeId: "RD-T001",
      name: "Sarah Johnson",
      email: "sarah.johnson@rentd.com",
      position: "Senior Frontend Developer",
      department: "Development",
      hireDate: "2023-01-15",
      startDate: "2023-01-15",
      status: "Active",
      phone: "+1 (555) 123-4567",
      salary: 85000,
      projects: [
        { name: "Dashboard Redesign", progress: 100, status: "Completed" },
        { name: "Payment System", progress: 85, status: "In Progress" },
      ],
      skills: ["React", "TypeScript", "Tailwind CSS", "Node.js"],
      performance: 4.8,
      lastReview: "2024-01-10",
      nextReview: "2024-07-10",
      emergencyContact: {
        name: "Robert Johnson",
        relationship: "Spouse",
        phone: "+1 (555) 123-4568",
      },
      vacationDays: 18,
      sickDays: 5,
      avatar: "SJ",
    },
    {
      id: 2,
      employeeId: "RD-T002",
      name: "Michael Chen",
      email: "michael.chen@rentd.com",
      position: "Backend Engineer",
      department: "Development",
      hireDate: "2023-03-22",
      startDate: "2023-03-22",
      status: "Active",
      phone: "+1 (555) 234-5678",
      salary: 92000,
      projects: [
        { name: "API Integration", progress: 100, status: "Completed" },
        { name: "Database Optimization", progress: 60, status: "In Progress" },
      ],
      skills: ["Python", "Django", "PostgreSQL", "Docker", "AWS"],
      performance: 4.6,
      lastReview: "2024-02-15",
      nextReview: "2024-08-15",
      emergencyContact: {
        name: "Jennifer Chen",
        relationship: "Spouse",
        phone: "+1 (555) 234-5679",
      },
      vacationDays: 22,
      sickDays: 3,
      avatar: "MC",
    },
    {
      id: 3,
      employeeId: "RD-T003",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@rentd.com",
      position: "UI/UX Designer",
      department: "Design",
      hireDate: "2022-11-08",
      startDate: "2022-11-08",
      status: "Active",
      phone: "+1 (555) 345-6789",
      salary: 78000,
      projects: [
        { name: "User Interface Design", progress: 100, status: "Completed" },
        { name: "Mobile App Design", progress: 90, status: "In Progress" },
      ],
      skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
      performance: 4.9,
      lastReview: "2024-01-20",
      nextReview: "2024-07-20",
      emergencyContact: {
        name: "Carlos Rodriguez",
        relationship: "Spouse",
        phone: "+1 (555) 345-6790",
      },
      vacationDays: 15,
      sickDays: 2,
      avatar: "ER",
    },
    {
      id: 4,
      employeeId: "RD-T004",
      name: "David Kim",
      email: "david.kim@rentd.com",
      position: "DevOps Engineer",
      department: "Operations",
      hireDate: "2023-06-14",
      startDate: "2023-06-14",
      status: "Active",
      phone: "+1 (555) 456-7890",
      salary: 95000,
      projects: [
        { name: "CI/CD Pipeline", progress: 100, status: "Completed" },
        { name: "Infrastructure Setup", progress: 75, status: "In Progress" },
      ],
      skills: ["Kubernetes", "Terraform", "AWS", "Jenkins", "Monitoring"],
      performance: 4.7,
      lastReview: "2024-03-01",
      nextReview: "2024-09-01",
      emergencyContact: {
        name: "Soo Kim",
        relationship: "Parent",
        phone: "+1 (555) 456-7891",
      },
      vacationDays: 20,
      sickDays: 4,
      avatar: "DK",
    },
  ];

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setTimeout(() => {
          setEmployees(mockEmployees);
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Format date function
  const formatDate = (dateString) => {
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

  // Filter employees function
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      !filterDepartment || employee.department === filterDepartment;
    const matchesStatus = !filterStatus || employee.status === filterStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Get departments and statuses for filters
  const departments = [...new Set(employees.map((emp) => emp.department))];
  const statuses = ["Active", "On Leave", "Inactive"];

  // Edit modal functions
  const handleEdit = (employee) => {
    setEditingEmployee(employee.id);
    setEditForm({ ...employee });
  };

  const handleInputChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setEmployees(
      employees.map((emp) =>
        emp.id === editingEmployee ? { ...emp, ...editForm } : emp
      )
    );
    setEditingEmployee(null);
    setEditForm({});
  };

  const handleCancel = () => {
    setEditingEmployee(null);
    setEditForm({});
  };

  // Add employee functions
  const handleAddEmployee = () => {
    const newEmp = {
      ...newEmployee,
      id: employees.length + 1,
      employeeId: `RD-T${String(employees.length + 1).padStart(3, "0")}`,
      hireDate: newEmployee.startDate,
      status: "Active",
      projects: [],
      skills: [],
      performance: 0,
      lastReview: new Date().toISOString().split("T")[0],
      nextReview: new Date(new Date().setMonth(new Date().getMonth() + 6))
        .toISOString()
        .split("T")[0],
      emergencyContact: { name: "", relationship: "", phone: "" },
      vacationDays: 0,
      sickDays: 0,
      avatar: newEmployee.name
        .split(" ")
        .map((n) => n[0])
        .join(""),
      salary: parseInt(newEmployee.salary),
    };

    setEmployees([...employees, newEmp]);
    setShowAddEmployee(false);
    setNewEmployee({
      name: "",
      email: "",
      position: "",
      department: "Development",
      phone: "",
      salary: "",
      startDate: new Date().toISOString().split("T")[0],
    });
  };

  const handleDelete = (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      setEmployees(employees.filter((emp) => emp.id !== employeeId));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "On Leave":
        return "bg-yellow-100 text-yellow-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPerformanceColor = (rating) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 4.0) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-main-orange rounded-full animate-spin"></div>
        <p className="text-gray-600">Loading employee data...</p>
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
                Tech Team Management
              </h1>
              <p className="text-gray-600">
                Comprehensive management portal for Rent'D tech team personnel
              </p>
            </div>
            <button
              onClick={() => setShowAddEmployee(true)}
              className="bg-main-orange hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <span>+</span> Add Employee
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
                  Total Employees
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {employees.length}
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
                  {employees.filter((emp) => emp.status === "Active").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-xl">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Avg. Performance
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {(
                    employees.reduce((acc, emp) => acc + emp.performance, 0) /
                    employees.length
                  ).toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 text-xl">💰</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Payroll
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    employees.reduce((acc, emp) => acc + emp.salary, 0)
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Access Control Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-blue-600">🔒</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Management Access Required
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                This portal contains sensitive employee information. All actions
                are logged and monitored.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex space-x-4">
            {["all", "development", "design", "operations", "qa"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium capitalize ${
                  activeTab === tab
                    ? "bg-main-orange text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab === "all" ? "All Employees" : tab}
              </button>
            ))}
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
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none transition-all"
              />
            </div>

            {/* Department Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🏢</span>
              </div>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none appearance-none bg-white"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
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
              {filteredEmployees.length} employee(s) found
            </div>
          </div>
        </div>

        {/* Enhanced Employees Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position & Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Projects
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Compensation
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Off
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Employee Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-main-orange rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {employee.avatar}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {employee.employeeId}
                          </div>
                          <div className="text-sm text-gray-500">
                            {employee.email}
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatDate(employee.hireDate)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Position & Department */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.position}
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                        {employee.department}
                      </span>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {employee.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {skill}
                          </span>
                        ))}
                        {employee.skills.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            +{employee.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Performance */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className={`text-lg font-bold ${getPerformanceColor(
                            employee.performance
                          )}`}
                        >
                          {employee.performance}
                        </span>
                        <span className="text-gray-400 ml-1">/5.0</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Last: {formatDate(employee.lastReview)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Next: {formatDate(employee.nextReview)}
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${getStatusColor(
                          employee.status
                        )}`}
                      >
                        {employee.status}
                      </span>
                    </td>

                    {/* Projects */}
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {employee.projects.slice(0, 2).map((project, index) => (
                          <div key={index} className="text-sm">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-gray-900">
                                {project.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {project.progress}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${
                                  project.status === "Completed"
                                    ? "bg-green-600"
                                    : project.status === "In Progress"
                                    ? "bg-blue-600"
                                    : "bg-yellow-600"
                                }`}
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {project.status}
                            </div>
                          </div>
                        ))}
                        {employee.projects.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{employee.projects.length - 2} more projects
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Compensation */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(employee.salary)}
                      </div>
                      <div className="text-xs text-gray-500">Annual</div>
                      <div className="text-xs text-gray-500 mt-2">
                        Phone: {employee.phone}
                      </div>
                    </td>

                    {/* Time Off */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="font-medium text-gray-900">
                            {employee.vacationDays}
                          </div>
                          <div className="text-xs text-gray-500">Vacation</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {employee.sickDays}
                          </div>
                          <div className="text-xs text-gray-500">Sick Days</div>
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => setViewingEmployee(employee)}
                          className="text-main-orange hover:text-orange-700 transition-colors text-left"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleEdit(employee)}
                          className="text-blue-600 hover:text-blue-800 transition-colors text-left"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(employee.id)}
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

          {filteredEmployees.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No employees found
              </h3>
              <p className="text-gray-500">
                {searchTerm || filterDepartment || filterStatus
                  ? "Try adjusting your search filters"
                  : "No employees found in the system"}
              </p>
            </div>
          )}
        </div>

        {/* View Employee Details Modal */}
        {viewingEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Employee Details
                </h3>
                <button
                  onClick={() => setViewingEmployee(null)}
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
                        <p className="text-gray-900">{viewingEmployee.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <p className="text-gray-900">{viewingEmployee.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <p className="text-gray-900">{viewingEmployee.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Employee ID
                        </label>
                        <p className="text-gray-900">
                          {viewingEmployee.employeeId}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Work Information */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">
                      Work Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Position
                        </label>
                        <p className="text-gray-900">
                          {viewingEmployee.position}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Department
                        </label>
                        <p className="text-gray-900">
                          {viewingEmployee.department}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Hire Date
                        </label>
                        <p className="text-gray-900">
                          {formatDate(viewingEmployee.hireDate)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            viewingEmployee.status
                          )}`}
                        >
                          {viewingEmployee.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">
                      Skills & Expertise
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {viewingEmployee.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Performance */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Performance</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Rating
                        </label>
                        <div className="flex items-center">
                          <span
                            className={`text-2xl font-bold ${getPerformanceColor(
                              viewingEmployee.performance
                            )}`}
                          >
                            {viewingEmployee.performance}
                          </span>
                          <span className="text-gray-400 ml-1">/5.0</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Last Review
                        </label>
                        <p className="text-gray-900">
                          {formatDate(viewingEmployee.lastReview)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Next Review
                        </label>
                        <p className="text-gray-900">
                          {formatDate(viewingEmployee.nextReview)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Current Projects */}
                  <div className="md:col-span-2">
                    <h4 className="text-lg font-semibold mb-4">
                      Current Projects
                    </h4>
                    <div className="space-y-4">
                      {viewingEmployee.projects.map((project, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="font-medium text-gray-900">
                              {project.name}
                            </h5>
                            <span className="text-sm text-gray-500">
                              {project.status}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${
                                project.status === "Completed"
                                  ? "bg-green-600"
                                  : project.status === "In Progress"
                                  ? "bg-blue-600"
                                  : "bg-yellow-600"
                              }`}
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {project.progress}% complete
                          </div>
                        </div>
                      ))}
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
                          {viewingEmployee.emergencyContact.name}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Relationship
                        </label>
                        <p className="text-gray-900">
                          {viewingEmployee.emergencyContact.relationship}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <p className="text-gray-900">
                          {viewingEmployee.emergencyContact.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Time Off Balance */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">
                      Time Off Balance
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Vacation Days
                        </label>
                        <p className="text-gray-900">
                          {viewingEmployee.vacationDays} days remaining
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Sick Days
                        </label>
                        <p className="text-gray-900">
                          {viewingEmployee.sickDays} days remaining
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setViewingEmployee(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Employee Modal */}
        {editingEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Edit Employee
                </h3>
              </div>
              <div className="px-6 py-4 space-y-4">
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
                      Position
                    </label>
                    <input
                      type="text"
                      value={editForm.position || ""}
                      onChange={(e) =>
                        handleInputChange("position", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      value={editForm.department || ""}
                      onChange={(e) =>
                        handleInputChange("department", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                    >
                      <option value="Development">Development</option>
                      <option value="Design">Design</option>
                      <option value="Operations">Operations</option>
                      <option value="Quality Assurance">
                        Quality Assurance
                      </option>
                    </select>
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
                      Salary
                    </label>
                    <input
                      type="number"
                      value={editForm.salary || ""}
                      onChange={(e) =>
                        handleInputChange("salary", parseInt(e.target.value))
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
                      <option value="On Leave">On Leave</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Performance Rating
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={editForm.performance || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "performance",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editForm.skills ? editForm.skills.join(", ") : ""}
                    onChange={(e) =>
                      handleInputChange(
                        "skills",
                        e.target.value.split(",").map((s) => s.trim())
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                    placeholder="React, Node.js, TypeScript"
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

        {/* Add Employee Modal */}
        {showAddEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Add New Employee
                </h3>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={newEmployee.name}
                      onChange={(e) =>
                        setNewEmployee({ ...newEmployee, name: e.target.value })
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
                      value={newEmployee.email}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          email: e.target.value,
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
                      value={newEmployee.position}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          position: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      value={newEmployee.department}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          department: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                    >
                      <option value="Development">Development</option>
                      <option value="Design">Design</option>
                      <option value="Operations">Operations</option>
                      <option value="Quality Assurance">
                        Quality Assurance
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={newEmployee.phone}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          phone: e.target.value,
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
                      value={newEmployee.salary}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          salary: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={newEmployee.startDate}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          startDate: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-main-orange outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddEmployee(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEmployee}
                  className="px-4 py-2 text-sm font-medium text-white bg-main-orange border border-transparent rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Add Employee
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admins;
