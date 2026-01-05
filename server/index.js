require('dotenv').config();
const express = require('express');

const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(express.json());

// Connect Database
connectDB();

app.use("/api/auth", require("./routes/authRoutes"));

app.get('/', (req, res) => {
    res.status(200).send('API is running');
});

// Global Error Handler

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});