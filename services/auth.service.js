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

  getOwner = async (email, password) => {
    // owner정보 가져오기
    const ownerInfo = await this.authRepository.getOwner(email);
    // 일치하는 회원이 없을 때
    if (!ownerInfo) throw new Error('일치하는 회원정보가 없습니다. ');

    // 패스워드 일치확인
    const pwVerification = await this.validatePassword(ownerInfo.password, password);
    if (!pwVerification) throw new Error('비밀번호가 일치하지 않습니다.');

    return ownerInfo;
  };

  // 패스워드 확인하는 함수
  validatePassword = async (clientInfoPw, password) => {
    const pwVerification = await bcrypt.compareSync(password, clientInfoPw);
    return pwVerification;
  };

  // // refresh토큰저장
  // saveRefreshToken = async (token, ClientId) => {
  //   console.log(token, ClientId);
  // };
}

module.exports = AuthService;
