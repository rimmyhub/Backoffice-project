// orders.controller.js

const OredersService = require('../services/orders.service');

class OrdersController {
  ordersService = new OredersService();

  //-- 주문하기 (고객) --//
  order = async (req, res, next) => {
    // const { client_id } = res.locals.user;
    const { restaurant_id, order_items } = req.body;

    if (!restaurant_id || !order_items) {
      return res.status(400).send({ message: '주문 데이터가 없습니다.' });
    }

    if (!Array.isArray(order_items) || order_items.length === 0) {
      return res.status(400).send({ message: '주문 수량이 올바르지 않습니다.' });
    }

    const orderData = await this.ordersService.order(restaurant_id, order_items);

    res.status(200).send({ data: orderData });
  };
}

module.exports = OrdersController;
