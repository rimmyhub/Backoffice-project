const RestaurantsRepository = require('../repositories/restaurants.repository');

class RestaurantsService {
  restaurantsRepository = new RestaurantsRepository();

  // 음식점 전체 조회
  getAllRestaurant = async (foodName, category) => {
    try {
      const getAll = await this.restaurantsRepository.getAllRestaurant(foodName);
      return { code: 200, data: getAll };
    } catch (error) {
      return { code: 500, data: error.message };
    }
  };

  // 음식점 조회
  getRestaurant = async ({ restaurant_id }) => {
    try {
      const get = await this.restaurantsRepository.getRestaurant({
        restaurant_id,
      });

      if (!get) {
        return { code: 404, data: '해당 음식점을 찾을 수 없습니다.' };
      }

      return { code: 200, data: get };
    } catch (error) {
      return { code: 500, data: error.message };
    }
  };

  // 음식점 등록
  postRestaurant = async ({ owner_id, name, address, phone_num, biz_hours, category }) => {
    try {
      const post = await this.restaurantsRepository.postRestaurant({
        Owner_id: owner_id,
        name,
        address,
        phone_num,
        biz_hours,
        category,
      });
      return { code: 200, data: post };
    } catch (error) {
      return { code: 500, data: error.message };
    }
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
    try {
      const existsRestaurant = await this.restaurantsRepository.findById({
        restaurant_id,
      });

      if (!existsRestaurant) {
        return { code: 404, data: ' 음식점이 존재하지 않습니다.' };
      } else if (existsRestaurant.Owner_id !== owner_id) {
        return { code: 401, data: '음식점을 수정할 권한이 없습니다.' };
      }
    } catch (error) {
      return { code: 500, data: error.message };
    }

    try {
      await this.restaurantsRepository.putRestaurant({
        restaurant_id,
        owner_id,
        name,
        address,
        phone_num,
        biz_hours,
        category,
      });
      return { code: 200, data: '음식점을 수정하였습니다.' };
    } catch (error) {
      return { code: 500, data: error.message };
    }
  };

  // 음식점 삭제
  deleteRestaurant = async ({ restaurant_id, owner_id }) => {
    try {
      const existsRestaurant = await this.restaurantsRepository.findById({
        restaurant_id,
      });

      if (!existsRestaurant) {
        return { code: 404, data: '음식점이 존재하지 않습니다' };
      } else if (existsRestaurant.Owner_id !== owner_id) {
        return { code: 401, data: '음식점을 삭제할 권한이 없습니다.' };
      }
    } catch (error) {
      return { code: 500, data: error.message };
    }

    try {
      await this.restaurantsRepository.deleteRestaurant({
        restaurant_id,
        owner_id,
      });
      return { code: 200, data: '음식점을 삭제하였습니다.' };
    } catch (error) {
      return { code: 500, data: error.message };
    }
  };
}

module.exports = RestaurantsService;
