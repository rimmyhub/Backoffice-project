const OwnersService = require('../services/owners.service');
const bcrypt = require('bcrypt');
class OwnersController {
  ownersService = new OwnersService();

  signupOwner = async (req, res) => {
    try {
      const { email, name, password, confirm, owner_name, owner_number, point } = req.body;
      const emailRegex =
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{4,25}$/;
      const ownerRegex = /^[0-9]{3}-[0-9]{2}-[0-9]{5}$/;
      if (!emailRegex.test(email))
        return res.status(412).json({ errMessage: '이메일형식이 올바르지 않습니다.' });
      if (!ownerRegex.test(owner_number))
        return res.status(412).json({ errMessage: '사업자등록번호 형식이 올바르지 않습니다.' });
      if (password !== confirm)
        return res.status(412).json({ errMessage: '패스워드확인이 일치하지 않습니다.' });
      if (!passwordRegex.test(password))
        return res
          .status(412)
          .json({ errMessage: '패스워드는 최소 4자이상 영문자와 숫자이어야합니다.' });
      const saltRounds = 10;
      const hashPassword = await bcrypt.hashSync(password, saltRounds); //비밀번호 암호화
      const payLoad = {
        email,
        name,
        password: hashPassword,
        owner_name,
        owner_number,
        point,
      };

      await this.ownersService.createOwner(payLoad);
      res.status(200).json({ message: '회원가입이 완료되었습니다.' });
    } catch (error) {
      return res.status(400).send(error.message);
    }
  };

  updateOwner = async (req, res) => {
    try {
      const Owner = res.locals.owner;
      // const division = res.locals.division;
      console.log('Owner = ', Owner);
      if (!Owner)
        return res.status(412).json({ errMessage: '사장님만 이용할 수 있는 기능입니다.' });
    } catch (error) {
      return res.status(400).json({ errMessage: error });
    }
  };
}

module.exports = OwnersController;
