const OwnersRepository = require('../repositories/owners.repository');

class OwnersService {
  ownersRepository = new OwnersRepository();

  // 전체 유저 정보 공개(테스트용)
  findAllUsers = async () => {
    const findUserData = await this.ownersRepository.findAllUsers();
    return findUserData.map((user) => {
      return {
        owner_id: user.owner_id,
        email: user.email,
        password: user.password,
        name: user.name,
        owner_name: user.owner_name,
        owner_number: user.owner_number,
        point: user.point,
      };
    });
  };

  // 지정 유저의 일반 정보 공개 (민감 정보, 불필요한 정보 제외)
  findUserCommonData = async (userInfo) => {
    // id와 email 둘 중 하나라도 찾으면 해당하는 유저 정보 보냄
    const findUserData =
      (await this.ownersRepository.findUserById(userInfo)) ??
      (await this.ownersRepository.findUserByEmail(userInfo));

    if (findUserData === null) return false; // 조회 결과 없으면 false
    return {
      owner_id: findUserData.owner_id,
      email: findUserData.email,
      name: findUserData.name,
      owner_name: findUserData.owner_name,
      owner_number: findUserData.owner_number,
      point: findUserData.point,
    };
  };

  // 지정 유저의 모든 정보 공개 (비밀번호 포함)
  findUserAllData = async (userInfo) => {
    const findUserData =
      (await this.ownersRepository.findUserById(userInfo)) ??
      (await this.ownersRepository.findUserByEmail(userInfo));

    if (findUserData === null) return false; // 조회 결과 없으면 false
    return findUserData;
  };

  // 유저 정보 수정
  modifyUserInfo = async (owner_id, owner_name, owner_number) => {
    const modifiedUserData = await this.ownersRepository.modifyUserInfo(
      owner_id,
      owner_name,
      owner_number
    );
    return modifiedUserData;
  };

  // 유저 비밀번호 수정
  modifyUserPassword = async (owner_id, password) => {
    const modifiedUserPassword = await this.ownersRepository.modifyUserPassword(owner_id, password);
    return modifiedUserPassword;
  };
    
  createOwner = async (payLoad) => {
    // 이미 가입한 회원인지 확인
    await this.checkEmailDup(payLoad.email);

    const owner = await this.ownersRepository.createOwner(payLoad);
    return owner;
  };

  checkEmailDup = async (email) => {
    const result = await this.ownersRepository.checkEmailDup(email);
    console.log('result = ', result);
    if (result) throw new Error('이미 가입한 회원의 이메일입니다.');
  };
}

module.exports = OwnersService;
