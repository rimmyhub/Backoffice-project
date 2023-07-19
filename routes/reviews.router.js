// reviews.router.js

const express = require('express');
const router = express.Router();
// const AuthMiddleware = require('../middlewares/auth.middleware');
// const authMiddleware = new AuthMiddleware();
const ReviewsController = require('../controllers/reviews.controller');
const reviewsController = new ReviewsController();

//-- 리뷰 작성 --//
// TO DO :: authMiddleware ???
router.post('/review/:Restaurant_id/:Order_id', reviewsController.createReview);

//-- 리뷰 보기 --//
// TO DO :: authMiddleware ???
router.get('/review/:Restaurant_id', reviewsController.getReviews);

module.exports = router;
