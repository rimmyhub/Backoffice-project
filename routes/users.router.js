const express = require('express');
const userRouter = express.Router();

const UploadBucket = require('../middlewares/bucket.middleware');
const upload = new UploadBucket();

const UserController = require('../controllers/users.controller');
const userController = new UserController();

// userRouter.get('/clients', userController.getUsers); // 테스트용: 서비스 제공할 필요 없음
userRouter.get('/mypage/clients', userController.getUser);
userRouter.put('/mypage/clients', userController.modifyUserInfo);
userRouter.put('/mypage/clients/password', userController.modifyUserPassword);

// 프로필 사진 업로드
userRouter.post(
  '/mypage/users/images',
  upload.profileImage('profileImage'), // 업로드할 사진 경로를 ('profile', 사진경로) 형태의 formData로 받는다.
  userController.uploadProfileImag
);

module.exports = userRouter;
