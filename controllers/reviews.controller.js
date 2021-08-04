const { fetchReviewById } = require("../models/reviews.model");

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewById(review_id)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      //   console.log(err, "err in controller");
      //   console.log(err.status, err.message);
      next(err);
    });
};
