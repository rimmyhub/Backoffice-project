// 예시입니다!
const jwt = require('jsonwebtoken');
const { Client, Owner } = require('../models');
require('dotenv').config();

module.exports = async (req, res, next) => {
  const { authorization } = req.cookies;
  // token 없으면
  if (!authorization) {
    return res.status(401).json({ errorMessage: '로그인 후에 이용가능합니다.' });
  }
  const [tokenType, token] = authorization.split(' ');

  if (tokenType !== 'Bearer' || !token) {
    return res.status(401).json({ errorMessage: '로그인 후에 이용가능합니다.' });
  }

  try {
    let tokenErr = false;
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, decoded) => {
      if (err) {
        tokenErr = true;

        switch (err.name) {
          case 'TokenExpiredError':
            // token이 만료됨.
            // 클라이언트에 있는 jwt삭제
            res.clearCookie('authorization');
            return res.status(200).json({ message: '시간이 만료되어 로그아웃되었습니다.' });
          default:
            //? token decoded 에러
            return res.status(400).json(`invalid token. error name: ${err.name}`);
        }
      }
      return decoded;
    });
    if (tokenErr) {
      //! token decoded error
      return;
    }
    // 사용자가 owner인지 client인지 판별하기
    const division = decodedToken.division;
    const userId = decodedToken.userId;
    let user;
    if (division === 'Owner') {
      user = await Owner.findOne({ where: { owner_id: userId } });
      res.locals.user = { owner_id: user.owner_id };
      res.locals.user.division = division;
    } else if (division === 'Client') {
      user = await Client.findOne({ where: { client_id: userId } });
      res.locals.user = { client_id: user.client_id }
      res.locals.user.division = division;
    }
    if (!user) return res.status(412).json({ errMessage: '존재하지 않는 회원입니다.' });
    next();
  } catch (error) {
    console.log('error = ', error);
    return res.status(401).json({
      errorMessage: '비정상적인 접근입니다.',
    });
  }
};
