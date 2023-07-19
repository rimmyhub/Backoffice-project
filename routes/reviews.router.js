// reviews.router.js

const express = require('express');
const router = express.Router();
// const AuthMiddleware = require('../middlewares/auth.middleware');
// const authMiddleware = new AuthMiddleware();
const ReviewsController = require('../controllers/reviews.controller');
const reviewsController = new ReviewsController();

//-- 리뷰 작성 --//
router.post('/review/:Restaurant_id/:Order_id', reviewsController.createReview);

//-- 리뷰 보기 --//
router.get('/review/:Restaurant_id', reviewsController.getReviews);

//-- 리뷰 수정 --//
router.put('/review/:Restaurant_id/:Order_id', reviewsController.modifyReview);

module.exports = router;
