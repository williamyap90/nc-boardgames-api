const express = require("express");
const apiRouter = require("./routers/api.router");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use("*", (req, res, next) => {
  res.status(404).send({ msg: "invalid path" })
});

module.exports = app;
