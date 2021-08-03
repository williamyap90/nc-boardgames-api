exports.handleRouter404s = (req, res, next) => {
  res.status(404).send({ message: "Invalid path" });
};

exports.handlePSQLErrors = (err, req, res, net) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Invalid review_id" });
  }
};

exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "Internal server error" });
};
