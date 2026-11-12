
const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  getSettings,
  saveSettings
} = require("../controllers/settingsController");

router.get("/settings", auth, getSettings);
router.put("/settings", auth, saveSettings);

module.exports = router;
