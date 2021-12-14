const express = require("express")
const multer = require("multer");
const multerConfig = require("../config/multer.js");
const authMiddleware = require("../middleware/auth.js");
const PostController = require("../controllers/posts-controllers.js");

const router = express.Router();

router.post('/api/posts', authMiddleware, multer(multerConfig).single("file"), PostController.CreatePost);
router.get('/api/posts/:id', authMiddleware, PostController.GetPost);
router.delete('/api/posts/:id', authMiddleware, PostController.DeletePost);

module.exports = router;