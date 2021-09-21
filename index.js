const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const config = require("./config.js");
const { screamsRoutes, usersRoutes } = require("./routes");

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use("/api", screamsRoutes.routes);
app.use("/api", usersRoutes.routes);

app.listen(config.port, () =>
  console.log("Server running...\nOn port: " + config.port)
);
