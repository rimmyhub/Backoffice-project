// reviews.service.js
const ReviewsRepository = require('../repositories/reviews.repository');
const { Review, Order } = require('../models');

class ReviewsService {
  reviewsRepository = new ReviewsRepository();

  createReview = async (Order_id, Client_id, content, rating) => {
    const order = await Order.findByPk(Order_id);

    // 검사 : 주문 데이터 여부
    if (!order) {
      throw new Error('해당하는 주문을 찾을 수 없습니다.');
    }

    // Orders 테이블의 Client_id와 현재 Client_id를 비교하여 일치하는 경우에만 리뷰 생성
    if (order.Client_id === Client_id) {
      const reviewData = await this.reviewsRepository.createReview(
        Order_id,
        Client_id,
        content,
        rating
      );
      return reviewData;
    } else {
      throw new Error(`주문자와 리뷰 작성자가 일치하지 않습니다.`);
    }
  };
}

module.exports = ReviewsService;
