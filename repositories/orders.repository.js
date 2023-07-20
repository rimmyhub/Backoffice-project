// order.repository.js
const { Order, OrderDetail, Client, Owner, Restaurant, sequelize, Menu } = require('../models');
const { Transaction } = require('sequelize');

class OrdersRepository {
  //-- 주문하기 (고객) --//
  createOrder = async (restaurant_id, order_items, client_id) => {
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
      if (!orderClient) throw new Error('존재하지 않는 유저입니다.');

      // 검사 :: 음식점 존재 여부
      if (!restaurant) throw new Error('존재하지 않는 음식점입니다.');

      // 주문 금액 계산
      let totalPayment = 0;
      for (const orderItem of order_items) {
        const menu = await Menu.findOne({ where: { menu_id: orderItem.menu_id } });
        if (!menu) throw new Error('해당하는 메뉴를 찾을 수 없습니다.');
        totalPayment += menu.price * orderItem.count;
      }

      // 검사 :: 잔액 확인
      if (orderClient.point < totalPayment) throw new Error('잔액이 없습니다.');

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

      // Restaurant :: 가게 총 매출 증가
      restaurant.total_income += totalPayment;
      await restaurant.save({ transaction: t });

      // Order 테이블에 주문 정보 저장
      const orderData = await Order.create(
        { Restaurant_id: restaurant_id, Client_id: client_id },
        { transaction: t }
      );
      const orderId = orderData.order_id;

      // OrderDetail 테이블에 주문 상세정보 저장
      const orderDetailsData = order_items.map((orderItem) => ({
        Order_id: orderId,
        Menu_id: orderItem.menu_id,
        count: orderItem.count,
      }));
      await OrderDetail.bulkCreate(orderDetailsData, { transaction: t });

      // owner_id 추가
      orderData.dataValues.owner_id = restaurant.Owner_id;

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

  //-- 주문조회 (고객) --//
  getOrderClient = async (client_id) => {
    const orderStatusMessage = {
      0: '접수대기',
      1: '접수완료',
      2: '배달완료',
    };
    try {
      // 주문데이터
      const orders = await Order.findAll({
        where: { Client_id: client_id },
        include: [
          { model: Client, attributes: ['name'] },
          { model: Restaurant, attributes: ['name'] },
          {
            model: OrderDetail,
            include: [{ model: Menu, attributes: ['name', 'price', 'menu_id'] }],
          },
        ],
      });

      // 내보낼 주문데이터
      const orderData = orders.map((order) => {
        const { name: restaurant_name } = order.Restaurant; // 레스토랑 이름
        const order_time = new Date(order.createdAt).toLocaleString('ko-KR', {
          timeZone: 'Asia/Seoul',
        }); // 주문 시각
        const { status } = order; // 주문상태
        const order_status = orderStatusMessage[status];

        const menuDetails = order.OrderDetails.map(({ Menu, count }) => {
          const { menu_id: menu_number, name: menu_name, price: item_price } = Menu; // 메뉴 주분번호,이름,개당 가격
          const totalPayment = item_price * count; // 총 결제금액
          return { menu_number, menu_name, count, item_price, totalPayment };
        });

        return { order_id: order.order_id, restaurant_name, order_time, order_status, menuDetails };
      });

      return orderData;
    } catch (err) {
      console.error(err.stack);
      throw new Error(`${err.message}`);
    }
  };

  //-- 주문받기 (사장) --//
  updateOrderStatus = async (order_id) => {
    try {
      const orderData = await Order.findByPk(order_id);

      // 검사 : 데이터 유효 여부 확인
      if (!orderData) return { error: true, message: `${order_id}번 주문을 찾을 수 없습니다.` };

      // 검사 : 주문상태에 따른 처리분리
      let orderMessage = '';
      let updateStatus;
      switch (orderData.status) {
        case 0:
          orderMessage = '주문접수 했습니다';
          updateStatus = 1;
          break;
        case 1:
          orderMessage = '배달완료 했습니다';
          updateStatus = 2;
          break;
        case 2:
          orderMessage = '완료된 주문입니다.';
          updateStatus = 2;
          break;
        default:
          return { error: true, message: '잘못된 주문 상태 값입니다.' };
      }

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
