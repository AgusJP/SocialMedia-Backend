const Sequelize = require("sequelize");
const { validationResult } = require("express-validator")
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const User = require("../models/User.js");
const Post = require("../models/Post.js");
const Follow = require("../models/Follow.js");
const passwordHash = require("../helpers/passwordHash.js");
const passwordCompare = require("../helpers/passwordCompare.js");
const generateToken = require("../helpers/generateToken.js");

module.exports = {

  async CreateUser(req, res) {
    //Extraemos los campos de la request.
    const { name, email, username, password } = req.body;  
    try {
      //Capturamos si hay errores en la petición
      const errors = validationResult(req);
      //Si hay errores indicamos como respuesta cuales son.
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });       
      }      
      /*Buscamos un usuario que coincida con el email de la request o con el username.
      (Sequelize se encarga de manejar esta consulta por dentro).*/
      let user = await User.findOne({
        where: { [Sequelize.Op.or]: [
          { email: email },
          { username: username }
        ]}
      });
      //Si existe ese usuario en la BB.DD respondemos con lo siguiente:
      if (user) {
        if (user.email === email)
          return res.status(400).json({ message: "Este email ya está en uso" });
        if (user.username === username)
          return res.status(400).json({ message: "Este usuario ya está en uso" });
      }

      //Hasheamos el password.
      const passwordHashed = await passwordHash(password);

      //Creamos el usuario con los datos de la request
      user = await User.create({name, email, username, password: passwordHashed});

      // JWT
      const payload = { id: user.id, username: user.username };
      const token = generateToken(payload)
      return res.json({token});

    }
    catch (err) {     
      res.status(500).json({err: err.message});
    }   
  },

  async GetUser(req, res) {
    const {username} = req.params;
    const { page, pageSize } = req.query;
    try {
    const user = await User.findOne({
      where: { username: username },
      attributes: { exclude: ["password", "updatedAt"] },
      include: [
        {
          association: "postUploads",
          separate: true,
          offset: page * pageSize,
          limit: pageSize
        }
      ],
      group: ["User.id"]
    });

    if (!user) res.status(404).json({error: "User not found"})

    const numberOfPosts = await Post.findAll({where: {user_id: user.id}})
    const numberOfFollows = await Follow.findAll({where: {user_from: user.id}})
    const numberOfFollowers = await Follow.findAll({where: {user_to: user.id}})

    let isMyProfile = false;
    if (user.id === req.userId) isMyProfile = true;

    let AmIFollow = await Follow.findOne({
      where: {
        [Sequelize.Op.and]: [{ user_from: req.userId }, { user_to: user.id }]
      }
    });

    return res.json({
      user,
      numberOfPosts: numberOfPosts.length,
      numberOfFollows: numberOfFollows.length,
      numberOfFollowers: numberOfFollowers.length,
      isMyProfile,
      AmIFollow: AmIFollow ? true : false
    });
    }
    catch(err){
      res.status(500).json({err: err.message});
    }
  },

  async UpdateUser(req, res) {
    
    const { name, email, username, phone, biography } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    await User.update(
      {
        name,
        email,
        username,
        phone,
        biography
      },
      { where: { id: req.userId } }
    );

    return res.json({ message: "Actualizado correctamente" });
  },

  async UpdatePassword(req, res) {

    const { currentPassword, password, passwordConfirm } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findByPk(req.userId);
    console.log(user)
    if (!await passwordCompare(currentPassword, user.password)) {
      return res.status(400).json({ message: "Esta contraseña no coincide con ningún usuario."});
    }

    if (password !== passwordConfirm){
      return res.status(400).json({ message: "La contraseña debe ser la misma"});
    } 
    
    const passwordHashed = await passwordHash(password);
    await User.update(
      {password: passwordHashed},
      {where: {id: req.userId}}
      );

    return res.json({message: "Contraseña actualizada correctamente."})

  },

  async UpdateUserPhoto(req, res) {
    const { filename: key } = req.file;
    
    try {
    //Ver si hay alguna foto subida ya y elimanarla en caso de que se suba otra foto.Eliminando el archivo de local
    promisify(fs.unlink)(path.resolve(__dirname, "..", "tmp", "uploads", req.query.key));
    }
    catch (err) {
      res.status(400).json({err: err.message});
    }
    const url = `${process.env.App_URL}/files/${key}`;

    try {
    await User.update(
      {
        key,
        avatar_url: url
      },
      { where: { id: req.userId } }
    );  
    return res.json({ avatar_url: url });
    }
    catch (err) {
      return res.status(500).json({err: err.message})
    }
  },

}