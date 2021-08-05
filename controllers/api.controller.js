const { fetchEndpoints } = require("../models/api.model");

exports.getEndpoints = (req, res, next) => {
  res.status(200).send({ message: "All ok from /api" });
};
