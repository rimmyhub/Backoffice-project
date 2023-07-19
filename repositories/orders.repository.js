// order.repository.js
const { Order, OrderDetail, Client, Owner, Restaurant, sequelize } = require('../models');
const { Transaction } = require('sequelize');

class OrdersRepository {
  //-- 주문하기 (고객) --//
  createOrder = async (restaurant_id, order_items, client_id, totalPayment) => {
    // 트랜잭션 : 설정
    const t = await sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED, // 격리수준 설정
    });

    try {
      // Order 테이블에 주문 정보 저장
      const orderData = await Order.create(
        { Restaurant_id: restaurant_id, Client_id: client_id },
        { transaction: t } // 트랜잭션 적용
      );
      const orderId = orderData.order_id;

      // OrderDetail 테이블에 주문 상세정보 저장
      const orderDetailsData = order_items.map((orderItem) => ({
        Order_id: orderId,
        Menu_id: orderItem.menu_id,
        count: orderItem.count,
      }));

      await OrderDetail.bulkCreate(orderDetailsData, { transaction: t });

      // Clients :: 포인트 차감
      const orderClient = await Client.findByPk(client_id, { transaction: t });
      orderClient.point -= totalPayment;
      await orderClient.save({ transaction: t });

      // Owners :: 포인트 증가
      const restaurant = await Restaurant.findOne(
        { where: { restaurant_id: restaurant_id } },
        { transaction: t }
      );
      const restaurantOwner = await Owner.findOne(
        { where: { Owner_id: restaurant.Owner_id } },
        { transaction: t }
      );
      restaurantOwner.point += totalPayment;
      await restaurantOwner.save({ transaction: t });

      // 트랜잭션 : commit
      await t.commit();

      return orderData;
    } catch (err) {
      // 트랜잭션 : rollback
      await t.rollback();
      console.error(err.stack);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  //-- 주문받기 (사장) --//
  updateOrderStatus = async (orderData, updateStatus, orderMessage) => {
    try {
      orderData.status = updateStatus;
      await orderData.save();

      return orderMessage;
    } catch (err) {
      console.error(err.stack);
      return res.status(400).send({ message: `${err.message}` });
    }
  };
}

module.exports = OrdersRepository;
