const AuthRepository = require('../repositories/auth.repository');
const bcrypt = require('bcrypt');
class AuthService {
  authRepository = new AuthRepository();
  // 클라이언트 정보 가져오기
  getClient = async (email, password) => {
    const clientInfo = await this.authRepository.getClient(email);
    // 일치하는 회원이 없을 때
    if (!clientInfo) throw new Error('일치하는 회원정보가 없습니다. ');

    // 패스워드 일치 확인
    const pwVerification = await this.validatePassword(clientInfo.password, password);
    if (!pwVerification) throw new Error('비밀번호가 일치하지 않습니다.');

    return clientInfo;
  };

  // 패스워드 확인하는 함수
  validatePassword = async (clientInfoPw, password) => {
    const pwVerification = await bcrypt.compareSync(password, clientInfoPw);
    return pwVerification;
  };

  // 레포지토리에 데이터를 요청합니다.
  // createUser = async (nickname, password, email, gender, interestTopic) => {
  //   // 해시화
  //   const createdUserData = await this.userRepository.createUser(
  //     nickname,
  //     password,
  //     email,
  //     gender,
  //     interestTopic
  //   );

  //   // 받은 데이터를 선별해서 보내줄 수 있습니다.
  //   return {
  //     userId: createdUserData.userId,
  //     nickname: createdUserData.nickname,
  //     email: createdUserData.email,
  //     gender: createdUserData.gender,
  //     interestTopic: createdUserData.interestTopic,
  //   };
  // };
}

module.exports = AuthService;
