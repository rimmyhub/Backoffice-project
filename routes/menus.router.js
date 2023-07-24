const express = require('express');
const menuRouter = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

const MenusController = require('../controllers/menus.controller');
const menusController = new MenusController();

const UploadBucket = require('../middlewares/bucket.middleware');
const upload = new UploadBucket();

// 메뉴 조회
menuRouter.get('/restaurant/:restaurant_id/menu', authMiddleware, menusController.getMenu);

// 메뉴 등록
menuRouter.post('/restaurant/:restaurant_id/menu', authMiddleware, menusController.postMenu);

// 메뉴 사진 업로드
menuRouter.post(
  '/mypage/menus/images',
  authMiddleware,
  upload.menuImage('menuImage'), // 업로드할 사진 경로를 ('profile', 사진경로) 형태의 formData로 받는다.
  menusController.uploadMenuImage
);

// 메뉴 수정
menuRouter.put(
  '/restaurant/:restaurant_id/menu/:menu_id',
  authMiddleware,
  menusController.putMenu
);

// 메뉴 삭제
menuRouter.delete(
  '/restaurant/:restaurant_id/menu/:menu_id',
  authMiddleware,
  menusController.deleteMenu
);

module.exports = menuRouter;
