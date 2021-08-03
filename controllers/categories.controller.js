const { fetchCategories } = require("../models/categories.model");

exports.getCategories = (req, res, next) => {
  fetchCategories()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
};
