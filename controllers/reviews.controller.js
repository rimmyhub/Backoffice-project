// reviews.controller.js
const ReviewsService = require('../services/reviews.service');
const { Reviews } = require('../models');
class ReviewsController {
  reviewService = new ReviewsService();

  //-- 리뷰 작성 --//
  createReview = async (req, res, next) => {
    const { content, rating } = req.body;
    const { client_id: Client_id } = res.locals.user;
    const { order_id: Order_id } = req.params;

    try {
      // 검사 : 데이터 검사
      if (!Order_id || !Client_id) {
        return res.status(400).send({ message: '주문내역과 주문자를 확인해주세요' });
      }

      // 검사 : 내용,평점 여부
      if (!content || !rating) {
        return res.status(400).send({ message: '내용과 별점 내용을 추가해주세요.' });
      }

      const reviewData = await this.reviewService.createReview(
        Order_id,
        Client_id,
        content,
        rating
      );

      res.status(200).send({ data: reviewData });
    } catch (err) {
      console.error(err.stack);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  //-- 리뷰 보기 --//
  getReviews = async (req, res, next) => {
    // TO DO :: 임시
    const { restaurant_id } = req.params;

    try {
      // const reviewData = await this.reviewService.getReviews(restaurant_id);

      res.status(200).send({ data: reviewData });
    } catch (err) {
      console.error(err.stack);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  //-- 리뷰 수정 --//
  modifyReview = async (req, res, next) => {
    const { content, rating } = req.body;
    const { client_id: Client_id } = res.locals.user;
    const { order_id: Order_id } = req.params;

    try {
      // 유효성 검사
      if (!content || !rating || !Client_id || !Order_id)
        return res.status(400).json({
          errorMessage: '수정 데이터를 확인해주세요.',
        });

      // 유효성 검사
      if (content === '')
        return res.status(400).json({
          errorMessage: '댓글 내용을 입력해주세요.',
        });

      const modifyReviewMessage = await this.reviewService.modifyReview(
        Order_id,
        Client_id,
        content,
        rating
      );

      res.status(200).send({ data: modifyReviewMessage });
    } catch (err) {
      console.error(err.stack);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  //-- 리뷰 삭제 --//
  deleteReview = async (req, res, next) => {
    const { client_id: Client_id } = res.locals.user;
    const { order_id: Order_id } = req.params;

    try {
      const deleteReviewMessage = await this.reviewService.deleteReview(Order_id, Client_id);

      res.status(200).send({ data: deleteReviewMessage });
    } catch (err) {
      console.error(err.stack);
      return res.status(400).send({ message: `${err.message}` });
    }
  };
}

module.exports = ReviewsController;
