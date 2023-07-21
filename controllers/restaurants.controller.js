const RestaurantsService = require('../services/restaurants.service');

class RestaurantsController {
  restaurantsService = new RestaurantsService();

  // 음식점 전체 조회
  getAllRestaurant = async (req, res) => {
    const { foodName, category } = req.query;
    console.log({ foodName });
    const { code, data } = await this.restaurantsService.getAllRestaurant(foodName, category);
    res.status(code).json({ data });
  };

  // 음식점 조회
  getRestaurant = async (req, res) => {
    // const { restaurant_id } = req.params;
    const restaurant_id = 1;
    const { code, data } = await this.restaurantsService.getRestaurant({ restaurant_id });
    // res.status(code).json({ data });
    return data;
  };

  // 음식점 등록
  postRestaurant = async (req, res) => {
    if (res.locals.user.division !== 'Owner')
      return res.status(412).send({ message: '너는 사장이 아니다.' });
    const { owner_id } = res.locals.user;
    const { name, address, phone_num, biz_hours, category } = req.body;
    const { code, data } = await this.restaurantsService.postRestaurant({
      owner_id,
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
    if (res.locals.user.division !== 'Owner')
      return res.status(412).send({ message: '너는 사장이 아니다.' });
    const { owner_id } = res.locals.user;
    const { restaurant_id } = req.params;
    const { name, address, phone_num, biz_hours, category } = req.body;

    const { code, data } = await this.restaurantsService.putRestaurant({
      restaurant_id,
      owner_id,
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
    if (res.locals.user.division !== 'Owner')
      return res.status(412).send({ message: '너는 사장이 아니다.' });
    const { owner_id } = res.locals.user;
    const { restaurant_id } = req.params;

    const { code, data } = await this.restaurantsService.deleteRestaurant({
      restaurant_id,
      owner_id,
    });
    res.status(code).json({ data });
  };
}

module.exports = RestaurantsController;
