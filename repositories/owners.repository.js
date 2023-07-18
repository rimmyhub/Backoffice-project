const { Owner } = require('../models');

class OwnerRepository {
  findAllUsers = async () => {
    const findUserData = await Owner.findAll();
    return findUserData;
  };

  findUserById = async (owner_id) => {
    const findUserData = await Owner.findByPk(owner_id);
    return findUserData;
  };

  findUserByEmail = async (email) => {
    const findUserData = await Owner.findOne({ where: { email } });
    return findUserData;
  };

  modifyUserInfo = async (owner_id, owner_name, owner_number) => {
    const modifiedUserData = await Owner.update(
      {
        owner_name,
        owner_number,
      },
      { where: { owner_id } }
    );
    return modifiedUserData;
  };

  modifyUserPassword = async (owner_id, password) => {
    const modifiedUserPassword = await Owner.update({ password }, { where: { owner_id } });
    return modifiedUserPassword;
  };
}

module.exports = OwnerRepository;
