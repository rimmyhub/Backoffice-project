const { Menu } = require('../models');
const { Op } = require('sequelize');

class MenusRepository {
  // 음식점 메뉴 조회
  getMenu = async ({ restaurant_id }) => {
    return await Menu.findAll({
      where: { restaurant_id },
      attributes: ['restaurant_id', 'name', 'price', 'sold_out', 'createdAt', 'updatedAt'],
      // include: [
      //   {
      //     // model: ReviewImages,
      //     // attributes: ['menu_image'],
      //   },
      // ],
      order: [['createdAt', 'DESC']],
    });
  };

  // 음식점 메뉴 등록
  postMenu = async ({ restaurant_id, name, image, price, sold_out }) => {
    return await Menu.create({
      Restaurant_id: restaurant_id,
      name,
      image,
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
    // owner_id,
    name,
    image,
    price,
    sold_out,
  }) => {
    await Menu.update(
      { name, image, price, sold_out },
      {
        where: {
          [Op.and]: [{ menu_id }],
          // where: {
          //   [Op.and]: [{ menu_id }, { Owner_id: owner_id }],
        },
      }
    );
  };

  deleteMenu = async ({
    menu_id,
    // owner_id
  }) => {
    await Menu.destroy({
      where: {
        [Op.and]: [{ menu_id }],
        // [Op.and]: [{ menu_id }, { Owner_id: owner_id }],
      },
    });
  };
}

module.exports = MenusRepository;
