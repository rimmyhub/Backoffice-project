// 예시입니다!
const AuthMiddleware = require('../middlewares/auth.middleware');
const VerificationMail = require('../assets/nodemailer');
const bcrypt = require('bcrypt');

class AuthController {
  authService = new AuthService();
  authMiddleware = new AuthMiddleware();

  signup = async (req, res) => {
    try {
      const { nickname, password, confirm, email, gender, interestTopic } = req.body;

      // comfirm 검증
      if (password !== confirm) return res.status(412).send({ message: '암호와 암호확인 불일치' });

      // 유효성 검증

      // 인증 번호 검증 확인 유무
      if (!req.session.isVerified)
        return res.status(412).send({ message: '인증 번호를 먼저 검증받을 것' });

      // 해시화 및 생성
      const hashedPassword = await bcrypt.hash(password, 10); // pw, salt_rounds
      await this.authService.createUser(nickname, hashedPassword, email, gender, interestTopic);
      res.status(200).send({ message: '회원가입 완료' });
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const findUserAllData = await this.authService.findUserAllData(email);

      // // 이메일 검증
      // if (!findUserAllData) return res.status(404).send({ message: '회원이 아님' });

      // 패스워드 검증
      const isPasswordValid = await bcrypt.compare(password, findUserAllData.password);
      if (!isPasswordValid) return res.status(412).send({ message: '비밀번호 틀렸음' });

      // 토큰 생성
      const userId = findUserAllData.userId;
      const accessToken = this.authMiddleware.createAccessToken(userId);
      const refreshToken = this.authMiddleware.createRefreshToken();

      // 리프레시 토큰 DB 저장
      await this.authService.createRefreshToken(refreshToken, userId);

      // 쿠키 저장
      res.cookie('accessToken', accessToken);
      res.cookie('refreshToken', refreshToken);

      res.status(200).send({ message: '로그인 완료' });
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  leave = async (req, res) => {
    try {
      const { userId } = res.locals.user;
      await this.authService.deleteUserInfo(userId);
      res.status(200).send({ message: '탈퇴 완료' });
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ message: `${err.message}` });
    }
  };
}

module.exports = AuthController;