const express = require("express");

// const { authUser, allUsers } = require("../controllers/userControllers");
// const { protect } = require("../middleware/authMiddleware");

const routes = express.Router();

const multer = require("multer");

const AuthController = require("../controllers/userControllers");

// routes.route("/").get(protect, allUsers);

routes.post("/Registration", AuthController.AuthRegistration);
routes.post("/Login", AuthController.AuthLogin);

module.exports = routes;
