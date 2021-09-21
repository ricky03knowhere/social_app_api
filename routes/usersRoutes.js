const express = require("express");
const { signup } = require("../controllers/UsersController");

const router = express.Router();

router.post("/signup", signup);
// router.get("/screams", getData);

module.exports = {
  routes: router,
};
