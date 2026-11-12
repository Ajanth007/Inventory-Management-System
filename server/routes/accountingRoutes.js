
const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  getAccountingOverview
} = require("../controllers/accountingController");

router.get("/overview", auth, getAccountingOverview);

module.exports = router;
