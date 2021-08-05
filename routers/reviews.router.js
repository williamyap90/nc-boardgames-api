const reviewsRouter = require("express").Router();
const {
  getReviewById,
  updateReviewById,
  getReviews,
  getReviewCommentsById,
  postNewComment,
} = require("../controllers/reviews.controller");

reviewsRouter.get("/", getReviews);
reviewsRouter.route("/:review_id").get(getReviewById).patch(updateReviewById);
reviewsRouter
  .route("/:review_id/comments")
  .get(getReviewCommentsById)
  .post(postNewComment);

module.exports = reviewsRouter;
