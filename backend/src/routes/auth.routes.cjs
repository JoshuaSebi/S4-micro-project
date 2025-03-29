const express = require('express');
const { register, login, deleteUser } = require('../controllers/auth.controller.cjs');
const authMiddleware = require('../middleware/auth.middleware.cjs');
const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.delete('/delete', authMiddleware, deleteUser);
module.exports = router;``
