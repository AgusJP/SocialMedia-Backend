const Sequelize = require('sequelize'); 
const ConfigDB = require("../config/database.js");
const User = require("../models/User");
const Post = require("../models/Post");
const Like = require("../models/Like");
const Comment = require("../models/Comment");
const Follow = require("../models/Follow");
const connection = new Sequelize(ConfigDB);

/**
 * Le pasamos a cada modelo a través de su método estático init
 * la instancia de conexión con la base de datos.
 */
User.init(connection);
Post.init(connection);
Like.init(connection);
Comment.init(connection);
Follow.init(connection);

//Asociations
User.associate(connection.models);
Post.associate(connection.models);
Like.associate(connection.models);
Comment.associate(connection.models);
Follow.associate(connection.models);