const express = require("express");
const { addData, getData } = require("../controllers/ScreamsController");
const authAccess = require("../middlewares/authAccess");

const router = express.Router();

router.post("/screams", authAccess, addData);
router.get("/screams", getData);

module.exports = {
  routes: router,
};
