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
      // Client
      const orderClient = await Client.findByPk(client_id, { transaction: t });

      // Restaurant
      const restaurant = await Restaurant.findOne(
        { where: { restaurant_id: restaurant_id } },
        { transaction: t }
      );

      // 검사 : 클라이언트 유저 존재 여부
      if (!orderClient) {
        throw new Error('존재하지 않는 유저입니다.');
      }

      // 검사 :: 잔액 확인
      if (orderClient.point < totalPayment) {
        throw new Error('잔액이 없습니다.');
      }

      // 검사 :: 음식점 존재 여부
      if (!restaurant) {
        return res.status(404).send({ message: '존재하지 않는 음식점입니다.' });
      }

      // Client :: 포인트 차감
      orderClient.point -= totalPayment;
      await orderClient.save({ transaction: t });

      // Owner :: 포인트 증가
      const restaurantOwner = await Owner.findOne(
        { where: { Owner_id: restaurant.Owner_id } },
        { transaction: t }
      );

      restaurantOwner.point += totalPayment;
      await restaurantOwner.save({ transaction: t });

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

      // 트랜잭션 : commit
      await t.commit();

      return orderData;
    } catch (err) {
      // 트랜잭션 : rollback
      await t.rollback();
      console.error(err.stack);
      throw new Error(`${err.message}`);
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
      throw new Error(`${err.message}`);
    }
  };
}

module.exports = OrdersRepository;
