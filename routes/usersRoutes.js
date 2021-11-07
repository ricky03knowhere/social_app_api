const express = require("express");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getUserDetails,
  getAuthenticatedUser,
} = require("../controllers/UsersController");
const authAccess = require("../middlewares/authAccess");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/user/", authAccess, addUserDetails);
router.get("/user/", authAccess, getAuthenticatedUser);
router.get("/user/:handle", authAccess, getUserDetails);
router.post("/user/image", authAccess, uploadImage);

module.exports = {
  routes: router,
};
