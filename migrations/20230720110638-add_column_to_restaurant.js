'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Restaurants', 'latitude', {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn('Restaurants', 'longitude', {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Restaurants', 'latitude');
    await queryInterface.removeColumn('Restaurants', 'longitude');
  },
};
