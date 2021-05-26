'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('Nfts', 'min_amount', {
        type: Sequelize.INTEGER,
        allowNull: true,
        after: 'hash'
      })
    ]
  },

  down: async (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('Nfts', 'min_amount'),
    ];
  }
};
