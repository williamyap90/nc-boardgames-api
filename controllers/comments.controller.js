const { removeCommentById } = require("../models/comments.model");

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById({ comment_id })
    .then((review) => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
