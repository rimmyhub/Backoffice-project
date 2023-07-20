// order.service.js
const OrdersRepository = require('../repositories/orders.repository');

class OrdersService {
  ordersRepository = new OrdersRepository();

  //-- 주문하기 (고객) --//
  order = async (restaurant_id, order_items, client_id) => {
    /**
     * 주문 생성 (고객)
     * @param {number} restaurant_id - 레스토랑 ID
     * @param {Array} order_items - 주문 아이템 목록
     * @param {number} client_id - 고객 ID
     */
    return await this.ordersRepository.createOrder(restaurant_id, order_items, client_id);
  };

  //-- 주문조회 (고객) --//
  getOrderClient = async (client_id) => {
    return await this.ordersRepository.getOrderClient(client_id);
  };

  //-- 주문조회 (사장) --//
  getOrderOwner = async (owner_id) => {
    return await this.ordersRepository.getOrderOwner(owner_id);
  };

  //-- 주문받기 (사장) --//
  orderReceive = async (order_id) => {
    return this.ordersRepository.updateOrderStatus(order_id);
  };
}

module.exports = OrdersService;
