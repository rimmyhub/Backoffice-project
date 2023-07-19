// order.service.js
const OrdersRepository = require('../repositories/orders.repository');
const { Order, Menu } = require('../models');

class OrdersService {
  ordersRepository = new OrdersRepository();

  //-- 주문하기 (고객) --//
  order = async (restaurant_id, order_items, client_id) => {
    try {
      // 주문 금액 계산
      let totalPayment = 0;
      for (const orderItem of order_items) {
        const menu = await Menu.findOne({ where: { menu_id: orderItem.menu_id } });
        if (!menu) {
          return { error: true, message: '해당하는 메뉴를 찾을 수 없습니다.' };
        }
        totalPayment += menu.price * orderItem.count;
      }

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

      return orderData;
    } catch (err) {
      console.error(err.stack);
      throw new Error(`${err.message}`);
    }
  };

  //-- 주문받기 (사장) --//
  orderReceive = async (order_id) => {
    try {
      const orderData = await Order.findByPk(order_id);

      if (!orderData) {
        return { error: true, message: `${order_id}번 주문을 찾을 수 없습니다.` };
      }
      let updateStatus = 0;
      let orderMessage = '';
      if (orderData.status === 0) {
        orderMessage = '주문접수 했습니다';
        updateStatus = 1;
      } else if (orderData.status === 1) {
        orderMessage = '배달완료 했습니다';
        updateStatus = 2;
      } else if (orderData.status === 2) {
        orderMessage = '완료된 주문입니다.';
        return orderMessage;
      } else {
        return { error: true, message: '잘못된 주문 상태 값입니다.' };
      }

      /**
       * @param {data} orderData - Order 테이블에 헤딩하는 데이터
       * @param {number} restaurant_id - 레스토랑 ID
       * @param {number} updateStatus - 업데이트 된 주문상태
       * @param {number} orderMessage - 주문상태 메세지
       */

      await this.ordersRepository.updateOrderStatus(orderData, updateStatus, orderMessage);

      return { message: orderMessage };
    } catch (err) {
      console.error(err.stack);
      throw new Error(`${err.message}`);
    }
  };
}

module.exports = OrdersService;
