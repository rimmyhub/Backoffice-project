const express = require('express');
const router = express.Router();
const path = require('path');
const RestaurantsRepository = require('../repositories/restaurants.repository');

const restaurantsRepository = new RestaurantsRepository();

const UserController = require('../controllers/users.controller');
const userController = new UserController();
const OrdersController = require('../controllers/orders.controller');
const ordersController = new OrdersController();

// 음식점 전체 조회
router.get('/', async (req, res) => {
  // /restaurants?foodName=오리지널 버거 콤보
  const data = await restaurantsRepository.getAllRestaurant();
  res.render('index', { data });
});

// 특정 음식점 조회

//검색할때 쿼리 스트링

// 마이 페이지(유저)
router.get('/my-page-client', async (req, res) => {
  const user = await userController.getUser();
  const orders = await ordersController.getOrderClient();
  res.render('my-page-client', { user, orders });
});

module.exports = router;
