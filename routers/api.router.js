const express = require("express");
const apiRouter = express.Router();
const categoriesRouter = require("./categories.router");
const reviewsRouter = require("./reviews.router");

apiRouter.get("/", (req, res) => {
  res.status(200).send({ message: "All ok from /api" });
});

apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/reviews", reviewsRouter);

module.exports = apiRouter;
