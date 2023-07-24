const express = require('express');
const router = express.Router();
const path = require('path');

const authMiddleware = require('../middlewares/auth.middleware');

// const RestaurantsRepository = require('../repositories/restaurants.repository');
// const restaurantsRepository = new RestaurantsRepository();
const RestaurantsController = require('../controllers/restaurants.controller');
const restaurantsController = new RestaurantsController();
const UserController = require('../controllers/users.controller');
const userController = new UserController();
const OrdersController = require('../controllers/orders.controller');
const ordersController = new OrdersController();
const OwnerController = require('../controllers/owners.controller');
const ownerController = new OwnerController();
const MenusController = require('../controllers/menus.controller');
const menusController = new MenusController();

// 메인 페이지 이동
router.get('/', async (req, res) => {
  const { foodName, category } = req.query;
  const data = await restaurantsController.getAllRestaurant(req, res);
  res.render('index', { data });
});

// 로그인 페이지 이동
router.get('/login/:userType', (req, res) => {
  const userType = req.params.userType;
  res.render('login', { userType });
});

// 회원가입 페이지 이동
router.get('/join/:userType', (req, res) => {
  const userType = req.params.userType;
  res.render('join', { userType });
});

// 서브 페이지 진입,
router.get('/sub-page/:restaurant_id', async (req, res) => {
  const restaurant = await restaurantsController.getRestaurant(req, res);
  const menus = restaurant.Menus;
  const reviews = restaurant.Reviews;
  res.render('sub-page', { restaurant, menus, reviews });
});

// 주문 정보 가져오기
router.get('/sub-page/:restaurant_id/order-page', async (req, res) => {
  await authMiddleware(req, res, async () => {
    const client = await userController.getUser(req, res);
    const menus = await menusController.getMenu(req, res);
    res.render('order-page', { menus, client });
  });
});

// 마이 페이지 이동
router.get('/mypage', async (req, res) => {
  await authMiddleware(req, res, async () => {
    if (res.locals.user.division === 'Client') {
      const user = await userController.getUser(req, res);
      const orders = await ordersController.getOrderClient(req, res);
      res.render('my-page-client', { user, orders });
    } else if (res.locals.user.division === 'Owner') {
      const user = await ownerController.getUser(req, res);
      const orders = await ordersController.getOrderOwner(req, res);
      const menus = await menusController.getMenu(req, res)
      res.render('my-page-owner', { user, orders, menus });
    }
  });
});

module.exports = router;
