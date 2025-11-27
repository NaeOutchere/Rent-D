import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    // Basic Information
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "landlord",
    phone: "",

    // Landlord Specific Information
    trn: "",
    companyName: "",
    companyRegistration: "",

    // Property Information
    propertyAddress: {
      street: "",
      city: "",
      parish: "",
      country: "Jamaica",
    },
    propertyType: "",
    numberOfUnits: "",
    propertyManagementExperience: "",

    // Lease Agreement Options
    hasExistingLease: "",
    leaseAgreementPreference: "generate", // 'generate', 'upload', 'both'
    existingLeaseFile: null,

    // Identification
    idType: "driver_license",
    idNumber: "",
    idFile: null,

    // Bank Information
    bankName: "",
    accountNumber: "",
    accountType: "checking",
    routingNumber: "",

    // Payment Preferences
    paymentMethods: ["bank_transfer"],
    rentCollectionDate: "1",
    lateFeePolicy: "standard",

    // Emergency Contact
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

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { register } = useAuth();

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

  const validateStep = (step) => {
    switch (step) {
      case 1:
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
        break;

      case 2:
        if (!formData.trn || !formData.phone) {
          setError("Please fill in all required landlord information");
          return false;
        }
        if (formData.trn.length !== 9) {
          setError("TRN must be 9 digits");
          return false;
        }
        break;

      case 3:
        if (
          !formData.propertyAddress.street ||
          !formData.propertyAddress.city ||
          !formData.propertyAddress.parish ||
          !formData.propertyType
        ) {
          setError("Please fill in all required property information");
          return false;
        }
        break;

      case 4:
        if (
          !formData.idNumber ||
          !formData.bankName ||
          !formData.accountNumber
        ) {
          setError("Please fill in all required verification information");
          return false;
        }
        break;

      case 5:
        if (!formData.agreeToTerms || !formData.agreeToPrivacy) {
          setError("You must agree to the terms and privacy policy");
          return false;
        }
        break;
    }
    setError("");
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validateStep(5)) {
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        );

      case 2:
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
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

      case 3:
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                  placeholder="123 Main Street"
                  value={formData.propertyAddress.street}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="propertyAddress.city"
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
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
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
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
                    Country
                  </label>
                  <input
                    type="text"
                    name="propertyAddress.country"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                    value={formData.propertyAddress.country}
                    onChange={handleChange}
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Property Type *
                  </label>
                  <select
                    name="propertyType"
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Number of Units
                  </label>
                  <input
                    type="number"
                    name="numberOfUnits"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
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
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
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
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
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
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Verification & Banking
            </h3>

            <div className="grid grid-cols-1 gap-6">
              {/* Identification */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Identification
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      ID Type
                    </label>
                    <select
                      name="idType"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                      value={formData.idType}
                      onChange={handleChange}
                    >
                      <option value="driver_license">Driver's License</option>
                      <option value="passport">Passport</option>
                      <option value="national_id">National ID</option>
                      <option value="voter_id">Voter ID</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      ID Number *
                    </label>
                    <input
                      type="text"
                      name="idNumber"
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                      placeholder="ID number"
                      value={formData.idNumber}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Upload ID Document
                    </label>
                    <input
                      type="file"
                      name="idFile"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Bank Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Bank Information for Direct Transfer
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bank Name *
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                      placeholder="Bank of Jamaica"
                      value={formData.bankName}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Account Number *
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                      placeholder="123456789"
                      value={formData.accountNumber}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Account Type
                    </label>
                    <select
                      name="accountType"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                      value={formData.accountType}
                      onChange={handleChange}
                    >
                      <option value="checking">Checking</option>
                      <option value="savings">Savings</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Routing Number
                    </label>
                    <input
                      type="text"
                      name="routingNumber"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                      placeholder="Routing number"
                      value={formData.routingNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Preferences */}
              <div>
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
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                      value={formData.rentCollectionDate}
                      onChange={handleChange}
                    >
                      {Array.from({ length: 28 }, (_, i) => i + 1).map(
                        (day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Late Fee Policy
                    </label>
                    <select
                      name="lateFeePolicy"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
                      value={formData.lateFeePolicy}
                      onChange={handleChange}
                    >
                      <option value="standard">
                        Standard (5% after 5 days)
                      </option>
                      <option value="flexible">Flexible (case by case)</option>
                      <option value="strict">Strict (immediate fees)</option>
                      <option value="none">No late fees</option>
                    </select>
                  </div>
                </div>
              </div>

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
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
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
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
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
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
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
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200"
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

      case 5:
        return (
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
                  Please review all the information you've provided before
                  submitting your application.
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
                      className="text-blue-600 hover:text-blue-500"
                    >
                      Terms of Service
                    </Link>{" "}
                    and understand that this information will be used for
                    landlord verification purposes. *
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
                      className="text-blue-600 hover:text-blue-500"
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
                    I would like to receive marketing emails about new features,
                    tips for landlords, and special offers.
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-main-dark-bg bg-main-bg p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white dark:bg-secondary-dark-bg rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Rent-D Landlord Registration
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Complete your landlord profile in {currentStep} of 5 steps
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
                {error}
              </div>
            )}

            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 mt-8 border-t border-gray-200 dark:border-gray-600">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200"
                >
                  Previous
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition duration-200"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition duration-200 flex items-center justify-center"
                >
                  {loading ? "Creating Account..." : "Complete Registration"}
                </button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-600 mt-8">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Sign in
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
