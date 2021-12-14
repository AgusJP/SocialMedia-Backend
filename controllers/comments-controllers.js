const { validationResult } = require("express-validator");
const Comment = require("../models/Comment");
const Post = require("../models/Post");

module.exports = {
  async CreateComment(req, res) {
    const { content } = req.body;
    const { postId: post_id } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await Post.findByPk(post_id);

    if (!post){
      return res.status(400).json({ message: "La publicación no existe!" });
    }
    
    const comment = await Comment.create({
      user_id: req.userId,
      post_id,
      content
    });

    const newComment = await Comment.findByPk(comment.id, {
      attributes: ["id", "post_id", "user_id", "content", "createdAt"],
      include: {
        association: "postedBy",
        attributes: ["username", "avatar_url"]
      }
    });

    return res.status(201).json(newComment);
  },

  async UpdateComment(req, res) {
    const { content } = req.body;
    const { commentId } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const comment = await Comment.findByPk(commentId);

    if (!comment)
      return res.status(404).json({ message: "El comentario no existe" });
    if (comment.user_id !== req.userId)
      return res.status(401).json({ message: "No puede actualizar un comentario que no es suyo" });

    const newComment = await comment.update({ content });

    return res.status(200).json(newComment);
  },

  async DeleteComment(req, res) {
    const { commentId } = req.params;

    const comment = await Comment.findByPk(commentId);

    if (!comment)
      return res.status(404).json({ message: "El comentario no existe" });
    if (comment.user_id !== req.userId)
      return res.status(401).json({ message: "No puede eliminar un comentario que no es suyo" });

    await comment.destroy();

    return res.status(200).json({ message: "El comentario ha sido eliminado correctamente"});
  }
};