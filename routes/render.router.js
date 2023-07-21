const express = require('express');
const router = express.Router();
const RestaurantsRepository = require('../repositories/restaurants.repository');

const restaurantsRepository = new RestaurantsRepository();

// 음식점 전체 조회
router.get('/', async (req, res) => {
  // /restaurants?foodName=오리지널 버거 콤보
  const data = await restaurantsRepository.getAllRestaurant();
  res.render('index', { data });
});

//subpage 진입
router.get('/subpage/:restaurant_id', async (req, res) => {
  const restaurant_id = req.params.restaurant_id;

  const restaurantResult = await restaurantsRepository.getRestaurant({ restaurant_id });

  const data = restaurantResult[0].dataValues;
  let menus = data.Menus;
  let reviews = data.Reviews;
  let restaurant = data;

  menus = menus.map((menu) => menu.dataValues);
  reviews = reviews.map((review) => review.dataValues);

  console.log(reviews);

  res.render('subpage', { restaurantResult, restaurant, menus, reviews });
});

module.exports = router;
