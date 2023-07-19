const express = require('express');
const restaurantRouter = express.Router();
// const authMiddleware = require('../middlewares/auth-middleware');
// 사장님 추가되면 미들웨어 추가하기!
const RestaurantsController = require('../controllers/restaurants.controller');

const restaurantsController = new RestaurantsController();

// 음식점 조회
restaurantRouter.get('/restaurant/:restaurant_id', restaurantsController.getRestaurant);

// 음식점 등록
restaurantRouter.post('/restaurant', restaurantsController.postRestaurant);

// 음식점 수정
restaurantRouter.put('/restaurant/:restaurant_id', restaurantsController.putRestaurant);

// 음식점 삭제
restaurantRouter.delete('/restaurant/:restaurant_id', restaurantsController.deleteRestaurant);

module.exports = restaurantRouter;
