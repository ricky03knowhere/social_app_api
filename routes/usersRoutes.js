const express = require("express");
const { signup, login } = require("../controllers/UsersController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

module.exports = {
  routes: router,
};
