
const {pool} = require("../config/db");
const auditLog = require("../utils/auditLog");

exports.getSettings = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT
        id,
        name,
        tax_id,
        country,
        email,
        phone,
        address,
        currency,
        locale,
        invoice_prefix,
        target_stock_factor
       FROM companies
       WHERE id = ?
       LIMIT 1`,
      [req.user.company_id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });

  } catch (error) {
    next(error);
  }
};

exports.saveSettings = async (req, res, next) => {
  try {
    const allowedFields = [
      "name",
      "tax_id",
      "country",
      "email",
      "phone",
      "address",
      "currency",
      "locale",
      "invoice_prefix",
      "target_stock_factor"
    ];

    const fields = allowedFields.filter(
      field => req.body[field] !== undefined
    );

    if (!fields.length) {
      return res.status(400).json({
        success: false,
        message: "No settings supplied"
      });
    }

    if (req.body.currency !== undefined &&
        !/^[A-Za-z]{3}$/.test(req.body.currency)) {
      return res.status(400).json({
        success: false,
        message: "Currency must be a three-letter code"
      });
    }

    if (req.body.target_stock_factor !== undefined &&
        (!Number.isFinite(Number(req.body.target_stock_factor)) ||
          Number(req.body.target_stock_factor) < 0 ||
          Number(req.body.target_stock_factor) > 99.99)) {
      return res.status(400).json({
        success: false,
        message: "Invalid target stock factor"
      });
    }

    const [oldRows] = await pool.query(
      "SELECT * FROM companies WHERE id = ?",
      [req.user.company_id]
    );

    if (!oldRows.length) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }

    const assignments = fields.map(
      field => `${field} = ?`
    ).join(", ");

    await pool.query(
      `UPDATE companies
       SET ${assignments}
       WHERE id = ?`,
      [
        ...fields.map(field => req.body[field]),
        req.user.company_id
      ]
    );

    const [rows] = await pool.query(
      `SELECT
        id, name, tax_id, country, email,
        phone, address, currency, locale,
        invoice_prefix, target_stock_factor
       FROM companies
       WHERE id = ?`,
      [req.user.company_id]
    );

    await auditLog({
      companyId: req.user.company_id,
      userId: req.user.id,
      action: "update",
      entityType: "company",
      entityId: req.user.company_id,
      details: "Company settings updated",
      oldValues: oldRows[0],
      newValues: rows[0],
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: "Settings updated successfully",
      data: rows[0]
    });

  } catch (error) {
    next(error);
  }
};
