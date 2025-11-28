import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const Signup = () => {
  const [selectedRole, setSelectedRole] = useState(""); // "landlord" or "tenant"
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Common form data structure
  const [formData, setFormData] = useState({
    role: "",

    // Basic Information (common for both)
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: "",

    // Landlord Specific Information
    trn: "",
    companyName: "",
    companyRegistration: "",
    propertyManagementExperience: "",

    // Property Information (Landlord)
    propertyAddress: {
      street: "",
      city: "",
      parish: "",
      country: "Jamaica",
    },
    propertyType: "",
    numberOfUnits: "",

    // Lease Agreement Options (Landlord)
    hasExistingLease: "",
    leaseAgreementPreference: "generate",
    existingLeaseFile: null,

    // Payment Preferences (Landlord)
    paymentMethods: ["bank_transfer"],
    rentCollectionDate: "1",
    lateFeePolicy: "standard",

    // Tenant Specific Information
    employmentStatus: "",
    occupation: "",
    monthlyIncome: "",
    employerName: "",
    employerPhone: "",
    workAddress: "",
    rentalHistory: "",
    previousLandlordName: "",
    previousLandlordPhone: "",
    reasonForLeaving: "",
    references: [
      { name: "", relationship: "", phone: "", email: "" },
      { name: "", relationship: "", phone: "", email: "" },
    ],

    // Tenant Rental Preferences
    preferredLocation: {
      parish: "",
      areas: [],
      maxBudget: "",
      minBedrooms: "",
      propertyType: "",
    },
    moveInDate: "",
    leaseDuration: "12",
    hasPets: "",
    petDetails: "",
    numberOfOccupants: "",
    smoking: "",
    vehicles: "",
    specialRequirements: "",

    // Identification & Verification (common for both)
    trn: "", // Added for tenants
    idType: "driver_license",
    idNumber: "",
    idFile: null,
    proofOfIncomeFile: null,
    creditCheckConsent: false,

    // Bank Information (common but optional for tenants)
    bankName: "",
    accountNumber: "",
    accountType: "checking",
    routingNumber: "",

    // Emergency Contact (common)
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
      email: "",
    },

    // Terms and Conditions
    agreeToTerms: false,
    agreeToPrivacy: false,
    marketingEmails: false,
  });

  const { register } = useAuth();

  // Data options
  const parishes = [
    "Kingston",
    "St. Andrew",
    "St. Thomas",
    "Portland",
    "St. Mary",
    "St. Ann",
    "Trelawny",
    "St. James",
    "Hanover",
    "Westmoreland",
    "St. Elizabeth",
    "Manchester",
    "Clarendon",
    "St. Catherine",
  ];

  const propertyTypes = [
    "Apartment Building",
    "Single Family Home",
    "Multi-Family Home",
    "Townhouse",
    "Condominium",
    "Commercial Property",
    "Vacation Rental",
    "Other",
  ];

  const tenantPropertyTypes = [
    "Apartment",
    "Studio",
    "Single Family Home",
    "Townhouse",
    "Condominium",
    "Duplex",
    "Shared Accommodation",
    "Other",
  ];

  const employmentStatuses = [
    "Employed Full-time",
    "Employed Part-time",
    "Self-Employed",
    "Student",
    "Retired",
    "Unemployed",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else if (type === "checkbox" && name === "paymentMethods") {
      const updatedMethods = formData.paymentMethods.includes(value)
        ? formData.paymentMethods.filter((method) => method !== value)
        : [...formData.paymentMethods, value];
      setFormData((prev) => ({ ...prev, paymentMethods: updatedMethods }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleReferenceChange = (index, field, value) => {
    const updatedReferences = [...formData.references];
    updatedReferences[index] = {
      ...updatedReferences[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, references: updatedReferences }));
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData((prev) => ({ ...prev, role }));
    setCurrentStep(2);
    setError(""); // Clear any previous errors
  };

  const validateStep = (step) => {
    setError(""); // Clear previous errors first

    switch (step) {
      case 1:
        if (!selectedRole) {
          setError("Please select your role");
          return false;
        }
        break;

      case 2:
        if (
          !formData.name ||
          !formData.email ||
          !formData.password ||
          !formData.confirmPassword
        ) {
          setError("Please fill in all required fields");
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          return false;
        }
        if (formData.password.length < 8) {
          setError("Password must be at least 8 characters long");
          return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
          setError("Please enter a valid email address");
          return false;
        }
        break;

      case 3:
        if (selectedRole === "landlord") {
          if (!formData.trn || !formData.phone) {
            setError("Please fill in all required information");
            return false;
          }
          if (formData.trn.length !== 9) {
            setError("TRN must be 9 digits");
            return false;
          }
        } else {
          if (
            !formData.phone ||
            !formData.dateOfBirth ||
            !formData.employmentStatus
          ) {
            setError("Please fill in all required information");
            return false;
          }
          // Validate age for tenant (must be at least 18)
          const birthDate = new Date(formData.dateOfBirth);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          if (age < 18) {
            setError("You must be at least 18 years old to register");
            return false;
          }
        }
        break;

      case 4:
        if (selectedRole === "landlord") {
          if (
            !formData.propertyAddress.street ||
            !formData.propertyAddress.parish ||
            !formData.propertyType
          ) {
            setError("Please fill in all required property information");
            return false;
          }
        } else {
          if (
            !formData.preferredLocation.parish ||
            !formData.preferredLocation.maxBudget ||
            !formData.moveInDate
          ) {
            setError("Please fill in all required rental preferences");
            return false;
          }
        }
        break;

      case 5:
        if (!formData.idNumber || !formData.trn) {
          setError("Please fill in all required verification information");
          return false;
        }
        if (selectedRole === "tenant" && !formData.creditCheckConsent) {
          setError("You must consent to credit check for tenant verification");
          return false;
        }
        break;

      case 6:
        if (!formData.agreeToTerms || !formData.agreeToPrivacy) {
          setError("You must agree to the terms and privacy policy");
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep === 2) {
      setSelectedRole("");
      setCurrentStep(1);
    } else {
      setCurrentStep((prev) => prev - 1);
    }
    setError(""); // Clear errors when going back
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validateStep(6)) {
      setLoading(false);
      return;
    }

    try {
      await register(formData);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Role Selection
  const renderRoleSelection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Join Rent'D as...
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Choose how you want to use our platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Landlord Option */}
        <div
          onClick={() => handleRoleSelect("landlord")}
          className="border-2 border-gray-300 dark:border-gray-600 rounded-xl p-6 cursor-pointer hover:border-orange-500 dark:hover:border-orange-400 hover:shadow-lg transition-all duration-200 group"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 dark:group-hover:bg-orange-800/50 transition-colors">
              <span className="text-2xl">🏠</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Property Owner/Landlord
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              List and manage your rental properties
            </p>
            <ul className="text-left text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                List unlimited properties
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Automated rent collection
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Tenant screening tools
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Maintenance tracking
              </li>
            </ul>
          </div>
        </div>

        {/* Tenant Option */}
        <div
          onClick={() => handleRoleSelect("tenant")}
          className="border-2 border-gray-300 dark:border-gray-600 rounded-xl p-6 cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all duration-200 group"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
              <span className="text-2xl">👤</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Tenant/Renter
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Find and apply for rental properties
            </p>
            <ul className="text-left text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Browse available properties
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Digital rental applications
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Online rent payments
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Maintenance requests
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );

  // Common Step 2: Basic Information
  const renderBasicInfo = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Basic Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password *
          </label>
          <input
            type="password"
            name="password"
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
            placeholder="At least 8 characters"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Confirm Password *
          </label>
          <input
            type="password"
            name="confirmPassword"
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );

  // Step 3: Role-Specific Information
  const renderRoleSpecificInfo = () => {
    if (selectedRole === "landlord") {
      return (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Landlord Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                TRN (Tax Registration Number) *
              </label>
              <input
                type="text"
                name="trn"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                placeholder="123-456-789"
                value={formData.trn}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                placeholder="(876) 123-4567"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Name (Optional)
              </label>
              <input
                type="text"
                name="companyName"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                placeholder="Your company name"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Registration (Optional)
              </label>
              <input
                type="text"
                name="companyRegistration"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                placeholder="Company registration number"
                value={formData.companyRegistration}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Property Management Experience
              </label>
              <select
                name="propertyManagementExperience"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                value={formData.propertyManagementExperience}
                onChange={handleChange}
              >
                <option value="">Select experience level</option>
                <option value="none">No experience</option>
                <option value="less_1">Less than 1 year</option>
                <option value="1_3">1-3 years</option>
                <option value="3_5">3-5 years</option>
                <option value="5_plus">5+ years</option>
              </select>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Tenant Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                placeholder="(876) 123-4567"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                name="dateOfBirth"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Employment Status *
              </label>
              <select
                name="employmentStatus"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                value={formData.employmentStatus}
                onChange={handleChange}
              >
                <option value="">Select employment status</option>
                {employmentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Occupation
              </label>
              <input
                type="text"
                name="occupation"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                placeholder="Your occupation"
                value={formData.occupation}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Monthly Income (JMD)
              </label>
              <input
                type="number"
                name="monthlyIncome"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                placeholder="50000"
                value={formData.monthlyIncome}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Employer Name
              </label>
              <input
                type="text"
                name="employerName"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                placeholder="Company name"
                value={formData.employerName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Occupants
              </label>
              <select
                name="numberOfOccupants"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                value={formData.numberOfOccupants}
                onChange={handleChange}
              >
                <option value="">Select number</option>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "person" : "people"}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Special Requirements or Accommodations
              </label>
              <textarea
                name="specialRequirements"
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                placeholder="Any special needs, accessibility requirements, or other accommodations"
                value={formData.specialRequirements}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      );
    }
  };

  // Step 4: Property/Rental Preferences
  const renderPropertyRentalInfo = () => {
    if (selectedRole === "landlord") {
      return (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Property Information
          </h3>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                name="propertyAddress.street"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                placeholder="123 Main Street"
                value={formData.propertyAddress.street}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="propertyAddress.city"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                  placeholder="Kingston"
                  value={formData.propertyAddress.city}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Parish *
                </label>
                <select
                  name="propertyAddress.parish"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                  value={formData.propertyAddress.parish}
                  onChange={handleChange}
                >
                  <option value="">Select Parish</option>
                  {parishes.map((parish) => (
                    <option key={parish} value={parish}>
                      {parish}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Property Type *
                </label>
                <select
                  name="propertyType"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                  value={formData.propertyType}
                  onChange={handleChange}
                >
                  <option value="">Select Property Type</option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Number of Units
                </label>
                <input
                  type="number"
                  name="numberOfUnits"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                  placeholder="1"
                  value={formData.numberOfUnits}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Lease Agreement Section */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Lease Agreement
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Do you have an existing lease agreement?
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasExistingLease"
                        value="yes"
                        checked={formData.hasExistingLease === "yes"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasExistingLease"
                        value="no"
                        checked={formData.hasExistingLease === "no"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>

                {formData.hasExistingLease === "yes" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Upload Existing Lease Agreement
                    </label>
                    <input
                      type="file"
                      name="existingLeaseFile"
                      accept=".pdf,.doc,.docx"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                      onChange={handleChange}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lease Agreement Preference
                  </label>
                  <select
                    name="leaseAgreementPreference"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                    value={formData.leaseAgreementPreference}
                    onChange={handleChange}
                  >
                    <option value="generate">Generate new agreement</option>
                    <option value="upload">Use my existing agreement</option>
                    <option value="both">Both (generate and upload)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Preferences */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Payment Preferences
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rent Collection Date
                  </label>
                  <select
                    name="rentCollectionDate"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                    value={formData.rentCollectionDate}
                    onChange={handleChange}
                  >
                    {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Late Fee Policy
                  </label>
                  <select
                    name="lateFeePolicy"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                    value={formData.lateFeePolicy}
                    onChange={handleChange}
                  >
                    <option value="standard">Standard (5% after 5 days)</option>
                    <option value="flexible">Flexible (case by case)</option>
                    <option value="strict">Strict (immediate fees)</option>
                    <option value="none">No late fees</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Rental Preferences
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preferred Parish *
              </label>
              <select
                name="preferredLocation.parish"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                value={formData.preferredLocation.parish}
                onChange={handleChange}
              >
                <option value="">Select Parish</option>
                {parishes.map((parish) => (
                  <option key={parish} value={parish}>
                    {parish}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Maximum Budget (JMD) *
              </label>
              <input
                type="number"
                name="preferredLocation.maxBudget"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                placeholder="50000"
                value={formData.preferredLocation.maxBudget}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Bedrooms
              </label>
              <select
                name="preferredLocation.minBedrooms"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                value={formData.preferredLocation.minBedrooms}
                onChange={handleChange}
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "bedroom" : "bedrooms"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preferred Property Type
              </label>
              <select
                name="preferredLocation.propertyType"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                value={formData.preferredLocation.propertyType}
                onChange={handleChange}
              >
                <option value="">Any type</option>
                {tenantPropertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Desired Move-in Date *
              </label>
              <input
                type="date"
                name="moveInDate"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                value={formData.moveInDate}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lease Duration (months)
              </label>
              <select
                name="leaseDuration"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                value={formData.leaseDuration}
                onChange={handleChange}
              >
                <option value="6">6 months</option>
                <option value="12">12 months</option>
                <option value="24">24 months</option>
                <option value="month_to_month">Month-to-month</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Do you have pets?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasPets"
                    value="yes"
                    checked={formData.hasPets === "yes"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasPets"
                    value="no"
                    checked={formData.hasPets === "no"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
              {formData.hasPets === "yes" && (
                <input
                  type="text"
                  name="petDetails"
                  className="w-full mt-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                  placeholder="Please describe your pets (type, size, number)"
                  value={formData.petDetails}
                  onChange={handleChange}
                />
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Do you smoke?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="smoking"
                    value="yes"
                    checked={formData.smoking === "yes"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="smoking"
                    value="no"
                    checked={formData.smoking === "no"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Vehicles
              </label>
              <select
                name="vehicles"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                value={formData.vehicles}
                onChange={handleChange}
              >
                <option value="">Select number</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3+</option>
              </select>
            </div>
          </div>

          {/* Rental History */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Rental History
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Previous Rental Experience
                </label>
                <textarea
                  name="rentalHistory"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                  placeholder="Describe your previous rental experience, if any"
                  value={formData.rentalHistory}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Previous Landlord Name
                  </label>
                  <input
                    type="text"
                    name="previousLandlordName"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                    placeholder="Previous landlord's name"
                    value={formData.previousLandlordName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Previous Landlord Phone
                  </label>
                  <input
                    type="tel"
                    name="previousLandlordPhone"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                    placeholder="(876) 123-4567"
                    value={formData.previousLandlordPhone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason for Leaving Previous Residence
                </label>
                <textarea
                  name="reasonForLeaving"
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                  placeholder="Why are you moving from your current residence?"
                  value={formData.reasonForLeaving}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  // Step 5: Verification & Documents
  const renderVerificationDocuments = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Verification & Documents
      </h3>

      <div className="grid grid-cols-1 gap-6">
        {/* TRN for both */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              TRN (Tax Registration Number) *
            </label>
            <input
              type="text"
              name="trn"
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
              placeholder="123-456-789"
              value={formData.trn}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ID Type *
            </label>
            <select
              name="idType"
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
              value={formData.idType}
              onChange={handleChange}
            >
              <option value="driver_license">Driver's License</option>
              <option value="passport">Passport</option>
              <option value="national_id">National ID</option>
              <option value="voter_id">Voter ID</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ID Number *
            </label>
            <input
              type="text"
              name="idNumber"
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
              placeholder="ID number"
              value={formData.idNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* File Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload ID Document *
            </label>
            <input
              type="file"
              name="idFile"
              required
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
              onChange={handleChange}
            />
            <p className="text-xs text-gray-500 mt-1">
              Accepted: PDF, JPG, PNG (Max 5MB)
            </p>
          </div>

          {selectedRole === "tenant" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Proof of Income
              </label>
              <input
                type="file"
                name="proofOfIncomeFile"
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                Pay stub, employment letter, etc.
              </p>
            </div>
          )}
        </div>

        {/* Credit Check Consent for Tenants */}
        {selectedRole === "tenant" && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                name="creditCheckConsent"
                required
                className="mt-1"
                checked={formData.creditCheckConsent}
                onChange={handleChange}
              />
              <span className="text-sm text-blue-800 dark:text-blue-200">
                I consent to a credit and background check as part of the tenant
                screening process. This helps landlords make informed decisions
                and ensures a safe community for all residents. *
              </span>
            </label>
          </div>
        )}

        {/* References for Tenants */}
        {selectedRole === "tenant" && (
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Personal References
            </h4>
            <div className="space-y-4">
              {formData.references.map((reference, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                >
                  <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                    Reference {index + 1}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={reference.name}
                        onChange={(e) =>
                          handleReferenceChange(index, "name", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                        placeholder="Reference name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Relationship
                      </label>
                      <input
                        type="text"
                        value={reference.relationship}
                        onChange={(e) =>
                          handleReferenceChange(
                            index,
                            "relationship",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                        placeholder="Friend, Colleague, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={reference.phone}
                        onChange={(e) =>
                          handleReferenceChange(index, "phone", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                        placeholder="(876) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={reference.email}
                        onChange={(e) =>
                          handleReferenceChange(index, "email", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                        placeholder="reference@example.com"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Emergency Contact */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Emergency Contact
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Name
              </label>
              <input
                type="text"
                name="emergencyContact.name"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                placeholder="Emergency contact name"
                value={formData.emergencyContact.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Relationship
              </label>
              <input
                type="text"
                name="emergencyContact.relationship"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                placeholder="Spouse, Parent, etc."
                value={formData.emergencyContact.relationship}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="emergencyContact.phone"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                placeholder="(876) 123-4567"
                value={formData.emergencyContact.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="emergencyContact.email"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                placeholder="contact@example.com"
                value={formData.emergencyContact.email}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 6: Terms & Conditions
  const renderTermsConditions = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Terms & Conditions
      </h3>

      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Review Your Information
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Please review all the information you've provided before submitting
            your application.
          </p>
        </div>

        <div className="space-y-3">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              name="agreeToTerms"
              required
              className="mt-1"
              checked={formData.agreeToTerms}
              onChange={handleChange}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              I agree to the{" "}
              <Link
                to="/terms"
                className="text-orange-600 hover:text-orange-500"
              >
                Terms of Service
              </Link>{" "}
              and understand that this information will be used for verification
              purposes. *
            </span>
          </label>

          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              name="agreeToPrivacy"
              required
              className="mt-1"
              checked={formData.agreeToPrivacy}
              onChange={handleChange}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              I agree to the{" "}
              <Link
                to="/privacy"
                className="text-orange-600 hover:text-orange-500"
              >
                Privacy Policy
              </Link>{" "}
              and understand how my data will be used and protected. *
            </span>
          </label>

          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              name="marketingEmails"
              className="mt-1"
              checked={formData.marketingEmails}
              onChange={handleChange}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              I would like to receive marketing emails about new features, tips,
              and special offers.
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderStep = () => {
    if (currentStep === 1) return renderRoleSelection();
    if (currentStep === 2) return renderBasicInfo();
    if (currentStep === 3) return renderRoleSpecificInfo();
    if (currentStep === 4) return renderPropertyRentalInfo();
    if (currentStep === 5) return renderVerificationDocuments();
    if (currentStep === 6) return renderTermsConditions();
    return null;
  };

  const getTotalSteps = () => 6;
  const getStepTitle = () => {
    if (currentStep === 1) return "Choose Your Role";
    if (currentStep === 2) return "Basic Information";
    if (currentStep === 3)
      return selectedRole === "landlord"
        ? "Landlord Information"
        : "Tenant Information";
    if (currentStep === 4)
      return selectedRole === "landlord"
        ? "Property Information"
        : "Rental Preferences";
    if (currentStep === 5) return "Verification & Documents";
    if (currentStep === 6) return "Terms & Conditions";
    return "";
  };

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-main-dark-bg bg-main-bg p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white dark:bg-secondary-dark-bg rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Rent'D
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {getStepTitle()} - Step {currentStep} of {getTotalSteps()}
            </p>
          </div>

          {/* Progress Bar */}
          {currentStep > 1 && (
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                {[1, 2, 3, 4, 5, 6].map((step) => (
                  <div
                    key={step}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= currentStep
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / getTotalSteps()) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 text-red-700 dark:text-red-300 text-sm">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {renderStep()}

            {/* Navigation Buttons */}
            {currentStep > 1 && (
              <div className="flex justify-between pt-8 mt-8 border-t border-gray-200 dark:border-gray-600">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200 font-medium"
                >
                  Previous
                </button>

                {currentStep < getTotalSteps() ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition duration-200"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition duration-200 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Registration</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Login Link */}
            {currentStep === 1 && (
              <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-600 mt-8">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-orange-500 hover:text-orange-600 font-medium"
                  >
                    Sign in
                  </Link>
                </span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
