const express = require('express');
const router = express.Router();
const { createReview, getReviews, approveReview, deleteReview, likeReview, getMyReviews, deleteMyReview } = require('../controllers/reviewController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

router.get('/my-reviews', verifyToken, getMyReviews); // Get own reviews
router.delete('/my-reviews/:id', verifyToken, deleteMyReview); // Delete own review

router.get('/', getReviews); // Public or filtered by param
router.post('/', verifyToken, createReview); // Students submit
router.put('/:id', verifyToken, verifyAdmin, require('../controllers/reviewController').updateReview); // Admin edit
router.put('/:id/approve', verifyToken, verifyAdmin, approveReview);
router.delete('/:id', verifyToken, verifyAdmin, deleteReview);
router.post('/:id/like', verifyToken, likeReview);

module.exports = router;
