const categoriesRouter = require("express").Router();
const {
  getCategories,
  postCategory,
} = require("../controllers/categories.controller");

categoriesRouter
  .route("/")
  .get(getCategories)
  .post(postCategory);

module.exports = categoriesRouter;
