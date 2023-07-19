const UserController = require('../controllers/users.controller');
const userController = new UserController();
const authMiddleware = require('../middlewares/auth.middleware');
const express = require('express');
const userRouter = express.Router();

userRouter.post('/signup/client', userController.signupClient);
userRouter.put('/client/:clientId', authMiddleware, userController.updateClient);

// const AuthMiddleware = require('../middlewares/auth.middleware');
// const auth = new AuthMiddleware();

// const UploadBucket = require('../middlewares/bucket.middleware');
// const upload = new UploadBucket();

// userRouter.post('/signup/owner', userController);

// userRouter.get('/users', userController.getUsers);
// userRouter.get('/users/info', auth.verifyAccessToken, userController.getUser);
// userRouter.put('/users/info', auth.verifyAccessToken, userController.modifyUserInfo);

// // 프로필 사진 업로드
// userRouter.post(
//   '/users/info/images',
//   auth.verifyAccessToken,
//   upload.profileImage('profileImage'),
//   userController.uploadProfileImage
// );
// userRouter.put('/users/info/password', auth.verifyAccessToken, userController.modifyUserPassword);
// userRouter.delete('/users/info', auth.verifyAccessToken, userController.leave);
// userRouter.post('/signup', userController.signup);
// userRouter.post('/signup/mail', userController.sendVerificationMail);
// userRouter.post('/signup/mail/verify', userController.verifyCode);
// userRouter.post('/login', userController.login);

module.exports = userRouter;
