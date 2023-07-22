const express = require('express');
const router = express.Router();
const path = require('path');

const authMiddleware = require('../middlewares/auth.middleware');

const RestaurantsRepository = require('../repositories/restaurants.repository');
const restaurantsRepository = new RestaurantsRepository();
const UserController = require('../controllers/users.controller');
const userController = new UserController();
const OrdersController = require('../controllers/orders.controller');
const ordersController = new OrdersController();
const OwnerController = require('../controllers/owners.controller');
const ownerController = new OwnerController();
const MenusController = require('../controllers/menus.controller');
const menusController = new MenusController();

// 로그인 페이지(사장)
router.get('/sign-in/:userType', (req, res) => {
  console.log('req.params.userType = ', req.params.userType);
  const userType = req.params.userType;

  const data = {
    userType: userType,
  };

  res.render('sign-in', data);
});

// 회원가입 페이지
router.get('/sign-up/:userType', (req, res) => {
  const userType = req.params.userType;

  const data = {
    userType: userType,
  };

  res.render('sign-up', data);
});

// 음식점 전체 조회
router.get('/', async (req, res) => {
  const { foodName, category } = req.query;
  const data = await restaurantsRepository.getAllRestaurant(foodName, category);
  res.render('index', { data });
});

// 서브 페이지 진입,
router.get('/sub-page/:restaurant_id', async (req, res) => {
  const restaurant_id = req.params.restaurant_id;
  const restaurantResult = await restaurantsRepository.getRestaurant({ restaurant_id });

  const data = restaurantResult[0].dataValues;
  let restaurant = data;

  let menus = data.Menus.map((menu) => menu.dataValues);
  let reviews = data.Reviews.map((review) => review.dataValues);

  res.render('sub-page', { restaurant, menus, reviews });
});

// 주문 정보 가져오기
router.get('/sub-page/:restaurant_id/order-page', async (req, res) => {
  const client = await userController.getUser();
  const menus = await menusController.getMenu();
  res.render('order-page', { menus, client });
});

// 마이 페이지(유저)
router.get('/my-page-client', async (req, res) => {
  const user = await userController.getUser();
  const orders = await ordersController.getOrderClient();
  res.render('my-page-client', { user, orders });
});

// 마이 페이지(사장님)
router.get('/my-page-owner', authMiddleware, async (req, res) => {
  const user = await ownerController.getUser();
  const orders = await ordersController.getOrderClient();
  const get = await menusController.getMenu();
  res.render('my-page-owner', { user, orders, get });
});

module.exports = router;
