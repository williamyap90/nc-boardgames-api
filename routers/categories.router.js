const categoriesRouter = require("express").Router();
const { getCategories } = require("../controllers/categories.controller");

categoriesRouter.get("/", getCategories);

module.exports = categoriesRouter;
