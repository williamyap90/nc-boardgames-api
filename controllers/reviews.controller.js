const { fetchReviewById, patchReviewById } = require("../models/reviews.model");

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
