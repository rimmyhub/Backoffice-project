// reviews.router.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const ReviewsController = require('../controllers/reviews.controller');
const reviewsController = new ReviewsController();

//-- 리뷰 작성 --//
router.post('/review/:order_id', authMiddleware, reviewsController.createReview);

//-- 리뷰 보기 --//
router.get('/review/:restaurant_id', reviewsController.getReviews);

//-- 리뷰 수정 --//
router.put('/review/:order_id', authMiddleware, reviewsController.modifyReview);

//-- 리뷰 삭제 --//
// router.delete('/review/:order_id', authMiddleware, reviewsController.deleteReview);

module.exports = router;
