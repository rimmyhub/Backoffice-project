const { Client } = require('../models');

class UserRepository {
  createUser = async (payload) => {
    const { email, name, password, point, address, phone_num, clint_image, introduction } = payload;

    const client = await Client.create({
      email,
      name,
      password,
      point,
      address,
      phone_num,
      clint_image,
      introduction,
    });

    return client;
  };
  checkEmailDup = async (email) => {
    const exEmail = await Client.findOne({
      where: { email },
    });
    return exEmail;
  };
}

module.exports = UserRepository;
