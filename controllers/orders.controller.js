// orders.controller.js
const OredersService = require('../services/orders.service');
const { Restaurant, Client } = require('../models');

class OrdersController {
  ordersService = new OredersService();

  //-- 주문하기 (고객) --//
  order = async (req, res, next) => {
    // TO DO :: 임시
    let { client_id, restaurant_id, order_items } = req.body;

    try {
      // 검사 : 주문 데이터 유효
      if (!restaurant_id || !order_items || order_items.length === 0) {
        return res.status(400).send({ message: '주문 데이터가 올바르지 않습니다.' });
      }

      const orderData = await this.ordersService.order(restaurant_id, order_items, client_id);

      res.status(200).send({ data: orderData });
    } catch (err) {
      console.error(err.stack);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  //-- 주문받기 (사장) --//
  orderReceive = async (req, res, next) => {
    // TO DO :: order_id 가져올것/ 테스트용
    const { order_id } = req.params;

    try {
      const orderMessage = await this.ordersService.orderReceive(order_id);

      res.status(200).send({ orderMessage });
    } catch (err) {
      console.error(err.stack);
      return res.status(400).send({ message: `${err.message}` });
    }
  };
}

module.exports = OrdersController;
