const reviewsRouter = require("express").Router();
const {
  getReviewById,
  updateReviewById,
  getReviews,
  getReviewCommentsById,
  postNewComment,
  postReview,
  deleteReviewById,
} = require("../controllers/reviews.controller");

reviewsRouter
  .route("/")
  .get(getReviews)
  .post(postReview);
reviewsRouter
  .route("/:review_id")
  .get(getReviewById)
  .patch(updateReviewById)
  .delete(deleteReviewById);
reviewsRouter
  .route("/:review_id/comments")
  .get(getReviewCommentsById)
  .post(postNewComment);

module.exports = reviewsRouter;
