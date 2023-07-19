const express = require('express');
const ownerRouter = express.Router();

const OwnerController = require('../controllers/owners.controller');
const ownerController = new OwnerController();

// ownerRouter.get('/owners', ownerController.getUsers); // 테스트용: 서비스 제공할 필요 없음
ownerRouter.get('/mypage/owners', ownerController.getUser);
ownerRouter.put('/mypage/owners', ownerController.modifyUserInfo);
ownerRouter.put('/mypage/owners/password', ownerController.modifyUserPassword);

module.exports = ownerRouter;
