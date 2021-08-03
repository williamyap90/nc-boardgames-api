const express = require("express");
const categoriesRouter = require("./categories.router");
const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
  res.status(200).send({ msg: "All ok from /api" });
});
apiRouter.use("/categories", categoriesRouter);

module.exports = apiRouter;
