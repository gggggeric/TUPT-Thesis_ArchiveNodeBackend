require('dotenv').config();
const express = require('express');
const connectDB = require('./db/connection');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to DB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/auth', require('./routes/auth'));

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});