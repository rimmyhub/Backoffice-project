const OwnerController = require('../controllers/owners.controller');
const ownerController = new OwnerController();

const express = require('express');
const ownerRouter = express.Router();

ownerRouter.post('/signup/owner', ownerController.signupOwner);

module.exports = ownerRouter;
