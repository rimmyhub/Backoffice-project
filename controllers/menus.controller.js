const MenusService = require('../services/menus.service');
const RestaurantsService = require('../services/restaurants.service');

class MenusController {
  menusService = new MenusService();
  restaurantsService = new RestaurantsService();

  // 메뉴 조회
  getMenu = async (req, res) => {
    if (Object.keys(req.params).length !== 0) {
      const { restaurant_id } = req.params;
      const { code, data } = await this.menusService.getMenu(restaurant_id);
      return data;
    } else {
      const { restaurant_id } = res.locals.restaurant;
      const { code, data } = await this.menusService.getMenu(restaurant_id);
      return data;
    }
    // const { code, data } = await this.menusService.getMenu(restaurant_id);
    // return data;
  };

  // 메뉴 등록
  postMenu = async (req, res) => {
    if (res.locals.user.division !== 'Owner')
      return res.status(412).send({ message: '너는 사장이 아니다.' });
    const { restaurant_id } = req.params;
    const { owner_id } = res.locals.user;

    // 메뉴 생성 권한 확인 (음식점 사장과 미들웨어 사장 id 비교)
    try {
      const { code, data } = await this.restaurantsService.getRestaurant(restaurant_id);
      if (data[0].dataValues.Owner_id !== owner_id)
        return res.status(412).send({ message: '해당 메뉴 생성 권한 없음' });
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ message: `${err.message}` });
    }

    const { name, menu_image, price, sold_out } = req.body;

    // 메뉴를 생성합니다.
    try {
      const { code, data } = await this.menusService.postMenu({
        restaurant_id,
        name,
        menu_image,
        price,
        sold_out,
      });

      res.status(code).json({ data });
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  // 메뉴 사진 업로드
  uploadMenuImage = async (req, res) => {
    if (res.locals.user.division !== 'Owner')
      return res.status(412).send({ message: '당신은 사장이 아닙니다.' });
    try {
      const { owner_id } = res.locals.user; // auth에서 가져옴
      const imageUrl = req.file.location;

      // 음식점 정보 획득
      const restaurant = await this.restaurantsService.getRestaurantByOwner(owner_id);
      const restaurant_id = restaurant.data.dataValues.restaurant_id;

      // 이미지 업로드
      await this.menusService.uploadMenuImage(imageUrl, restaurant_id);
      res.status(200).send({ imageUrl, restaurant_id });
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  // 메뉴 수정
  putMenu = async (req, res) => {
    if (res.locals.user.division !== 'Owner')
      return res.status(412).send({ message: '너는 사장이 아니다.' });
    const { menu_id, restaurant_id } = req.params;
    const { owner_id } = res.locals.user;

    // 메뉴 수정 권한 확인 (음식점 사장과 미들웨어 사장 id 비교)
    try {
      const { code, data } = await this.restaurantsService.getRestaurant(restaurant_id);
      if (data[0].dataValues.Owner_id !== owner_id)
        return res.status(412).send({ message: '해당 메뉴 수정 권한 없음' });
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ message: `${err.message}` });
    }

    const { name, menu_image, price, sold_out } = req.body;

    // 메뉴 수정
    try {
      const { code, data } = await this.menusService.putMenu(
        menu_id,
        name,
        menu_image,
        price,
        sold_out
      );
      res.status(code).json({ data });
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  // 메뉴 삭제
  deleteMenu = async (req, res) => {
    const { menu_id } = req.params;
    const { restaurant_id } = req.params;
    const { owner_id } = res.locals.user;

    // 메뉴 삭제 권한 확인 (음식점 사장과 미들웨어 사장 id 비교)
    try {
      const { code, data } = await this.restaurantsService.getRestaurant(restaurant_id);
      if (data[0].dataValues.Owner_id !== owner_id)
        return res.status(412).send({ message: '해당 메뉴 삭제 권한 없음' });
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ message: `${err.message}` });
    }

    // 메뉴 삭제
    try {
      const { code, data } = await this.menusService.deleteMenu(menu_id);
      res.status(code).json({ data });
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ message: `${err.message}` });
    }
  };
}

module.exports = MenusController;
