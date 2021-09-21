const express = require("express");
const { addData, getData } = require("../controllers/ScreamsController");

const router = express.Router();

router.post("/screams", addData);
router.get("/screams", getData);

module.exports = {
  routes: router,
};
