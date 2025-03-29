const express = require('express');
const { addSongToPlaylist, removeSongFromPlaylist, searchSong } = require('../controllers/song.controller.cjs');
const authMiddleware = require('../middleware/auth.middleware.cjs');

const router = express.Router();

router.post('/add', authMiddleware, addSongToPlaylist);
router.post('/remove', authMiddleware, removeSongFromPlaylist);
router.get('/search', authMiddleware, searchSong);

module.exports = router;
