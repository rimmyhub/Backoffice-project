const AuthController = require('../controllers/auth.controller');
const authController = new AuthController();
const express = require('express');
const authRouter = express.Router();

authRouter.post('/login/client', authController.loginClient);
authRouter.post('/login/owner', authController.loginOwner);

module.exports = authRouter;
