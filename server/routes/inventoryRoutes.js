
const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  listMovements,
  adjustStock
} = require("../controllers/inventoryController");

router.use(auth);

router.get("/movements", listMovements);
router.post("/adjustments", adjustStock);

module.exports = router;
