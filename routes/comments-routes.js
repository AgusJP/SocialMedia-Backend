const express = require("express")
const authMiddleware = require("../middleware/auth.js");
const CommentController = require("../controllers/comments-controllers.js");
const validationComment = require("../validations/validationComment.js");

const router = express.Router();

router.post('/api/comments/:postId', validationComment.Comment, authMiddleware, CommentController.CreateComment);
router.put('/api/comments/:commentId', validationComment.Comment, authMiddleware, CommentController.UpdateComment);
router.delete('/api/comments/:commentId', authMiddleware, CommentController.DeleteComment);

module.exports = router;