const { check } = require("express-validator");

const ValidationComment = {
  Comment: [
    check("content", "No se puede guardar un comentario sin contenido")
      .not()
      .isEmpty()
  ]
};

module.exports = ValidationComment;