const express = require('express');
const ownerRouter = express.Router();

// const AuthMiddleware = require('../middlewares/auth.middleware');
// const auth = new AuthMiddleware();

const OwnerController = require('../controllers/owners.controller');
const ownerController = new OwnerController();

ownerRouter.get('/owners', ownerController.getUsers);
ownerRouter.get('/mypage/owners', ownerController.getUser);
ownerRouter.put('/mypage/owners', ownerController.modifyUserInfo);
ownerRouter.put('/mypage/owners/password', ownerController.modifyUserPassword);

module.exports = ownerRouter;
