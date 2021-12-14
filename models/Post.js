const { Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require('uuid');

class Post extends Model {
  static init(sequelize) {
    super.init(
      {
        content: DataTypes.TEXT,
        key: DataTypes.STRING,
        post_url: DataTypes.STRING
      },
      {
        sequelize
      }
    );
    Post.beforeCreate(post => post.id = uuidv4());
  }

  static associate(models) {   
    this.belongsTo(models.User, 
        { foreignKey: "user_id",
         as: "uploadedBy" 
        });
    this.hasMany(models.Like,
      { foreignKey: "post_id",
        as: "getLikes"
      });
    this.hasMany(models.Comment,
      { foreignKey: "post_id",
        as: "getComments"
      });  
  } 
}

module.exports = Post;