// order.service.js
const OrdersRepository = require('../repositories/orders.repository');
const { Order, Menu } = require('../models');

class OrdersService {
  ordersRepository = new OrdersRepository();

  //-- 주문하기 (고객) --//
  order = async (restaurant_id, order_items, client_id) => {
    try {
      /**
       * 주문 생성 (고객)
       * @param {number} restaurant_id - 레스토랑 ID
       * @param {Array} order_items - 주문 아이템 목록
       * @param {number} client_id - 고객 ID
       * @param {number} totalPayment - 총 주문 금액
       */
      const orderData = await this.ordersRepository.createOrder(
        restaurant_id,
        order_items,
        client_id,
        totalPayment
      );
    } catch (err) {
      console.error(err.stack);
      throw new Error(`${err.message}`);
    }
  };

  //-- 주문받기 (사장) --//
  orderReceive = async (order_id) => {
    try {
      /**
       * @param {data} orderData - Order 데이터
       * @param {number} restaurant_id - 레스토랑 ID
       * @param {number:0,1,2} updateStatus - 업데이트 된 주문상태
       */

      await this.ordersRepository.updateOrderStatus(orderData, updateStatus);
    } catch (err) {
      console.error(err.stack);
      throw new Error(`${err.message}`);
    }
  };
}

module.exports = OrdersService;
