const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const Sequelize = require("sequelize");
const Post = require("../models/Post");
const Like = require("../models/Like");

module.exports = {

  async CreatePost(req, res) {
    const { filename: key } = req.file;
    const { content } = req.body;

    const url = `${process.env.APP_URL}/files/${key}`;

    const postCreated = await Post.create({
      user_id: req.userId,
      content,
      key,
      post_url: url
    });

    const post = await Post.findByPk(postCreated.id, {
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
      order: [["createdAt", "desc"]]
    });
   
    let isAutor = false;
    if (post.user_id === req.userId) isAutor = true;

    let isLiked = false;
    post.getLikes.map(like => {
      if (like.user_id === req.userId) isLiked = true;
    });

    return res.json({ isAutor, isLiked, post });
    
  },
  
  async GetPost(req, res) {
    const { id } = req.params;

    try{
    const post = await Post.findByPk(id, {
      attributes: {
        exclude: ["updatedAt"],
        include: [
          [Sequelize.fn("COUNT", Sequelize.col("getLikes")), "likesCount"]
        ]
      },
      include: [
        {
          association: "uploadedBy",
          attributes: ["username", "avatar_url"]
        },
        {
          association: "getLikes",
          attributes: []
        },
        {
          association: "getComments",
          attributes: ["id", "user_id", "content", "createdAt"],
          include: {
            association: "postedBy",
            attributes: ["username", "avatar_url"]
          }
        }
      ],
      group: [
        "uploadedBy.id",
        "Post.id",
        "getComments.id",
        "getComments->postedBy.id"
      ]
    });
        let isAutor = false;
        if (req.userId === post.user_id) isAutor = true;

        let isLiked = false;
        let like = await Like.findOne({
        where: {
            [Sequelize.Op.and]: [{ post_id: post.id }, { user_id: req.userId }]
        }
        });
        if (like) isLiked = true;

        return res.json({ post, isAutor, isLiked });
    }
    catch(err) {
        res.status(400).send({ message: "Post no encontrado" })
    } 
  },

  async DeletePost(req, res) {
    const { id } = req.params;
    const { key } = req.query;

    try{
    const post = await Post.findByPk(id);

    if (post.user_id !== req.userId)
      return res.status(401).json({ message: "No estás autorizado" });

    promisify(fs.unlink)(
      path.resolve(__dirname, "..", "tmp", "uploads", key)
    ); // Eliminando el archivo de local

    await post.destroy();

    return res.json({ message: "Publicación eliminada correctamente"});
    }
    catch (err) {
        res.status(400).json({ message: "Publicación no encontrada" });
    }
  }
}
