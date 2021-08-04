const reviewsRouter = require("express").Router();
const {
  getReviewById,
  updateReviewById,
  getReviews,
} = require("../controllers/reviews.controller");

reviewsRouter.get("/", getReviews);
reviewsRouter.route("/:review_id").get(getReviewById).patch(updateReviewById);

module.exports = reviewsRouter;
