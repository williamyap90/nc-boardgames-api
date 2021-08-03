const express = require("express");
const categoriesRouter = express.Router();
const { getCategories } = require("../controllers/categories.controller");

categoriesRouter.get("/", getCategories);

module.exports = categoriesRouter;
