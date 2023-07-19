const { Client } = require('../models');

class UserRepository {
  // 모든 유저를 찾습니다.
  findAllUsers = async () => {
    const findUserData = await Client.findAll();
    return findUserData;
  };

  // ID 기준으로 유저를 찾습니다.
  findUserById = async (client_id) => {
    const findUserData = await Client.findByPk(client_id);
    return findUserData;
  };

  // 이메일 기준으로 유저를 찾습니다.
  findUserByEmail = async (email) => {
    const findUserData = await Client.findOne({ where: { email } });
    return findUserData;
  };

  // 유저 정보를 수정합니다.
  modifyUserInfo = async (client_id, introduction, address, phone_num) => {
    const modifiedUserData = await Client.update(
      {
        introduction,
        address,
        phone_num,
      },
      { where: { client_id } }
    );
    return modifiedUserData;
  };

  // 유저의 패스워드를 수정합니다.
  modifyUserPassword = async (client_id, password) => {
    const modifiedUserPassword = await Client.update({ password }, { where: { client_id } });
    return modifiedUserPassword;
  };
}

module.exports = UserRepository;
