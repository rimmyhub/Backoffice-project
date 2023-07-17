const AuthRepository = require('../repositories/users.repository');

class AuthService {
  authRepository = new AuthRepository();
  // 레포지토리에 데이터를 요청합니다.
  createUser = async (nickname, password, email, gender, interestTopic) => {
    // 해시화
    const createdUserData = await this.userRepository.createUser(
      nickname,
      password,
      email,
      gender,
      interestTopic
    );

    // 받은 데이터를 선별해서 보내줄 수 있습니다.
    return {
      userId: createdUserData.userId,
      nickname: createdUserData.nickname,
      email: createdUserData.email,
      gender: createdUserData.gender,
      interestTopic: createdUserData.interestTopic,
    };
  };
}

module.exports = AuthService;
