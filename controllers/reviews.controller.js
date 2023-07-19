// reviews.controller.js
const ReviewsService = require('../services/reviews.service');
const { Reviews } = require('../models');
class ReviewsController {
  reviewService = new ReviewsService();

  //-- 리뷰 작성 --//
  createReview = async (req, res, next) => {
    // TO DO :: 임시
    let { Client_id, content, rating } = req.body;
    Client_id = 131;
    const { Order_id } = req.params;
    const { Restaurant_id } = req.params;

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
        Restaurant_id,
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
    const { content, rating } = req.body;
    const { Restaurant_id } = req.params;
    const Client_id = 1;

    try {
      const reviewData = await this.reviewService.getReviews(
        Restaurant_id,
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
}

module.exports = ReviewsController;
