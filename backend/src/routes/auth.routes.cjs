const express = require('express');
const { register, login, logout, deleteUser } = require('../controllers/auth.controller.cjs');
const authMiddleware = require('../middleware/auth.middleware.cjs');
const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.delete('/delete', authMiddleware, deleteUser);
module.exports = router;
