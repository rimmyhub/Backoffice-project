const express = require('express');
const userRouter = express.Router();

// const AuthMiddleware = require('../middlewares/auth.middleware');
// const auth = new AuthMiddleware();

const UploadBucket = require('../middlewares/bucket.middleware');
const upload = new UploadBucket();

const UserController = require('../controllers/users.controller');
const userController = new UserController();

userRouter.get('/clients', userController.getUsers);
userRouter.get('/mypage/clients', userController.getUser);
userRouter.put('/mypage/clients', userController.modifyUserInfo);
userRouter.put('/mypage/clients/password', userController.modifyUserPassword);

// 프로필 사진 업로드
userRouter.post(
  '/mypage/users/images',
  upload.profileImage('profileImage'),
  userController.uploadProfileImage
);

module.exports = userRouter;
