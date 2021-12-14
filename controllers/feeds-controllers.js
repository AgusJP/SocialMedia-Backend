const Sequelize = require("sequelize");
const User = require("../models/User");
const Post = require("../models/Post");

module.exports = {
  async GetFeed(req, res) {
    const { page, pageSize } = req.query;

    const user = await User.findByPk(req.userId, {
      attributes: [],
      include: [
        {
          association: "getFollows",
          attributes: ["user_to"]
        }
      ]
    });

    let arrayUsers = user.getFollows.map(user => {
      return user.user_to;
    });

    arrayUsers.push(req.userId);

    const countPosts = await Post.count({
      where: { user_id:
        { [Sequelize.Op.in]: arrayUsers } },
    })

    let posts = await Post.findAll({
      offset: page * pageSize,
      limit: pageSize,
      attributes: {
        exclude: ["updatedAt"]
      },
      include: [
        {
          association: "uploadedBy",
          attributes: ["username", "avatar_url"]
        },
        {
          association: "getComments",
          attributes: {
            exclude: ["post_id", "updatedAt"]
          },
          include: {
            association: "postedBy",
            attributes: ["username"]
          },
          limit: 3
        },
        {
          association: "getLikes",
          attributes: ["user_id"]
        }
      ],
      where: { user_id: { [Sequelize.Op.in]: arrayUsers } },
      order: [["createdAt", "desc"]]
    });

    let newArray = posts.map(post => {
      let isAutor = false;
      if (post.user_id === req.userId) isAutor = true;

      let isLiked = false;
      post.getLikes.map(like => {
        if (like.user_id === req.userId) isLiked = true;
      });

      return { isAutor, isLiked, post };
    });
    
    res.header('CountPosts', countPosts)
    return res.json(newArray);
  },

  async GetFollows(req, res) {
    const user = await User.findByPk(req.userId, {
      attributes: [],
      include: [
        {
          association: "getFollows",
          attributes: ["user_to"]
        }
      ]
    });

    let followUsers = user.getFollows.map(user => {
      return user.user_to;
    });

    const follows = await User.findAll({
      attributes: {
        exclude: ["password", "createdAt", "updatedAt", "key", "biography", "phone"]
      },
      where: { id: { [Sequelize.Op.in]: followUsers } }
    });

    return res.json(follows);
  }
};