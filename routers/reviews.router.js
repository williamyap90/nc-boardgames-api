const express = require("express");
const reviewsRouter = express.Router();
const { getReviewById } = require("../controllers/reviews.controller");

reviewsRouter.get("/:review_id", getReviewById);

module.exports = reviewsRouter;
