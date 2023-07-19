const OwnerController = require('../controllers/owners.controller');
const ownerController = new OwnerController();
const authMiddleware = require('../middlewares/auth.middleware');

const express = require('express');
const ownerRouter = express.Router();

ownerRouter.post('/signup/owner', ownerController.signupOwner);
ownerRouter.put('/owner/:ownerId', authMiddleware, ownerController.updateOwner);

module.exports = ownerRouter;
