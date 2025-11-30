const express = require("express");
const {auth} = require("../middleware/auth");
const ServiceRequest = require("../models/ServiceRequest");
const ServiceProvider = require("../models/ServiceProvider");
const PropertyService = require("../models/PropertyService");
const Property = require("../models/Property");

const router = express.Router();

// Get service categories
router.get("/categories", auth, async (req, res) => {
  try {
    const categories = [
      {
        name: "Plumbing",
        icon: "🔧",
        description: "Pipe leaks, clogged drains, toilet repairs",
      },
      {
        name: "Electrical",
        icon: "⚡",
        description: "Outlet issues, lighting problems, electrical repairs",
      },
      {
        name: "HVAC",
        icon: "❄️",
        description: "Heating, ventilation, air conditioning",
      },
      {
        name: "Carpentry",
        icon: "🪵",
        description: "Furniture repair, door adjustments, shelving",
      },
      {
        name: "Pest Control",
        icon: "🐜",
        description: "Insect control, rodent removal",
      },
      {
        name: "Cleaning",
        icon: "🧹",
        description: "Deep cleaning, move-in/move-out cleaning",
      },
      {
        name: "Appliance Repair",
        icon: "🔌",
        description: "Refrigerator, oven, washer/dryer repairs",
      },
      {
        name: "General Maintenance",
        icon: "🛠️",
        description: "Various maintenance tasks",
      },
    ];

    res.json({
      status: "success",
      data: { categories },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Get service providers for a property
router.get("/property/:propertyId/providers", auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.propertyId).populate(
      "preferredServiceProviders"
    );

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Check if user has access to this property
    const isLandlord = property.landlord.toString() === req.user.id;
    const isTenant = property.tenants.some(
      (tenantId) => tenantId.toString() === req.user.id
    );
    const isAdmin = ["admin", "tech_admin", "ceo"].includes(req.user.role);

    if (!isLandlord && !isTenant && !isAdmin) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Get property-specific service providers
    const propertyServices = await PropertyService.findOne({
      property: req.params.propertyId,
    }).populate("serviceProviders.serviceProvider");

    res.json({
      status: "success",
      data: {
        propertyServices,
        preferredProviders: property.preferredServiceProviders || [],
        availableProviders: propertyServices?.serviceProviders || [],
      },
    });
  } catch (error) {
    console.error("Error fetching service providers:", error);
    res.status(500).json({ error: "Failed to fetch service providers" });
  }
});

// Submit service request (Tenant)
router.post("/request", auth, async (req, res) => {
  try {
    const {
      propertyId,
      category,
      title,
      description,
      urgency,
      preferredProviderId,
      scheduledDate,
      images,
    } = req.body;

    // Verify property exists and user is tenant
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Check if user is a tenant of this property
    const isTenant = property.tenants.some(
      (tenantId) => tenantId.toString() === req.user.id
    );
    if (!isTenant && req.user.role !== "admin") {
      return res
        .status(403)
        .json({
          error: "Only tenants of this property can submit service requests",
        });
    }

    const serviceRequest = new ServiceRequest({
      tenant: req.user.id,
      property: propertyId,
      landlord: property.landlord,
      category,
      title,
      description,
      urgency: urgency || "Medium",
      preferredProvider: preferredProviderId,
      scheduledDate,
      images: images || [],
      status: "Submitted",
    });

    await serviceRequest.save();
    await serviceRequest.populate("preferredProvider property landlord");

    res.status(201).json({
      status: "success",
      data: { serviceRequest },
    });
  } catch (error) {
    console.error("Error submitting service request:", error);
    res.status(500).json({ error: "Failed to submit service request" });
  }
});

// Get service requests for user
router.get("/requests", auth, async (req, res) => {
  try {
    const { status, propertyId } = req.query;
    let query = {};

    if (req.user.role === "tenant") {
      query.tenant = req.user.id;
    } else if (req.user.role === "landlord") {
      query.landlord = req.user.id;
    } else if (["admin", "tech_admin", "ceo"].includes(req.user.role)) {
      // Admins can see all requests
    }

    if (status) {
      query.status = status;
    }

    if (propertyId) {
      query.property = propertyId;
    }

    const requests = await ServiceRequest.find(query)
      .populate("property")
      .populate("preferredProvider")
      .populate("assignedProvider")
      .populate("tenant", "name email phone")
      .populate("landlord", "name email phone")
      .sort({ createdAt: -1 });

    res.json({
      status: "success",
      data: { requests },
    });
  } catch (error) {
    console.error("Error fetching service requests:", error);
    res.status(500).json({ error: "Failed to fetch service requests" });
  }
});

// Get service request by ID
router.get("/requests/:requestId", auth, async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.requestId)
      .populate("property")
      .populate("preferredProvider")
      .populate("assignedProvider")
      .populate("tenant", "name email phone")
      .populate("landlord", "name email phone");

    if (!request) {
      return res.status(404).json({ error: "Service request not found" });
    }

    // Check if user has access to this request
    const isTenant = request.tenant._id.toString() === req.user.id;
    const isLandlord = request.landlord._id.toString() === req.user.id;
    const isAdmin = ["admin", "tech_admin", "ceo"].includes(req.user.role);

    if (!isTenant && !isLandlord && !isAdmin) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({
      status: "success",
      data: { request },
    });
  } catch (error) {
    console.error("Error fetching service request:", error);
    res.status(500).json({ error: "Failed to fetch service request" });
  }
});

