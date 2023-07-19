const { Client, Owner } = require('../models');

class AuthRepository {
  // client정보 찾기
  getClient = async (email) => {
    console.log(email);
    const clientInfo = await Client.findOne({ where: { email } });
    return clientInfo;
  };

  // owner정보찾기
  getOwner = async (email) => {
    console.log(email);
    const ownerInfo = await Owner.findOne({ where: { email } });
    return ownerInfo;
  };
  // refreshDB에 refresh토큰과 userId를 함께 저장
  saveRefreshToken = async (token, ClientId) => {
    console.log(token, ClientId);
  };

  // 유저 데이터 생성 (회원가입)
  // createUser = async (nickname, password, email, gender, interestTopic) => {
  //   const createUserData = await User.create({ nickname, password, email, gender, interestTopic });
  //   return createUserData;
  // };

  // createProfileImage = async (imageUrl, UserId) => {
  //   const createdProfileImage = await ProfileImage.create({ imageUrl, UserId });
  //   return createdProfileImage;
  // };

  // findProfileImage = async (UserId) => {
  //   const findProfileImage = await ProfileImage.findAll({ where: { UserId } });
  //   return findProfileImage;
  // };
}

module.exports = AuthRepository;
