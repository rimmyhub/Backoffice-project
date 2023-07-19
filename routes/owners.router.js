const express = require('express');
const ownerRouter = express.Router();

const OwnerController = require('../controllers/owners.controller');
const ownerController = new OwnerController();

const authMiddleware = require('../middlewares/auth.middleware');

// ownerRouter.get('/owners', ownerController.getUsers); // 테스트용: 서비스 제공할 필요 없음
ownerRouter.post('/signup/owner', ownerController.signupOwner);
ownerRouter.get('/mypage/owners', authMiddleware, ownerController.getUser);
ownerRouter.put('/mypage/owners', authMiddleware, ownerController.modifyUserInfo);
ownerRouter.put('/mypage/owners/password', authMiddleware, ownerController.modifyUserPassword);

module.exports = ownerRouter;
