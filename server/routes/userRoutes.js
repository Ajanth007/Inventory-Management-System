
const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// All user routes require authentication
router.use(authMiddleware);

// GET /api/users
router.get("/", userController.listUsers);

// GET /api/users/roles
router.get("/roles", userController.listRoles);

// POST /api/users
router.post("/", userController.createUser);

module.exports = router;
