const UserController = require('../controllers/users.controller');
const userController = new UserController();
const authMiddleware = require('../middlewares/auth.middleware');
const express = require('express');
const userRouter = express.Router();

userRouter.post('/signup/client', userController.signupClient);
userRouter.put('/client/:clientId', authMiddleware, userController.updateClient);

module.exports = userRouter;
