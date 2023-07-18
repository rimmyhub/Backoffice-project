const { Client } = require('../models');

class UserRepository {
  findAllUsers = async () => {
    const findUserData = await Client.findAll();
    return findUserData;
  };

  findUserById = async (client_id) => {
    const findUserData = await Client.findByPk(client_id);
    return findUserData;
  };

  findUserByEmail = async (email) => {
    const findUserData = await Client.findOne({ where: { email } });
    return findUserData;
  };

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

  modifyUserPassword = async (client_id, password) => {
    const modifiedUserPassword = await Client.update({ password }, { where: { client_id } });
    return modifiedUserPassword;
  };
}

module.exports = UserRepository;
