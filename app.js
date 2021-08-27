const express = require("express");
const apiRouter = require("./routers/api.router");
const {
  handleRouter404s,
  handle500s,
  handlePSQLErrors,
  handleCustomErrors,
} = require("./errors");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", apiRouter);

app.use(handleRouter404s);
app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500s);

module.exports = app;
