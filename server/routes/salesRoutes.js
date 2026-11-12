
const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  listSales,
  createSale,
  completeSale
} = require("../controllers/salesController");

router.use(auth);

router.get("/sales", listSales);
router.post("/sales", createSale);
router.put("/sales/:id/complete", completeSale);

module.exports = router;
