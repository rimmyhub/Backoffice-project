const nodemailer = require('nodemailer');
const AuthService = require('../services/auth.service');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class AuthController {
  authService = new AuthService();
  // 이메일 인증
  authMailer = async (req, res) => {
    const { email, division } = req.body;
    const emailRegex =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    try {
      // 메일형식이 맞지않으면
      if (!emailRegex.test(email))
        return res.status(412).json({ errMessage: '이메일형식이 올바르지 않습니다.' });
      let authNum = Math.random().toString().substr(2, 6);

      // 이메일이 이미 존재하는지 확인을 위해 authService에 email과 division을 전달
      await this.authService.validateEmail(email, division);

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASS,
        },
      });
      // send mail with defined transport object
      let mailOptions = {
        from: `Backoffice 이메일 인증하기`,
        to: email,
        subject: '인증번호입니다.',
        text: authNum,
      };
      transporter.verify((error) => {
        if (error) {
          console.log(
            `[ERROR] - Nodemailer (${process.env.NODEMAILER_USER}:${process.env.NODEMAILER_PASS})`
          );
        } else {
          console.log('[SUCCESS] - Nodemailer');
        }
      });
      console.log('transporter = ');
      await transporter.sendMail(mailOptions);

      return res.status(200).json({ data: authNum });
    } catch (error) {
      return res.status(400).json(error.message);
    }
  };

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

  logout = async (req, res) => {
    try {
      const { authorization } = req.cookies;
      // authorization가 없으면
      if (!authorization) {
        return res.status(401).json({ errorMessage: '로그인상태가 아닙니다.' });
      }
      // 클라이언트에 있는 jwt삭제
      res.clearCookie('authorization');
      return res.status(200).json({ message: '로그아웃되었습니다.' });
    } catch (error) {
      return res.status(400).json({ errorMessage: '로그인상태가 아닙니다.' });
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
        expiresIn: '1h',
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
