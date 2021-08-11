const usersRouter = require("express").Router();
const {
  getUsers,
  getUserByUsername,
  updateUserByUsername,
  postNewUser,
} = require("../controllers/users.controller");

usersRouter.route("/").get(getUsers).post(postNewUser);
usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .patch(updateUserByUsername);

module.exports = usersRouter;
