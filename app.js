const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const httpError = require("./models/http-error");
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");

const app = express();

app.use(bodyParser.json());

app.use(cors())

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", '*');
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept, Athorization, X-Auth-Token"
//   );
//   res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, POST, PATCH, PUT, DELETE, OPTIONS");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader("Access-Control-Max-Age", "3600");
//   next();
// });

app.use("/api/places", placesRoutes); // => /api/places/...
app.use("/api/users", usersRoutes);

app.use("/", (req, res, next) => {
  throw new httpError("This page does not exist!", 404);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
});

mongoose
  .connect(
    "mongodb+srv://youcef4k:sby4TAK8@cluster0.sisbg.mongodb.net/placegram?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
