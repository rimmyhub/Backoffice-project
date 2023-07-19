const UserService = require('../services/users.service');
const bcrypt = require('bcrypt');
class UserController {
  userService = new UserService();

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
}

module.exports = UserController;
