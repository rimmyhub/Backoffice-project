const express = require('express');
const userRouter = express.Router();

// const AuthMiddleware = require('../middlewares/auth.middleware');
// const auth = new AuthMiddleware();

const UploadBucket = require('../middlewares/bucket.middleware');
const upload = new UploadBucket();

const UserController = require('../controllers/users.controller');
const userController = new UserController();

userRouter.get('/users', userController.getUsers);
userRouter.get('/mypage/users', userController.getUser);
userRouter.put('/mypage/users', userController.modifyUserInfo);
userRouter.put('/mypage/users/password', userController.modifyUserPassword);

// 프로필 사진 업로드
userRouter.post(
  '/mypage/users/images',
  upload.profileImage('profileImage'),
  userController.uploadProfileImage
);


module.exports = userRouter;
