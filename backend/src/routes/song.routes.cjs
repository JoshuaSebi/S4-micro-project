// src/routes/song.routes.cjs
const express = require('express');
const songController = require('../controllers/song.controller.cjs');
const authMiddleware = require('../middleware/auth.middleware.cjs');

const router = express.Router();

// Make sure these match exactly what your frontend is requesting
router.post('/add-to-playlist', authMiddleware, songController.addSongToPlaylist);
router.post('/remove-from-playlist', authMiddleware, songController.removeSongFromPlaylist);
router.get('/search', authMiddleware, songController.searchSong);
router.get('/:name', authMiddleware, songController.getSongByName);

module.exports = router;