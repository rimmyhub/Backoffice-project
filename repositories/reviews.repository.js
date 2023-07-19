// reviews.repository.js
const { Review, Client } = require('../models');
class ReviewsRepository {
  //-- 리뷰 작성 --//
  createReview = async (Restaurant_id, Order_id, Client_id, content, rating) => {
    try {
      // 기존 리뷰
      const existingReview = await Review.findOne({
        where: {
          Restaurant_id,
          Order_id,
          Client_id,
        },
      });

      // 검사 : 리뷰 한개이상시 오류
      if (existingReview) {
        return { error: true, message: '이미 해당하는 리뷰가 존재합니다.' };
      }

      const reviewData = await Review.create({
        Restaurant_id,
        Order_id,
        Client_id,
        content,
        rating,
      });
      return reviewData;
    } catch (err) {
      console.error(err.stack);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  //-- 리뷰 보기 --//
  getReviews = async (Restaurant_id, Client_id, content, rating) => {
    try {
      const reviews = await Review.findAll({
        where: {
          Restaurant_id: Restaurant_id,
        },
        include: {
          model: Client,
          attributes: ['name'],
        },
      });

      return reviews;
    } catch (err) {
      console.error(err.stack);
      return res.status(400).send({ message: `${err.message}` });
    }
  };
}

module.exports = ReviewsRepository;
