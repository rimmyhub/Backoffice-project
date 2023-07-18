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
      // 클라이언트 정보 가져오기
      const clientInfo = await this.authService.getClient(email, password);
      // 로그인상태에서 다시 로그인을 시도했을 경우
      if (authorization) {
        return res.status(412).json({ errorMessage: '현재 로그인 상태입니다.' });
      }

      // jwt생성
      // client_id와 email를 jwt로 감싸고 secretKey와 만료기간을 1시간으로 한다.
      // const token = jwt.sign(
      //   { userId: clientInfo.client_id, email: email },
      //   process.env.ACCESS_TOKEN_KEY,
      //   {
      //     expiresIn: '1h',
      //   }
      // );
      const token = this.accessToken(clientInfo.client_id, email);
      const refreshToken = this.refreshToken();
      // bearer타입으로 클라이언트에 token을 전달
      res.cookie('authorization', `Bearer ${token}`);
      return res.status(400).json({ message: '로그인되었습니다.' });
    } catch (error) {
      return res.status(400).json(error.message);
    }
  };

  loginOwner = async (userId, mail) => {
    console.log('loginOwner');
  };

  accessToken = async (userId, email) => {
    // accessToken생성
    const token = jwt.sign({ userId: userId, email: email }, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: '1h',
    });
    return token;
  };
  refreshToken = async () => {
    const token = jwt.sign({}, process.env.REFRESH_TOKEN_KEY, {
      expiresIn: '1d',
    });
    return token;
  };
  // authService = new AuthService();
  // authMiddleware = new AuthMiddleware();
  // signup = async (req, res) => {
  //   try {
  //     const { nickname, password, confirm, email, gender, interestTopic } = req.body;
  //     // comfirm 검증
  //     if (password !== confirm) return res.status(412).send({ message: '암호와 암호확인 불일치' });
  //     // 유효성 검증
  //     // 인증 번호 검증 확인 유무
  //     if (!req.session.isVerified)
  //       return res.status(412).send({ message: '인증 번호를 먼저 검증받을 것' });
  //     // 해시화 및 생성
  //     const hashedPassword = await bcrypt.hash(password, 10); // pw, salt_rounds
  //     await this.authService.createUser(nickname, hashedPassword, email, gender, interestTopic);
  //     res.status(200).send({ message: '회원가입 완료' });
  //   } catch (err) {
  //     console.error(err.name, ':', err.message);
  //     return res.status(400).send({ message: `${err.message}` });
  //   }
  // };
  // login = async (req, res) => {
  //   try {
  //     const { email, password } = req.body;
  //     const findUserAllData = await this.authService.findUserAllData(email);
  //     // // 이메일 검증
  //     // if (!findUserAllData) return res.status(404).send({ message: '회원이 아님' });
  //     // 패스워드 검증
  //     const isPasswordValid = await bcrypt.compare(password, findUserAllData.password);
  //     if (!isPasswordValid) return res.status(412).send({ message: '비밀번호 틀렸음' });
  //     // 토큰 생성
  //     const userId = findUserAllData.userId;
  //     const accessToken = this.authMiddleware.createAccessToken(userId);
  //     const refreshToken = this.authMiddleware.createRefreshToken();
  //     // 리프레시 토큰 DB 저장
  //     await this.authService.createRefreshToken(refreshToken, userId);
  //     // 쿠키 저장
  //     res.cookie('accessToken', accessToken);
  //     res.cookie('refreshToken', refreshToken);
  //     res.status(200).send({ message: '로그인 완료' });
  //   } catch (err) {
  //     console.error(err.name, ':', err.message);
  //     return res.status(400).send({ message: `${err.message}` });
  //   }
  // };
  // leave = async (req, res) => {
  //   try {
  //     const { userId } = res.locals.user;
  //     await this.authService.deleteUserInfo(userId);
  //     res.status(200).send({ message: '탈퇴 완료' });
  //   } catch (err) {
  //     console.error(err.name, ':', err.message);
  //     return res.status(400).send({ message: `${err.message}` });
  //   }
  // };
}

module.exports = AuthController;
