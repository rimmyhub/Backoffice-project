const OwnerService = require('../services/owners.service');

class OwnerController {
  ownerService = new OwnerService();

  // 전체 유저 정보 조회
  getUsers = async (req, res) => {
    try {
      const users = await this.ownerService.findAllUsers();

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
      const { owner_id } = res.locals.user; // auth에서 가져옴

      const user = await this.ownerService.findUserCommonData(owner_id);

      // 유저 정보 없음
      if (!user) return res.status(404).send({ message: '유저 정보 없음' });
      res.status(200).send({ data: user });
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  modifyUserInfo = async (req, res) => {
    try {
      const { owner_id } = res.locals.user; // auth에서 가져옴
      const { owner_name, owner_number } = req.body;

      await this.ownerService.modifyUserInfo(owner_id, owner_name, owner_number);
      res.status(200).send({ message: '개인정보 수정 성공' });
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ message: `${err.message}` });
    }
  };

  modifyUserPassword = async (req, res) => {
    try {
      const { owner_id } = res.locals.user; // auth에서 가져옴
      const { password, newPassword, confirm } = req.body;
      const findUserAllData = await this.ownerService.findUserAllData(owner_id);

      // 패스워드 검증
      const isPasswordValid = await bcrypt.compare(password, findUserAllData.password);
      if (!isPasswordValid) return res.status(412).send({ message: '비밀번호 틀렸음' });

      if (newPassword !== confirm)
        return res.status(412).send({ message: '암호와 암호확인 불일치' });

      if (password === newPassword) return res.status(400).send({ message: '비밀번호가 그대로임' });

      const hashedPassword = await bcrypt.hash(newPassword, 10); // pw, salt_rounds
      await this.ownerService.modifyUserPassword(owner_id, hashedPassword);
      res.status(200).send({ message: '비밀번호 변경 성공' });
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ message: `${err.message}` });
    }
  };
}

module.exports = OwnerController;
