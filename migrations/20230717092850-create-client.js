'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Clients', {
      client_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
      },
      phone_num: {
        type: Sequelize.STRING,
      },
      client_image: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue:
          'https://issuebombom-awsbucket.s3.ap-northeast-2.amazonaws.com/images/profile/1689841609097_22bc8ad7-0051-4572-8597-616fdb618776',
      },
      introduction: {
        type: Sequelize.STRING,
      },
      point: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1000000,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Clients');
  },
};
