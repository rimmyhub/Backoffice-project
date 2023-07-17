const { User } = require('../models');

class AuthRepository {
  // 유저 데이터 생성 (회원가입)
  createUser = async (nickname, password, email, gender, interestTopic) => {
    const createUserData = await User.create({ nickname, password, email, gender, interestTopic });
    return createUserData;
  };

  createProfileImage = async (imageUrl, UserId) => {
    const createdProfileImage = await ProfileImage.create({ imageUrl, UserId });
    return createdProfileImage;
  };

  findProfileImage = async (UserId) => {
    const findProfileImage = await ProfileImage.findAll({ where: { UserId } });
    return findProfileImage;
  };
}

module.exports = AuthRepository;
