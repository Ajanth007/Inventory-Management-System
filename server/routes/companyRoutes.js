
const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  getCompany
} = require("../controllers/companyController");

router.get("/", auth, getCompany);

module.exports = router;
