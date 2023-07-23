const RestaurantsService = require('../services/restaurants.service');

class RestaurantsController {
  restaurantsService = new RestaurantsService();

  // 음식점 전체 조회
  getAllRestaurant = async (req, res) => {
    try {
      const { foodName, category } = req.query;
      const data = await this.restaurantsService.getAllRestaurant(foodName, category);
      return data;
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  // 음식점 조회
  getRestaurant = async (req, res) => {
    try {
      const { restaurant_id } = req.params;
      const data = await this.restaurantsService.getRestaurant(restaurant_id);
      if (!data) return res.status(404).send({ message: '해당 음식점을 찾을 수 없습니다.' });
      return data;
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  // 음식점 등록
  postRestaurant = async (req, res) => {
    try {
      if (res.locals.user.division !== 'Owner')
        return res.status(412).send({ message: '너는 사장이 아니다.' });

      const { owner_id } = res.locals.user;
      const { name, address, phone_num, biz_hours, category } = req.body;
      const data = await this.restaurantsService.postRestaurant(
        owner_id,
        name,
        address,
        phone_num,
        biz_hours,
        category
      );
      return data;
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  // 음식점 수정
  putRestaurant = async (req, res) => {
    if (res.locals.user.division !== 'Owner')
      return res.status(412).send({ message: '너는 사장이 아니다.' });

    const { owner_id } = res.locals.user;
    const { restaurant_id } = req.params;
    const { name, address, phone_num, biz_hours, category } = req.body;

    try {
      const restaurant = await this.restaurantsRepository.findById(restaurant_id);
      // 존재 유무
      if (!restaurant) return res.status(404).send({ message: '등록되지 않은 음식점' });
      // 수정권한 관련
      if (restaurant.Owner_id !== owner_id) {
        return res.status(412).send({ message: '수정 권한 없음' });
      }

      const data = await this.restaurantsService.putRestaurant(
        restaurant_id,
        owner_id,
        name,
        address,
        phone_num,
        biz_hours,
        category
      );
      return data;
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  // 음식점 삭제
  deleteRestaurant = async (req, res) => {
    if (res.locals.user.division !== 'Owner')
      return res.status(412).send({ message: '너는 사장이 아니다.' });
    const { owner_id } = res.locals.user;
    const { restaurant_id } = req.params;

    try {
      const restaurant = await this.restaurantsRepository.findById(restaurant_id);
      // 존재 유무
      if (!restaurant) return res.status(404).send({ message: '등록되지 않은 음식점' });
      // 수정권한 관련
      if (restaurant.Owner_id !== owner_id) {
        return res.status(412).send({ message: '삭제 권한 없음' });
      }

      await this.restaurantsService.deleteRestaurant(restaurant_id, owner_id);
      res.status(200).send({ message: '음식점 삭제 완료' });
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ message: `${err.message}` });
    }
  };
}

module.exports = RestaurantsController;
