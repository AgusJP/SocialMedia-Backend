const express = require("express")
const authMiddleware = require("../middleware/auth.js");
const LikeController = require("../controllers/likes-controllers.js");

const router = express.Router();

router.post('/api/likes/:postId', authMiddleware, LikeController.CreateLike);


module.exports = router;