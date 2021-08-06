const commentsRouter = require("express").Router();
const {
  deleteCommentById,
  updateCommentById,
} = require("../controllers/comments.controller");

commentsRouter
  .route("/:comment_id")
  .delete(deleteCommentById)
  .patch(updateCommentById);

module.exports = commentsRouter;
