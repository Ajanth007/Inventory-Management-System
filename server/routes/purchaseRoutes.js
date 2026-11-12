
const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  listPurchases,
  createPurchase,
  receivePurchase
} = require("../controllers/purchaseController");

router.use(auth);

router.get("/purchases", listPurchases);
router.post("/purchases", createPurchase);
router.put("/purchases/:id/receive", receivePurchase);

module.exports = router;
