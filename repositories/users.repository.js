const { Client, ProfileImage } = require('../models');

class UserRepository {
  // 이미지 등록
  createProfileImage = async (imageUrl, Client_id) => {
    const createdProfileImage = await ProfileImage.create({ imageUrl, Client_id });
    return createdProfileImage;
  };

  // 이미지 가져오기
  findProfileImage = async (Client_id) => {
    const findProfileImage = await ProfileImage.findAll({ where: { Client_id } });
    return findProfileImage;
  };

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
  modifyUserInfo = async (client_id, client_image, introduction, address, phone_num) => {
    const modifiedUserData = await Client.update(
      {
        client_image,
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

  // 유저를 생성합니다.
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

  // 이메일 중복 검증 함수
  checkEmailDup = async (email) => {
    const exEmail = await Client.findOne({
      where: { email },
    });
    return exEmail;
  };
}

module.exports = UserRepository;
