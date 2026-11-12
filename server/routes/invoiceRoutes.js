
const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  listInvoices,
  createInvoice
} = require("../controllers/invoiceController");

router.use(auth);

router.get("/invoices", listInvoices);
router.post("/invoices", createInvoice);

module.exports = router;
