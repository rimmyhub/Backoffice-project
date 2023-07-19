const UserRepository = require('../repositories/users.repository');

class UserService {
  userRepository = new UserRepository();

  // 프로필 사진 업로드
  uploadProfileImage = async (imageUrl, client_id) => {
    const uploadedProfileImage = await this.userRepository.createProfileImage(imageUrl, client_id);
    return uploadedProfileImage;
  };

  // 프로필 사진 가져오기
  getProfileImage = async (client_id) => {
    const getProfileImage = await this.userRepository.findProfileImage(client_id);
    return getProfileImage[getProfileImage.length - 1]; // 가장 최신에 업로드한 사진만 가져옴
  };

  // 전체 유저 정보 공개(테스트용, 원래는 비밀번호를 조회할 수 있으면 안됩니다.)
  findAllUsers = async () => {
    const findUserData = await this.userRepository.findAllUsers();
    return findUserData.map((user) => {
      return {
        client_id: user.client_id,
        email: user.email,
        password: user.password,
        name: user.name,
        address: user.address,
        phone_num: user.phone_num,
        client_image: user.client_image,
        introduction: user.introduction,
        point: user.point,
      };
    });
  };

  // 지정 유저의 정보 공개 (민감 정보, 불필요한 정보 제외)
  findUserCommonData = async (userInfo) => {
    // id와 email 둘 중 하나라도 찾으면 해당하는 유저 정보 보냄
    const findUserData =
      (await this.userRepository.findUserById(userInfo)) ??
      (await this.userRepository.findUserByEmail(userInfo));

    if (findUserData === null) return false; // 조회 결과 없으면 false
    return {
      client_id: findUserData.client_id,
      email: findUserData.email,
      name: findUserData.name,
      address: findUserData.address,
      phone_num: findUserData.phone_num,
      client_image: findUserData.client_image,
      introduction: findUserData.introduction,
      point: findUserData.point,
    };
  };

  // 지정 유저의 모든 정보 공개(비밀번호도 공개됨)
  findUserAllData = async (userInfo) => {
    const findUserData =
      (await this.userRepository.findUserById(userInfo)) ??
      (await this.userRepository.findUserByEmail(userInfo));

    if (findUserData === null) return false; // 조회 결과 없으면 false
    return findUserData;
  };

  // 유저 정보 수정
  modifyUserInfo = async (client_id, introduction, address, phone_num) => {
    const modifiedUserData = await this.userRepository.modifyUserInfo(
      client_id,
      introduction,
      address,
      phone_num
    );
    return modifiedUserData;
  };

  // 유저 비밀번호 수정
  modifyUserPassword = async (client_id, password) => {
    const modifiedUserPassword = await this.userRepository.modifyUserPassword(client_id, password);
    return modifiedUserPassword;
  };

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
