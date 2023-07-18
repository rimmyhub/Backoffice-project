const { Client } = require('../models');

class UserRepository {
  createUser = async (payload) => {
    const { email, name, password } = payload;

    const owner = await Client.create({
      email,
      name,
      password,
    });

    return owner;
  };
  checkEmailDup = async (email) => {
    const exEmail = await Client.findOne({
      where: { email },
    });
    return exEmail;
  };
  // findAllUsers = async () => {
  //   const findUserData = await User.findAll();
  //   return findUserData;
  // };
  // findUserById = async (userId) => {
  //   const findUserData = await User.findByPk(userId);
  //   return findUserData;
  // };
  // findUserByEmail = async (email) => {
  //   const findUserData = await User.findOne({ where: { email } });
  //   return findUserData;
  // };
  // modifyUserInfo = async (userId, nickname, email, gender, interestTopic) => {
  //   const modifiedUserData = await User.update(
  //     {
  //       nickname,
  //       email,
  //       gender,
  //       interestTopic,
  //     },
  //     { where: { userId } }
  //   );
  //   return modifiedUserData;
  // };
  // modifyUserPassword = async (userId, password) => {
  //   const modifiedUserPassword = await User.update({ password }, { where: { userId } });
  //   return modifiedUserPassword;
  // };
  // deleteUserInfo = async (userId) => {
  //   const deletedUserInfo = await User.destroy({ where: { userId } });
  //   return deletedUserInfo;
  // };
  // findRefreshTokenByUserId = async (UserId) => {
  //   const findRefreshTokenData = await RefreshToken.findOne({ UserId });
  //   return findRefreshTokenData;
  // };
  // createRefreshToken = async (refreshToken, UserId) => {
  //   const createdRefreshToken = await RefreshToken.create({ refreshToken, UserId });
  //   return createdRefreshToken;
  // };
  // updateRefreshToken = async (refreshToken, UserId) => {
  //   const updatedRefreshToken = await RefreshToken.update({ refreshToken }, { where: { UserId } });
  //   return updatedRefreshToken;
  // };
  // deleteRefreshToken = async (UserId) => {
  //   const deletedRefreshToken = await RefreshToken.destroy({ where: { UserId } });
  //   return deletedRefreshToken;
  // };
}

module.exports = UserRepository;
