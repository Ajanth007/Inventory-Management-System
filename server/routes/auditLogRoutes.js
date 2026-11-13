
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const auditLogController = require("../controllers/auditLogController");

router.use(authMiddleware);

router.get("/", auditLogController.listAuditLogs);

module.exports = router;
