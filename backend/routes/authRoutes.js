const express = require('express');
const router = express.Router();
const {
    register, login, getProfile, updateProfile,
    forgotPassword, changePassword,
    createUser, getPendingUsers, approveUser
} = require('../controllers/authController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.put('/change-password', verifyToken, changePassword);

// Admin Routes
router.post('/create-user', verifyToken, verifyAdmin, createUser);
router.get('/pending-users', verifyToken, verifyAdmin, getPendingUsers);
router.put('/approve-user/:id', verifyToken, verifyAdmin, approveUser);

module.exports = router;
