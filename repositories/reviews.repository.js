// reviews.repository.js
const { Review } = require('../models');
class ReviewsRepository {
  createReview = async (Order_id, Client_id, content, rating) => {
    const reviewData = await Review.create({ Order_id, Client_id, content, rating });

    return reviewData;
  };
}

module.exports = ReviewsRepository;
