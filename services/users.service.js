const UserRepository = require('../repositories/users.repository');

class UserService {
  userRepository = new UserRepository();

  createUser = async (payLoad) => {
    // 이미 가입한 회원인지 확인
    await this.checkEmailDup(payLoad.email);
    const user = await this.userRepository.createUser(payLoad);
    return user;
  };

  checkEmailDup = async (email) => {
    const result = await this.userRepository.checkEmailDup(email);
    if (result) throw new Error('이미 가입한 회원의 이메일입니다.');
  };
}

module.exports = UserService;
