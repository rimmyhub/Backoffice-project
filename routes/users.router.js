const express = require('express');
const userRouter = express.Router();

const UserController = require('../controllers/users.controller');
const userController = new UserController();

const authMiddleware = require('../middlewares/auth.middleware');

const UploadBucket = require('../middlewares/bucket.middleware');
const upload = new UploadBucket();

// userRouter.get('/clients', userController.getUsers); // 테스트용: 서비스 제공할 필요 없음
userRouter.post('/signup/clients', userController.signupClient);
userRouter.get('/mypage/clients', userController.getUser);
userRouter.put('/mypage/clients', authMiddleware, userController.modifyUserInfo);
userRouter.put('/mypage/clients/password', authMiddleware, userController.modifyUserPassword);

// 프로필 사진 업로드
userRouter.post(
  '/mypage/clients/images',
  authMiddleware,
  upload.profileImage('profileImage'), // 업로드할 사진 경로를 ('profile', 사진경로) 형태의 formData로 받는다.
  userController.uploadProfileImage
);

module.exports = userRouter;
