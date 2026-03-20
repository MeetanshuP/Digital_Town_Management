const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error(
      "Invalid file type. Only JPEG, JPG, PNG and WEBP images are allowed."
    );
    error.status = 400;
    cb(error, false);
  }
};

const upload = multer({
  storage: storage,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },

  fileFilter: fileFilter,
});

module.exports = upload;