const AuthController = require('../controllers/auth.controller');
const authController = new AuthController();
const express = require('express');
const authRouter = express.Router();

authRouter.post('/login/clients', authController.loginClient);
authRouter.post('/login/owners', authController.loginOwner);
authRouter.delete('/logout', authController.logout);
authRouter.post('/auth/mail', authController.authMailer);
authRouter.post('/auth/mail-num', authController.validAuthNum);

module.exports = authRouter;
