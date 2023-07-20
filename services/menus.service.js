const MenusRepository = require('../repositories/menus.repository');

class MenusService {
  menusRepository = new MenusRepository();

  // 음식점 메뉴 조회
  getMenu = async ({ restaurant_id }) => {
    try {
      const get = await this.menusRepository.getMenu({ restaurant_id });

      return { code: 200, data: get };
    } catch (error) {
      return { code: 500, data: error.message };
    }
  };

  // 음식점 메뉴 등록
  postMenu = async ({ restaurant_id, name, menu_image, price, sold_out }) => {
    try {
      const postMenu = await this.menusRepository.postMenu({
        restaurant_id,
        name,
        menu_image,
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

  // 메뉴 사진 업로드
  uploadMenuImage = async (imageUrl, owner_id) => {
    const uploadedMenuImage = await this.menusRepository.createMenuImage(imageUrl, owner_id);
    return uploadedMenuImage;
  };

  // 메뉴 수정
  putMenu = async ({ menu_id, name, menu_image, price, sold_out }) => {
    // 댓글을 조회합니다.

    try {
      const existsMenu = await this.menusRepository.findById({
        menu_id,
      });

      if (!existsMenu) {
        return { code: 404, data: ' 메뉴가 존재하지 않습니다.' };
      }
    } catch (error) {
      return { code: 500, data: error.message };
    }

    try {
      await this.menusRepository.putMenu({
        menu_id,
        name,
        menu_image,
        price,
        sold_out,
      });
      return { code: 200, data: '메뉴를 수정하였습니다.' };
    } catch (error) {
      return { code: 500, data: error.message };
    }
  };

  deleteMenu = async ({ menu_id }) => {
    try {
      const existsMenu = await this.menusRepository.findById({
        menu_id,
      });

      if (!existsMenu) {
        return { code: 404, data: ' 메뉴가 존재하지 않습니다.' };
      }
    } catch (error) {
      return { code: 500, data: error.message };
    }

    try {
      await this.menusRepository.deleteMenu({
        menu_id,
      });
      return { code: 200, data: '메뉴를 삭제하였습니다.' };
    } catch (error) {
      return { code: 500, data: error.message };
    }
  };
}

module.exports = MenusService;
