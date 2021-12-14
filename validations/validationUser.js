const { check } = require("express-validator");

const ValidationsUser = {
  withPassword: [
    check("name", "Ingrese su nombre completo")
      .not()
      .isEmpty(),
    check("username", "Ingrese su nombre de usuario")
      .not()
      .isEmpty(),
    check("email", "Agreaga un email válido").isEmail(),
    check("password", "El password debe ser mínimo de 8 caracteres").isLength({
      min: 8
    })
  ],
  withoutPassword: [
    check("name", "Ingrese su nombre completo")
      .not()
      .isEmpty(),
    check("email", "Agreaga un email válido").isEmail()
  ],
  password: [
    check("password", "El password debe ser mínimo de 8 caracteres").isLength({
      min: 8
    }),
    check(
      "passwordConfirm",
      "El password debe ser mínimo de 8 caracteres"
    ).isLength({
      min: 8
    })
  ]
};

module.exports = ValidationsUser;