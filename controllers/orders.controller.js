// order.controller.js
const OredersService = require('../services/orders.service');

class OrdersController {
  ordersService = new OredersService();

  // 주문하기 (고객)
  order = async (req, res, next) => {};
}

module.exports = OrdersController;
