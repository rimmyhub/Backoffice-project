const { Owner } = require('../models');

class OwnersRepository {
  createOwner = async (payload) => {
    const { email, name, password, owner_name, owner_number } = payload;
    const owner = await Owner.create({ email, name, password, owner_name, owner_number });

    return owner;
  };

  checkEmailDup = async (email) => {
    const exEmail = await Owner.findOne({
      where: { email },
    });
    return exEmail;
  };
}

module.exports = OwnersRepository;
