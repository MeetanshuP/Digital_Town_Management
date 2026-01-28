const express = require("express");
const {
  createServiceProviderRequest,
} = require("../controllers/serviceProviderController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/apply", authMiddleware, createServiceProviderRequest);

module.exports = router;
