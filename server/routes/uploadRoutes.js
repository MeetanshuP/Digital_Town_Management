const express = require("express");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/image", upload.single("image"), (req, res) => {
  res.status(200).json({
    message: "Image uploaded successfully",
    imageUrl: req.file.path, // cloudinary URL
  });
});

module.exports = router;
