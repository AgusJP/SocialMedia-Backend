const { Op } = require("sequelize");
const User = require("../models/User");

module.exports = {
  async SearchUser(req, res) {
    const { term } = req.query;

    //Buscamos por nombre o username
    const users = await User.findAll({
      attributes: ["id", "username", "name", "avatar_url"],
      where: {
        [Op.or]: [
          { username: { [Op.iLike]: `%${term}%` } },
          { name: { [Op.iLike]: `%${term}%` } }
        ]
      }
    });

    return res.json(users);
  }
};