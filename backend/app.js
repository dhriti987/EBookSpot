const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const userRoute = require("./routes/userRoutes");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());

app.use(express.json());

app.use("/api/v1/users", userRoute);

app.use((err, req, res, next) => {
  err.status = err.status || "Error";
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).send({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
