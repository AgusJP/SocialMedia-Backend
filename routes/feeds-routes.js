const express = require("express")
const authMiddleware = require("../middleware/auth.js");
const FeedController = require("../controllers/feeds-controllers.js");

const router = express.Router();

router.get('/api/feeds',  authMiddleware, FeedController.GetFeed);
router.get('/api/feeds/follows', authMiddleware, FeedController.GetFollows);

module.exports = router;