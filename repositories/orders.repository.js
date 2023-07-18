// order.repository.js

const { Order, OrderDetail } = require('../models');

class OrdersRepository {
  //-- 주문하기 (고객) --//
  createOrder = async (restaurant_id, order_items) => {
    // Order 테이블에 음식점 ID 저장
    const order = await Order.create({ restaurant_id });

    const orderId = order.id;

    // OrderDetail 테이블에 데이터 저장
    for (const orderItem of order_items) {
      console.log(orderItem);
      await OrderDetail.create({
        Order_id: orderId,
        Menu_id: orderItem.menu_id,
        count: orderItem.count,
      });
    }

    return order_items;
  };
}

module.exports = OrdersRepository;
