const ServiceProviderRequest = require("../models/serviceProvider");

exports.createServiceProviderRequest = async (req, res) => {
  try {
    const {
      serviceCategory,
      serviceTitle,
      description,
      // experience,
      //   location,
      serviceImage,
    } = req.body;

    if (
      !serviceCategory ||
      !serviceTitle ||
      !description 
      // !experience
      // ||  !location
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await ServiceProviderRequest.findOne({
      user: req.user.id,
      status: "PENDING",
    });

    if (existing) {
      return res
        .status(409)
        .json({ message: "Request already submitted" });
    }

    const request = await ServiceProviderRequest.create({
      user: req.user.id,
      serviceCategory,
      serviceTitle,
      description,
      // experience,
      //   location,
      // serviceImage,
    });
    // console.Console.log(request)
    res.status(201).json({
      message: "Service provider request submitted",
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
