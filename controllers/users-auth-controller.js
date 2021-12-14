const { validationResult } = require("express-validator");
const User = require("../models/User.js")
const passwordCompare = require("../helpers/passwordCompare.js");
const generateToken = require("../helpers/generateToken.js");

module.exports = {
  async me(req, res) { 
    try {
      const user = await User.findByPk(req.userId, {
        attributes: ['id', 'username', 'name', 'avatar_url']
      });
      return res.json(user);
    }catch (err) {     
      res.status(500).json({err: err.message});
    } 
  },

  async login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    const { username, password } = req.body;

    let user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).send({ message: "Usuario o contraseña incorrectos" });

    if (!(await passwordCompare(password, user.password))){
        return res.status(400).send({ message: "Usuario o contraseña incorrectos" });
    }       
    //JWT
    const payload = { id: user.id, username: user.username };
    const token = generateToken(payload)
    return res.json({token});

  }
};