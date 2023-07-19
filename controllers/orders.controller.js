// orders.controller.js
const OredersService = require('../services/orders.service');

class OrdersController {
  ordersService = new OredersService();

  //-- 주문하기 (고객) --//
  order = async (req, res, next) => {
    // 검사 : 사장/유저 여부 확인
    if (res.locals.user.division !== 'Client')
      return res.status(412).send({ message: '너는 고객이 아니다.' });

    const { client_id } = res.locals.user;
    const { restaurant_id, order_items } = req.body;
    /**
     * @param {Array} order_items - [{menu_id:1, count:3}, {menu_id:2, count:2}, {menu_id:3, count:4}]
     */
    try {
      // 검사 : 주문 데이터 유효
      if (!restaurant_id || !order_items || order_items.length === 0) {
        return res.status(400).send({ message: '주문 데이터가 올바르지 않습니다.' });
      }

      const orderData = await this.ordersService.order(restaurant_id, order_items, client_id);
      // orderData -> { restaurant_id, order_items, client_id, totalPayment }
      const responseData = { ...orderData.dataValues, Owner_id: orderData.Owner_id };
      // responseData -> { restaurant_id, order_items, client_id, totalPayment, Owner_id}
      res.status(200).send({ data: responseData });
    } catch (err) {
      console.error(err.stack);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  //-- 주문조회 (고객) --//
  getOrderClient = async (req, res, next) => {
    try {
      const { client_id } = res.locals.user;

      const orderData = await this.ordersService.getOrderClient(client_id);
      res.status(200).send({ data: orderData });
    } catch (err) {
      console.error(err.stack);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  //-- 주문받기 (사장) --//
  orderReceive = async (req, res, next) => {
    if (res.locals.user.division !== 'Owner')
      return res.status(412).send({ message: '너는 사장이 아니다.' });

    const { order_id } = req.params;

    try {
      const orderData = await this.ordersService.orderReceive(order_id);

      res.status(200).send({ data: orderData });
    } catch (err) {
      console.error(err.stack);
      return res.status(400).send({ message: `${err.message}` });
    }
  };
}

module.exports = OrdersController;
