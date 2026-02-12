const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng, radius = 5000, category, type } = req.query;

    // 🔴 validation
    if (!lat || !lng) {
      return res.status(400).json({ error: "lat and lng are required" });
    }

    const query = `
      SELECT
        id as _id,
        name,
        category,
        type,
        address,
        phone as contact,
        ST_Distance(
          location::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        ) AS distance
      FROM places
      WHERE ST_DWithin(
        location::geography,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
        $3
      )
      AND ($4::text IS NULL OR category = $4)
      AND ($5::text IS NULL OR type = $5)
      ORDER BY distance
      LIMIT 100;
    `;

    const values = [
      lng,
      lat,
      radius,
      category || null,
      type || null
    ];

    const result = await pool.query(query, values);
    // console.log(result.rows);
    res.json(result.rows);


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
