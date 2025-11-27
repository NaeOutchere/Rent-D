import React, { useState } from "react";

// Simple SVG icons as React components
const LocationIcon = () => (
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
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const BedIcon = () => (
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
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const BathIcon = () => (
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
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const AreaIcon = () => (
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
      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
    />
  </svg>
);

const UtilitiesIcon = () => (
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
      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
    />
  </svg>
);

const Properties = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Mock data for properties
  const propertiesData = [
    {
      id: 1,
      title: "Modern Apartment in Kingston",
      address: "25 Hope Road, Kingston 6",
      price: 85000,
      deposit: 170000,
      images: [
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      ],
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      furnished: true,
      amenities: ["Swimming Pool", "Gym", "Parking", "Security"],
      utilities: ["Water", "Electricity", "Internet"],
      status: "Available",
    },
    {
      id: 2,
      title: "Luxury Villa in Montego Bay",
      address: "15 Gloucester Avenue, Montego Bay",
      price: 150000,
      deposit: 300000,
      images: [
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      ],
      bedrooms: 4,
      bathrooms: 3,
      area: 2800,
      furnished: false,
      amenities: ["Private Pool", "Garden", "Garage", "Sea View"],
      utilities: ["Water", "Electricity"],
      status: "Rented",
    },
    {
      id: 3,
      title: "Studio Apartment in Portmore",
      address: "42 Passage Fort Drive, Portmore",
      price: 45000,
      deposit: 90000,
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      ],
      bedrooms: 1,
      bathrooms: 1,
      area: 600,
      furnished: true,
      amenities: ["Security", "Laundry"],
      utilities: ["Water", "Electricity", "Internet", "Cable"],
      status: "Available",
    },
    {
      id: 4,
      title: "Family Home in Ocho Rios",
      address: "8 Main Street, Ocho Rios",
      price: 120000,
      deposit: 240000,
      images: [
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      ],
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      furnished: false,
      amenities: ["Garden", "Parking", "Pet Friendly"],
      utilities: ["Water", "Electricity"],
      status: "Under Maintenance",
    },
    {
      id: 5,
      title: "Penthouse in New Kingston",
      address: "The Atrium, New Kingston",
      price: 200000,
      deposit: 400000,
      images: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      ],
      bedrooms: 3,
      bathrooms: 3,
      area: 2200,
      furnished: true,
      amenities: ["Pool", "Gym", "Concierge", "Rooftop Terrace"],
      utilities: ["Water", "Electricity", "Internet", "Cable"],
      status: "Available",
    },
    {
      id: 6,
      title: "Beach House in Negril",
      address: "7 Mile Beach, Negril",
      price: 180000,
      deposit: 360000,
      images: [
        "https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      ],
      bedrooms: 4,
      bathrooms: 4,
      area: 3200,
      furnished: true,
      amenities: ["Private Beach", "Pool", "Outdoor Kitchen", "Hot Tub"],
      utilities: ["Water", "Electricity", "Internet"],
      status: "Rented",
    },
  ];

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
  };

  const handleCloseModal = () => {
    setSelectedProperty(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Rented":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Under Maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-2xl font-semibold dark:text-white">Properties</p>
          <p className="text-gray-400 dark:text-gray-300 mt-2">
            Browse available rental properties
          </p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-main-blue text-white rounded-lg hover:bg-blue-700 transition duration-200">
            Add Property
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200">
            Filter
          </button>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {propertiesData.map((property) => (
          <div
            key={property.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
            onClick={() => handlePropertyClick(property)}
          >
            {/* Property Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute top-4 right-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    property.status
                  )}`}
                >
                  {property.status}
                </span>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  ${property.price.toLocaleString()}/month
                </span>
              </div>
            </div>

            {/* Property Details */}
            <div className="p-6">
              {/* Title and Address */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {property.title}
                </h3>
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <LocationIcon />
                  <span className="ml-2">{property.address}</span>
                </div>
              </div>

              {/* Property Features */}
              <div className="flex items-center justify-between mb-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <BedIcon />
                  <span className="ml-1">{property.bedrooms} bed</span>
                </div>
                <div className="flex items-center">
                  <BathIcon />
                  <span className="ml-1">{property.bathrooms} bath</span>
                </div>
                <div className="flex items-center">
                  <AreaIcon />
                  <span className="ml-1">{property.area} sq ft</span>
                </div>
              </div>

              {/* Deposit and Furnishing */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Deposit:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${property.deposit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Furnished:
                  </span>
                  <span
                    className={`font-semibold ${
                      property.furnished
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {property.furnished ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              {/* Amenities Preview */}
              <div className="mb-4">
                <div className="flex items-center mb-2 text-sm text-gray-600 dark:text-gray-400">
                  <UtilitiesIcon />
                  <span className="ml-2">Utilities Included:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {property.utilities.slice(0, 3).map((utility, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs"
                    >
                      {utility}
                    </span>
                  ))}
                  {property.utilities.length > 3 && (
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded text-xs">
                      +{property.utilities.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Amenities Tags */}
              <div className="flex flex-wrap gap-1">
                {property.amenities.slice(0, 2).map((amenity, index) => (
                  <span
                    key={index}
                    className="bg-main-orange bg-opacity-10 text-main-orange px-2 py-1 rounded text-xs"
                  >
                    {amenity}
                  </span>
                ))}
                {property.amenities.length > 2 && (
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded text-xs">
                    +{property.amenities.length - 2} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-secondary-dark-bg rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold dark:text-white">
                    {selectedProperty.title}
                  </h2>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mt-2">
                    <LocationIcon />
                    <span className="ml-2">{selectedProperty.address}</span>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Image Gallery */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {selectedProperty.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${selectedProperty.title} ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ))}
              </div>

              {/* Property Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold dark:text-white mb-4">
                    Property Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Monthly Rent:
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ${selectedProperty.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Security Deposit:
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ${selectedProperty.deposit.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Furnished:
                      </span>
                      <span
                        className={`font-semibold ${
                          selectedProperty.furnished
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {selectedProperty.furnished ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Status:
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          selectedProperty.status
                        )}`}
                      >
                        {selectedProperty.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column - Features */}
                <div>
                  <h3 className="text-lg font-semibold dark:text-white mb-4">
                    Features
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <BedIcon />
                      <span className="ml-2">
                        {selectedProperty.bedrooms} Bedrooms
                      </span>
                    </div>
                    <div className="flex items-center">
                      <BathIcon />
                      <span className="ml-2">
                        {selectedProperty.bathrooms} Bathrooms
                      </span>
                    </div>
                    <div className="flex items-center">
                      <AreaIcon />
                      <span className="ml-2">
                        {selectedProperty.area} sq ft
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities and Utilities */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold dark:text-white mb-3">
                    Amenities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProperty.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="bg-main-orange bg-opacity-10 text-main-orange px-3 py-1 rounded-full text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold dark:text-white mb-3">
                    Utilities Included
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProperty.utilities.map((utility, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                      >
                        {utility}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                <button className="flex-1 bg-main-orange text-white py-3 rounded-lg hover:bg-orange-600 transition duration-200 font-semibold">
                  Contact Landlord
                </button>
                <button className="flex-1 bg-main-blue text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold">
                  Schedule Viewing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;
