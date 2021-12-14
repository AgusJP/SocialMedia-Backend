const { Op } = require("sequelize");
const Post = require("../models/Post");
const Like = require("../models/Like");

module.exports = {
  async CreateLike(req, res) {
    const { postId: postId } = req.params;
    const { userId } = req;

    const post = await Post.findByPk(postId);

    if (!post){
      return res.status(404).json({
        message: "No se encuentra el Post seleccionado"
      });
    }   

    let like = await Like.findOne({
      where: { [Op.and]: [{ post_id: post.id }, { user_id: req.userId }] }
    });

    if (!like) {
      let newLike = await Like.create({
        user_id: userId,
        post_id: post.id
      });
      return res.json(newLike);
    } else {
      await like.destroy();
      return res.send();
    }
  }
};