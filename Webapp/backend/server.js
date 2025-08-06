const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Initialize AIML services
const AIML = require('../AIML');

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

// Health check route
app.get('/', (req, res) => {
    res.send('Backend server is running!');
});

// Initialize AIML services
AIML.initialize().then(result => {
    if (result.success) {
        console.log('✅ AIML services ready');
    } else {
        console.log('⚠️  AIML services failed to initialize:', result.error);
    }
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Backend server is running!',
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/content', require('./routes/content'));
app.use('/api/schedule', require('./routes/schedule'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/ai', require('./routes/ai'));

// Catch-all route for undefined endpoints
app.use((req, res, next) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));