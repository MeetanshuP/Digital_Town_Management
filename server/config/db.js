const mongoose = require("mongoose");
const { Pool } = require('pg');

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: process.env.DB_PASSWORD,
  database: "geo_db",
  port: 5432
});

// module.exports = pool;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = {connectDB,pool};
