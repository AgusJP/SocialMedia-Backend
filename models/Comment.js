const { Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require('uuid');

class Comment extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id:  DataTypes.UUID,
        post_id: DataTypes.UUID,
        content: DataTypes.TEXT
      },
      {
        sequelize
      }
    );
    Comment.beforeCreate(comment => comment.id = uuidv4());
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "postedBy"
    });
    this.belongsTo(models.Post, {
      foreignKey: "post_id",
      as: "post"
    });
  }
}

module.exports = Comment;