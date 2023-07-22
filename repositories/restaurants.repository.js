const { Restaurant, Menu, Review, Client } = require('../models');
const { Op } = require('sequelize');

class RestaurantsRepository {
  getAllRestaurant = async (foodName, category) => {
    // foodName search
    if (foodName) {
      return await Restaurant.findAll({
        include: [
          {
            model: Menu,
            where: {
              name: { [Op.like]: '%' + foodName + '%' },
            },
          },
        ],
        order: [['createdAt', 'DESC']],
      });
    }

    // category search
    if (category) {
      return await Restaurant.findAll({
        where: {
          category: { [Op.like]: '%' + category + '%' },
        },
        order: [['createdAt', 'DESC']],
      });
    }

    return await Restaurant.findAll({
      attributes: [
        'restaurant_id',
        'Owner_id',
        'name',
        'address',
        'phone_num',
        'biz_hours',
        'category',
        'createdAt',
        'updatedAt',
      ],
      order: [['createdAt', 'DESC']],
    });
  };

  // 음식점 조회
  getRestaurant = async ({ restaurant_id }) => {
    return await Restaurant.findAll({
      where: { restaurant_id },
      attributes: [
        'restaurant_id',
        'Owner_id',
        'name',
        'address',
        'phone_num',
        'biz_hours',
        'category',
        'createdAt',
        'updatedAt',
      ],
      include: [
        {
          model: Menu,
        },
        {
          model: Review,
          include: [
            {
              model: Client,
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  };

  // 음식점 조회 (owner_id 기준)
  getRestaurantByOwner = async (Owner_id) => {
    return await Restaurant.findOne({ where: { Owner_id } });
  };

  // 음식점 등록
  postRestaurant = async ({ Owner_id, name, address, phone_num, biz_hours, category }) => {
    return await Restaurant.create({
      Owner_id,
      name,
      address,
      phone_num,
      biz_hours,
      category,
    });
  };

  // 음식점 수정 및 삭제를 위한 음식점 권한 조회
  findById = async ({ restaurant_id }) => {
    return await Restaurant.findOne({ where: { restaurant_id } });
  };

  // 음식점 수정
  putRestaurant = async ({
    restaurant_id,
    owner_id,
    name,
    address,
    phone_num,
    biz_hours,
    category,
  }) => {
    await Restaurant.update(
      { name, address, phone_num, biz_hours, category }, // 수정 사항
      {
        where: {
          [Op.and]: [{ restaurant_id }, { Owner_id: owner_id }],
        },
      }
    );
  };

  // 음식점 삭제
  deleteRestaurant = async ({ restaurant_id, owner_id }) => {
    await Restaurant.destroy({
      where: {
        [Op.and]: [{ restaurant_id }, { Owner_id: owner_id }],
      },
    });
  };
}

module.exports = RestaurantsRepository;
