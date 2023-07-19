const MenusService = require('../services/menus.service');

class MenusController {
  menusService = new MenusService();

  // 메뉴 조회
  getMenu = async (req, res) => {
    const { restaurant_id } = req.params;

    const { code, data } = await this.menusService.getMenu({ restaurant_id });
    res.status(code).json({ data });
  };

  // 메뉴 등록
  postMenu = async (req, res) => {
    // const { owner_id } = res.locals.user;
    const { restaurant_id } = req.params;
    const { name, image, price, sold_out } = req.body;

    const { code, data } = await this.menusService.postMenu({
      restaurant_id,
      name,
      image,
      price,
      sold_out,
    });

    res.status(code).json({ data });
  };

  // 메뉴 수정
  putMenu = async (req, res) => {
    const { menu_id } = req.params;
    // const { owner_id } = res.locals.user;
    const { name, image, price, sold_out } = req.body;

    const { code, data } = await this.menusService.putMenu({
      menu_id,
      // owner_id,
      name,
      image,
      price,
      sold_out,
    });
    res.status(code).json({ data });
  };

  // 메뉴 삭제
  deleteMenu = async (req, res) => {
    const { menu_id } = req.params;
    // const { owner_id } = res.locals.user;

    const { code, data } = await this.menusService.deleteMenu({
      menu_id,
      // owner_id,
    });
    res.status(code).json({ data });
  };
}

module.exports = MenusController;
