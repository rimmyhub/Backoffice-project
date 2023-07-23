const express = require('express');
const restaurantRouter = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const RestaurantsController = require('../controllers/restaurants.controller');

const restaurantsController = new RestaurantsController();

// 음식점 전체 조회
// restaurantRouter.get('/restaurant', restaurantsController.getAllRestaurant);

// 음식점 조회
// restaurantRouter.get('/restaurant/:restaurant_id', restaurantsController.getRestaurant);

// 음식점 등록
restaurantRouter.post('/restaurant', authMiddleware, restaurantsController.postRestaurant);

// 음식점 수정
restaurantRouter.put(
  '/restaurant/:restaurant_id',
  authMiddleware,
  restaurantsController.putRestaurant
);

// 음식점 삭제
restaurantRouter.delete(
  '/restaurant/:restaurant_id',
  authMiddleware,
  restaurantsController.deleteRestaurant
);

module.exports = restaurantRouter;
