const { Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require('uuid');

class User extends Model {

  static init(sequelize) {      
    super.init(
      {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        biography: DataTypes.TEXT,
        phone: DataTypes.STRING,
        key: DataTypes.STRING,
        avatar_url: DataTypes.STRING,
      },
      {
        sequelize
      }      
    );
      User.beforeCreate(user => user.id = uuidv4());
  }
  
  static associate(models) {
    this.hasMany(models.Post, { foreignKey: "user_id", as: "postUploads" });    
    this.hasMany(models.Comment, { foreignKey: "user_id", as: "getComments" });
    this.hasMany(models.Follow, { foreignKey: "user_from", as: "getFollows" });
    this.hasMany(models.Follow, { foreignKey: "user_to", as: "getFollowers" });
    this.belongsToMany(models.Like, { foreignKey: "user_id", through: "likes", as: "userLike" });
  }

}

module.exports = User;