const UserRepository = require('../repositories/users.repository');

class UserService {
  userRepository = new UserRepository();

  uploadProfileImage = async (imageUrl, userId) => {
    const uploadedProfileImage = await this.userRepository.createProfileImage(imageUrl, userId);
    return uploadedProfileImage;
  };

  getProfileImage = async (userId) => {
    const getProfileImage = await this.userRepository.findProfileImage(userId);
    return getProfileImage[getProfileImage.length - 1]; // 가장 최신에 업로드한 사진만 가져옴
  };

  findAllUsers = async () => {
    const findUserData = await this.userRepository.findAllUsers();
    return findUserData.map((user) => {
      return {
        userId: user.userId,
        nickname: user.nickname,
        email: user.email,
        gender: user.gender,
        interestTopic: user.interestTopic,
      };
    });
  };

  // 일반 정보 공개
  findUserCommonData = async (userInfo) => {
    // id와 email 둘 중 하나라도 찾으면 해당하는 유저 정보 보냄
    const findUserData =
      (await this.userRepository.findUserById(userInfo)) ??
      (await this.userRepository.findUserByEmail(userInfo));

    if (findUserData === null) return false; // 조회 결과 없으면 false
    return {
      userId: findUserData.userId,
      nickname: findUserData.nickname,
      gender: findUserData.gender,
      interestTopic: findUserData.interestTopic,
    };
  };

  // 모든 정보 공개
  findUserAllData = async (userInfo) => {
    const findUserData =
      (await this.userRepository.findUserById(userInfo)) ??
      (await this.userRepository.findUserByEmail(userInfo));

    if (findUserData === null) return false; // 조회 결과 없으면 false
    return findUserData;
  };

  // 유저 정보 수정
  modifyUserInfo = async (userId, nickname, email, gender, interestTopic) => {
    const modifiedUserData = await this.userRepository.modifyUserInfo(
      userId,
      nickname,
      email,
      gender,
      interestTopic
    );
    return modifiedUserData;
  };

  // 유저 비밀번호 수정
  modifyUserPassword = async (userId, password) => {
    const modifiedUserPassword = await this.userRepository.modifyUserPassword(userId, password);
    return modifiedUserPassword;
  };

  // 유저 삭제 (회원 탈퇴)
  deleteUserInfo = async (userId) => {
    const deletedUserInfo = await this.userRepository.deleteUserInfo(userId);
    return deletedUserInfo;
  };
}

module.exports = UserService;
