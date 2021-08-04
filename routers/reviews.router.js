const reviewsRouter = require("express").Router();
const {
  getReviewById,
  updateReviewById,
} = require("../controllers/reviews.controller");

reviewsRouter.route("/:review_id").get(getReviewById).patch(updateReviewById);

module.exports = reviewsRouter;
