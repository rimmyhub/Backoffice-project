const express = require('express');
const router = express.Router();
const RestaurantsRepository = require('../repositories/restaurants.repository');

const restaurantsRepository = new RestaurantsRepository();

// 로그인 페이지(사장)
router.get('/sign-in/:userType', (req, res) => {
  console.log('req.params.userType = ', req.params.userType);
  const userType = req.params.userType;

  const data = {
    userType: userType,
  };

  res.render('sign-in', data);
});

// 회원가입 페이지
router.get('/sign-up/:userType', (req, res) => {
  const userType = req.params.userType;

  const data = {
    userType: userType,
  };

  res.render('sign-up', data);
});

// 음식점 전체 조회
router.get('/', async (req, res) => {
  // /restaurants?foodName=오리지널 버거 콤보
  const data = await restaurantsRepository.getAllRestaurant();
  res.render('index', { data });
});

// 특정 음식점 조회

//검색할때 쿼리 스트링

module.exports = router;
