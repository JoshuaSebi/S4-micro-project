const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes.cjs');
const playlistRoutes = require('./routes/playlist.routes.cjs');
const songRoutes = require('./routes/song.routes.cjs');
const userRoutes = require('./routes/user.routes.cjs');
// const artistRoutes = require('./routes/artist.routes.cjs');
const addSongRoutes = require('./routes/addSong.routes.cjs');
const artistRoutes = require("./routes/artist.routes.cjs");

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Add all needed methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Explicitly allow headers
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/playlist', playlistRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/user', userRoutes);
app.use('/api/dev', addSongRoutes);  // Isolated under /dev
app.use('/api/', artistRoutes);

// Health check route with improved response
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.BACKEND_PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});