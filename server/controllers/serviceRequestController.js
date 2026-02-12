const Service = require("../models/service");
const ServiceRequest = require("../models/serviceRequest");




const allowedTransitions = {
  PENDING: ["ACCEPTED", "REJECTED", "CANCELLED"],
  ACCEPTED: ["COMPLETED"],
  COMPLETED: [],
  REJECTED: [],
  CANCELLED: []
};


exports.createServiceRequest = async (req, res) => {
  try {
    const { serviceId, description, address, preferredDate } = req.body;

    if (!serviceId || !description || !address) {
      return res.status(400).json({
        message: "Service, description and address are required"
      });
    }

    // 1️⃣ Check service exists
    const service = await Service.findById(serviceId);

    if (!service || service.status !== "ACTIVE") {
      return res.status(404).json({
        message: "Service not available"
      });
    }

    // 2️⃣ Create request
    const request = await ServiceRequest.create({
      user: req.user.id,
      service: service._id,
      provider: service.provider, // auto assign
      description,
      address,
      preferredDate
    });

    res.status(201).json({
      message: "Service request submitted successfully",
      request
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Check transition validity
    if (!allowedTransitions[request.status].includes(status)) {
      return res.status(400).json({
        message: `Cannot change status from ${request.status} to ${status}`
      });
    }

    // Role-based validation
    if (status === "CANCELLED" && request.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only user can cancel" });
    }

    if (["ACCEPTED", "REJECTED", "COMPLETED"].includes(status) &&
        request.provider.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only provider can update this request" });
    }

    request.status = status;

    if (status === "COMPLETED") {
      request.completedAt = new Date();
    }

    await request.save();

    res.json({
      message: "Request status updated",
      request
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
