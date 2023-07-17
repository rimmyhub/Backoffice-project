// 예시입니다!
const UserService = require('../services/users.service');

class UserController {
  userService = new UserService();

  getUsers = async (req, res) => {
    try {
      const users = await this.userService.findAllUsers();

      // 유저 정보 없음
      if (users.length === 0) return res.status(404).send({ message: '유저 정보 없음' });
      res.status(200).send({ data: users });
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ message: `${err.message}` });
    }
  };
  getUser = async (req, res) => {
    try {
      const { userId } = res.locals.user;
      const user = await this.userService.findUserCommonData(userId);

      // 유저 정보 없음
      if (!user) return res.status(404).send({ message: '유저 정보 없음' });
      res.status(200).send({ data: user });
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  uploadProfileImage = async (req, res) => {
    try {
      const { userId } = res.locals.user;
      const imageUrl = req.file.location;
      await this.userService.uploadProfileImage(imageUrl, userId);
      res.status(200).send({ message: '프로필 사진 업로드 완료' });
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  getProfileImage = async (req, res) => {
    try {
      const { userId } = res.locals.user;
      const imageUrl = await this.userService.getProfileImage(userId);
      res.status(200).send({ data: imageUrl });
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  modifyUserInfo = async (req, res) => {
    try {
      const { userId } = res.locals.user;
      const { nickname, email, gender, interestTopic } = req.body;

      await this.userService.modifyUserInfo(userId, nickname, email, gender, interestTopic);
      res.status(200).send({ message: '개인정보 수정 성공' });
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  modifyUserPassword = async (req, res) => {
    try {
      const { userId } = res.locals.user;
      const { password, newPassword, confirm } = req.body;
      const findUserAllData = await this.userService.findUserAllData(userId);

      // 패스워드 검증
      const isPasswordValid = await bcrypt.compare(password, findUserAllData.password);
      if (!isPasswordValid) return res.status(412).send({ message: '비밀번호 틀렸음' });

      if (newPassword !== confirm)
        return res.status(412).send({ message: '암호와 암호확인 불일치' });

      if (password === newPassword) return res.status(400).send({ message: '비밀번호가 그대로임' });

      const hashedPassword = await bcrypt.hash(newPassword, 10); // pw, salt_rounds
      await this.userService.modifyUserPassword(userId, hashedPassword);
      res.status(200).send({ message: '비밀번호 변경 성공' });
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  sendVerificationMail = async (req, res) => {
    try {
      const { email } = req.body;
      const verificationMail = new VerificationMail();
      const randomNumber = await verificationMail.sendEmail(email); // 인증번호 메일 전송 후 난수 리턴
      req.session.verificationCode = randomNumber;

      res.status(200).send({ message: '인증 메일 전송 완료' });
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  // 인증 메일 발송 시 인증 번호 입력 form + 인증 확인 button 기능에 부여되는 함수
  verifyCode = async (req, res) => {
    try {
      const { inputVerificationCode } = req.body;
      const verificationCode = req.session.verificationCode;
      console.log(verificationCode);

      if (!verificationCode) return res.status(404).send({ message: '인증 메일을 먼저 발송할 것' });
      // 인증 번호 입력 유효성 검증 필요

      // 인증 번호 일치 여부 검증
      if (verificationCode !== Number(inputVerificationCode))
        return res.status(412).send({ message: '인증 번호 일치하지 않음' });

      // 인증 번호 일치 시
      req.session.isVerified = true;

      return res.status(200).send({ message: '인증 번호 확인 완료' });
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ message: `${err.message}` });
    }
  };
}

module.exports = UserController;
