const { Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require('uuid');

class Like extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: DataTypes.UUID,
        post_id: DataTypes.UUID,
      },
      {
        sequelize
      }
    );
    Like.beforeCreate(like => like.id = uuidv4());
  }

  static associate(models) {   
    this.belongsTo(models.User, 
        { foreignKey: "user_id",
         as: "user" 
        });
    this.belongsTo(models.Post, 
        { foreignKey: "post_id",
         as: "post" 
        });
  }
}

module.exports = Like;