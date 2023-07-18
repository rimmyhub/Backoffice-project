// order.service.js

const OrdersRepository = require('../repositories/orders.repository');
const { Orders } = require('../models');

class OrdersService {
  ordersRepository = new OrdersRepository();

  //-- 주문하기 (고객) --//
  order = async (restaurant_id, order_items) => {
    const orderData = await this.ordersRepository.createOrder(restaurant_id, order_items);
    return { restaurant_id, order_items };
  };
}

module.exports = OrdersService;
