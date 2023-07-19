const RestaurantsService = require('../services/restaurants.service');

class RestaurantsController {
  restaurantsService = new RestaurantsService();

  // 음식점 조회
  getRestaurant = async (req, res) => {
    const { restaurant_id } = req.params;
    const { code, data } = await this.restaurantsService.getRestaurant({ restaurant_id });
    res.status(code).json({ data });
  };

  // 음식점 등록
  postRestaurant = async (req, res) => {
    // const { owner_id } = res.locals.user;
    const { Owner_id, name, address, phone_num, biz_hours, category } = req.body;
    const { code, data } = await this.restaurantsService.postRestaurant({
      // owner_id,
      name,
      address,
      phone_num,
      biz_hours,
      category,
    });
    res.status(code).json({ data });
  };

  // 음식점 수정
  putRestaurant = async (req, res) => {
    const { restaurant_id } = req.params;
    // const { owner_id } = res.locals.user;
    const { name, address, phone_num, biz_hours, category } = req.body;

    const { code, data } = await this.restaurantsService.putRestaurant({
      restaurant_id,
      // owner_id,
      name,
      address,
      phone_num,
      biz_hours,
      category,
    });
    res.status(code).json({ data });
  };

  // 음식점 삭제
  deleteRestaurant = async (req, res) => {
    const { restaurant_id } = req.params;
    // const { owner_id } = res.locals.user;

    const { code, data } = await this.restaurantsService.deleteRestaurant({
      restaurant_id,
      // owner_id,
    });
    res.status(code).json({ data });
  };
}

module.exports = RestaurantsController;
