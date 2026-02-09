const ServiceProviderRequest = require("../models/ServiceProvider");
const User = require("../models/user");

exports.getPendingRequests = async (req, res) => {
  // console.log("i here for answer");
  const requests = await ServiceProviderRequest.find({ status: "PENDING" })
    .populate("user", "firstName lastName email");
  res.json(requests);
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { action } = req.body;
    // console.log(`[ADMIN DEBUG] Updating request ${req.params.id} with action ${action}`);

    const request = await ServiceProviderRequest.findById(req.params.id);

    if (!request) {
      // console.log(`[ADMIN DEBUG] Request ${req.params.id} not found`);
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = action === "APPROVE" ? "APPROVED" : "REJECTED";
    await request.save();
    // console.log(`[ADMIN DEBUG] Status set to ${request.status}`);

    if (action === "APPROVE") {
      await User.findByIdAndUpdate(request.user, {
        role: "service_provider",
      });
      // console.log(`[ADMIN DEBUG] User role updated to service_provider`);
    }

    res.json({ message: "Request updated", status: request.status });
  } catch (error) {
    // console.error(`[ADMIN DEBUG] Error updating request:`, error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
