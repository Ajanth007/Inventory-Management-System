
const { pool } = require("../config/db");

exports.listAuditLogs = async (req, res, next) => {
  try {
    console.log("========== LIST AUDIT LOGS ==========");
    console.log("Company ID:", req.user.company_id);

    const [rows] = await pool.query(
      `SELECT
          a.id,
          a.company_id,
          a.user_id,
          u.name AS user,
          a.action,
          a.entity_type,
          a.entity_id,
          a.details,
          a.old_values,
          a.new_values,
          a.ip_address,
          a.created_at
       FROM audit_logs a
       LEFT JOIN users u ON u.id = a.user_id
       WHERE a.company_id = ?
       ORDER BY a.id DESC
       LIMIT 500`,
      [req.user.company_id]
    );

    console.log("Audit logs fetched:", rows.length);

    res.json(rows);

  } catch (error) {
    console.error("AUDIT LOG ERROR:", error);
    next(error);
  }
};
