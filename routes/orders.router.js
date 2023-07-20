// order.router.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const OrdersController = require('../controllers/orders.controller');
const ordersController = new OrdersController();

//-- 주문하기 (고객) --//
router.post('/order', authMiddleware, ordersController.order);

//-- 주문조회 (고객/사장)--//
router.get('/order/:client_id', authMiddleware, ordersController.getOrderClient);

//-- 주문받기 (사장) --//
router.patch('/order-receive/:order_id', authMiddleware, ordersController.orderReceive);

module.exports = router;
