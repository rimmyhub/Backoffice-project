const { Menu } = require('../models');
const { Op } = require('sequelize');

class MenusRepository {
  // 음식점 메뉴 조회
  getMenu = async ({ restaurant_id }) => {
    return await Menu.findAll({
      where: { restaurant_id },
      attributes: [
        'menu_id',
        'restaurant_id',
        'name',
        'menu_image',
        'price',
        'sold_out',
        'createdAt',
        'updatedAt',
      ],
      order: [['createdAt', 'DESC']],
    });
  };

  // 음식점 메뉴 등록
  postMenu = async ({ restaurant_id, name, menu_image, price, sold_out }) => {
    return await Menu.create({
      Restaurant_id: restaurant_id,
      name,
      menu_image,
      price,
      sold_out,
    });
  };

  // 수정 및 삭제를 위한 메뉴 권한 확인
  findById = async ({ menu_id }) => {
    return await Menu.findOne({ where: { menu_id } });
  };

  putMenu = async ({
    menu_id,
    name,
    menu_image,
    price,
    sold_out,
  }) => {
    await Menu.update(
      { name, menu_image, price, sold_out },
      {
        where: {
          [Op.and]: [{ menu_id }],
        },
      }
    );
  };

  deleteMenu = async ({
    menu_id,
  }) => {
    await Menu.destroy({
      where: {
        [Op.and]: [{ menu_id }],
      },
    });
  };
}

module.exports = MenusRepository;
