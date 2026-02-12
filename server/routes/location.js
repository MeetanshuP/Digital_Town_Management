const express = require("express");
const router = express.Router();

const {
  getLocationFromCoordinates
} = require("../services/location.service");

router.get("/reverse-geocode", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({
      message: "Latitude and longitude are required"
    });
  }

  try {
    const location = await getLocationFromCoordinates(lat, lon);
    return res.json(location);

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;
