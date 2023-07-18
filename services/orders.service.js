// order.service.js
const OrdersRepository = require('../repositories/orders.repository');
const { Orders, Menu } = require('../models');

class OrdersService {
  ordersRepository = new OrdersRepository();

  //-- 주문하기 (고객) --//
  order = async (restaurant_id, order_items) => {
    // 총 주문금액 계산
    let totalPayment = 0;

    for (const orderItem of order_items) {
      const menu = await Menu.findOne({ where: { id: orderItem.menu_id } });
      if (!menu) {
        throw new Error(`메뉴 아이디 ${orderItem.menu_id}에 해당하는 메뉴를 찾을 수 없습니다.`);
      }
      totalPayment += menu.price * orderItem.count;
    }

    console.log(totalPayment);
    const orderData = await this.ordersRepository.createOrder(restaurant_id, totalPayment);
    return { restaurant_id, totalPayment };
  };
}

module.exports = OrdersService;
