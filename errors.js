exports.handleRouter404s = (req, res, next) => {
  res.status(404).send({ msg: "invalid path" });
};
