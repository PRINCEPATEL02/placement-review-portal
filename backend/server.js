const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db'); // Ensure DB connects

dotenv.config();

// Connect to Database
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`Error: Port ${PORT} is already in use. Please check if another instance is running.`);
        } else {
            console.error('Server error:', err);
        }
        process.exit(1);
    });
}).catch(err => {
    console.error('Database connection failed', err);
    process.exit(1);
});
