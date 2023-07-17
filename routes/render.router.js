// 예시입니다!
const express = require('express');
const router = express.Router();
const path = require('path');

const AuthMiddleware = require('../middlewares/auth.middleware');
const auth = new AuthMiddleware();

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

router.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'signup.html'));
});

router.get('/mypage', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'mypage.html'));
});

router.get('/chat', auth.verifyAccessToken, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'chat.html'));
});

module.exports = router;
