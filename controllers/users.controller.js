const UserService = require('../services/users.service');
const bcrypt = require('bcrypt');
class UserController {
  userService = new UserService();

  // 전체 유저 정보 조회
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

  // 유저 개인 정보 조회
  getUser = async (req, res) => {
    try {
      const { client_id } = res.locals.user; // auth에서 가져옴
      const user = await this.userService.findUserCommonData(client_id);

      // 유저 정보 없음
      if (!user) return res.status(404).send({ message: '유저 정보 없음' });
      res.status(200).send({ data: user });
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  // 유저 프로필 사진 업로드
  uploadProfileImage = async (req, res) => {
    try {
      const { client_id } = res.locals.user; // auth에서 가져옴
      const imageUrl = req.file.location;
      await this.userService.uploadProfileImage(imageUrl, client_id);
      res.status(200).send({ message: '프로필 사진 업로드 완료' });
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  // 등록된 유저 프로필 사진 중 가장 최근에 업로드한 사진 획득
  getProfileImage = async (req, res) => {
    try {
      const { client_id } = res.locals.user; // auth에서 가져옴
      const imageUrl = await this.userService.getProfileImage(client_id);
      res.status(200).send({ data: imageUrl });
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  // 유저 개인 정보 수정
  modifyUserInfo = async (req, res) => {
    try {
      const { client_id } = res.locals.user; // auth에서 가져옴
      const { introduction, address, phone_num } = req.body;

      // NOTE: 유효성 검증 코드 아래에 추가할 것

      await this.userService.modifyUserInfo(client_id, introduction, address, phone_num);
      res.status(200).send({ message: '개인정보 수정 성공' });
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  // 패스워드 변경
  modifyUserPassword = async (req, res) => {
    try {
      const { client_id } = res.locals.user; // auth에서 가져옴
      const { password, newPassword, confirm } = req.body;
      const findUserAllData = await this.userService.findUserAllData(client_id);

      // 패스워드 검증
      const isPasswordValid = await bcrypt.compare(password, findUserAllData.password);
      if (!isPasswordValid) return res.status(412).send({ message: '비밀번호 틀렸음' });

      if (newPassword !== confirm)
        return res.status(412).send({ message: '암호와 암호확인 불일치' });

      if (password === newPassword) return res.status(400).send({ message: '비밀번호가 그대로임' });

      const hashedPassword = await bcrypt.hash(newPassword, 10); // pw, salt_rounds
      await this.userService.modifyUserPassword(client_id, hashedPassword);
      res.status(200).send({ message: '비밀번호 변경 성공' });
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ message: `${err.message}` });
    }
  };
  
  signupClient = async (req, res) => {
    try {
      const {
        email,
        name,
        password,
        confirm,
        point,
        address,
        phone_num,
        clint_image,
        introduction,
      } = req.body;
      const emailRegex =
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{4,25}$/;
      if (!emailRegex.test(email))
        return res.status(412).json({ errMessage: '이메일형식이 올바르지 않습니다.' });
      if (password !== confirm)
        return res.status(412).json({ errMessage: '패스워드확인이 일치하지 않습니다.' });
      if (!passwordRegex.test(password))
        return res
          .status(412)
          .json({ errMessage: '패스워드는 최소 4자이상 영문자와 숫자이어야합니다.' });
      // 위의 패스워드 검증이 다 마치면 패스워드를 암호화
      const saltRounds = 10;
      const hashPassword = await bcrypt.hashSync(password, saltRounds); //비밀번호 암호화
      const payLoad = {
        email,
        name,
        password: hashPassword,
        point,
        address,
        phone_num,
        clint_image,
        introduction,
      };
      await this.userService.createUser(payLoad);
      return res.status(200).json({ message: '회원가입이 완료되었습니다.' });
    } catch (error) {
      return res.status(400).json(error.message);
    }
  };

  updateClient = async (req, res) => {
    try {
      const client = res.locals.client;
      console.log('client = ', client);
      if (!client)
        return res.status(412).json({ errMessage: '고객님만 이용할 수 있는 기능입니다.' });
    } catch (error) {
      return res.status(400).json({ errMessage: error });
    }
  };
}

module.exports = UserController;
