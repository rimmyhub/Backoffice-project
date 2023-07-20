const { Client, Owner } = require('../models');

class AuthRepository {
  // client정보 찾기
  getClient = async (email) => {
    const clientInfo = await Client.findOne({ where: { email } });
    return clientInfo;
  };
  // owner정보찾기
  getOwner = async (email) => {
    const ownerInfo = await Owner.findOne({ where: { email } });
    return ownerInfo;
  };
  // refreshDB에 refresh토큰과 userId를 함께 저장
  saveRefreshToken = async (token, ClientId) => {
    console.log(token, ClientId);
  };
  // 이메일 찾기
  clientEmail = async (email) => {
    const validEmail = await Client.findOne({ attributes: ['email'], where: { email } });
    return validEmail;
  };
  ownerEmail = async (email) => {
    const validEmail = await Owner.findOne({ attributes: ['email'], where: { email } });
    return validEmail;
  };
}

module.exports = AuthRepository;
