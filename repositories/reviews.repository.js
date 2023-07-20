// reviews.repository.js
const { Review, Client, Order } = require('../models');
class ReviewsRepository {
  //-- 리뷰 작성 --//
  createReview = async (Order_id, Client_id, content, rating) => {
    try {
      const order = await Order.findByPk(Order_id);

      // 검사 : 주문 데이터 여부
      if (!order) return { error: true, message: '해당하는 주문을 찾을 수 없습니다.' };

      // 검사 : 주문상태가 배달완료인지
      if (order.status === 0 || order.status === 1)
        return { error: true, message: '주문이 접수중입니다.' };

      // 검사 : 주문상태가 배달완료인지
      if (order.status !== 2) return { error: true, message: '배달이 완료되지 않았습니다.' };

      // 검사 : 주문자 정보와 동일한지
      if (order.Client_id !== Client_id)
        return { error: true, message: '주문자 정보와 동일하지 않습니다.' };

      // 기존 리뷰
      const existingReview = await Review.findOne({
        where: {
          Order_id,
          Client_id,
        },
      });

      // 검사 : 리뷰 한개 이상시 오류
      if (existingReview) return { error: true, message: '이미 해당 주문의 리뷰를 작성했습니다.' };

      // Restaurant_id 가져오기
      const Restaurant_id = order.Restaurant_id;

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
  getReviews = async (restaurant_id) => {
    // console.log(restaurant_id);
    try {
      const reviews = await Review.findAll({
        where: {
          Restaurant_id: restaurant_id,
        },
        include: {
          model: Client,
          attributes: ['name'],
        },
      });

      if (!reviews.length) return { error: true, message: '해당 음식점의 리뷰가 없습니다.' };
      console.log(reviews);
      return reviews;
    } catch (err) {
      console.error(err.stack);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  //-- 리뷰 수정 --//
  modifyReviewUpdate = async (Order_id, Client_id, content, rating) => {
    try {
      const review = await Review.findOne({
        where: {
          Order_id,
          Client_id,
        },
      });

      // 검사 : 주문 데이터 여부
      if (!review) return { error: true, message: '해당하는 주문을 찾을 수 없습니다.' };

      // 검사 : 주문자 정보와 동일한지
      if (review.Client_id !== Client_id)
        return { error: true, message: '주문자 정보와 동일하지 않습니다.' };

      // 리뷰 수정
      review.content = content;
      review.rating = rating;
      await review.save();

      return { success: true, message: '리뷰가 수정되었습니다.' };
    } catch (err) {
      console.error(err.stack);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  //-- 리뷰 삭제 --//
  deleteReview = async (Order_id, Client_id) => {
    const review = await Review.findOne({
      where: {
        Order_id,
        Client_id,
      },
    });

    // 검사: 리뷰가 없을 때 오류
    if (!review) return { error: true, message: '삭제할 리뷰가 없습니다.' };

    // 리뷰 삭제
    await review.destroy();

    return { success: true, message: '리뷰가 삭제되었습니다.' };
  };
}

module.exports = ReviewsRepository;
