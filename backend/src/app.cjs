const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes.cjs');
const playlistRoutes = require('./routes/playlist.routes.cjs');
const songRoutes = require('./routes/song.routes.cjs');
const userRoutes = require('./routes/user.routes.cjs');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/playlist', playlistRoutes);
app.use('/api/song', songRoutes);
app.use('/api/user', userRoutes);

// Health check route
app.get('/health', (req, res) => res.json({ status: 'ok' }));
const PORT = process.env.BACKEND_PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));