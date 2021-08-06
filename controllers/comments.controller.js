const {
  removeCommentById,
  patchCommentById,
} = require("../models/comments.model");

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

exports.updateCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const updateVotes = req.body;
  patchCommentById({ comment_id, updateVotes })
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
