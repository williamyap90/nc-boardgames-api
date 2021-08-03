const express = require("express");
const { handleRouter404s, handle500s, handlePSQLErrors } = require("./errors");
const apiRouter = require("./routers/api.router");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleRouter404s);
app.use(handlePSQLErrors);
app.use(handle500s);

module.exports = app;
