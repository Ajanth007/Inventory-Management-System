
const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  login,
  me
} = require("../controllers/authController");

router.post("/login", login);
router.get("/me", auth, me);

module.exports = router;
