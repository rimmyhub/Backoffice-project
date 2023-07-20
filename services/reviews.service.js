// reviews.service.js
const ReviewsRepository = require('../repositories/reviews.repository');

class ReviewsService {
  reviewsRepository = new ReviewsRepository();

  //-- 리뷰 작성 --//
  createReview = async (Order_id, Client_id, content, rating) => {
    return await this.reviewsRepository.createReview(Order_id, Client_id, content, rating);
  };

  //-- 리뷰 보기 --//
  getReviews = async (restaurant_id) => {
    return await this.reviewsRepository.getReviews(restaurant_id);
  };

  //-- 리뷰 수정 --//
  modifyReview = async (Order_id, Client_id, content, rating) => {
    return this.reviewsRepository.modifyReviewUpdate(Order_id, Client_id, content, rating);
  };

  //-- 리뷰 삭제 --//
  deleteReview = async (Order_id, Client_id) => {
    return this.reviewsRepository.deleteReview(Order_id, Client_id);
  };
}

module.exports = ReviewsService;
