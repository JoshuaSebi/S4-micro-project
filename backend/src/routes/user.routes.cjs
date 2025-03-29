const express = require('express');
const { getUserDetails } = require('../controllers/user.controller.cjs');
const authMiddleware = require('../middleware/auth.middleware.cjs');

const router = express.Router();

router.get('/me', authMiddleware, getUserDetails);

module.exports = router;
