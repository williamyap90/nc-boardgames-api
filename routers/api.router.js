const apiRouter = require("express").Router();
const { getEndpoints } = require("../controllers/api.controller");
const categoriesRouter = require("./categories.router");
const reviewsRouter = require("./reviews.router");

apiRouter.get("/", getEndpoints);

apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/reviews", reviewsRouter);

module.exports = apiRouter;
