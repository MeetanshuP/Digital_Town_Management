require('dotenv').config();
const express = require('express');

const {connectDB,pool} = require('./config/db');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(express.json());
app.use(morgan("dev"));
// Connect Database
connectDB();


pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('DB Error', err);
  } else {
    console.log('DB Connected:', res.rows[0]);
  }
});


app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/news", require("./routes/newsRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/marketplace", require("./routes/marketplaceRoutes"));
app.use("/api/grievances", require("./routes/grievanceRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/service-provider", require("./routes/serviceProviderRoutes"));
app.use("/api/admin", require("./routes/adminServiceProviderRoutes"));
app.use("/api/admin", require("./routes/adminGrievanceRoutes"));
app.use("/api/location", require("./routes/location"));
app.use("/api/places", require("./routes/places"));


app.get('/', (req, res) => {
    res.status(200).send('API is running');
});

// Global Error Handler

app.use((err, req, res, next) => {
    console.error(" Error:", err.message);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port : ${PORT}`);
});