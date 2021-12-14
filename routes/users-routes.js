const express = require("express");
const multer = require("multer");
const multerConfig = require("../config/multer.js");
const UserController = require("../controllers/users-controllers.js");
const SearchController = require("../controllers/search-controllers.js");
const ValidationsUser = require("../validations/validationUser.js");
const authMiddleware = require("../middleware/auth.js");
const router = express.Router();

router.get('/api/users/:username', authMiddleware, UserController.GetUser);
//Sign up
router.post('/api/users', ValidationsUser.withPassword, UserController.CreateUser);

router.put('/api/users', authMiddleware, ValidationsUser.withoutPassword, UserController.UpdateUser);

router.put('/api/update-password', authMiddleware, ValidationsUser.password, UserController.UpdatePassword);

router.put('/api/user-photo', authMiddleware, multer(multerConfig).single("file"), UserController.UpdateUserPhoto);

router.get('/api/search/:term', authMiddleware, SearchController.SearchUser);

module.exports = router;