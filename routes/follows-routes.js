const express = require("express")
const authMiddleware = require("../middleware/auth.js");
const FollowController = require("../controllers/follows-controllers.js");

const router = express.Router();

router.post('/api/follows/:userId', authMiddleware, FollowController.CreateFollow);


module.exports = router;