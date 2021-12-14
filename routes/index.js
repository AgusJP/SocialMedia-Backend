const {Router} = require('express');
const appRoutes = Router();

const usersRouter = require("./users-routes.js");
const usersAuthRouter = require("./users-auth.js");
const postsRouter = require("./posts-routes.js");
const likesRouter = require("./likes-routes.js");
const commentsRouter = require("./comments-routes.js");
const followsRouter = require("./follows-routes.js");
const feedsRouter = require("./feeds-routes.js");

appRoutes.use(usersRouter);
appRoutes.use(usersAuthRouter);
appRoutes.use(postsRouter);
appRoutes.use(likesRouter);
appRoutes.use(commentsRouter);
appRoutes.use(followsRouter);
appRoutes.use(feedsRouter);

module.exports = appRoutes;
