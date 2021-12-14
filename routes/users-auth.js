const express = require("express")
const ValidationUserAuth = require("../validations/validationUserAuth.js");
const UserAuthController = require("../controllers/users-auth-controller.js");
const authMiddleware = require("../middleware/auth.js");

const router = express.Router();

router.get('/api/auth/me', authMiddleware, UserAuthController.me);

router.post('/api/auth', ValidationUserAuth.login, UserAuthController.login);

module.exports = router;