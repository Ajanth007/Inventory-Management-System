
const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  listPayments,
  createPayment
} = require("../controllers/paymentController");

router.use(auth);

router.get("/payments", listPayments);
router.post("/payments", createPayment);

module.exports = router;