// Landlord: Add service provider to property
router.post("/property/:propertyId/providers", auth, async (req, res) => {
  try {
    const { name, email, phone, company, services, hourlyRate } = req.body;

    const property = await Property.findById(req.params.propertyId);
    if (!property || property.landlord.toString() !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Create or find existing service provider
    let serviceProvider = await ServiceProvider.findOne({
      email,
      landlord: req.user.id,
    });

    if (!serviceProvider) {
      serviceProvider = new ServiceProvider({
        name,
        email,
        phone,
        company,
        services,
        hourlyRate,
        landlord: req.user.id,
      });
      await serviceProvider.save();
    }

    // Add to property's preferred providers if not already there
    if (!property.preferredServiceProviders.includes(serviceProvider._id)) {
      property.preferredServiceProviders.push(serviceProvider._id);
      await property.save();
    }

    // Add to property services registry
    let propertyService = await PropertyService.findOne({
      property: req.params.propertyId,
    });

    if (!propertyService) {
      propertyService = new PropertyService({
        property: req.params.propertyId,
        landlord: req.user.id,
        serviceProviders: [],
      });
    }

    // Check if provider already exists for this property
    const existingProvider = propertyService.serviceProviders.find(
      (sp) => sp.serviceProvider.toString() === serviceProvider._id.toString()
    );

    if (!existingProvider) {
      propertyService.serviceProviders.push({
        serviceProvider: serviceProvider._id,
        category: services[0], // Primary category
        isPreferred: false,
      });
    }

    await propertyService.save();

    res.json({
      status: "success",
      data: { serviceProvider, propertyService },
    });
  } catch (error) {
    console.error("Error adding service provider:", error);
    res.status(500).json({ error: "Failed to add service provider" });
  }
});

// Landlord: Update service request status
router.patch("/requests/:requestId/status", auth, async (req, res) => {
  try {
    const { status, assignedProviderId, landlordNotes, costEstimate } =
      req.body;

    const serviceRequest = await ServiceRequest.findById(
      req.params.requestId
    ).populate("property");

    if (!serviceRequest) {
      return res.status(404).json({ error: "Service request not found" });
    }

    // Check if user is the landlord or admin
    const isLandlord = serviceRequest.landlord.toString() === req.user.id;
    const isAdmin = ["admin", "tech_admin", "ceo"].includes(req.user.role);

    if (!isLandlord && !isAdmin) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (status) serviceRequest.status = status;
    if (assignedProviderId)
      serviceRequest.assignedProvider = assignedProviderId;
    if (landlordNotes) serviceRequest.landlordNotes = landlordNotes;
    if (costEstimate) serviceRequest.costEstimate = costEstimate;

    if (status === "Completed") {
      serviceRequest.completedDate = new Date();
    }

    await serviceRequest.save();
    await serviceRequest.populate("assignedProvider");

    res.json({
      status: "success",
      data: { serviceRequest },
    });
  } catch (error) {
    console.error("Error updating service request:", error);
    res.status(500).json({ error: "Failed to update service request" });
  }
});

// Tenant: Update service request notes
router.patch("/requests/:requestId/notes", auth, async (req, res) => {
  try {
    const { tenantNotes } = req.body;

    const serviceRequest = await ServiceRequest.findById(req.params.requestId);

    if (!serviceRequest) {
      return res.status(404).json({ error: "Service request not found" });
    }

    // Check if user is the tenant who submitted the request
    if (serviceRequest.tenant.toString() !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (tenantNotes) serviceRequest.tenantNotes = tenantNotes;

    await serviceRequest.save();

    res.json({
      status: "success",
      data: { serviceRequest },
    });
  } catch (error) {
    console.error("Error updating service request notes:", error);
    res.status(500).json({ error: "Failed to update service request notes" });
  }
});

// Get all service providers for landlord
router.get("/providers", auth, async (req, res) => {
  try {
    let providers;

    if (req.user.role === "landlord") {
      providers = await ServiceProvider.find({ landlord: req.user.id });
    } else if (["admin", "tech_admin", "ceo"].includes(req.user.role)) {
      providers = await ServiceProvider.find();
    } else {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({
      status: "success",
      data: { providers },
    });
  } catch (error) {
    console.error("Error fetching service providers:", error);
    res.status(500).json({ error: "Failed to fetch service providers" });
  }
});

// Cancel service request
router.patch("/requests/:requestId/cancel", auth, async (req, res) => {
  try {
    const serviceRequest = await ServiceRequest.findById(req.params.requestId);

    if (!serviceRequest) {
      return res.status(404).json({ error: "Service request not found" });
    }

    // Check if user can cancel this request
    const isTenant = serviceRequest.tenant.toString() === req.user.id;
    const isLandlord = serviceRequest.landlord.toString() === req.user.id;
    const isAdmin = ["admin", "tech_admin", "ceo"].includes(req.user.role);

    if (!isTenant && !isLandlord && !isAdmin) {
      return res.status(403).json({ error: "Access denied" });
    }

    serviceRequest.status = "Cancelled";
    await serviceRequest.save();

    res.json({
      status: "success",
      data: { serviceRequest },
    });
  } catch (error) {
    console.error("Error cancelling service request:", error);
    res.status(500).json({ error: "Failed to cancel service request" });
  }
});

module.exports = router;
