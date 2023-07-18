// orders.controller.js
const OredersService = require('../services/orders.service');
const { Restaurant } = require('../models');

class OrdersController {
  ordersService = new OredersService();

  //-- 주문하기 (고객) --//
  order = async (req, res, next) => {
    // const { client_id } = res.locals.user;
    const { restaurant_id, order_items } = req.body;

    // 검사 : 주문 데이터 유효
    if (!restaurant_id || !order_items) {
      return res.status(400).send({ message: '주문 데이터가 없습니다.' });
    }

    // 검사 : 주문 수량 유효
    if (order_items.length === 0) {
      return res.status(400).send({ message: '주문 수량은 최소 1개 이상입니다.' });
    }

    // 검사 : 레스토랑 존재 여부
    const restaurant = await Restaurant.findOne({
      where: {
        restaurant_id: restaurant_id,
      },
    });
    if (!restaurant) {
      return res.status(404).send({ message: '존재하지 않는 음식점입니다.' });
    }

    const orderData = await this.ordersService.order(restaurant_id, order_items);

    res.status(200).send({ data: orderData });
  };
}

module.exports = OrdersController;
