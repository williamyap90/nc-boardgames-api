const {
  fetchReviewById,
  patchReviewById,
  fetchReviews,
  fetchReviewCommentsById,
  insertNewComment,
} = require("../models/reviews.model");

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;

  fetchReviewById({ review_id })
    .then((review) => {
      res.status(200).send(review);
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateReviewById = (req, res, next) => {
  const updateBody = req.body;
  const { review_id } = req.params;

  patchReviewById({ updateBody, review_id })
    .then((review) => {
      res.status(201).send(review);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res, next) => {
  const query = req.query;
  fetchReviews(query)
    .then((reviews) => {
      res.status(200).send(reviews);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewCommentsById = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewCommentsById({ review_id })
    .then((comment) => {
      res.status(200).send(comment);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postNewComment = (req, res, next) => {
  const newComment = req.body;
  const { review_id } = req.params;
  insertNewComment({ newComment, review_id })
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch((err) => {
      next(err);
    });
};
