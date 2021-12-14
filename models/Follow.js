const { Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require('uuid');

class Follow extends Model {
  static init(sequelize) {
    super.init(
      {
        user_from: DataTypes.UUID,
        user_to: DataTypes.UUID
      },
      {
        sequelize,
        tableName: "follows"
      }
    );
    Follow.beforeCreate(follow => follow.id = uuidv4());
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "user_from",
      as: "fromFollows"
    });
    this.belongsTo(models.User, {
      foreignKey: "user_to",
      as: "getUserFollows"
    });
  }
}

module.exports = Follow;