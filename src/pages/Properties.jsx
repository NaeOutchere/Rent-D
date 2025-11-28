import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Fixed Unsplash images
const propertyImages = [
  "https://images.unsplash.com/photo-1560184897-6b2d3c5f276c?auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1618220990930-3c5d2ef15e36?auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1572120360610-d971b9b63919?auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1560184897-6b2d3c5f276c?auto=format&fit=crop&w=500&q=60",
];

// Mock properties
const mockProperties = [
  {
    id: 1,
    address: "123 Main St, Kingston",
    location: "Kingston",
    bedrooms: 2,
    bathrooms: 1,
    rent: 1200,
    landlordName: "Mr. Brown",
    type: "Apartment",
  },
  {
    id: 2,
    address: "45 Ocean View, Montego Bay",
    location: "Montego Bay",
    bedrooms: 3,
    bathrooms: 2,
    rent: 1800,
    landlordName: "Ms. Green",
    type: "Villa",
  },
  {
    id: 3,
    address: "78 Hillside Rd, Negril",
    location: "Negril",
    bedrooms: 1,
    bathrooms: 1,
    rent: 900,
    landlordName: "Mr. White",
    type: "Studio",
  },
  {
    id: 4,
    address: "12 Palm St, Ocho Rios",
    location: "Ocho Rios",
    bedrooms: 4,
    bathrooms: 3,
    rent: 2500,
    landlordName: "Mrs. Blue",
    type: "House",
  },
  {
    id: 5,
    address: "9 Sunset Blvd, Kingston",
    location: "Kingston",
    bedrooms: 2,
    bathrooms: 2,
    rent: 1500,
    landlordName: "Mr. Black",
    type: "Apartment",
  },
  {
    id: 6,
    address: "88 Coral Way, Montego Bay",
    location: "Montego Bay",
    bedrooms: 3,
    bathrooms: 2,
    rent: 2000,
    landlordName: "Ms. Yellow",
    type: "Villa",
  },
  {
    id: 7,
    address: "22 Garden St, Negril",
    location: "Negril",
    bedrooms: 1,
    bathrooms: 1,
    rent: 950,
    landlordName: "Mr. Gray",
    type: "Studio",
  },
  {
    id: 8,
    address: "56 Mountain Rd, Ocho Rios",
    location: "Ocho Rios",
    bedrooms: 3,
    bathrooms: 2,
    rent: 2100,
    landlordName: "Mrs. Pink",
    type: "House",
  },
  {
    id: 9,
    address: "101 River St, Kingston",
    location: "Kingston",
    bedrooms: 2,
    bathrooms: 1,
    rent: 1300,
    landlordName: "Mr. Orange",
    type: "Apartment",
  },
].map((property, index) => ({
  ...property,
  image: propertyImages[index % propertyImages.length], // assign image by index
}));

const Properties = ({ currentUser }) => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    location: "",
    type: "",
    bedrooms: "",
    maxRent: "",
  });

  useEffect(() => {
    setProperties(mockProperties);
  }, []);

  // Filter properties
  const filteredProperties = properties.filter((p) => {
    const locationMatch = filters.location
      ? p.location === filters.location
      : true;
    const typeMatch = filters.type ? p.type === filters.type : true;
    const bedroomsMatch = filters.bedrooms
      ? p.bedrooms === parseInt(filters.bedrooms)
      : true;
    const rentMatch = filters.maxRent
      ? p.rent <= parseInt(filters.maxRent)
      : true;
    return locationMatch && typeMatch && bedroomsMatch && rentMatch;
  });

  // Pagination
  const perPage = 6;
  const totalPages = Math.ceil(filteredProperties.length / perPage);
  const displayedProperties = filteredProperties.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const handleContactLandlord = (property) =>
    alert(`Contacting landlord of ${property.address}`);
  const handleApply = (property) => alert(`Applying for ${property.address}`);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Available Properties</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 rounded-lg p-4 bg-gray-50 shadow-sm">
        <select
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          <option value="">All Locations</option>
          <option value="Kingston">Kingston</option>
          <option value="Montego Bay">Montego Bay</option>
          <option value="Negril">Negril</option>
          <option value="Ocho Rios">Ocho Rios</option>
        </select>

        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          <option value="">All Types</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Studio">Studio</option>
          <option value="House">House</option>
        </select>

        <select
          value={filters.bedrooms}
          onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
          className="border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          <option value="">Any Bedrooms</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>

        <input
          type="number"
          placeholder="Max Rent"
          value={filters.maxRent}
          onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })}
          className="border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedProperties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden transform transition duration-300 hover:shadow-lg hover:shadow-orange-300"
          >
            <img
              src={property.image}
              alt={property.address}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="font-semibold text-lg">{property.address}</h2>
              <p className="text-gray-500 mt-1">
                {property.bedrooms} Bed | {property.bathrooms} Bath | Rent: $
                {property.rent}
              </p>
              <p className="text-gray-500 mt-1">
                Landlord: {property.landlordName}
              </p>
              <p className="text-gray-500 mt-1">Type: {property.type}</p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleContactLandlord(property)}
                  className="flex-1 bg-[#2b4354] text-white py-2 rounded-lg hover:bg-[#3c5a6a] transition font-medium"
                >
                  Contact Landlord
                </button>
                <button
                  onClick={() => handleApply(property)}
                  className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition font-medium"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1
                ? "bg-orange-400 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Properties;
