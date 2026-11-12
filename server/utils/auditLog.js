
const db = require("../config/db");

async function auditLog({
  companyId,
  userId = null,
  action,
  entityType,
  entityId = null,
  details = "",
  oldValues = null,
  newValues = null,
  ipAddress = null
}) {
  await db.query(
    `INSERT INTO audit_logs
    (
      company_id,
      user_id,
      action,
      entity_type,
      entity_id,
      details,
      old_values,
      new_values,
      ip_address
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      companyId,
      userId,
      action,
      entityType,
      entityId,
      details,
      oldValues ? JSON.stringify(oldValues) : null,
      newValues ? JSON.stringify(newValues) : null,
      ipAddress
    ]
  );
}

module.exports = auditLog;
