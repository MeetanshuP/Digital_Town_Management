// routes/location.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/reverse-geocode", async (req, res) => {
  const { lat, lon } = req.query;



  
  if (!lat || !lon) {
    return res.status(400).json({
      message: "Latitude and longitude are required"
    });
  }

  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          lat,
          lon,
          format: "json"
        },
        headers: {
          "User-Agent": "DigitalTownManagement/1.0 (student-project)"
        }
      }
    );
    // console.log(response.data);
    res.json(response.data);
  } catch (err) {
    // console.error("Reverse geocoding error:", error.message);
    res.status(500).json({
      message: "Failed to reverse geocode location"
    });

  }
});

module.exports = router;
