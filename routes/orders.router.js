// order.router.js

const express = require('express');
const router = express.Router();
const OrdersController = require('../controllers/orders.controller');
const ordersController = new OrdersController();

// 주문하기 (고객)
router.post('/order', ordersController.order);

// 주문받기 (사장)
router.get('/order-receive', (req, res) => {});

module.exports = router;
