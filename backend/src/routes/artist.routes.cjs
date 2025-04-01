const express = require('express');
const { getAllArtists } = require('../controllers/artistController.cjs');
const router = express.Router();

router.get('/artists', getAllArtists);

module.exports = router;
