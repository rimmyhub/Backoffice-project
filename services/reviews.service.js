// reviews.service.js
const ReviewsRepository = require('../repositories/reviews.repository');
const { Order } = require('../models');

class ReviewsService {
  reviewsRepository = new ReviewsRepository();

  //-- 리뷰 작성 --//
  createReview = async (Restaurant_id, Order_id, Client_id, content, rating) => {
    try {
      const order = await Order.findByPk(Order_id);

      // 검사 : 주문 데이터 여부
      if (!order) {
        return { error: true, message: '해당하는 주문을 찾을 수 없습니다.' };
      }

      // 검사 : 주문상태가 배달완료인지
      if (order.status === 0 || order.status === 1) {
        return { error: true, message: '주문이 접수중입니다.' };
      }

      if (order.status !== 2) {
        return { error: true, message: '주문 상태를 확인해주세요.' };
      }

      // 검사 : 주문자 정보와 동일한지
      if (order.Client_id === Client_id) {
        const reviewData = await this.reviewsRepository.createReview(
          Restaurant_id,
          Order_id,
          Client_id,
          content,
          rating
        );
        return reviewData;
      } else {
        return { error: true, message: '주문자와 리뷰 작성자가 일치하지 않습니다.' };
      }
    } catch (err) {
      console.error(err.stack);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  //-- 리뷰 보기 --//
  getReviews = async (Restaurant_id, Client_id, content, rating) => {
    try {
      const reviewData = await this.reviewsRepository.getReviews(
        Restaurant_id,
        Client_id,
        content,
        rating
      );
      return reviewData;
    } catch (err) {
      console.error(err.stack);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  //-- 리뷰 수정 --//
  modifyReview = async (Client_id, content, rating) => {
    // 유효성 검사
    if (!content || !rating) {
      return res.status(400).json({
        errorMessage: '수정 데이터.',
      });
    }

    // 유효성 검사
    if (content === '') {
      return res.status(400).json({
        errorMessage: '댓글 내용을 입력해주세요.',
      });
    }

    return this.CommentsRepository.updateComments(postId, commentId, title, content);
  };
}

module.exports = ReviewsService;
