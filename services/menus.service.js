const MenusRepository = require('../repositories/menus.repository');

class MenusService {
  menusRepository = new MenusRepository();

  // 음식점 메뉴 조회
  getMenu = async ({ restaurant_id }) => {
    try {
      const get = await this.menusRepository.getRestaurant({ restaurant_id });

      return { code: 200, data: get };
    } catch (error) {
      return { code: 500, data: error.message };
    }
  };

  // 음식점 메뉴 등록
  postMenu = async ({ restaurant_id, name, image, price, sold_out }) => {
    try {
      const postMenu = await this.menusRepository.postMenu({
        restaurant_id,
        name,
        image,
        price,
        sold_out,
      });

      // 데이터가 정상적으로 전달되지 못한 경우
      if (!postMenu) return { code: 400, data: '데이터 형식이 올바르지 않습니다.' };

      return { code: 200, data: postMenu };
    } catch (error) {
      return { code: 500, data: error.message };
    }
  };

  // 메뉴 수정
  putMenu = async ({
    menu_id,
    // owner_id,
    name,
    image,
    price,
    sold_out,
  }) => {
    // 댓글을 조회합니다.

    try {
      const existsMenu = await this.menusRepository.findById({
        menu_id,
      });

      if (!existsMenu) {
        return { code: 404, data: ' 메뉴가 존재하지 않습니다.' };
      }
      // } else if (existsMenu.Owner_id !== owner_id) {
      //   return { code: 401, data: '댓글을 수정할 권한이 없습니다.' };
      // }
    } catch (error) {
      return { code: 500, data: error.message };
    }

    try {
      await this.menusRepository.putMenu({
        menu_id,
        // owner_id,
        name,
        image,
        price,
        sold_out,
      });
      return { code: 200, data: '메뉴를 수정하였습니다.' };
    } catch (error) {
      return { code: 500, data: error.message };
    }
  };

  deleteMenu = async ({
    menu_id,
    // owner_id,
    name,
    image,
    price,
    sold_out,
  }) => {
    try {
      const existsMenu = await this.menusRepository.findById({
        menu_id,
      });

      if (!existsMenu) {
        return { code: 404, data: ' 메뉴가 존재하지 않습니다.' };
      }
      // } else if (existsMenu.Owner_id !== owner_id) {
      //   return { code: 401, data: '메뉴를 삭제할 권한이 없습니다.' };
    } catch (error) {
      return { code: 500, data: error.message };
    }

    try {
      await this.menusRepository.deleteMenu({
        menu_id,
        // owner_id,
      });
      return { code: 200, data: '메뉴를 삭제하였습니다.' };
    } catch (error) {
      return { code: 500, data: error.message };
    }
  };
}

module.exports = MenusService;
