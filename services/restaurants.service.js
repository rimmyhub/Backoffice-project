const RestaurantsRepository = require('../repositories/restaurants.repository');

class RestaurantsService {
  restaurantsRepository = new RestaurantsRepository();

  // 음식점 전체 조회
  getAllRestaurant = async (foodName, category) => {
    return await this.restaurantsRepository.getAllRestaurant(foodName, category);
  };

  // 음식점 조회
  getRestaurant = async (restaurant_id) => {
    return await this.restaurantsRepository.getRestaurant(restaurant_id);
  };

  // 음식점 조회
  getRestaurantByOwner = async (owner_id) => {
    return await this.restaurantsRepository.getRestaurantByOwner(owner_id);
  };

  // 음식점 등록
  postRestaurant = async (owner_id, name, address, phone_num, biz_hours, category) => {
    return await this.restaurantsRepository.postRestaurant(
      owner_id,
      name,
      address,
      phone_num,
      biz_hours,
      category
    );
  };

  // 음식점 수정
  putRestaurant = async (
    restaurant_id,
    owner_id,
    name,
    address,
    phone_num,
    biz_hours,
    category
  ) => {
    return await this.restaurantsRepository.putRestaurant(
      restaurant_id,
      owner_id,
      name,
      address,
      phone_num,
      biz_hours,
      category
    );
  };

  // 음식점 삭제
  deleteRestaurant = async (restaurant_id, owner_id) => {
    return await this.restaurantsRepository.deleteRestaurant(restaurant_id, owner_id);
  };
}

module.exports = RestaurantsService;
