// 예시입니다!
const jwt = require('jsonwebtoken');
const { RefreshToken } = require('../models');

class AuthMiddleware {
  createAccessToken = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_KEY, { expiresIn: '10s' });
    return accessToken;
  };

  createRefreshToken = () => {
    const refreshToken = jwt.sign({}, process.env.REFRESH_TOKEN_KEY, { expiresIn: '1d' });
    return refreshToken;
  };

  validAccessToken = (accessToken) => {
    try {
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
      return true;
    } catch (err) {
      return false;
    }
  };

  validRefreshToken = (refreshToken) => {
    try {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
      return true;
    } catch (err) {
      return false;
    }
  };

  getAccessTokenPayload = (accessToken) => {
    try {
      const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
      return payload;
    } catch (err) {
      return null;
    }
  };

  verifyAccessToken = async (req, res, next) => {
    let { accessToken, refreshToken } = req.cookies;

    if (!refreshToken) return res.status(400).send({ message: 'Refresh Token이 존재하지 않음' });
    if (!accessToken) return res.status(400).send({ message: 'Access Token이 존재하지 않음' });

    const isAccessTokenValid = this.validAccessToken(accessToken);
    const isRefreshTokenValid = this.validRefreshToken(refreshToken);

    if (!isRefreshTokenValid) return res.status(419).send({ message: 'Refresh Token이 만료됨' });

    if (!isAccessTokenValid) {
      const tokenInfo = await RefreshToken.findOne({ where: { refreshToken } });
      if (!tokenInfo) return res.status(419).send({ message: '서버에 Refresh Token 없음' });

      // 재발급
      accessToken = this.createAccessToken(tokenInfo.UserId);
      res.cookie('accessToken', accessToken);
      console.log('Access Token 재발급 성공');
    }
    res.locals.user = this.getAccessTokenPayload(accessToken);
    next();
  };
}

module.exports = AuthMiddleware;
