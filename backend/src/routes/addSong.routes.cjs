const express = require('express');
const router = express.Router();
const { addMusicData } = require('../controllers/addSong.controller.cjs');

router.post('/', addMusicData); // POST /api/test/seed

module.exports = router;