const express = require('express');
const MenusController = require('../controllers/menus.controller');
const menuRouter = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
// 사장님 추가되면 미들웨어 추가하기!

const menusController = new MenusController();

// 메뉴 조회
menuRouter.get('/restaurant/:restaurant_id/menu', menusController.getMenu);

// 메뉴 등록
menuRouter.post('/restaurant/:restaurant_id/menu', authMiddleware, menusController.postMenu);

// 메뉴 수정
menuRouter.put('/restaurant/:restaurant_id/menu/:menu_id', authMiddleware, menusController.putMenu);

// 메뉴 삭제
menuRouter.delete(
  '/restaurant/:restaurant_id/menu/:menu_id',
  authMiddleware,
  menusController.deleteMenu
);

module.exports = menuRouter;
