// 예시입니다!
const AuthService = require('../services/auth.service');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class AuthController {
  authService = new AuthService();
  loginClient = async (req, res) => {
    try {
      const { email, password } = req.body;
      const { authorization } = req.cookies;
      const division = 'Client';
      // 클라이언트 정보 가져오기
      const clientInfo = await this.authService.getClient(email, password);
      // 로그인상태에서 다시 로그인을 시도했을 경우
      if (authorization) {
        return res.status(412).json({ errorMessage: '현재 로그인 상태입니다.' });
      }

      const token = await this.accessToken(clientInfo.client_id, email, division);
      // refresh토큰 DB에 저장
      // bearer타입으로 클라이언트에 token을 전달
      res.cookie('authorization', `Bearer ${token}`);
      return res.status(200).json({ message: '로그인되었습니다.' });
    } catch (error) {
      return res.status(400).json(error.message);
    }
  };

  loginOwner = async (req, res) => {
    try {
      const { email, password } = req.body;
      const { authorization } = req.cookies;
      const division = 'Owner';
      // 클라이언트 정보 가져오기
      const ownerInfo = await this.authService.getOwner(email, password);
      // 로그인상태에서 다시 로그인을 시도했을 경우
      if (authorization) {
        return res.status(412).json({ errorMessage: '현재 로그인 상태입니다.' });
      }

      const token = await this.accessToken(ownerInfo.owner_id, email, division);
      // bearer타입으로 클라이언트에 token을 전달
      res.cookie('authorization', `Bearer ${token}`);
      return res.status(200).json({ message: '로그인되었습니다.' });
    } catch (error) {
      return res.status(400).json(error.message);
    }
  };

  // accessToken생성
  accessToken = async (userId, email, param) => {
    const division = param;
    // 1. 키값으로 구분
    // 2. 속성을 추가
    const token = jwt.sign(
      { userId: userId, email: email, division: division },
      process.env.ACCESS_TOKEN_KEY,
      {
        expiresIn: '1m',
      }
    );
    return token;
  };
  // refreshToken생성
  refreshToken = async () => {
    const token = jwt.sign({}, process.env.REFRESH_TOKEN_KEY, {
      expiresIn: '1d',
    });
    // DB저장을 할까?

    return token;
  };
}

module.exports = AuthController;
