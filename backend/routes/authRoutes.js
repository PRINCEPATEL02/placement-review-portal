const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, forgotPassword, changePassword } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.put('/change-password', verifyToken, changePassword);

module.exports = router;
