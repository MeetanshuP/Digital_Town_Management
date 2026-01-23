const ServiceProviderRequest = require("../models/ServiceProvider");
const User = require("../models/user");

exports.getPendingRequests = async (req, res) => {
  const requests = await ServiceProviderRequest.find({ status: "PENDING" })
    .populate("user", "firstName lastName email");
  res.json(requests);
};

exports.updateRequestStatus = async (req, res) => {
  const { action } = req.body;
  const request = await ServiceProviderRequest.findById(req.params.id);

  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  request.status = action === "APPROVE" ? "APPROVED" : "REJECTED";
  await request.save();

  if (action === "APPROVE") {
    await User.findByIdAndUpdate(request.user, {
      role: "service_provider",
    });
  }

  res.json({ message: "Request updated" });
};
