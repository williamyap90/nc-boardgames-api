const usersRouter = require("express").Router();
const {
  getUsers,
  getUserByUsername,
  updateUserByUsername,
} = require("../controllers/users.controller");

usersRouter.get("/", getUsers);
usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .patch(updateUserByUsername);

module.exports = usersRouter;
