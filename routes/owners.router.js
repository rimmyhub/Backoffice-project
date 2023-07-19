const express = require('express');
const ownerRouter = express.Router();

const OwnerController = require('../controllers/owners.controller');
const ownerController = new OwnerController();

const authMiddleware = require('../middlewares/auth.middleware');

// ownerRouter.get('/owners', ownerController.getUsers); // 테스트용: 서비스 제공할 필요 없음
ownerRouter.get('/mypage/owners', ownerController.getUser);
ownerRouter.put('/mypage/owners', ownerController.modifyUserInfo);
ownerRouter.put('/mypage/owners/password', ownerController.modifyUserPassword);
ownerRouter.post('/signup/owner', ownerController.signupOwner);
ownerRouter.put('/owner/:ownerId', authMiddleware, ownerController.updateOwner);

module.exports = ownerRouter;
