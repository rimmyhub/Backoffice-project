// order.repository.js
const { Order, OrderDetail, Client, Owner } = require('../models');

class OrdersRepository {
  //-- 주문하기 (고객) --//
  createOrder = async (restaurant_id, order_items) => {
    // 트랜잭션으로 비즈니스 로직 수행
    const t = await sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED, // 격리수준
    });

    try {
      // Order 테이블에 저장
      const orderData = await Order.create({ Restaurant_id: restaurant_id }, { transaction: t });

      const orderId = orderData.order_id;

      // OrderDetail 테이블에 저장
      for (const orderItem of order_items) {
        await OrderDetail.create(
          {
            Order_id: orderId,
            Menu_id: orderItem.menu_id,
            count: orderItem.count,
          },
          { transaction: t }
        );
      }

      // Clients 테이블의 point 차감
      const client = await Client.findByPk(orderData.Client_id, { transaction: t });
      const totalOrderAmount = order_items.reduce(
        (total, item) => total + item.count * item.price,
        0
      );
      client.point -= totalOrderAmount;
      await client.save({ transaction: t });

      // Owners 테이블의 point 증가
      const restaurant = await Owner.findOne(
        { where: { Restaurant_id: restaurant_id } },
        { transaction: t }
      );
      restaurant.point += totalOrderAmount;
      await restaurant.save({ transaction: t });

      // 모든 작업이 성공하면 커밋
      await t.commit();

      return orderData;
    } catch (err) {
      // 오류가 발생하면 롤백
      await t.rollback();
      throw err;
    }
  };
}

module.exports = OrdersRepository;
