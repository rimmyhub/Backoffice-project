// reviews.router.js

const express = require('express');
const router = express.Router();
// const AuthMiddleware = require('../middlewares/auth.middleware');
// const authMiddleware = new AuthMiddleware();
const ReviewsController = require('../controllers/reviews.controller');
const reviewsController = new ReviewsController();

//-- 리뷰 작성 --//
// TO DO :: authMiddleware ???
router.post('/review/:order_id', reviewsController.createReview);

module.exports = router;
