const express = require("express");
const {
  addData,
  getData,
  getAllData,
  addComment,
  addLike,
  unLike,
  deleteScream,
} = require("../controllers/ScreamsController");
const authAccess = require("../middlewares/authAccess");

const router = express.Router();

router.get("/screams", getAllData);
router.get("/scream/:screamId", getData);
router.post("/scream", authAccess, addData);
router.delete("/scream/:screamId", authAccess, deleteScream);
router.post("/scream/:screamId/like", authAccess, addLike);
router.post("/scream/:screamId/unlike", authAccess, unLike);
router.post("/scream/:screamId/comment", authAccess, addComment);

module.exports = {
  routes: router,
};