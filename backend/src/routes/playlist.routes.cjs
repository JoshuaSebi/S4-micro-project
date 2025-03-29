const express = require('express');
const { createPlaylist, deletePlaylist, getUserPlaylists, getPlaylistSongs } = require('../controllers/playlist.controller.cjs');
const authMiddleware = require('../middleware/auth.middleware.cjs');

const router = express.Router();

router.post('/create', authMiddleware, createPlaylist);
router.delete('/delete/:id', authMiddleware, deletePlaylist);
router.get('/user-playlists', authMiddleware, getUserPlaylists);
router.get('/playlist-songs/:id', authMiddleware, getPlaylistSongs);

module.exports = router;
