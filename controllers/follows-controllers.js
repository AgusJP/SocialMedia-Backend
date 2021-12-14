const { Op } = require("sequelize");

const User = require("../models/User");
const Follow = require("../models/Follow");

module.exports = {
  async CreateFollow(req, res) {
    const { userId } = req.params;

    const user = await User.findByPk(userId);

    if (!user)
      return res.status(404).send({ message: "Usuario no encontrado" });

    if (user.id === req.userId)
      return res.status(400).send({ message: "No puedes seguirte a ti mismo" });

    const follow = await Follow.findOne({
      where: { [Op.and]: [{ user_to: user.id }, { user_from: req.userId }] }
    });
    
    if (follow) {
      await follow.destroy();
      return res.json({message: "Follow deshecho"});
    }
    else {
      await Follow.create({
        user_from: req.userId,
        user_to: user.id
      });
      return res.json({message: "Follow establecido"});
    }
  }
};