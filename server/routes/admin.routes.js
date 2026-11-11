const express = require("express");
const router = express.Router();

const {
  getAllProducts
} = require("../controller/admin/adminProductController");

router.get("/api/products", getAllProducts);

module.exports = router;