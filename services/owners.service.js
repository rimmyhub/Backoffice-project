const OwnersRepository = require('../repositories/owners.repository');

class OwnersService {
  ownersRepository = new OwnersRepository();

  createOwner = async (payLoad) => {
    // 이미 가입한 회원인지 확인
    await this.checkEmailDup(payLoad.email);

    const owner = await this.ownersRepository.createOwner(payLoad);
    return owner;
  };

  checkEmailDup = async (email) => {
    const result = await this.ownersRepository.checkEmailDup(email);
    console.log('result = ', result);
    if (result) throw new Error('이미 가입한 회원의 이메일입니다.');
  };
}

module.exports = OwnersService;
