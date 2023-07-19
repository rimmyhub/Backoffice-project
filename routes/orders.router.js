// order.router.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const OrdersController = require('../controllers/orders.controller');
const ordersController = new OrdersController();

//-- 주문하기 (고객) --//
// router.post('/order', authMiddleware.verifyAccessToken, ordersController.order);
router.post('/order', authMiddleware, ordersController.order);

// TO DO :: 클라이언트.js 추가 코드
// const socket = io('/orders');

// socket.on('new_order', (orderData) => {
//   alert('새로운 주문이 도착했습니다.');
//   console.log('주문 정보:', orderData);
// });
// 주문받기 (사장)
router.patch('/order-receive/:order_id', authMiddleware, ordersController.orderReceive);

module.exports = router;
